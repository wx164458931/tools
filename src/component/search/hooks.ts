import { useContext, useRef } from 'react'
import { SearchContext } from './config';
import { ISearchInstance, SearchBaseObj } from './types'

export const useSearchContext = () => useContext(SearchContext);

export const useSearch = <T extends SearchBaseObj>() => {
  const ref = useRef<ISearchInstance<T>>({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setFieldValue: (_key, _value) => {
      // dosomething
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setFieldsValue: (_values) => {
      // dosomething
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getFieldValue: (_key) => {
      return void 0;
    },
    getFieldsValue: () => {
      return {}
    }
  })

  return ref.current
}