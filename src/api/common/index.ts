// import request from "../../common/axiosRequest";
import { MockUrlEnum, getMockData } from './mock'
import { IUserInfo } from "./types";

// const allFolder = import.meta.glob(["/src/*/**", "!/src/pages/**"]);

// 获取用户信息
export function getUserInfo() {
  return new Promise<IUserInfo>((resolve, reject) => {
    setTimeout(() => {
      const data = getMockData(MockUrlEnum.GetUserInfo)

      if(data) {
        resolve({
          ...data
        })
      }
      else {
        reject(false)
      }
    });
  });
}
