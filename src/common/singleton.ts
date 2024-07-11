/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 这是一个获取单例构造函数的工具函数。
 */

/**
 * 首先定义一个类型别名，用于表示构造函数类型。
 */
type Constructor<T> = new (...args: any[]) => T;

/**
 * 传入一个构造函数，ES6的Class也行，返回一个新的构造函数
 * 1.定义变量instance来保存该构造函数的单例实例
 * 2.定义一个Proxy对象，用于拦截构造函数的new操作符
 * 3.在Proxy对象的construct方法中，判断instance是否为null，如果为null则调用构造函数生成实例，否则直接返回instance
 * 4.将Proxy对象赋值给构造函数的原型，在调用构造函数时，就会触发Proxy对象的construct方法,这样能避免使用者利用new instance.prototype.constructor()这样的方式来绕过代理，创建一个新的实例
 * @param constructor 
 * @returns 
 */
export function createSingleton<T extends object>(constructor: Constructor<T>): Constructor<T> {
  let instance: T | null = null;

  const proxy = new Proxy<Constructor<T>>(constructor, {
    construct(target:Constructor<T>, args: any[]) {
      if (!instance) {
        instance = Reflect.construct(target, args);
      }

      return instance as T;
    },
  })

  constructor.prototype.constructor = proxy;
  return proxy as Constructor<T>;
}

//示例：可将以下代码放入合适的地方查看效果
// enum Sex {
//   Male = 'male',
//   Female = 'female'
// }

/**
 * 这是准备用来用作单例的构造函数
 */
// class People {
//   name: string
//   age: number
//   sex: Sex
//   constructor(name: string, age: number, sex: Sex) {
//     this.name = name;
//     this.age = age;
//     this.sex = sex;
//   }
// }

/**
 * 生成一个只能生成单例的构造函数
 */
// const singlePeople = createSingleton(People);

// const p1 = new singlePeople('Alice', 20, Sex.Female);
// const p2 = new singlePeople('Bob', 25, Sex.Male);
// const p3 = new singlePeople.prototype.constructor('Charlie', 30, Sex.Male)
// console.log(p1.name); //输出Alice
// console.log(p2.name); //输出Alice
// console.log(p3.name); //输出Alice

// console.log(p1 === p2); // 输出 true
// console.log(p1 === p3); //输出true