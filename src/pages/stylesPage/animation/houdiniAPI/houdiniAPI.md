# [houdini API](https://developer.mozilla.org/zh-CN/docs/Web/API/Houdini_APIs)

## 背景说明

houdini API是浏览器开放的一套非常底层的API，它允许使用者通过它来干预浏览器渲染进程的过程，例如重绘、回流、动画等等各个方面。  
它包含cssAPI和JSAPI两个部分。其中很多API还没有标准化，在实验室阶段，其使用方法后续可能变更、资料稀少，所以对houdiniAPI中的大部分API还了解得不多。  
这次主要了解其中已经基本算是标准化的[CSS Properties and Values API](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS_Properties_and_Values_API)。

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

如左边示例所示，<font color=#1890ff>普通渐变背景</font>所示的是一个普通的渐变背景，其样式代码如下：

```css
.demo-item-bg {
  width: 196px;
  height: 292px;
  margin-bottom: 12px;
  background-image: linear-gradient(0deg, #5ddcff, #3c67e3 43%, #4e00c2);
}
```

如果这个时候我们想要实现示例左边的<font color=#1890ff>带有动画的渐变背景</font>，在没有houdiniAPI的自定义属性之前，我们只能通过js来实现，非常麻烦，且效果不好。

我们可以在不使用houdiniAPI的情况下利用CSS动画做如下尝试，看看是否能够实现渐变背景动画:  

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

然后我们就得到左侧示例的<font color=#1890ff>test1渐变背景</font>，发现动画并没有动起来。

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

这样我们得到了左侧示例的<font color=#1890ff>test2渐变背景</font>，发现依然没有用。

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

然后我们得到了想要的<font color=#1890ff>带有动画的渐变背景</font>，因为这个时候我们自定义了一个数值类css属性，动画修改了这个属性，所以渲染进程会去应用动画。  
其中

```css
@property
```

这是定义一个自定义属性的关键字，属性名和变量一样，要求--开头

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
