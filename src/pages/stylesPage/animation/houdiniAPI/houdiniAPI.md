# [houdini API](https://developer.mozilla.org/zh-CN/docs/Web/API/Houdini_APIs)

## 背景说明

houdini API是浏览器开放的一套非常底层的API，它允许使用者通过它来干预浏览器渲染进程的过程，例如重绘、回流、动画等等各个方面。  
它包含cssAPI和JSAPI两个部分。其中JSAPI和部分CSSAPI目前还没有标准化，其使用方法后续可能变更、资料稀少，所以这部分API还了解得不多。  
这次主要了解其中已经标准化的[CSS Properties and Values API](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS_Properties_and_Values_API)。

## CSS Properties and Values API

这套API最主要的功能是允许用户自定义css属性，让用户不再只能自定义css变量  
它可以使用CSS来定义：

```css
@property --my-color {
  syntax: "<color>";
  inherits: false;
  initial-value: #c0ffee;
}
```

也可以使用js来定义：

```js
window.CSS.registerProperty({
  name: "--my-color",
  syntax: "<color>",
  inherits: false,
  initialValue: "#c0ffee",
});
```

### 用处

如左边实例所示，普通渐变背景所示的是一个普通的渐变背景，其样式代码如下：

```css
.demo-item-bg {
  width: 196px;
  height: 292px;
  margin-bottom: 12px;
  background-image: linear-gradient(0deg, #5ddcff, #3c67e3 43%, #4e00c2);
}
```

如果这个时候我们想要实现示例左边的带有动画的渐变背景，在没有houdiniAPI的自定义属性之前，我们只能通过js来实现，因为渐变背景不属于数值类属性变化，是没法应用css动画的，只有靠JS来定时修改渐变背景的方式来实现动画，非常麻烦。  
我们可以利用CSS动画做如下尝试：  

#### 尝试1

我们修改普通的渐变背景, 增加css animation, 动画中修改渐变背景旋转角度从0deg到360deg，代码如下：

```css
.demo-item-test1-bg {
  width: 196px;
  height: 292px;
  margin-bottom: 12px;
  background-image: linear-gradient(0deg, #5ddcff, #3c67e3 43%, #4e00c2);
  animation: bg-test1-rotaing 3s linear infinite;
}

@keyframes bg-test1-rotaing {
  to {
    background-image: linear-gradient(360deg, #5ddcff, #3c67e3 43%, #4e00c2);
  }
}
```

然后我们就得到左侧示例的test1渐变背景，发现动画并没有动起来。

#### 尝试2

因为动画只能应用到数值类属性上，我们尝试将旋转角度用css变量来表示，css animation修改css变量的值，代码如下：

```css
.demo-item-test2-bg {
  --r: 0deg;
  width: 196px;
  height: 292px;
  margin-bottom: 12px;
  background-image: linear-gradient(var(--r), #5ddcff, #3c67e3 43%, #4e00c2);
  animation: bg-test2-rotaing 3s linear infinite;
}

@keyframes bg-test2-rotaing {
  to {
    --r: 360deg;
  }
}
```

这样我们得到了左侧示例的test2渐变背景，发现依然没有用，因为animation只能应用到数值类属性上。单纯的改变变量值，而渐变背景的属性并没有涉及到数值类属性，动画依然没法生效。

#### 尝试3

现在，我们来使用houdiniAPI的自定义属性来试试，代码如下：

```css
@property --bg-roate {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}

.demo-item-animation-gb {
  width: 196px;
  height: 292px;
  margin-bottom: 12px;
  background-image: linear-gradient(var(--bg-roate), #5ddcff, #3c67e3 43%, #4e00c2);
  animation: bg-rotaing 3s linear infinite;
}

@keyframes bg-rotaing {
  to {
    --bg-roate: 360deg
  }
}
```

然后我们得到了想要的带动画的渐变背景，因为这个时候我们自定义了一个数值类css属性，动画修改了这个属性，所以渲染进程会去应用动画。  
其中

```css
@property
```

这是定义一个自定义属性的关键字，属性名和变量一样，要求两个-开头

```css
syntax
```

这是定义自定属性的值类型，具体参数这个文档[https://developer.mozilla.org/zh-CN/docs/Web/CSS/@property/syntax](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@property/syntax)

```css
inherits
```

这是定义自定义属性是否可被继承

```css
initial-value
```

这是定义自定义属性的默认值

这样以前一个只能依靠js实现的复杂动画，用css很简单就实现了  
然后我们利用这个旋转的渐变背景动画，实现一个旋转的边框
最后说一下，houdiniAPI功能强大，但是它会影响浏览器的渲染，且是实验属性，请谨慎使用
