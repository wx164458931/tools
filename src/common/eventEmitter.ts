/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/ban-types */
import { createSingleton } from './singleton'

/**
 * 这是一个自定义的事件管理器
 * 这个管理器的特点是采用链式调用
 */
export class EventEmitter {
  private handlers: { [key: string]: Function[] } = {};

  on(eventName: string, handler: Function) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
    return this;
  }
  
  off(eventName: string, handler?: Function) {
    if (!this.handlers[eventName]) {
      return;
    }
    if (handler) {
      this.handlers[eventName] = this.handlers[eventName].filter(h => h !== handler);
    } else {
      this.handlers[eventName] = [];
    }
    return this;
  }
  
  emit(eventName: string, ...args: unknown[]) {
    if (!this.handlers[eventName]) {
      return;
    }
    this.handlers[eventName].forEach(handler => {
      handler.apply(null, args);
    });
    return this;
  }
  
  once(eventName: string, handler: Function) {
    const onceHandler = (...args: unknown[]) => {
      handler.apply(null, args);
      this.off(eventName, onceHandler);
    };
    this.on(eventName, onceHandler);
    return this;
  }

  clear() {
    this.handlers = {};
    return this;
  }
}

/**
 * 这是一个自定义的事件管理器
 * 这个管理器的特点是on方法会返回一个方法，调用该方法即可取消事件监听
 */
export class EventEmitter2 {
  private handlers: { [key: string]: Function[] } = {};

  on(eventName: string, handler: Function) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(handler);
    return () => {
      this.off(eventName, handler)
    };
  }
  
  off(eventName: string, handler?: Function) {
    if (!this.handlers[eventName]) {
      return;
    }
    if (handler) {
      this.handlers[eventName] = this.handlers[eventName].filter(h => h !== handler);
    } else {
      this.handlers[eventName] = [];
    }
  }
  
  emit(eventName: string, ...args: unknown[]) {
    if (!this.handlers[eventName]) {
      return;
    }
    this.handlers[eventName].forEach(handler => {
      handler.apply(null, args);
    });
  }
  
  once(eventName: string, handler: Function) {
    const onceHandler = (...args: unknown[]) => {
      handler.apply(null, args);
      this.off(eventName, onceHandler);
    };
    this.on(eventName, onceHandler);
  }

  clear() {
    this.handlers = {};
  }
}

const EventEmitterSingleton = createSingleton(EventEmitter);

export default new EventEmitterSingleton();