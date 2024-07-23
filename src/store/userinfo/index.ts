import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { IMenuItem, IUserInfo } from '../../api/common/types'
import { RootState } from '../index'
import { getUserInfo } from '../../api/common'
import EventEmitter from '../../common/eventEmitter'
import CustomizerEvent from '../../common/customizerEvent'

export enum LoginStatus {
  Loading,
  Login,
  Unlogin
}

export type StoreSiderItem = {
  icon?: string;
  label: string;
  key: string;
  title?: string;
  children?: StoreSiderItem[];
}

const initialState: IUserInfo & {
  loginStatus: LoginStatus
  siders: StoreSiderItem[]
} = {
  name: '',
  account: '',
  menus: [],
  siders: [],
  loginStatus: LoginStatus.Loading
}

const getSiders = (menus: IMenuItem[]) => {
  const _menus = menus.filter(el => el.visiable)

  const childrenMenusStack: ({
    menu: IMenuItem;
    sider: StoreSiderItem & {
      parentKey?: string;
    };
    parentPath: string
  } [])[] = [
    _menus.map(el => {
      return {
        menu: el,
        parentPath: `${el.path}`,
        sider: {
          icon: el.icon,
          label: el.name,
          parentKey: '',
          key: `${el.path}`,
        }
      }
    })
  ]

  let i = 0;

  while(i < childrenMenusStack.length) {
    const childrenMenus = childrenMenusStack[i];
    let nextChildrenMenusStack:{
      menu: IMenuItem;
      sider: StoreSiderItem & {
        parentKey?: string;
      };
      parentPath: string
    } [] = []

    childrenMenus.forEach(el => {
      const { menu, parentPath } = el;
      if(menu.children && menu.children.length) {
        nextChildrenMenusStack = [...nextChildrenMenusStack, ...menu.children.map(cl => {
          return {
            menu: cl,
            parentPath: `${parentPath}${cl.path}`,
            sider: {
              icon: cl.icon,
              label: cl.name,
              key: `${parentPath}${cl.path}`,
              parentKey: parentPath,
            }
          }
        })]
      }
    })

    if(nextChildrenMenusStack.length > 0) {
      childrenMenusStack.push(nextChildrenMenusStack);
    }

    i++;
  }

  i = childrenMenusStack.length - 1
  while(i > 0) {
    const stacks = childrenMenusStack[i];
    const preStacks = childrenMenusStack[i - 1];
    childrenMenusStack[i - 1] = preStacks.map(pl => {
      const childrne = stacks.filter(el => {
        const parentKey = el.sider.parentKey;
        return parentKey === pl.sider.key
      })

      if(childrne.length) {
        return {
          ...pl,
          sider: {
            ...pl.sider,
            children: [...(pl.sider.children || []), ...childrne.map(el => el.sider).map(el => {
              delete el.parentKey;
              return el;
            })]
          }
        }
      }
      else {
        return pl;
      }
    })

    i--;
  }

  return childrenMenusStack[0].map(el => el.sider).map(el => {
    delete el.parentKey;
    return el;
  })
}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.name = action.payload.name
      state.account = action.payload.account
      state.menus = action.payload.menus
    },
    setLoginStatus: (state, action) => {
      state.loginStatus = action.payload
    },
    logout: (state) => {
      state.name = '';
      state.account = '';
      state.menus = [];
      state.siders = [];
      state.loginStatus = LoginStatus.Unlogin;
    }
  },
  extraReducers(builder) {
    builder.addCase(login.fulfilled, (state, action) => {
      state.loginStatus = LoginStatus.Login;
      state.name = action.payload.name
      state.account = action.payload.account
      state.menus = action.payload.menus
      state.siders = getSiders(action.payload.menus)
    }).addCase(login.pending,(state) => {
      state.loginStatus = LoginStatus.Loading
    }).addCase(login.rejected,(state) => {
      state.loginStatus = LoginStatus.Unlogin
      EventEmitter.emit(CustomizerEvent.UNLOGIN)
    })
  },
})

export const login = createAsyncThunk('userInfo/login', async () => {
  // const res = await getUserInfoApi(params)
  /**
   * 登录逻辑
   * 1.每次进入页面，先调用获取用户信息接口
   */
  const res = await getUserInfo();
  if(res && res.success) {
    return res.data;
  }
  else {
    return {
      name: '',
      account: '',
      menus: []
    }
  }
})

export const { setUserInfo, setLoginStatus, logout } = userInfoSlice.actions
export const selectUserInfo = (state: RootState) => state.userInfo
export const selectMenus = (state: RootState) => state.userInfo.menus
export const selectSiders = (state: RootState) => state.userInfo.siders
export const selectUserStatus = (state: RootState) => state.userInfo.loginStatus
export default userInfoSlice.reducer