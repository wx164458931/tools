/* eslint-disable react-refresh/only-export-components */
import React, { Children, cloneElement, forwardRef, HTMLAttributes, useImperativeHandle } from "react";
import { ISearchItemPorps, ISearchItemRef } from '../types';
import { SearchItemComponentType } from '../config';
import { createTargetComponent, createOnchangeCallBack } from '../utils';
import { useSearchContext } from '../hooks'
import styles from './index.module.scss';

const SearchItem = forwardRef<ISearchItemRef, HTMLAttributes<HTMLElement> & ISearchItemPorps>((props, ref) => {
  const { children, label, name } = props;
  const context = useSearchContext();

  useImperativeHandle(ref, () => {
    return {

    }
  })

  const initChild = (node: React.ReactNode) => {
    if(name) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return cloneElement(node, {
        value: context?.searchValues[name],
        onChange: createOnchangeCallBack(node, (val:unknown) => {
          context?.setFieldValue(name, val)
        })
      });
    }
    else {
      return node;
    }
  }

  const renderChildren = () => {
    return Children.map(children, (child, idx) => {
      if(idx === 0) {
        return initChild(child);
      }
      else {
        return child;
      }
    })
  }

  return <div className={styles['search-item-container']}>
    {label && <div className={styles['search-item-label']}>{label}</div>}
    <div className={styles['search-content-wrapper']}>
      {renderChildren()}
    </div>
  </div>
})

SearchItem.displayName = 'SearchItem';

export default createTargetComponent(SearchItem, SearchItemComponentType);