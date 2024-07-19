/* eslint-disable react-refresh/only-export-components */
import React, { forwardRef, HTMLAttributes, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Button } from 'antd';
import { ISearchProps, ISearchRef, SearchPropsSearchObjType } from '../types';
import { SEARCH_DEFAULT_PRPOPS, SearchComponentType, SearchItemComponentType, SearchContext } from '../config';
import { isTargetComponent, createTargetComponent, isFunction, getTargetProps } from '../utils';
import styles from './index.module.scss'

const Search = forwardRef<ISearchRef, HTMLAttributes<HTMLElement> & ISearchProps>((props, ref) => {
  const { 
    children, 
    advancedSearchable = SEARCH_DEFAULT_PRPOPS.advancedSearchable, 
    // cacheSearch = DEFAULT_PRPOPS.cacheSearch, 
    maxFixItemCount = SEARCH_DEFAULT_PRPOPS.maxFixItemCount,
    filterSundryChildren = SEARCH_DEFAULT_PRPOPS.filterSundryChildren,
    searchable = SEARCH_DEFAULT_PRPOPS.searchable,
    resetable = SEARCH_DEFAULT_PRPOPS.resetable,
    refreshable = SEARCH_DEFAULT_PRPOPS.refreshable,
    expandable = SEARCH_DEFAULT_PRPOPS.expandable,
    initialValues = { ...SEARCH_DEFAULT_PRPOPS.initialValues },
    onValueChange,
    search,
    onSearch,
    onReset,
    onRefresh,
    ...surplusProps 
  } = props;

  type SearchObj = SearchPropsSearchObjType<typeof search>;
  type SearchObjKeys = keyof SearchObj

  const [itemCount, setItemCount] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const searchValueRef = useRef<SearchObj>({ ...initialValues})
  const [searchValues, setSearchValues] = useState<SearchObj>({...initialValues})

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setFieldValue = <T extends SearchObjKeys>(name:T, value: SearchObj[T]) => {
    // 更新表单值并触发onValuesChange
    const newValues = {
      ...searchValues,
      [name]: value
    }

    setSearchValues(newValues)
    searchValueRef.current = newValues;
    if(isFunction(onValueChange)) {
      onValueChange({
        [name]: value
      }, {
        ...searchValueRef.current
      })
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const setFieldsValue = (val: SearchObj) => {
    // 更新表单值并触发onValuesChange
    const newValues = {
      ...searchValues,
      ...val
    }
    searchValueRef.current = {
      ...newValues
    }

    setSearchValues(newValues)

    if(isFunction(onValueChange)) {
      onValueChange({
        ...val
      }, {
        ...searchValueRef.current
      })
    }
  }

  const value = {
    searchValues,
    setFieldValue,
    setFieldsValue,
  };

  useImperativeHandle(ref, () => {
    return {

    }
  })

  useEffect(() => {
    const cArr = React.Children.toArray(children);
    setItemCount(cArr.filter(el => {
      return isTargetComponent(el, SearchItemComponentType as unknown as string) // el.type && el.type.displayName === SearchItemComponentType
    }).length)
  }, [children])

  useEffect(() => {
    if(search) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      search.setFieldValue = setFieldValue;
      search.setFieldsValue = setFieldsValue;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      search.getFieldValue = <T extends SearchObjKeys>(key: T) => {
        return searchValueRef.current[key];
      };
      search.getFieldsValue = () => {
        return searchValueRef.current;
      }
    }
  }, [search, setFieldValue, setFieldsValue, searchValueRef])
  
  const renderChildren = () => {
    let cArr = React.Children.toArray(children);

    /**
     * 如果开启过滤杂项
     * 过滤children，只保留SearchItem
     */
    if(filterSundryChildren) {
      cArr = cArr.filter(el => {
        return isTargetComponent(el, SearchItemComponentType);
      })
    }

    /**
     * 如果开启了展开收起或者高级搜索，当前搜索项数量超过了固定搜索项数量
     * 将把多余项过滤不显示
     */
    if(itemCount > maxFixItemCount && (expandable || advancedSearchable)) {
      /**
       * 先将标记了固定的项取出来
       * 最多只保留maxFixItemCount那么多项
       */
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      let items = cArr.filter(el => isTargetComponent(el, SearchItemComponentType) && getTargetProps(el, 'fixed') === true);

      if(items.length > maxFixItemCount) {
        items = items.slice(0, maxFixItemCount);
      }

      /**
       * 高级搜索优先级最高
       * 只要开启高级搜索
       * 永远只展示固定项
       * 如果没有开启高级搜索，则收起的时候只展示固定项
       */
      if(advancedSearchable || !expanded) {
        cArr = items;
      }
    }

    return cArr;
  }

  const searchClick = () => {
    if(isFunction(onSearch)) {
      if(search) {
        onSearch({
          ...searchValueRef.current
        } as SearchObj)
      }
    }
  }

  const resetClick = () => {
    if(isFunction(onReset)) {
      const res = onReset();

      if(res) {
        setSearchValues({
          ...res
        })

        searchValueRef.current = {
          ...res
        }
      }
    }
  }

  const refreshClick = () => {
    if(isFunction(onRefresh)) {
      onRefresh({
        ...searchValueRef.current
      } as SearchObj)
    }
  }

  return <SearchContext.Provider value={value}>
    <div {...surplusProps}>
      <div className={styles['search-container']}>
        <div className={styles['search-items-container']}>
          <div className={styles['search-items-main-container']}>
            {renderChildren()}
          </div>
          <div className={styles['search-items-btns-container']}>
            {
              !advancedSearchable && expandable && itemCount > maxFixItemCount && <Button type="link" onClick={() => setExpanded(!expanded)}>{expanded ? '收起' : '展开'}</Button>
            }
            {
              resetable && <Button onClick={resetClick}>重置</Button>
            }
            {
              searchable && <Button type="primary" onClick={searchClick}>搜索</Button>
            }
            {
              refreshable && <Button onClick={refreshClick}>刷新</Button>
            }
          </div>
        </div>
        <div className={styles['search-advanced-btns-container']}>
        </div>
      </div>
    </div>
  </SearchContext.Provider>
})

Search.displayName = 'Search';

export default createTargetComponent(Search, SearchComponentType);