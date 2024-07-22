/* eslint-disable @typescript-eslint/no-unused-vars */
import { IUserInfo } from './types';
import { createMockGetor } from '../utils';
import { IResponse } from '../../common/tsTools/request';

export enum MockUrlEnum {
  GetUserInfo = 'getUserInfo'
}

const UserMockData: IResponse<IUserInfo> = {
  code: 200,
  timestamp: Date.now(),
  success: true,
  msg: '操作成功',
  data: {
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
                id: "components",
                name: "components",
                path: "/components",
                component: "/componentPage",
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
                id: "pages",
                name: "pages",
                path: "/pages",
                component: "/pagesPage",
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
              },
              {
                id: 'houdini-api',
                name: 'houdiniAPI',
                path: '/houdini-api',
                visiable: true,
                component: '/stylesPage/animation/houdiniAPI',
              }
            ]
          },
          {
            id: 'components',
            name: '组件',
            path: '/components',
            visiable: true,
            children: [
              {
                id: 'search',
                name: '搜索栏组件',
                path: '/search',
                visiable: true,
                component: '/componentPage/searchComponent'
              }
            ]
          }
        ]
      },
      {
        id: 'notes',
        name: '笔记',
        path: '/notes',
        visiable: true,
        children: [
          {
            id: 'browserRenderFlow',
            name: '浏览器渲染流程',
            path: '/browser-render-flow',
            visiable: true,
            children: [
              {
                id: 'browserRenderFlowOverview',
                name: '流程概览',
                path: '/overflow',
                visiable: true,
                component: '/notes/browserRenderFlow',
              },
              {
                id: 'CSSOM',
                name: 'CSSOMTree说明',
                path: '/cssom-tree',
                visiable: true,
                component: '/notes/browserRenderFlow/CSSOM',
              },
              {
                id: 'recalculateStyle',
                name: '样式计算',
                path: '/recalculate-style',
                visiable: true,
                component: '/notes/browserRenderFlow/recalculateStyle',
              },
              {
                id: 'layout',
                name: 'Layout',
                path: '/layout',
                visiable: true,
                component: '/notes/browserRenderFlow/layout',
              },
              {
                id: 'layer',
                name: 'Layer',
                path: '/layer',
                visiable: true,
                component: '/notes/browserRenderFlow/layer',
              },
              {
                id: 'paint',
                name: 'Paint',
                path: '/paint',
                visiable: true,
                component: '/notes/browserRenderFlow/paint',
              },
              {
                id: 'tiling',
                name: 'Tiling',
                path: '/tiling',
                visiable: true,
                component: '/notes/browserRenderFlow/tiling',
              },
              {
                id: 'raster',
                name: 'Raster',
                path: '/raster',
                visiable: true,
                component: '/notes/browserRenderFlow/raster',
              },
              {
                id: 'draw',
                name: 'Draw',
                path: '/draw',
                visiable: true,
                component: '/notes/browserRenderFlow/draw',
              }
            ]
            // component: '/notes/browserRenderFlow',
          },
          {
            id: 'eventLoop',
            name: '事件循环',
            path: '/event',
            visiable: true,
            children: [
              {
                id: 'eventLoopOverflow',
                name: '事件循环概览',
                path: '/overflow',
                visiable: true,
                component: '/notes/eventLoop',
              },
            ]
            // component: '/notes/browserRenderFlow',
          }
        ]
      }
    ],
  }
}

export const MockMap = {
  [MockUrlEnum.GetUserInfo]: UserMockData,
}

export const getMockData = createMockGetor(MockMap)