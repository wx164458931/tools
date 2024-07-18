import { createContext } from 'react';
import { ISearchPropsConfig, ISearchContext } from './types'

export const SEARCH_DEFAULT_PRPOPS:Required<ISearchPropsConfig> = {
  advancedSearchable:false,
  cacheSearch: false,
  maxFixItemCount: 3,
  filterSundryChildren: true,
  searchable: true,
  resetable: true,
  refreshable: true,
  expandable: true,
  initialValues: {}
}

/**
 * 作为组件类型判断的key
 */
export const ComponentTypeKey = Symbol('ComponentTypeKey');

export const SearchComponentType = Symbol('Search');

export const SearchItemComponentType = Symbol('SearchItem');

/**
 * antd 内需要对onChange事件做特殊处理的组件
 */
export const SpecialAntdComponents = ['Checkbox', 'Input', 'Radio', 'Transfer', 'Upload', 'RadioGroup'];

export const SearchContext = createContext<ISearchContext | null>(null);