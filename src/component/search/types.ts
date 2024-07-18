import { ReactNode } from "react"

export type SearchBaseObj = {
  [key: string]: unknown
}

export interface ISearchRef {

}

export interface ISearchItemRef {

}

export interface IAdvancedSearchModalRef {

}

export interface ISearchInstance<T = SearchBaseObj> {
  setFieldValue: <P extends keyof T>(key: P, value: T[P]) => void,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setFieldsValue: (values: Partial<T>) => void,
  getFieldValue: <P extends keyof T>(key: P) => (T[P] | undefined)
  getFieldsValue: () => Partial<T>
}

export interface ISearchPropsConfig {
  /**
   * 是否开启高级搜索
   * @default false
   */
  advancedSearchable?: boolean
  /**
   * 是否允许缓存搜索方案
   * @default false
   */
  cacheSearch?: boolean
  /**
   * 最大固定显示的item数量
   * @default 3
   */
  maxFixItemCount?: number,
  /**
   * 是否过滤杂项children
   * @default true
   */
  filterSundryChildren?: boolean
  /**
   * 是否可以搜索
   * @default true
   */
  searchable?: boolean
  /**
   * 是否可以重置
   * @default true
   */
  resetable?: boolean
  /**
   * 是否可以刷新
   * @default true
   */
  refreshable?: boolean
  /**
   * 当Item数量超过fixItemCount是否可以展开收起
   * @default true
   */
  expandable?: boolean,
  /**
   * 初始化数据
   */
  initialValues?: SearchBaseObj
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SearchPropsSearchObjType<T> = T extends ISearchInstance<any> ? ReturnType<T['getFieldsValue']> : SearchBaseObj

/**
 * 搜索栏props
 */
export interface ISearchProps extends ISearchPropsConfig {
  
  /**
   * 值变更回调
   * @param changeKey 
   * @param changeValue 
   * @param values 
   * @returns 
   */
  onValueChange?: <T extends SearchPropsSearchObjType<ISearchProps['search']>>(changeValues: T, values: T) => void
  /**
   * 搜索回调
   * @param values 
   * @returns 
   */
  onSearch?: <T extends (ISearchInstance | undefined)>(values: SearchPropsSearchObjType<T>) => void
  /**
   * 重置回调
   * @returns 
   */
  onReset?: <T extends SearchPropsSearchObjType<ISearchProps['search']>>() => (T | void)
  /**
   * 刷新回调
   * @param values 
   * @returns 
   */
  onRefresh?: <T extends SearchPropsSearchObjType<ISearchProps['search']>>(values: T) => void
  /**
   * 搜索栏组件实例，类似antd的form，用于调用操作对应方法
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  search?: ISearchInstance<any>
}

export interface ISearchItemPorps {
  /**
   * 搜索项标题
   */
  label?: string | ReactNode
  /**
   * 是否固定
   * 针对启用展开收起或者高级搜索时，一直固定展示的搜索项
   * @default false
   */
  fixed?: boolean,
  /**
   * name参照AntDesign的FormItem组件，name是最后搜索对象的key值,但是目前只支持字符串，不支持数组多层级
   */
  name?: string
}

export interface IAdvancedSearchModalProps {

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionType = (...args: any) => any

export interface ISearchContext {
  searchValues: Record<string, unknown>
  setFieldValue: (key: string, value: unknown) => void
  setFieldsValue: (values: Record<string, unknown>) => void
}