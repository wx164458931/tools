# 说明

common文件夹主要是一些自己归纳收藏的TS工具方法、各种工具函数等  

## higher-orderFunctions

这个下面主要是一些高阶函数的类型定义  
目前主要有以下这些  

- curry-柯里化

## tsTools

这个里面主要是一些基础TS类型工具，主要内容有  

- common-一些基础公共的TS类型工具
- request-后端请求的结构的一种TS封装方案
- skill-一些使用ts的技巧示例

## axiosRequest

axios的TS封装

## browserFingerprint

获取浏览器指纹，简单实现了一个利用canvas生成的浏览器指纹

## customizerEvent

自定义事件监听器

## eventEmitter

自定义事件枚举

## prettyLog

这是一个利用console.log的功能，增加样式的一个美观的log库。  
如果愿意了解，可以确保main.tsx中包含以下代码：

```js
import {registerPerttyLog} from './common/prettyLog.ts'
registerPerttyLog();
```

然后可以打开控制台，看一看现在console.log的效果吧

## processTask

这是一个常见的面试题实现，只是实现不是重点，重点是像完成对类似的方法的TS类型标注

## sigleton

一个用来创建单例模式构造函数的工具
可以尝试如下方式使用及测试

```ts
import { createSingleton } from './singleton';

enum Sex {
  Male = 'male',
  Female = 'female'
}

/**
 * 这是准备用来用作单例的构造函数
 */
class People {
  name: string
  age: number
  sex: Sex
  constructor(name: string, age: number, sex: Sex) {
    this.name = name;
    this.age = age;
    this.sex = sex;
  }
}

/**
 * 生成一个只能生成单例的构造函数
 */
const singlePeople = createSingleton(People);

/**
 * 第一次调用构造函数，能够生成名称为Alice的实例
 */
const p1 = new singlePeople('Alice', 20, Sex.Female);
/**
 * 第二次调用构造函数，因为是单例，所以返回的还是之前创建的实例，不会生成新的实例
 */
const p2 = new singlePeople('Bob', 25, Sex.Male);
/**
 * 使用原型链上的构造函数来创建实例
 * 因为是单例，依然返回第一次创建的实例
 * 尽可能的避免单例模式被破坏
 * 但是不可能覆盖所有的场景
 * 这几种是我能想到的能够调用它的构造函数创建实例的场景，目前都覆盖到了
 */
const p3 = new singlePeople.prototype.constructor('Charlie', 30, Sex.Male)

console.log(p1.name); // 输出Alice

console.log(p2.name); // 输出Alice

console.log(p3.name); // 输出Alice


console.log(p1 === p2); // 输出 true, 表明第二次创建的实例和第一次创建的是同一个
console.log(p1 === p3); // 输出 true, 表明第三次创建的实例和第一次创建的是同一个
```

## storage

一种对storage等底层存储类webapi的封装方案
这个方案提供了一个存储介质的接口： 

```ts
interface IStorageStore
```

考虑到绝大多数场景使用是在浏览器环境中使用localStorate或者sessionStorage，所以这个接口和这两个Storage的接口保持一致。  
如果使用其他的的存储介质，例如indexDB等。可以对indexDB进行第一次封装，暴露一个实现该接口方法的对象用来作为存储介质
但是indexDB的封装似乎有点困难，后续在升入学习indexDB后尝试对该方法进行优化，使其能够更好的兼容indexDB

其中实现了有效期、转义、数据校验等。其中数据校验逻辑依赖MD5这个库
