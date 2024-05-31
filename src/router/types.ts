export interface IRouteConfig {
  getComponentPath?: (path: string) => string
  ignore?: boolean
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