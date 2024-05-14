/**
 * Storage对象返回接口
 */
interface IStorage {
  get<R = any>(key: string): R | undefined,
  set(key: string, value: any): void
  has(key: string): boolean
  delete(key: string): void
  clear(): void
}

/**
 * 定义存储对象的接口，目前继承与localStorage和sessionStorage
 * 如果有其他的存储对象，例如indexDB等，实现该接口即可使用
 */
export interface IStorageStore extends Storage {}

type StoreType = 'local' | 'session'

/**
 * 使用该方式创建一个存储对象
 * 使用这种方法的好处是解耦存储对象使用和实际存储对象，方便以后扩展切换
 * 例如传入localStorage，那么实际存储对象就是localStorage
 * 但是当需要切换成sessionStorage时，只需要传入sessionStorage即可
 * 这样就不用修改代码，只需要修改配置即可
 * @param store 
 * @returns 
 */
export function createStorage(store: IStorageStore): IStorage {
  let s = store || null;

  const isFunction = (v: any): v is Function => {
    return v && typeof v === 'function';
  }

  const isStore = (s: IStorageStore | null): s is IStorageStore => {
    return !!(s && isFunction(s.clear) && isFunction(s.getItem) && isFunction(s.setItem) && isFunction(s.removeItem));
  }

  if(!isStore(s)) {
    throw TypeError('Invalid store type');
  }

  return {
    get<R = any>(key: string): R | undefined {
      if(isStore(s)){
        return JSON.parse(s.getItem(key) || '{}') as unknown as R;
      }

      return void 0;
    },
    set(key: string, value: any): void {
      if(isStore(s)){
        s.setItem(key, JSON.stringify(value))
      }
    },
    has(key: string): boolean {
      if(isStore(s)) {
        return s.getItem(key) ? true : false;
      }

      return false;
    },
    delete(key: string): void {
      if(isStore(s)) {
        s.removeItem(key);
      }
    },
    clear() {
      if(isStore(s)) {
        s.clear();
      }
    }
  }
}

/**
 * 用这个方法用于便捷的创建一个localStorage或者sessionStorage对象
 * @param type 
 * @returns 
 */
export function createStorageStore(type: StoreType): IStorage {
  switch(type) {
    case 'local':
      return createStorage(localStorage);
    case 'session':
      return createStorage(sessionStorage);
    default:
      const n: never = type;
      return n as IStorage;
  }
}