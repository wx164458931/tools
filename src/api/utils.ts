/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import request, { /** RequestMethod */ } from '../common/axiosRequest';

/**
 * 定义一个获取当前Mock返回结果类型的类型工具
 */
type MockData<T extends Record<string, any>, R> = R extends keyof T ? T[R] : never

/**
 * 传入一个对象,对象结构为key是请求地址，value是mock的返回结果
 * @param map 
 * @returns 返回一个函数，这个函数接受一个url,url必须是传入mock对象的key,然后返回对应的mock数据。根据url带上类型推导
 */
export const createMockGetor = <T extends Record<string, any> = object>(mockMap: T) => {
  return <R extends keyof T>(url: R):MockData<T, R> | undefined => {

    if(url in mockMap) {
      return mockMap[url];
    }

    return void 0;
  }
}

/**
 * 创建一个request方法，方法会根据传入的mock状态看是否返回mock数据
 * 当不使用mock数据的时候，利用axios发送请求
 * 注意，此处是针对现在使用的axios封装方案的方案二
 * 如果使用方案一，请调整代码
 * @param mock 
 * @param mockMap 
 * @returns 
 */
export const createMockRequest = <T extends Record<string, any> = object>(mock: boolean, mockMap: T) => {
  if(mock) {
    const mockGetor = createMockGetor(mockMap);

    const _request = <R extends MockData<T, K> = any, K extends keyof T = string>(url: K | AxiosRequestConfig, option?: AxiosRequestConfig & {
      url?: K
    }): Promise<R | undefined> => {
      let _url = '';

      const isString = (u:  any) : u is string => {
        return typeof u === 'string'
      }

      if(isString(url)) {
        _url = url;
      }
      else {
        _url = option?.url || ''
      }

      if(_url) {
        const resData = mockGetor(_url);
        return Promise.resolve(resData);
      }

      return Promise.reject({
        timestamp: Date.now(),
        success: true,
        code: 500,
        msg: '接口mock数据不存在',
        data: void 0
      });
    }

    _request.get = _request;
    _request.post = _request;
    _request.delete = _request;
    _request.put = _request;
    _request.patch = _request;
    _request.head = _request;
    _request.options = _request;
    _request.rpc = _request;

    /**
     * 对应axios封装方案一
     */
    // return _request as unknown as RequestMethod;
    
    /**
     * 对应axios封装方案二
     */
    return _request as unknown as AxiosInstance;
  }
  else {
    return request;
  }
}