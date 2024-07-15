# CSSOMTree

假设存在如下CSS样式:  

```css
body h1 {
  color: #000;
  font-size: 12px;
}
```

会解析得到如下CSSOMTree：  

<!-- ![CSSOMTree](/src//assets//cssom_tree.drawio.png#pic_center#pic_center) -->
<div align=center><img src="/src/assets/browserRender/cssom_tree.drawio.png#pic_center#pic_center" alt="CSSOMTree"/></div>

其中根节点是CSSStyleList,是所有的css样式表  
css样式表主要分一下几种：  

- 内部样式表-style标签连接的
- 外部样式表-link标签链接的
- 内联样式表-标签style属性内设置的值
- 浏览器默认样式表

有多少个样式表，就会在根节点下生成多少个一级子节点。  
然后是二级子节点，他们是一个个规则对象就是对应图中的CSSStyleRule,每个规则对象性又至少存在两个属性，第一个是选择器，第二个是样式对象。  
除了浏览器默认样式表，其他的样式表都可以通过JS操作  
可以在控制台输入一下代码查看当前的样式表：  

```js
document.styleSheets
```

得到如下截图:  

![样式表](/src/assets/browserRender/stylesSheets.jpg#pic_center)
<!-- <div align=center><img src="/src/assets/browserRender/stylesSheets.jpg#pic_center#pic_center" alt="样式表"/></div> -->

然后每个styleSheet对象有以下方法：

![样式表对象](/src/assets/browserRender/styleSheetObj.jpg#pic_center)

我们可以如下图这样去操作样式表：  

![操作样式表对象](/src/assets/browserRender/styleSheetAddRule.jpg)
