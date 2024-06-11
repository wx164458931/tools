import React from "react";

const ApiPage: React.FC = () => {
  return (
    <div className="article">
      <h1>目录说明</h1>
      <p>api目录主要是管理项目的所有请求方法</p>
      <p>建议请求方法管理按照实际业务模块进行文件划分，尽量不要把所有接口写入到同一个文件中</p>
      <p>由于项目使用了ts，且对axios进行了ts封装，对模块区分时建议每个模块使用一个文件夹，文件夹下新建两个文件，一个是接口文件本身，index.ts，一个是类型标注信息types.ts</p>
    </div>
  );
}

export default ApiPage