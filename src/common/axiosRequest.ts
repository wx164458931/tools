/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig }from 'axios'
import EventEmitter from './eventEmitter'
import CustomizerEvent from './customizerEvent'
/**
 * 写在前面，一种不算优雅的axios封装方案
 * 主要是想解决axios的类型指定。
 * axios的原AxiosInstance的返回结果的类型是AxiosResponse<T>，这个类型中的T的类型才是指定的我们的返回数据，通常就是我们定义的IResponse<T>
 * 但是我们在具体使用axios的过程中，大多会在响应拦截器中只将AxiosResponse<T>中的T返回，而不会返回整个AxiosResponse<T>，
 * 这个时候我们我们期望的返回类型实际是是Promise<T>，而不是Promise<AxiosResponse<T>>，
 * 因此我们需要对axios的返回类型进行重新定义，以满足我们的需求。
 * 现在有两种方案.
 */

export interface ICustomeizedAxiosRequestConfig extends AxiosRequestConfig {
  prefix?: string
  [key: string]: any
}

/**
 * 方案一
 * 定义了RequestMethod类型，这个类型中包含了所有axios的请求方法，并且返回类型都是Promise<T>，
 * 在返回axios实例是利用as断言告诉TypeScript这个axios实例的返回类型是RequestMethod类型
 * 同时必须配合response的interceptors中，只将response的data返回，才能满足我们的需求。
 */
export interface RequestMethod {
  <T = any>(url: string, options?: ICustomeizedAxiosRequestConfig): Promise<T>;
  <T = any>(options?: ICustomeizedAxiosRequestConfig): Promise<T>;
  get: RequestMethod;
  post: RequestMethod;
  delete: RequestMethod;
  put: RequestMethod;
  patch: RequestMethod;
  head: RequestMethod;
  options: RequestMethod;
  rpc: RequestMethod;
}

/**
 * 重新定义axios中的AxiosInstance的返回类型
 * 一样要配合response的interceptors中，只将response的data返回，才能满足我们的需求。
 * 和方案一相比不需要使用as进行断言。
 * 但是一样的，都修改了AxiosInstance,可能因此带来其他的问题。但是我目前还没有遇到，遇到以后再来优化
 * 2024年5月11日10:41:36
 */
declare module 'axios' {
  export interface AxiosInstance {
    <T = any>(url: string, options?: ICustomeizedAxiosRequestConfig): Promise<T>;
    <T = any>(options?: ICustomeizedAxiosRequestConfig): Promise<T>;
    get<T = any>(url: string, options?: ICustomeizedAxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, options?: ICustomeizedAxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, options?: ICustomeizedAxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, options?: ICustomeizedAxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, options?: ICustomeizedAxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, options?: ICustomeizedAxiosRequestConfig): Promise<T>;
    options<T = any>(url: string, options?: ICustomeizedAxiosRequestConfig): Promise<T>;
    rpc<T = any>(url: string, options?: ICustomeizedAxiosRequestConfig): Promise<T>;
  }
}

const baseUrl = '';
const timeout = 600000;
const NO_LOGIN_CODE = 401;

const service = axios.create({
  baseURL: baseUrl, // api 的 base_url
  timeout: timeout, // 请求超时时间
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// response 拦截器
service.interceptors.response.use(
  (response) => {
    /**
     * 对响应做出处理
     * 注意一定要把response.data返回。因为response是axios封装的，response.data才是后台返回的数据
     */
    const res = response.data;
    const { code } = res;

    if (code === NO_LOGIN_CODE) {
      EventEmitter.emit(CustomizerEvent.UNLOGIN);
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 这是一个请求构造器
 * 作用是创建一个axios请求实例，这个实例带有一些公共的config
 * 例如系统需要对接多个微服务后端，每个微服务后端的请求前缀不同
 * 可以针对不同的微服务调用改方法创建带有不同前缀的请求实例
 * @param config 公共请求配置
 * @returns 
 */
export function createRequest(config: Partial<ICustomeizedAxiosRequestConfig>) {
  /**
   * 实际的请求构造器
   * @param req 实际发送请求的方法 这个地方没想到合适的类型标注，先用any
   * @param args1 请求的url或者让配置
   * @param args2 请求配置
   * @returns 
   */
  const _request = function(req: any, args1:string | ICustomeizedAxiosRequestConfig, args2?: ICustomeizedAxiosRequestConfig) {
    const isUrl = (v: string | ICustomeizedAxiosRequestConfig): v is string => {
      return typeof v === 'string';
    }

    /**
     * 提取公共配置
     */
    let opt = {
      ...config
    }

    /**
     * 将请求独立配置合并入公共配置得到最终配置
     * 优先级以独立配置优先
     */
    if(isUrl(args1)) {
      /**
       * 如果第一个参数是url
       * 那将第二个参数合并入最终配置
       */
      opt = {
        ...opt,
        ...(args2 || {})
      }

      return req(args1, opt);
    }
    else {
      /**
       * 如果第一个参数数配置
       * 将第一个参数合并入最终配置
       */
      opt = {
        ...opt,
        ...(args1 || {})
      }

      return req(opt);
    }
  }

  /**
   * 包装层的请求构造器
   * 主要是传入不同的请求方法
   * @param req 这个地方没想到合适的类型标注，先用any
   * @returns 
   */
  const reqCreator = function(req: any) {
    return function(args1:string | ICustomeizedAxiosRequestConfig, args2?: ICustomeizedAxiosRequestConfig) {
      return _request(req, args1, args2);
    }
  }

  /**
   * 创建整体请求
   */
  // const req = reqCreator(service) as unknown as RequestMethod; // 方案1
  const req = reqCreator(service) as unknown as AxiosInstance; // 方案2
  /**
   * 创建各个独立请求
   */
  req.get =  reqCreator(service.get);
  req.post =  reqCreator(service.post);
  req.delete =  reqCreator(service.delete);
  req.put =  reqCreator(service.put);
  req.patch =  reqCreator(service.patch);
  req.head =  reqCreator(service.head);
  req.options =  reqCreator(service.options);
  req.rpc =  reqCreator(service.rpc);

  // return req as unknown as RequestMethod; // 方案1
  return req as unknown as AxiosInstance; // 方案2
}

// export default service as any as RequestMethod // 对应方案1

export default service // 对应方案二