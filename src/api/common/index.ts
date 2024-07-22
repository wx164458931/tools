// import request from "../../common/axiosRequest";
import { MockUrlEnum, /** getMockData,*/ MockMap } from './mock';
import { IUserInfo } from "./types";
import { createMockRequest } from '../utils';
import { IResponse } from "../../common/tsTools/request";
import { mockTag } from '../config';

/**
 * 此处提供了两种处理mock的方案
 */

/**
 * 方案一。使用utils里面提供的create方法，创建一个request对象(基于封装的axios)
 * 创建时传入是否开启mock，和当前mock数据的mockMap,
 * 之后所有的发送请求的地方统一使用该工厂创建的request对象
 * 当开启mock时，方法会根据url去mockMap里查找对应的mock数据返回
 * 当没有开启时，使用axios提供的request对象发送请求
 * 创建的request对象使用方法传参和axios提供的完全一致。
 * 推荐使用该方案
 */
const request = createMockRequest(mockTag, MockMap);

// 获取用户信息
export function getUserInfo() {
  return request<IResponse<IUserInfo>>(MockUrlEnum.GetUserInfo);
  // return request.get<IResponse<IUserInfo>>(MockUrlEnum.GetUserInfo)

  /**
   * 方案二
   * 参看mock里面提供的getMockData方法。
   * 开启mock是，调用该方法，获取url对应的mock数据返回，
   * 不开启时，调用axios发送真实请求
   * 由于需要每个请求都要改，不推荐
   */
  // if(mockTag) {
  //   return new Promise<IResponse<IUserInfo>>((resolve) => {
  //     setTimeout(async () => {
  //       const data = getMockData(MockUrlEnum.GetUserInfo);
  //       resolve({
  //         ...data
  //       })
  //     });
  //   });
  // }
  // else {
  //   return request<IResponse<IUserInfo>>(MockUrlEnum.GetUserInfo)
  // }
}
