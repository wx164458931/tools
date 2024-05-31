import axios, { AxiosRequestConfig }from 'axios'
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


/**
 * 方案一
 * 定义了RequestMethod类型，这个类型中包含了所有axios的请求方法，并且返回类型都是Promise<T>，
 * 在返回axios实例是利用as断言告诉TypeScript这个axios实例的返回类型是RequestMethod类型
 * 同时必须配合response的interceptors中，只将response的data返回，才能满足我们的需求。
 */
export interface RequestMethod {
  <T = any>(url: string, options?: AxiosRequestConfig): Promise<T>;
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
 * 重新定义axios中饿AxiosInstance的返回类型
 * 一样要配合response的interceptors中，只将response的data返回，才能满足我们的需求。
 * 和方案一相比不需要使用as进行断言。
 * 但是一样的，都修改了AxiosInstance,可能因此带来其他的问题。但是我目前还没有遇到，遇到以后再来优化
 * 2024年5月11日10:41:36
 */
declare module 'axios' {
  export interface AxiosInstance {
    <T = any>(url: string, options?: AxiosRequestConfig): Promise<T>;
    <T = any>(options?: AxiosRequestConfig): Promise<T>;
    get<T = any>(url: string, options?: AxiosRequestConfig): Promise<T>;
    post<T = any>(url: string, options?: AxiosRequestConfig): Promise<T>;
    delete<T = any>(url: string, options?: AxiosRequestConfig): Promise<T>;
    put<T = any>(url: string, options?: AxiosRequestConfig): Promise<T>;
    patch<T = any>(url: string, options?: AxiosRequestConfig): Promise<T>;
    head<T = any>(url: string, options?: AxiosRequestConfig): Promise<T>;
    options<T = any>(url: string, options?: AxiosRequestConfig): Promise<T>;
    rpc<T = any>(url: string, options?: AxiosRequestConfig): Promise<T>;
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
     * 对响应租出处理
     * 注意一定要把response.data返回。因为response是axios封装的，response.data才是后台返回的数据
     */
    const res = response.data;
    const { code, msg } = res;

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

// export default service as unknown as RequestMethod //对应方案1

export default service //对应方案二