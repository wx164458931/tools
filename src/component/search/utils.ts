import React from "react";
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { RadioChangeEvent } from 'antd';
import { ComponentTypeKey, SpecialAntdComponents } from './config';
import type { FunctionType } from './types'

/**
 * 传入一个组件，返回一个新的组件
 * 新的组件会增加一个ComponentTypeKey
 * 值为target指定的值
 * @param com 
 * @param target 
 * @returns 
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createTargetComponent = <T>(com: T, target: string | symbol):T => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  com[ComponentTypeKey] = target;
  return com
}

/**
 * 获取内部组件的类型
 * @param node React.ReactNode 
 * @returns 
 */
export const getComponentType = (node: React.ReactNode) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (node && node.type && node.type[ComponentTypeKey]) || '';
}

/**
 * 通过判断组件是不是目标每部组件
 * @param node 
 * @param targetType 
 * @returns 
 */
export const isTargetComponent = (node: React.ReactNode, targetType: string | symbol) => {
  return getComponentType(node) === targetType;
}

/**
 * 获取antd组件的类型
 * 实际获取的是displayName
 * @param node 
 * @returns 
 */
export const getAntdComponentType = (node: React.ReactNode) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (node && node.type && node.type.displayName) || (isAntdRadioGroup(node) && 'RadioGroup') || '';
}

/**
 * 判断当前组件是不是目标的antd组件
 * @param node 
 * @param targetType 
 * @returns 
 */
export const isTargetAntdComponent = (node: React.ReactNode, targetType: string) => {
  return getAntdComponentType(node) === targetType;
}

/**
 * 判断是不是需要特殊处理onChange事件的antd组件
 * @param node 
 * @returns 
 */
export const isSpecialAntdComponent = (node: React.ReactNode) => {
  return SpecialAntdComponents.includes(getAntdComponentType(node));
}

/**
 * 获组件props指定的属性
 * @param node 
 * @param propsKey 
 * @returns 
 */
export const getTargetProps = (node:React.ReactNode, propsKey: string) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (node && node.props && node.props[propsKey]) || '';
}

/**
 * 判断是不是一个方法
 * @param val 
 * @returns 
 */
export const isFunction = (val: unknown): val is FunctionType => {
  return !!val && typeof val === 'function';
}

/**
 * 创建一个合适的onChange事件回调
 * @param node 
 * @param cb 
 * @returns 
 */
export const createOnchangeCallBack = (node: React.ReactNode, cb: FunctionType) => {
  const originOnchange = getTargetProps(node, 'onChange');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let getValue = (val: any) => {
    return val;
  }

  if(isSpecialAntdComponent(node)) {
    const nodeType = getAntdComponentType(node);

    if(nodeType === 'Input') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getValue = (e: Event) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return e && e.target?.value;
      }
    }
    else if(nodeType === 'Checkbox') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getValue = (e: CheckboxChangeEvent) => {
        return e.target.checked;
      }
    }
    else if(nodeType === 'Radio' || nodeType === 'RadioGroup') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getValue = (e: RadioChangeEvent) => {
        return e.target.value
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (val: unknown, ...args: any[]) => {
    if(originOnchange) {
      originOnchange(val, ...args);
    }

    cb(getValue(val))
  }
}

export const isAntdRadioGroup = (node: React.ReactNode) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return (node && node.type && 'compare' in node.type) || false;
}

/**
 * 执行某个回调
 * @param cb 
 * @param args 
 * @returns 
 */
export const runCallback = (cb: FunctionType, ...args: Parameters<typeof cb>): (ReturnType<typeof cb>) | void => {
  if(isFunction(cb)) {
    return cb(...args)
  }
}