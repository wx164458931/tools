import React from "react";

const Home: React.FC = () => {
  return (
    <div className={'article'}>
      <h1>项目说明</h1>
      <h3>整体概述</h3>
      <p>这个项目是以vite为脚手架搭建的react项目，使用了Ant Design组件库，使用redux作为状态管理工具，使用react-route-dom作为路由管理工具。使用TypeScript作为开发语音，使用SASS作为css预处理器</p>
      <h3>项目目的</h3>
      <p>1.将整体的项目不停完善，可以作为以后自己新开react项目的模板使用。</p>
      <p>2.项目中不停完善一些ts类型工具（包括type challenges），作为TS的学习</p>
      <p>3.在项目中加入一些常用的工具方法等，例如axios的ts封装等等</p>
      <h3>构建工具选择</h3>
      <p>构建工具主要在webpack和vite中选择</p>
      <h4>webpack</h4>
      <p>webpack是现在生态最为庞大，使用最为广泛的打包工具，可以说是每一个前端人都绕不开的构建工具</p>
      <p>优势：</p>
      <ul>
        <li>webpack的生态非常丰富，插件非常丰富，可以满足大部分的需求</li>
        <li>基于webpack的react脚手架选择非常多，例如基础的creat-react-app,也例如比较成熟的企业级框架umi.js等，选择非常多</li>
      </ul>
      <h4>vite</h4>
      <p>vite是基于rollup和esmodule基础上新开发的构建工具，最佳支持的代码框架依然是vue，后续现在对react等的支持也</p>
      <p>优势</p>
      <ul>
        <li>vite自己继承了devserver,以及scss、lessloader等loader,很大程度上可以实现开箱即用</li>
        <li>vite的构建速度非常快，特别是在在开发环境下，由于使用了esmodule的方式，构建速度比webpack快了10倍，在开发体验上非常好，在生产环境目前使用的是rollup进行构建打包，多数情况下和打包速度也小幅优于webpack，只是生态相对webpack有些不足</li>
      </ul>
      <h3>状态管理工具</h3>
      <p>选择了redux作为状态管理工具。以后可以尝试一些其他的更加轻量化的状态管理工具，或者引入类似redux-saga对异步状态管理更为方便的redux插件等</p>
      <h3>路由管理工具</h3>
      <p>选择了react-route-dom作为路由管理工具。使用的V6版本，也可以尝试其他的路由工具</p>
    </div>
  );
}

export default Home