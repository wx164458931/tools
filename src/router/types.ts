export declare interface IRouteConfig {
  path?: string
  meta?: {
    title?: string
    icon?: string
    [key: string]: any
  };
  [key: string]: any;
}

export type RouteInfo = {
  path: string,
  parentPath?: string
  level: number
}

export type RouteConfigPathInfo = {
  componentPath: `${string}/index.tsx`
  routeInfo: RouteInfo
}