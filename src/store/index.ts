import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import userInfo, { setUserInfo, setLoginStatus, LoginStatus, logout } from './userinfo'
import EventEmitter from '../common/eventEmitter'
import CustomizerEvent from '../common/customizerEvent'

const store = configureStore({
  reducer: {
    userInfo
  }
})

// 从 store 本身推断出 `RootState` 和 `AppDispatch` 类型
export type RootState = ReturnType<typeof store.getState>
// 推断出类型: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// 在整个应用程序中使用，而不是简单的 `useDispatch` 和 `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

const clearUserInfo = () => {
  setTimeout(() => {
    store.dispatch(logout({}))
  });
}

EventEmitter.on(CustomizerEvent.UNLOGIN, clearUserInfo)

window.addEventListener('beforeunload', () => {
  EventEmitter.off(CustomizerEvent.UNLOGIN, clearUserInfo)
})

export default store