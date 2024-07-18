import type { RuleFunction, cacheItem } from './type';

export const nodeMap = new Map<string, cacheItem>()

/**
 * 计算组件是否需要缓存
 * @param pathname 
 * @param rule 
 * @param includes 
 * @param excludes 
 * @param oldPathname 
 * @returns 
 */
export const canCached = (
  pathname: string,
  rule: RuleFunction | undefined,
  includes: string[],
  excludes: string[],
  oldPathname: string
) => {
  if (rule && typeof rule === 'function') {
    return rule(oldPathname, pathname)
  } else {
    if (
      (includes.length > 0 && !includes.includes(pathname)) ||
      excludes.includes(pathname)
    ) {
      return {
        fromCache: true,
        toCache: false
      }
    }
  }

  return {
    fromCache: true,
    toCache: true
  }
}