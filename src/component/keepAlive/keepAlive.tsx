import React, {
  HTMLAttributes,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState
} from 'react'
import { useLocation } from 'react-router-dom';
import type { IKeepAliveProps, IKeepALiveRef } from './type';
import { canCached, nodeMap } from './util';

/**
 * 实现类似vue的keepAlive的容器组件
 * 该方案基于路由变化，对该组件的children进行缓存。与url及路由path强相关
 * @prop maxCacheCount
 * @prop expirationDate
 * @prop includes
 * @prop excludes
 * @prop rule
 */
const KeepAlive = forwardRef<IKeepALiveRef, HTMLAttributes<HTMLElement> & IKeepAliveProps>((
  props,
  ref
) => {
  const {
    children,
    maxCacheCount = 5,
    expirationDate,
    includes = [],
    excludes = [],
    rule
  } = props
  const location = useLocation()
  const { pathname, search } = location
  const [updateFlag, setUpdateFlag] = useState<boolean>(false)
  const [cacheLocation, setCacheLocation] = useState<{
    pathname: string
    search: string
  }>({
    pathname,
    search
  })

  useImperativeHandle(ref, () => {
    return {
      clear() {
        const { pathname, search } = location
        Array.from(nodeMap.keys()).map(key => {
          if (pathname + search !== key) {
            nodeMap.delete(key)
          }
        })
        setUpdateFlag(!updateFlag)
      },
      clearAll() {
        nodeMap.clear()
        setUpdateFlag(!updateFlag)
      }
    }
  })

  useEffect(() => {
    const { fromCache, toCache } = canCached(
      pathname,
      rule,
      includes,
      excludes,
      cacheLocation.pathname
    )

    Array.from(nodeMap.keys()).forEach(key => {
      const item = nodeMap.get(key)

      if (key === cacheLocation.pathname + cacheLocation.search && item) {
        nodeMap.set(key, {
          ...item,
          needCached: fromCache
        })
      }
    })

    if (expirationDate) {
      //当存在有效期时
      /**
       * 遍历缓存的map，
       * 超过有效期的缓存清除
       */
      Array.from(nodeMap.keys()).map(key => {
        const item = nodeMap.get(key)

        if (item) {
          if (Date.now() - item.time > expirationDate) {
            nodeMap.delete(key)
          }
        }
      })
    }

    /**
     * 遍历缓存map
     * 将不可缓存的数据清除
     */
    Array.from(nodeMap.keys()).map(key => {
      const item = nodeMap.get(key)

      if (item) {
        if (!item.needCached) {
          nodeMap.delete(key)
        }
      }
    })

    /**
     * 将超出最大数量限制的缓存清除
     */
    let size = nodeMap.size
    const keyIt = nodeMap.keys()

    while (
      (toCache && size >= maxCacheCount) ||
      (!toCache && size > maxCacheCount)
    ) {
      size--
      nodeMap.delete(keyIt.next().value)
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const Component = React.Children.only(children)?.type;

    console.log('React.Children.only(children)', React.Children.only(children));

    /**
     * 将当前路由对应的组件缓存
     */
    nodeMap.set(pathname + search, {
      node: <Component key={pathname + search}/>,
      time: Date.now(),
      needCached: toCache
    })

    setCacheLocation({
      pathname,
      search
    })
    setUpdateFlag(!updateFlag)
  }, [pathname, search])

  return (
    <React.Fragment>
      {Array.from(nodeMap.keys()).map(key => {
        const item = nodeMap.get(key)
        const isHidden = pathname + search !== key;

        if(isHidden) {
          return <div style={{display: 'none'}}>{item?.node}</div>
        }
        else {
          return <>
            {item?.node}
          </>
        }
      })}
    </React.Fragment>
  )
})

export default KeepAlive
