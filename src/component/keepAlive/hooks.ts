import {
  useEffect,
  useRef,
  useState
} from 'react'
import { useLocation } from 'react-router-dom';
import type { IKeepALiveRef } from './type';
import { nodeMap } from './util'

/**
 * 获取KeepAlive组件的ref
 * @param val
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useKeepAliveRef = (val?: any) => {
  const ref = useRef<IKeepALiveRef>(val)
  return [ref]
}

/**
 * 获取当前组件在缓存中的key
 * 参考taskManage的index.jsx中的使用
 * @returns
 */
export const useKeepAliveUniqueCode = () => {
  const location = useLocation()
  const { pathname, search } = location
  const [res] = useState<string>(pathname + search)
  return res
}

/**
 * 对应被缓存的组件额外增加的生命周期，当从缓存不可见中激活变成可见时会调用的回调。若改组件没有被缓存，则该回调不会触发
 * @param cb 回调方法
 * @param uniqueCode 通过useKeepAliveUniqueCode获取的缓存key值，因为react并不存在vue组件中的name，必须通过该值才能将该生命周期和对应的缓存组件挂钩
 */
export const useActive = (cb: () => void, uniqueCode: string) => {
  const [cacheKey, setCacheKey] = useState<string>()
  const location = useLocation()
  const { pathname, search } = location

  useEffect(() => {
    const item = nodeMap.get(uniqueCode)
    const curKey = pathname + search

    if (item && cacheKey && cacheKey !== uniqueCode && curKey === uniqueCode) {
      cb()
    }

    setCacheKey(curKey)
  }, [cb, uniqueCode, pathname, search])
}

/**
 * 对应被缓存的组件额外增加的生命周期，当从激活状态转入缓存不可见时会调用的回调。若改组件没有被缓存，则该回调不会触发
 * @param cb 回调方法
 * @param uniqueCode 通过useKeepAliveUniqueCode获取的缓存key值，因为react并不存在vue组件中的name，必须通过该值才能将该生命周期和对应的缓存组件挂钩
 */
export const useUnActive = (cb: () => void, uniqueCode: string) => {
  const [cacheKey, setCacheKey] = useState<string>()
  const location = useLocation()
  const { pathname, search } = location

  useEffect(() => {
    const item = nodeMap.get(uniqueCode)
    const curKey = pathname + search

    if (item && cacheKey && cacheKey === uniqueCode && curKey !== uniqueCode) {
      cb()
    }

    setCacheKey(curKey)
  }, [cb, uniqueCode, pathname, search])
}