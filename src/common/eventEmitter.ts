import { createSingleton } from './singleton'

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
  
  emit(eventName: string, ...args: any[]) {
    if (!this.handlers[eventName]) {
      return;
    }
    this.handlers[eventName].forEach(handler => {
      handler.apply(null, args);
    });
    return this;
  }
  
  once(eventName: string, handler: Function) {
    const onceHandler = (...args: any[]) => {
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

const EventEmitterSingleton = createSingleton(EventEmitter);

export default new EventEmitterSingleton();