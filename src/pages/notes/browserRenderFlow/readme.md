# 浏览器渲染流程

这个流程主要是梳理已经获取到了HTML文件之后的过程，对于输入网址到获取到HTML这中间的过程主要是网络的知识，换一个模块总结。

## 整体流程图

<!-- ![浏览器渲染流程](/src/assets/render-flow.drawio.png#pic_center) -->
<div align=center><img src="/src/assets/browserRender/render-flow.drawio.png" alt="浏览器渲染流程"/></div>

## 特殊点说明

### HTML解析过程中遇到CSS代码怎么办

浏览器会启动一个预解析器去下载和解析CSS，预解析器是在渲染线程之外的线程执行，所以CSS下载不会阻塞HTML解析。  

### HTML解析过程中遇到JS代码怎么办

- 预解析线程会分担一些JS下载的工作， 但是HTML解析遇到JS时会暂停HTML解析，等待JS下载并执行后再继续解析。原因是JS代码中可能会访问和更改当前DOM树，所以必须等待JS执行。  
- 但是一些特殊标签属性会影响这个过程。
  - **async**
    - 对于普通脚本，如果存在 async 属性，那么普通脚本会被并行请求，并尽快解析和执行。
    - 对于模块脚本，如果存在 async 属性，那么脚本及其所有依赖都会在延缓队列中执行，因此它们会被并行请求，并尽快解析和执行。
    - 该属性能够消除js加载对HTML解析的阻塞。
    - 该属性并不阻塞DOMContentLoaded事件，其执行顺序不保证。
  - **defer**
    - 这个布尔属性的设置是为了向浏览器表明，该脚本是要在文档被解析后，但在触发 DOMContentLoaded 事件之前执行的。
    - 这个属性只会阻塞DOMContentLoaded事件，并不会阻塞解析
    - defer 属性对模块脚本也不会生效——它们默认是 defer 的。
    - 包含 defer 属性的脚本会按照它们出现在文档中的顺序执行。
  - **blocking**
    - 这是个实验室属性(截止2024年7月)
    - 这个属性明确指出，在获取脚本的过程中，某些操作应该被阻断。要阻断的操作必须是一个以空格分隔的列表。
    - 目前支持阻断的属性只有render。
    - 代码示例：  

    ```html
      <script blocking="render" async src="async-script.js"></script>
    ```

    这表明异步加载js，不阻塞解析，但是要求在渲染之前执行该js

## reflow(回流)

当了解浏览器渲染流程以后，其实就很好解释reflow,它实际上就是修改了几何信息（宽高、大小等），或者增删dom元素，导致DOM树或者CSSOM树的几何相关信息发生了变化，导致需要重新从样式计算开始讲整个流程重新执行一遍。  

最主要的就是需要执行Layout，因为Layout生成的LayoutTree决定当前渲染的位置大小信息，也就是几何信息。
而Layout是整个流程中最耗时的操作。所以回流是一个昂贵的操作。

需要特殊说明的一点，对dom树的修改、，修改已有的dom等几何信息，通常不会立刻reflow，浏览器通常会将多次reflow操作放到任务队列中，等待当前js执行完成后，合并为一次只进行一次reflow，减少reflow次数，所以对几何信息的增删改引起的reflow是异步完成的，这是浏览器的优化之一。  

也是因为上述优化，会导致获取dom的几何信息时，如果浏览器不采取任何措施的话，就有很大可能会获取到失效的信息。  
针对这个问题，浏览器采用了几何信息的获取回立刻reflow的策略。例如document.querySelector('#root').clientHeight等操作是会立刻reflow，因为浏览器为了确保获取到的信息是实时有效的，会强制进行一次新的Layout更新几何信息之后才让拿到真实的结果。  

但是注意，这次reflow他只会重新Layout，拿到Layout树，并不会知道到后面的流程导致页面发生变化，因此我们通常可以利用这一点做一些巧妙的操作，如以下代码：  

```css
.btn {
  /** 它的属性不重要 */
}

.detail {
  height: 0;
  transition: 1s;
  /** 其他属性不重要 */
}

/**
 * 这段样式的含义是detail包含的容高度未知，但是期望btn元素hover时能有一个高度缓缓增高到目标高度的效果
 * 当然，现在的这段代码不会生效，因为transition应用的属性只能数值到数值能有效，auto并不是一个有效的数值。
 * 我们可以用一些纯CSS方案实现，但是现在为了演示这个效果，使用js来实现
 */
.btn:hover .detail {
  height: auto;
}
```

```js
/**
 * 为了实现上述效果，可以有以下js代码
 */
const btnDom = document.querySelector('.btn');
const detailDom = document.querySelector('.detail')

btnDom.onmouseenter = () => {
  detailDom.style.height = 'auto';
  const { height } = detailDom.getBoundingClientRect(); // 第一次强制回流，获取了dom的几何信息，但是这个只会重新Layout，并不会重新绘制
  detailDom.style.height = 0; // 拿到展开后的高度后，将高度设置回0
  detailDom.style.height = height + 'px';// 然后再把高度设置为数值的目标高度，因为高度是数值类型的了，所以transition能生效
}

btnDom.onmouseleave = () => {
  detailDom.style.height = 0; 
}
```

如果你写了上述代码，思路是对了，但是发现并不会生效，原因就是这两行代码之间没有任何额外操作，浏览器回将两次回导致reflow的操作在当前js代码执行完之后，将他们合并成一次也就是最新的值。  
也就是相当于对于detail来说，height的属性值变化是从'auto'变化到具体的高度，这就相当于设置height为0的这一行代码没有生效。因此过度效果出不来  

```js
detailDom.style.height = 0;
detailDom.style.height = height + 'px';
```

因此我们需要把代码修改成如下：  

```js
btnDom.onmouseenter = () => {
  detailDom.style.height = 'auto';
  const { height } = detailDom.getBoundingClientRect(); // 第一次强制回流，获取了dom的几何信息，但是这个只会重新Layout，并不会重新绘制
  detailDom.style.height = 0; // 拿到展开后的高度后，将高度设置回0
  detailDom.getBoundingClientRect(); // 新增代码，目的是重新获取一次几何信息，强制reflow，让高度设置为0生效
  detailDom.style.height = height + 'px';// 然后再把高度设置为数值的目标高度，因为高度是数值类型的了，所以transition能生效
}
```

这就是利用浏览器reflow机制能够做的一些巧妙的方案

## repaint(重绘)

重绘实际上只是修改了一些非几何信息，如颜色等，它主要是修改了CSSOMTree中的非几何信息，由于几何信息没有发生变化，无需重新Layout，也无需后续的Layer、Tiling等，只是合成线程的paint需要重新生成相关的层的绘制指令，后续执行相关步骤

## transform效率高的原因

这里分两种情况，一种是通过JS修改了样式表中的transform属性，这个时候会导致CSSOM发生变化，一定会导致重新进行样式计算，但是因为transform不属于几何信息，也不属于paint需要的信息，所以这一步后，后续流程都不会重新执行，直接到了最后的真实绘制一步，在生成真实的绘制信息交给GPU进程之前，根据新得到的transform信息进行矩阵变化，后续交给GPU进程。这里面只有样式计算这一步在渲染主线程中，其他的真实绘制在合成线程，实际渲染在GPU进程，本身任务不耗时，且大多不会占用渲染主线程资源，所以高效。

但是更高效的是使用animation去修改transform，例如：  

```css
.ball {
  animation: move 3s linear infinite;
}

@keyframes move {
  to {
    transform: translateX(100px)
  }
}
```

这里transform信息的修改是通过动画完成的，连CSSOM修改都不存在了，所以样式计算这一步都也省了，这样的动画就完全和渲染主线程无关了，这个时候即使渲染主线程一直在执行JS代码（俗称卡死了），但是你会发现动画依然顺畅，因为这个只涉及到了合成线程和GPU进程，和渲染主线程没有任何关系  

与之相对的是使用其他方式来实现动画，就要低效不少，例如将上述的CSS代码改成如下：  

```css
.ball {
  position: absolute;
  left: 0;
  animation: move 3s linear infinite;
}

@keyframes move {
  to {
    left: 0;
  }
}
```

上述代码在设置合适的包含块的时候，大多数情况下和使用transform视觉效果一样，体验不出差距。  
但是如果某个时刻执行了某个耗时的JS代码。就会发现这个动画也同步的卡住不动了。  
因为修改的定位信息的left属性，这个属于几何属性，需要从样式计算开始到最后的draw所有步骤都要重新过一遍。  
而其中的样式计算、layout、layer、paint这几个步骤都是在渲染主线程中完成的，但是此时渲染主线程在执行耗时的JS代码。是没有办法来处理这个渲染流程的。所以动画就停止卡主了

## 滚动条

我们会发现一个特殊的现象，在现代浏览器中（Chrome为例），即使页面卡死了，滚动依然流畅，知道浏览器的渲染原理以后就理解这是为什么。因为滚动条发生变化时，整个渲染流程除了最后的真实渲染这一步以外其他步骤都不需要执行，因为滚动条发生变化，只有真实渲染这一步需要提供给GPU进程的真实渲染信息发生了改变，其他信息没有任何变化，所有滚动之后，只是draw这一步重新执行，而这一步涉及到的是合成线程和GPU进程，也和渲染主线程没有关系

## 补充说明

梳理的浏览器的渲染流程只是个大体的流程，且主要是以Chrome（126.0.6478.127）为主。 

然后还有一些步骤没有加入到流程中，例如：  

- JS编译，JS编译是获取到JS后想要执行JS的必须过程，浏览器解析JS生成AST，然后将AST交由JS编译器编译，得到字节码。然后再将字节码郊游渲染主线程进行解释执行。
  - 大部分的解释工作都是在渲染主线程完成
  - web worker的代码会交由专门的JS线程执行
  - WebAssembly的代码似乎也不是渲染主线程去完成，这个有待下来学习了解

- 构建无障碍树
  无障碍树是是交给屏幕阅读器读取的，它主要是提供给视障认识使用的。在解析生成无障碍树之前，屏幕阅读器无法读取当当前页面的任何内容
