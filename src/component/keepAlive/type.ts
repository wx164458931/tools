import { ReactNode } from "react"

export type cacheItem = {
  node: ReactNode
  time: number
  needCached: boolean
}

export type RuleFunction = (
  fromPathname: string,
  toPahtname: string
) => {
  fromCache: boolean
  toCache: boolean
}

export interface IKeepAliveProps {
  /**
   * 最大缓存数量，默认值5，出于内存考虑，超出缓存数量的页面将不再缓存
   */
  maxCacheCount?: number
  /**
   * 缓存有效期，单位毫秒。当设置缓存有效期时，已缓存的页面从缓存那一刻开始到现在超过了有效期，则会被踢出缓存
   */
  expirationDate?: number
  /**
   * 包含的路由，参考vue的keepalive组件。
   * 不过该值为路由的path，此处没有做动态路由的匹配，如有需要，后续优化
   */
  includes?: string[]
  /**
   * 排除缓存的路由，方式参考includes
   */
  excludes?: string[]
  /**
   * 路由缓存规则回调，优先级比includes和excludes都高。当url变化时调用
   * @param fromPathname string 路由变化时旧路由path
   * @param toPahtname string 路由变化时新路由的path
   * @returns {
   *  返回一个对象，包含以下两个属性
   *  fromCache: boolean, 旧路由对应children是否缓存
   *  toCache: boolean, 新路由对应children是否缓存
   * }
   */
  rule?: RuleFunction
}

export interface IKeepALiveRef {
  /**
   * 清除非当前路由意外的所有缓存
   * @returns
   */
  clear: () => void
  /**
   * 清除所有缓存
   * @returns
   */
  clearAll: () => void
}