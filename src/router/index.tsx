import { createBrowserRouter, RouteObject, useNavigate } from 'react-router-dom'
import { getRouteUsefullPath } from './util.ts'
import Layout from '../layout'
import Login from '../pages/login/index.tsx'
import Error from '../pages/error/index.tsx'
import type { DesignatedRequired } from '../common/tsTools/common.ts'
import { useState, useEffect } from 'react'
import { selectMenus } from '../store/userinfo/index.ts'
import { useAppSelector } from '../store'
import { cloneDeep } from 'lodash'
import { IMenuItem } from '../api/common/types.ts'
import { IRouteConfig } from './types.ts'

const routeComponents = import.meta.glob(['../pages/**/index.tsx', '!../pages/**/components/**/index.tsx', '../pages/**/common/**/index.tsx'])
const routeConfigs = import.meta.glob(['../pages/**/page.ts', '!../pages/**/components/**/page.ts', '../pages/**/common/**/page.ts'], {
  eager: true,
  import: 'default'
})

const baseRoutes = [
  {
    path: '/login',
    element: <Login/>,
  }
]

const baseDynamicRoute = {
  path: '/*',
  element: <Layout/>,
  errorElement: <Error/>,
  children: [] as RouteObject[]
}

// const dynamicRoutes = Object.entries(routeComponents).reduce((res, [path, cmp], idx) => {
//   const { routeInfo } = getRouteUsefullPath(path);
//   const { path: routePath } = routeInfo
//   let configPath = path.split('/').filter(Boolean);
//   configPath.pop();
//   console.log('path', path);
//   console.log('config', routeConfigs[configPath.join('/') + '/page.ts'])
//   const lazy = async () => {
//     const { default: Index} = await (cmp() as Promise<{
//       default: any;
//     }>);
//     return { Component: Index };
//   }

//   res[0].children.push({
//     path: routePath,
//     lazy
//   })

//   return res;
// }, [
//   cloneDeep(baseDynamicRoute)
// ] as DesignatedRequired<RouteObject, 'children'>[])


const createDynamicRoutes = (menus: IMenuItem[]) => {
  const dynamicRootRoute = cloneDeep(baseDynamicRoute);
  const childrenStack: {
    cmenus: IMenuItem[], parentPath: string
  } [] = [
    {
      cmenus: menus,
      parentPath: ''
    }
  ]
  
  while(childrenStack.length) {
    const { cmenus, parentPath } = childrenStack.pop() as { cmenus: IMenuItem[], parentPath: string };
    cmenus.forEach(item => {
      const path = (parentPath + item.path).split('/').filter(Boolean).join('/');
  
      if(item.component) {
        const componentPath = `../pages${item.component}/index.tsx`;
        const configPath = `../pages${item.component}/page.ts`;
        const config = routeConfigs[configPath] as IRouteConfig;
        if(!config || !config.ignore) {
          const cmp  = routeComponents[config?.getComponentPath ? config?.getComponentPath(componentPath) : componentPath];
          dynamicRootRoute.children.push({
            path: path,
            lazy: async () => {
              const { default: Index} = await (cmp() as Promise<{
                default: any;
              }>);
              return { Component: Index };
            }
          })
        }
      }
  
      if(item.children && item.children.length) {
        childrenStack.push({
          cmenus: item.children,
          parentPath: path
        })
      }
    })
  }

  return dynamicRootRoute;
}

const useDynamicRoutes = () => {
  const menus = useAppSelector(selectMenus);
  const [routes, setRoutes] = useState(createBrowserRouter([...baseRoutes, baseDynamicRoute]))

  useEffect(() => {
    if(!menus.length) {
      return;
    }
    setRoutes(createBrowserRouter([
      ...baseRoutes,
      createDynamicRoutes(menus),
    ]))
    // console.log('createDynamicRoutes', createDynamicRoutes(menus));
  }, [menus])

  return routes
}

export default useDynamicRoutes