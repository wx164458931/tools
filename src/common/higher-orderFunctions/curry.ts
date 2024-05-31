import type { OwnTuple, Length, First } from '../tsTools/common'

/**
 * 类型体操中柯里化的一种类型实现方案
 */

/**
 * 柯里化的返回类型
 * 1.接受两个泛型，T是参数，R是返回值
 * 2.首先判断参数T的长度是不是0， 是0的返回一个参数为空，返回值是R的函数
 * 3.如果不是0，判断参数T的长度是不是1， 如果是1的返回一个参数为第一个元素，返回值是R的函数
 * 4.参数长度不是0 也不是1，那么表示参数长度超过1，则取出参数中的第一项和剩余项，返回一个递归本身类型的函数，函数的参数是第一项，返回值是剩余项递归
 */
type CurryMethod<T extends OwnTuple, R> = Length<T> extends 0 ? () => R :
Length<T> extends 1 ? (a: First<T>) => R :
T extends [infer A, ...infer B] ? (a: A) => CurryMethod<B, R> :
never

/**
 * 定义柯里化函数
 * 1.参数fn是函数类型，返回值是CurryMethod类型
 * 2.利用类型工具，获取函数的参数类型和返回值类型
 * 3.将取出的参数类型和返回类型作为泛型传入CurryMethod类型，返回一个CurryMethod类型的函数
 * @param fn 
 */
export declare function curry<A extends OwnTuple, R>(fn: (...args: A) => R): CurryMethod<A, R>

// const sum = (a: number, b: string, c: number) => {
//   return a + b + c
// }

/**
 * 此处利用IDE的代码提示，可以看到_currid的提示信息如下
 * const _currid: (a: number) => (a: string) => (a: number) => string
 * 表明该类型标注能够很好的为柯里化函数服务
 */
// const _currid = curry(sum)

/**
 * 存在的问题
 * 本想在实现curry函数的类型定义，并实现该函数。
 * 但是发现实现过程中还需要一些更为复杂的类型定义，或者没有想到贴合现在类型定义的实现方案，期望以后能够补充
 * 接下来贴几个不使用TS的简单版本的curry类型实现
 */

/**
 * 实现方案1
 * 1.返回一个函数，函数接受任意数量参数
 * 2.该方法内部首先判断接受参数长度是否已经复合原函数参数
 * 3.如果超过，将所有参数传入原参数调用
 * 4.如果不超过，利用bind固化已有参数，返回一个接受剩余参数的函数
 */
// function curry(fn) {
//   return (...args) => {
//     if(args.length >= fn.length) {
//       return fn.apply(null, args)
//     }
//     else {
//       return curry(fn.bind(null, ...args))
//     }
//   }
// }

/**
 * 实现方案2
 * 该方案主要是存在默认参数等特殊参数不会被统计到Function的参数长度中，导致无法使用方案1的实现方式, 所以增加一个参数length来记录参数长度
 * 1.创建一个参数数组用来存储所有已接收参数
 * 2.创建一个变量，用于存储该方法的参数长度
 * 3.创建一个函数，该函数接受任意数量参数，并将所有参数存储到参数数组中
 * 4.判断参数数组长度是否已经超过原函数参数长度，如果超过，则调用原函数，并返回结果
 * 5.如果不超过，则返回函数自身
 */
// function curry(fn, length = fn.length) {
//   let _args = [];
//   let argLenght = length || fn.length;
//   function _curry(...args) {
//     _args = [..._args, ...args];

//     if(_args.length >= argLenght) {
//       return fn.apply(null, _args)
//     }
//     else {
//       return _curry
//     }
//   }

//   return _curry
// }

// const getParams = (a: string, b:number, c: boolean) => {
//   return [a, b, c];
// }

// const _paramsCurrid = curry(getParams)

/**
 * 以上两种方案都是使用js的简易实现，没有使用TS的特性，所以无法实现类型标注；
 * 尝试将其改造为TS版，但是发现很难在不使用as进行强行类型断言的前提，实现一个完整的类型标注
 * 同时现在的CurryMethod的类型标注也存在一些问题。主要问题如下：
 * 1.curry是函数式编程中最重要的函数不为过，通常来讲，curry是将一个多参函数转换成一个单参高阶函数，例如多次调用curry返回的函数来实现多参调用。
 * 但是curry函数返回的高阶函数并不禁止多参调用，单当前的类型标注只支持单参调用。多参调用情况更为复杂，需要跟多的类型工具。
 * 以上文中的getParams方法为例，方法接受三个参数，返回结果将三个参数放到一个数组中返回，我们的类型标注的_paramsCurrid方法只能以_paramsCurrid('1')(2)(true)这样的方式调用
 * 但是实际上的curry的使用场景中，可以_paramsCurrid('1', 2)(true)等种方式调用，所以需要对类型标注进行加强
 * 2.对于例如lodash中的curry等实现来说，支持占位符来调整参数顺序，让实际的传参顺序并不严格按照调用顺序来实现，当前类型标准和现在的两种实现方案均不支持该场景，可以尝试加强
 * 以_paramsCurrid为例，lodash中可以如下方式调用_paramsCurrid('1')('_', false)(2) => ['1', 2, false];可以看到第二次调用的时候，使用了一次占位符'_',将false的传参顺序从第二次调用的调用顺序改为第三个传入的传参顺序已保证原函数的参数顺序不变。目前的标准和实现都不支持
 * 3.在很多curry的实现的场景中，使用curry的时候还可以天然固化参数，已getParams函数为例，在使用curry创建_paramsCurrid时，可以如下创建const _paramsCurrid = curry(getParams, '1');
 * 这样得到的_paramsCurrid只能调用两次或者一次调用传入两个参数，且分别为number和boolean类型，无法传入其他类型的参数，所以需要对类型标注进行加强
 * 4.除此之外还有一些其他问题，后续慢慢补充
 */