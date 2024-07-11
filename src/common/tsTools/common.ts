/**
 * 判断一个属性是否可选
 * 首先构造一个子类型，该子类型将属性K设置为可选的
 * 然后，检查该子类型是否等同于原类型
 * 如果属于原类型，则表示K是可选的，返回K
 * 否则表示K不是可选的，返回never
 */
export type IsOptional<T, K extends keyof T> = (Omit<T, K> & Partial<Pick<T, K>>) extends T ? K : never
/**
 * 利用IsOptional判断一个属性是否可选，然后将可选的属性提取出来
 * 然后返回一个新类型，该新类型包含所有可选的属性
 */
export type OptionalKeys<T> = { [K in keyof T]: IsOptional<T, K> }[keyof T]

/**
 * 导出一个类型，用于获取T类型中所有属性的键
 * 遍历T类型的所有键，如果该键对应的属性类型是Required，则将其添加到结果中
 * 定义P是类型T的key
 * 尝试将P的类型进行断言
 * 断言结果采用以下方式来定义
 * 1.取出类型T中的属性K的类型，即T[P]
 * 2.将类型T转成全必填的新类型Required<T>
 * 3.再取出新类型的属性K的类型，即Required<T>[P]
 * 4.将类型T[P]与Required<T>[P]进行比较，如果相等，则表示P是必填的，返回P
 * 5.否则表示P不是必填的，返回never
 * 6.如果重命名一个对象的属性是never，该属性不会存在。
 * 通过上述步骤，可将所有非必填的属性过滤
 */
export type GetRequired<T> = {
  [P in keyof T as T[P] extends Required<T>[P] ? P : never]: T[P];
};

/**
 * 判断一个属性是否必填
 * 首先构造一个子类型，该子类型将属性K设置为必选的
 * 然后，检查该子类型是否等同于原类型
 * 如果属于原类型，则表示K是必填的，返回K
 * 否则表示K不是必填的，返回never
 * 注意，此处不能和type IsOptional<T, K extends keyof T> = (Omit<T, K> & Partial<Pick<T, K>>) extends T ? K : never采用类似的逻辑来处理
 * 因为K属性不可选的类型必定extends K属性可选的类型，但是反之不会成立
 * 如果此处判断逻辑写为(Omit<T, K> & Required<Pick<T, K>>) extends T ? K : never，
 * 假设K属性可选，但是我将子类型构建为K属性不可选，但是此子类型仍然等同于原类型即(Omit<T, K> & Required<Pick<T, K>>) extends T ? K : never，永远成立
 * 示例：
 * type A = {
 *    a:string,
 *    b?:string
 * }
 * 
 * type B = {
 *    a:string,
 *    b:string
 * }
 * 
 * type C = B extends A ? true : false
 * 示例中A为源类型，b为指定的属性K，那么B就是构建出来的子类型，C就是判断结果
 * 运行此代码克制，C一定为true
 * 所以，此处不能采用类似的逻辑来处理
 */
export type IsRequired<T, K extends keyof T> = K extends keyof GetRequired<T> ? K : never

/**
 * 导出一个类型，用于获取T类型中所有必填属性属性的键
 */
export type RequiredKeys<T> = { [K in keyof T]: IsRequired<T, K> }[keyof T]
/**
 * 将对象的指定属性改为可选
 * 假设存在如下情景：
 * type A ={
 *   a:string,
 *   b?:string，
 *   createTime:string
 *   creator:string
 * }
 * 类型A 中所有的属性是接口拿到的,其中createTime是从接口中一定返回的字段，所以做类型定义时，不适合将createTime设置为可选的
 * 但是当我们调用创建接口创建数据A时，我们又不需要传createTime
 * 通常我们有以下几种处理方式，
 * 1.重新定义类型
 * type AParams = {
 *   a:string,
 *   b?:string，
 *   createTime?:string
 *   creator?:string
 * }
 * 将createTime和creator设置为可选的，但需要重新定义类型,一旦A类型需要修改，就需要重新定义类型
 * 2.使用Optional<T, K>来处理
 * 无需重新定义类型，在接口方法定义时使用，
 * 示例：
 * function createA(params:Optional<A, 'createTime' | 'creator'>): IResponse<A> {
 *  函数实现
 * }
 */
export type Optional<T extends object, K extends RequiredKeys<T>> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * 将对象的指定属性改为必选
 */
export type DesignatedRequired<T extends object, K extends OptionalKeys<T>> = Omit<T, K> & Required<Pick<T, K>>

/**
 * 定义一个元组类型，用于表示函数的参数类型
 */
export type OwnTuple = unknown [] | readonly unknown []

/**
 * 定义一个获取元组长度的类型工具
 */
export type Length<T extends OwnTuple> = T['length'];

/**
 * 获取元组类型的第一个元素类型
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type First<T extends OwnTuple> = T extends [infer A, ...infer _B] ? A : never;

/**
 * 获取元组类型的最后一个元素类型
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type Last<T extends OwnTuple> = T extends [...infer _A, infer B] ? B : never;

/**
 * 判断第一个元组是不是第二个元组的子元组
 * 判断逻辑如下：
 * 1.元组1extends元组2，则元组1是元组2的子元组
 * 2.元组1的每个元素extends元组2相同位置的元素，则元组1是元组2的子元组
 * 3.T1是空元组，T2是任意元组，则T1是T2的子元组
 * 根据上述条件，完成以下逻辑：
 * 1.T1 extends T2，则T1是T2的子元组（这类情况包含了T1和T2都是空元组的情况）
 * 2.反之判断T2元组的长度，由于T1 extends T2 是false,则表示T1 T2不可能同时为空元组，此时如果T2的长度为0，则T1不是T2的子元组
 * 3.判断T1元组的长度，如果T1的长度为0，则T1是T2的子元组
 * 4.利用类型推导取出T1的第一项以及剩余项，三目运算符的第二项表述无法进行元组推导，表示T1不是元组，所有用false表示T1不是T2的子元组
 * 5.利用类型推导取出T2的第一项以及剩余项，三目运算符的第二项表述无法进行元组推导，表示T2不是元组，所有用false表示T1不是T2的子元组
 * 6.判断T1的第一项和T2的第一项是否相等，如果相等，则利用递归调用TupleExtends<T1的剩余项, T2的剩余项>，进行递归判断，不相等则得到了判断结果，T1不是T2的子元组
 */
export type TupleExtends<T1 extends OwnTuple, T2 extends OwnTuple> = T1 extends T2 ? true : 
Length<T2> extends 0 ? false :
Length<T1> extends 0 ? true :
T1 extends [infer F1, ...infer R1] ? 
T2 extends [infer F2, ...infer R2] ? 
F1 extends F2 ? 
TupleExtends<R1, R2>
: false 
: false 
: false

/**
 * 获取promise的返回值类型
 */
export type GetPromiseType<T> = T extends Promise<infer U> ? GetPromiseType<U> : T;