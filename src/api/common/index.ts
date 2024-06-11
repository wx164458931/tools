import request from "../../common/axiosRequest";
import { IMenuItem, IUserInfo } from "./types";

const allFolder = import.meta.glob(["/src/*/**", "!/src/pages/**"]);

// 获取用户信息
export function getUserInfo() {
  return new Promise<IUserInfo>((resolve, reject) => {
    setTimeout(() => {
      const res: IUserInfo = {
        name: "Admin",
        account: "admin",
        menus: [
          {
            id: "1",
            name: "说明",
            path: "/home",
            visiable: true,
            icon: "",
            children: [
              {
                id: "4",
                name: "整体概述",
                path: "/second",
                visiable: true,
                component: "/home",
              },
              {
                id: "2",
                name: "目录说明",
                path: "/module",
                visiable: true,
                children: [
                  {
                    id: "api",
                    name: "api",
                    path: "/api",
                    component: "/apiPage",
                    visiable: true,
                  },
                  {
                    id: "assets",
                    name: "assets",
                    path: "/assets",
                    component: "/assetsPage",
                    visiable: true,
                  },
                  {
                    id: "common",
                    name: "common",
                    path: "/common",
                    component: "/commonPage",
                    visiable: true,
                  },
                  {
                    id: "layout",
                    name: "layout",
                    path: "/layout",
                    component: "/layoutPage",
                    visiable: true,
                  },
                  {
                    id: "router",
                    name: "router",
                    path: "/router",
                    component: "/routerPage",
                    visiable: true,
                  },
                  {
                    id: "store",
                    name: "store",
                    path: "/store",
                    component: "/storePage",
                    visiable: true,
                  },
                  {
                    id: "styles",
                    name: "styles",
                    path: "/styles",
                    component: "/stylesPage",
                    visiable: true,
                  },
                ],
              },
            ],
          },
          {
            id: 'demo',
            name: '示例',
            path: '/demo',
            visiable: true,
            children: [
              {
                id: 'cssDemo',
                name: '样式',
                path: '/cssDemo',
                visiable: true,
                children: [
                  {
                    id: 'animation-delay',
                    name: '动画延迟',
                    path: '/animation-delay',
                    visiable: true,
                    component: '/stylesPage/animation/animationDelay',
                  }
                ]
              }
            ]
          }
        ],
      };
      resolve({
        ...res,
      });
      // reject(false)
    });
  });
}
