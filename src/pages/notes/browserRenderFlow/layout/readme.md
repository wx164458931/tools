# 布局（Layout）

layout是拿到DOMtree和CSSOMTree经过样式计算（computed Style）之后得到带有最终样式的DOM树进行一些列计算的过程，它经过一些列过程得到dom树中每个节点的位置、宽高等各种信息。然后生成Layout树。这一步主要是得到当前需要渲染的内容的几何信息。  

Layout树和DOM树类似，但是不完全一样。例如(下列列表没有完全列完，只列了一些我知道的):  

- Layout树中不包含display:none等不参与布局的dom元素
- w3c标准中，块盒不能直接包含文本，只能行盒包含，所以对块盒直接包容的内容，浏览器会自动的给块盒内的内容增加一个匿名行盒来作为容器包容
- w3c标准中，行盒和快盒不能相邻，所以对于块盒相邻的行盒，会生成匿名块盒作为容器包容
- before\after等伪元素，这些伪元素在dom树中不存，但在生成的layout树中却存在
- 滚动条
- layout树中的对象是JS无法访问的，它的元素不是DOM对象。但是可以通过JS我们拿到一些Layout树的属性，例如元素的clientHeight等
- 还有其他等等

这其中比较需要注意的是对元素的位置、层次等信息的计算。要了解这些信息，就得了解CSS的的重要规范

[css基础规范(css2)](https://drafts.csswg.org/css2/#about)  
[css3规范](https://drafts.csswg.org/?path=css3)

## 盒模型

重点关注box-sizing为不同值时盒模型的不同表现。

详情见：[https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model/Introduction_to_the_CSS_box_model)

## 布局模式

主要有以下几种：  

- 块布局
- 行内布局
- 表格布局
- 定位布局
- 弹性盒布局
- 网格布局

慎用行内布局

详情见：[https://developer.mozilla.org/zh-CN/docs/Web/CSS/Layout_mode](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Layout_mode)

## 视觉格式化模型

这是CSS的基础概念之一，所以非常重要  

详情见：[https://developer.mozilla.org/zh-CN/docs/Web/CSS/Visual_formatting_model](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Visual_formatting_model)  

其中有一些比较重要的概念：  

### 包含块

详情见：[https://developer.mozilla.org/zh-CN/docs/Web/CSS/Containing_block](https://developer.mozilla.org/zh-CN/docs/Web/CSS/Containing_block)

### BFC

详情见：[https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_display/Block_formatting_context](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_display/Block_formatting_context)

## 外边距合并

详情见：[https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)
