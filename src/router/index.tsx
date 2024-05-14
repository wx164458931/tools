import { createBrowserRouter, RouteObject } from 'react-router-dom'
// import { Children, lazy } from 'react'
// import { getRouteUsefullPath, findRouteByPath } from './util.ts'
import Layout from '../layout'

// const dynamicRoute:RouteObject =  {
//   path: '/',
//   element: <Layout/>,
//   children: []
// };

// let routeConfigs = import.meta.glob('../pages/**/route_config.ts', {
//   eager: true,
//   import: 'default'
// })

// const dynamicRoute = Object.entries(routeConfigs).reduce((res, [path, cmp]) => {
//   const { routeInfo, componentPath } = getRouteUsefullPath(path);
//   const { level, parentPath, path: routePath } = routeInfo
//   const Component = lazy(() => import(componentPath));

//   if(level === 1) {
//     res.push({
//       path: routePath,
//       element: <Component/>,
//     })
//   }
//   else if(parentPath) {
//     const parent = findRouteByPath(parentPath, res);

//     if(parent) {
//       if(parent.children && parent.children.length) {
//         parent.children.push({
//           path: routePath,
//           element: <Component/>,
//         })
//       }
//       else{
//         parent.children = [{
//           path: routePath,
//           element: <Component/>,
//         }]
//       }
//     }
//   }
//   return res;
// }, [] as RouteObject[])

// console.log('dynamicRoute', dynamicRoute);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout/>,
  },
])

export default router