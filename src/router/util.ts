import type { RouteConfigPathInfo, RouteInfo } from './types'
import { RouteObject } from 'react-router-dom'

export function getRouteUsefullPath(path: string): RouteConfigPathInfo {
  let arr = path.split('/');
  //去掉最后一项
  arr.pop();

  const getRouteInfo = ():RouteInfo => {
    arr.shift();
    arr.shift();
    const res = {
      path: `/${arr.join('/')}`,
      level: arr.length
    }

    arr.pop();

    return {
      ...res,
      parentPath: res.level === 1 ? void 0 : res.path = `/${arr.join('/')}`
    }
  }

  return {
    componentPath: `${arr.join('/')}/index.tsx`,
    routeInfo: getRouteInfo(),
  }
}

export function findRouteByPath(path: string, routes: RouteObject[]): null |RouteObject {
  let res = null;
  
  routes.some(el => {
    if(el.path === path) {
      res = el;
      return true;
    }

    if(el.children) {
      res = findRouteByPath(path, el.children);
      return !!res;
    }

    return false;
  })

  return res;
}