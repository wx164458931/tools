import request from '../../common/axiosRequest'
import { IMenuItem, IUserInfo } from './types'

const allFolder = import.meta.glob(['/src/*/**', '!/src/pages/**'])

// 获取用户信息
export function getUserInfo() {
  return new Promise<IUserInfo>((resolve, reject) => {
    setTimeout(() => {
      const moluleMenu = Object.entries(allFolder).reduce((res, [path, val]) => {
        const pathArr = path.split('/').filter(Boolean).filter(el => el !== 'src');
        const curPath = pathArr[0];

        if(res.find(el => el.id === curPath)) return res;

        res.push({
          id: curPath,
          name: curPath,
          path: `/${curPath}`,
          component: `/${curPath}Page`,
          // fullPath: `/module/`,
          visiable: true
        })

        return res;
      }, [] as IMenuItem [])

      const res:IUserInfo = {
          name: 'Admin',
          account: 'admin',
          menus: [
            {
              id: '1',
              name: '首页',
              path: '/home',
              // component: '/home',
              visiable: true,
              icon: '',
              children: [
                {
                  id: '3',
                  name: '一级菜单',
                  path: '/first',
                  visiable: true,
                  children: [
                    {
                      id: '4',
                      name: '二级菜单',
                      path: '/second',
                      visiable: true,
                      component: '/home'
                    }
                  ]
                }
              ]
            },
            {
              id: '2',
              name: '模块说明',
              path: '/module',
              visiable: true,
              children: [
                ...moluleMenu
              ]
            }
          ]
      }
      resolve({
        ...res
      })
      // reject(false)
    })
  })
}