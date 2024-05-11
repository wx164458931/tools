/**
 * 写在前面，这一系列封装的目的是为了方便后续的接口调用，
 * 减少重复的代码，提高开发效率。
 * 尽量将一些公共的参数和返回结构进行封装，
 * 方便后续的修改和扩展。
 * 但是如果某些系统存在对接多种不同后端服务的接口，多种后端服务的接口返回结构存在差异，
 * 这个时候对响应结构进行封装我个人认为虽然看上去有些鸡肋，但实际上确更为重要。
 * 因为这个时候的目的不是减少重复代码。方便后续修改和扩展。而是将不同后端服务的接口都单独封装一套。看似进行了重复的工作，
 * 但只要在调用接口的过程中使用类型标注清楚，那么之后的接口使用的时候，使用者就可以通过TS的类型推断即可轻松的知道接口的返回结构，从而知道这个接口是访问的哪个后端服务
 * 示例：
 * interface IResponse<T> {
 *  code: number
 *  msg: string
 *  data: T
 *  success: boolean
 *  timestamp: number
 * }
 * interface IResponseA<T> {
 *  returnCode: number
 *  message: string
 *  data: T
 * }
 * 此时我们在api定义时，定义两个接口，一个接口是返回结构为IResponse<T>的接口，另一个接口是返回结构为IResponseA<T>的接口
 * 这样在调用接口的时候，通过类型标注清楚，就可以轻松的知道接口的返回结构，从而知道这个接口是访问的哪个后端服务
 * 例如：
 * async function getData(): Promise<IResponse<T>> {
 *  return axios.get('/api/data')
 * }
 * async function getAData(): Promise<IResponseA<T>> {
 *  return axios.get('a/api/data')
 * }
 * 
 * 之后用户使用这两个接口时
 * const data = await getData()
 * const aData = await getAData()
 * 此时通过类型推断，TS就可以自动推断出data和aData的类型，从而知道data和aData的返回结构是IResponse<T>和IResponseA<T>，从而知道这个接口是访问的哪个后端服务
 */


/**
 * 定义一个公共响应接口，用于封装接口返回的公共数据结构。
 */
export interface IResponse<T> {
  /**
   * 常见的请求返回结构
   * 其中data使用泛型来约束
   */
  code: number
  msg: string
  data: T
  success: boolean
  timestamp: number
}

/**
 * 定义一个公共列表响应接口，用于封装接口返回的列表数据结构。
 */
export interface IListResponseData<T> {
  /**
   * 一种常见的列表数据结构
   * 具体可根据具体项目修改
   * data使用泛型约束
   */
  data: T[]
  total: number
  pageNum: number
  pageSize: number
}

/**
 * 利用IResponse和IListResponseData定义一个公共列表响应接口
 * 首先是它自身继承自IResponse，并且泛型约束为IListResponseData
 * 这样这个列表的返回结构就如下：
 * {
 *  code: number
 *  msg: string
 *  data: IListResponseData<T>
 *  success: boolean
 *  timestamp: number
 * }
 */
export interface IListResponse<T> extends IResponse<IListResponseData<T>> {}

/**
 * 可以尝试对一些公共的参数进行封装
 * 例如这个是对分页列表接口参数的封装，
 * 将其中的pageNum和pageSize作为公共的参数
 * 可根据具体情况增加其他的公共参数，例如排序等
 */
export interface IListQueryParams {
  pageNum: number
  pageSize: number
}