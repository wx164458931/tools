import React from "react";

const CommonPage: React.FC = () => {
  return (
    <div className="article">
      <h1>说明</h1>
      <p>common文件夹主要是一些自己归纳收藏的TS工具方法、各种工具函数等</p>
      <h3>higher-orderFunctions</h3>
      <p>这个下面主要是一些高阶函数的类型定义</p>
      <p>目前主要有以下这些</p>
      <ul>
        <li>curry-柯里化</li>
      </ul>
      <h3>tsTools</h3>
      <p>这个里面主要是一些基础TS类型工具，主要内容有</p>
      <ul>
        <li>common-一些基础公共的TS类型工具</li>
        <li>request-后端请求的结构的一种TS封装方案</li>
        <li>skill-一些使用ts的技巧示例</li>
      </ul>
      <h3>axiosRequest</h3>
      <p>axios的TS封装</p>
      <h3>customizerEvent</h3>
      <p>一个可以链式调用的自定义事件监听器</p>
      <h3>eventEmitter</h3>
      <p>自定义事件枚举</p>
      <h3>sigleton</h3>
      <p>一个用来创建单例模式构造函数的工具</p>
      <h3>storage</h3>
      <p>一种对storage等底层存储类webapi的封装方案</p>
    </div>
  );
}

export default CommonPage