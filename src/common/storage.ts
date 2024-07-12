/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 依赖MD5加密插件
 * pnpm add md5
 * yarn add md5
 * npm i md5
 */
import md5 from "md5";
import browserFingerprint from "./browserFingerprint";

/**
 * 字符串转base64
 * 利用自执行函数来实现判断前置
 * 所谓判断前置也就是只在代码第一次运行的时候进行条件判断
 * 后续执行改方法由第一次判断的结果决定，后续不再执行判断
 */
const stringToBase64 = (() => {
  /**
   * 浏览器环境利用window下的btoa方法转base64
   */
  if(Object.prototype.hasOwnProperty.call(globalThis, 'btoa')) {
    return (val: string) => {
      return btoa(val);
    }
  }
  /**
   * node环境利用Buffer类转base64
   */
  //@ts-expect-error
  else if(Buffer) {
    return (val: string) => {
      //@ts-ignore
      return new Buffer(val).toString('base64');
    }
  }
  else {
    /**
     * 其他环境暂时不转，也可增加专门转base64的js库来实现
     */
    return (val: string) => {
      return val;
    }
  }
})()

/**
 * base64转string
 * 和stringToBase64方法一一对应
 */
const base64ToString = (() => {
  if(Object.prototype.hasOwnProperty.call(globalThis, 'atob')) {
    return (val: string) => {
      return atob(val);
    }
  }
  //@ts-ignore
  else if(Buffer) {
    return (val: string) => {
      //@ts-ignore
      return new Buffer(val, 'base64').toString();
    }
  }
  else {
    return (val: string) => {
      return val;
    }
  }
})()

/**
 * 获取环境信息作为生成hash的一部分特征
 */
const hash_base = (() => {
  if(Object.prototype.hasOwnProperty.call(globalThis, 'navigator')) {
    return navigator.userAgent + browserFingerprint;
  }
  //@ts-ignore
  else if(process) {
    //@ts-ignore
    return `${process.version} ${process.platform} ${process.arch}`
  }
  else {
    return '';
  }
})()

/**
 * 存储的数据结构
 */
export type StoreValue = {
  /**
   * 存入数据或更新数据时的时间戳
   */
  date: number,
  /**
   * 当前数据使用MD5得到的hash值，使用默认加密方式时存在该属性
   */
  hash?: string
  /**
   * 最后需要存储的值
   */
  value: any
}
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
 * 存储配置
 */
export type StoreConfig = {
  /**
   * 可以接受一个数字，单位毫秒
   * 当传入0时表示关闭有效期校验
   * 也可接受一个回调，传入当前获取的数据，返回一个布尔值用于判断是否过期
   * 不设置表示不启用有效期,只要获取到的数据均表示有效
   * 获取超期数据会返回空字符串
   * 并将超期数据清理
   */
  expiration?: number | ((value: StoreValue) => boolean)
  /**
   * 加密
   * 可传入一个布尔值
   * 为true是表示启用加密
   * 也可传入一个回调，将需要存储的StoreValue对象传入，得到以后加密后的字符串
   * 因为纯前端加密作用不大。所以更多的是增加解密复杂度，以及增加一定的数据校验机制，一定程度避免数据被篡改。如果需要严格加密，这些数据就不应该在前端存储，或者校验需要后端校验
   */
  encrypt?: boolean | ((value: StoreValue) => string)
  /**
   * 解密
   * 当启用加密时需要，将加密后的结果解密
   * 
   * 当加密采用默认方法是，默认解密逻辑如下：
   * 将取出的值进行base64解码，然后转成JSON对象，该JSON对象是StoreValue类型
   * 然后按照加密逻辑获取hash值，和存储内容中的hash值做比较，如不匹配，则表明数据被篡改，不可信，此时返回空字符串
   * 反之表明数据可信，返回获取值的value
   */
  decrypt?: ((value: string) => StoreValue)
}

/**
 * 定义存储对象的接口，目前继承与localStorage和sessionStorage
 * 如果有其他的存储对象，例如indexDB等，实现该接口即可使用
 * 复制浏览器环境的Storage, 不直接extends Storege, 避免特殊环境不存在改类型定义
 * This Web Storage API interface provides access to a particular domain's session or local storage. It allows, for example, the addition, modification, or deletion of stored data items.
 *
 * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage)
 */
export interface IStorageStore {
  /**
   * Returns the number of key/value pairs.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/length)
   */
  readonly length: number;
  /**
   * Removes all key/value pairs, if there are any.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/clear)
   */
  clear(): void;
  /**
   * Returns the current value associated with the given key, or null if the given key does not exist.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/getItem)
   */
  getItem(key: string): string | null;
  /**
   * Returns the name of the nth key, or null if n is greater than or equal to the number of key/value pairs.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/key)
   */
  key(index: number): string | null;
  /**
   * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/removeItem)
   */
  removeItem(key: string): void;
  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   *
   * [MDN Reference](https://developer.mozilla.org/docs/Web/API/Storage/setItem)
   */
  setItem(key: string, value: string): void;
  [name: string]: any;
}

/**
 * 获取MD5加密hash
 * 利用MD5库实现
 * @param val 
 * @returns 
 */
const getHash = (val: StoreValue) => {
  const { value, date } = val;
  const valStr = JSON.stringify(value) + date + hash_base + '';
  return md5(valStr);
}

/**
 * 将base64字符串转换成StoreValue对象
 * 仅在使用默认加密方法的解析时需要
 * @param val 
 * @returns 
 */
const stringToStoreValue = (val: string) => {
  try {
    const str = base64ToString(val);
    return JSON.parse(str) as StoreValue
  }
  catch(err) {
    console.warn('数据解析失败', err);
    return {} as StoreValue;
  }
}

/**
 * 默认加密方法
 * 默认加密规则是将StoreValue的value转成JSON字符串
 * 后续加上StoreValue的date得到结果字符串，用MD5加密
 * 得到hash值存入到StoreValue的hash字段中
 * 最后将整个StoreValue转成JSON字符串，进行base64编码后存储
 * @param val 
 * @returns 
 */
const defaultEncrypt = (val: StoreValue) => {
  try {
    const { value, date } = val;
    const res = {
      date,
      value,
      hash: getHash(val)
    }

    return stringToBase64(JSON.stringify(res))
  }
  catch(err) {
    console.log('数据加密失败!', err);
    return '';
  }
}

/**
 * 采用默认加密后获取到的数据的默认校验逻辑
 * 将获取到的base64字符串转成StoreValue
 * 重新计算StoreValue对应的hash值
 * 对比解析出来的hash值和计算后的hash值，如果不匹配，表示数据被篡改
 * @param val 
 * @returns 
 */
const defaultValidate = (val: string) => {
  const value = stringToStoreValue(val);
  return value.hash && value.hash === getHash(value)
}

/**
 * 验证存储数据是否过期
 * @param val 
 * @param expiration 
 * @returns 
 */
const isExpirationUseful = (val: StoreValue, expiration: number) => {
  const { date } = val;
  const now = Date.now();

  return +date + expiration >= now;
}

/**
 * 默认配置
 */
const defaultConfig:StoreConfig = {
  /**
   * 默认值30天
   */
  expiration: 30 * 24 * 60 * 60 * 1000,
  /**
   * 默认开启加密，使用默认加密
   */
  encrypt: true
}

/**
 * 使用该方式创建一个存储对象
 * 使用这种方法的好处是解耦存储对象使用和实际存储对象，方便以后扩展切换
 * 例如传入localStorage，那么实际存储对象就是localStorage
 * 但是当需要切换成sessionStorage时，只需要传入sessionStorage即可
 * 举个例子说明采用这种封装方式的优势，假设业务代码可能已经大范围使用了localStorage,但是某个版本变动时需要把localStorage切换成indexDB
 * 如果不采取这样的方式封装，indexDB和localStorage使用方法差距巨大无比，然后由于业务代码中大范围使用，可能涉及大范围改动，并带来大量的回归测试工作量。
 * 但是采用这样的封装，由于使用的是创建的store，并不是直接的localStorage，并且封装内部也没有和localStorage强关联
 * 此时，只需要增加一个文件，文件内对indexDB进行封装，提供一个实现IStorageStore接口的store对象，
 * 然后修改调用此方法的地方，将store传入即可，所有的业务代码均不涉及修改
 * 可以实现底层存储资源变动对业务代码隔离
 * 后续测试也只需针对indexDB封装出来的store对象做测试即可，无需大范围回归测试
 * @param store 一个实现了IStorageStore接口的对象
 * @param config 创建store的配置
 * @returns 一个IStorage类型的对象
 */
export default function createStorage(store: IStorageStore, config?: StoreConfig): IStorage {
  const s = store || null;
  /**
   * 将传入配置和默认配置合并成新的配置
   */
  config = config || {};
  const selfConfig = {
    ...defaultConfig,
    ...config
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  const isFunction = (v: any): v is Function => {
    return !!v && typeof v === 'function';
  }

  const isStore = (s: IStorageStore | null): s is IStorageStore => {
    return !!(s && isFunction(s.clear) && isFunction(s.getItem) && isFunction(s.setItem) && isFunction(s.removeItem));
  }

  if(!isStore(s)) {
    throw new TypeError('Invalid store type');
  }

  return {
    get<R = any>(key: string): R | undefined {
      if(isStore(s)){
        /**
         * 从sorage中取出值
         */
        const val = s.getItem(key);
        let res: StoreValue | undefined = void 0;

        if(!val) {
          return void 0;// 值不存在，直接返回undefined
        }

        /**
         * 如果开启默认加密，必须使用默认解密方法解密
         */
        if(selfConfig.encrypt === true) {
          /**
           * 生成默认解密方法
           * @returns 
           */
          const decrypt = (val: string) => {
            /**
             * 进行校验
             * 校验通过返回值
             * 校验不通过清空值
             */
            if(defaultValidate(val)) {
              return stringToStoreValue(val);
            }
            else {
              console.warn('数据检验失败，数据被篡改!');
              s.removeItem(key);
              return void 0;
            }
          }

          try {
            res = decrypt(val as string);
          }
          catch(err) {
            console.warn('数据解密失败！', err);
            throw new Error('default decrypt fialed!')
          }
        }
        /**
         * 如果启用了加密，且是自定义的加密方法
         */
        else if(isFunction(selfConfig.encrypt)) {
          /**
           * 判断是否存在解密方法，存在解密方法,调用解密方法，获取值
           */
          if(isFunction(selfConfig.decrypt)) {
            try {
              res = selfConfig.decrypt(val as string)
            }
            catch(err) {
              console.warn('数据解密失败！', err);
              throw new Error('customized decrypt fialed!')
            }
          }
          /**
           * 不存在解密方法，直接返回值
           */
          else {
            res = JSON.parse(val || '');
          }
        }
        /**
         * 为开启加密，直接返回结果
         */
        else {
          res = JSON.parse(val || '');
        }

        /**
         * 如果已经获取到解密后的值，且开启了有效期校验，进行有效期校验
         */
        if(!!res && selfConfig.expiration) {
          let flag = true;
          /**
           * 如果有效期是一个回调
           */
          if(isFunction(selfConfig.expiration)) {
            /**
             * 调用回调，传入获取的值，得到是否过期的标志
             */
            try {
              flag = selfConfig.expiration(res);
            }
            catch(err) {
              console.warn('数据有效期校验失败!', err);
              throw new Error('customized expiration validate fialed!')
            }
          }
          else {
            /**
             * 设置的数字有效期，则判断数据是否过期
             */
            flag = isExpirationUseful(res, selfConfig.expiration)
          }

          /**
           * 数据无效的话
           * 清空数据
           * 返回undefined
           */
          if(!flag) {
            s.removeItem(key);
            return void 0;
          }
        }

        /**
         * 最后，如果存在值
         * 返回值的value
         */
        if(res) {
          return res.value as R
        }
        else {
          return void 0;
        }
      }

      return void 0;
    },
    set(key: string, value: any): void {
      if(isStore(s)) {
        /**
         * 构建storeValue
         */
        const v:StoreValue = {
          date: Date.now(),
          value
        }

        /**
         * 如果开启加密
         */
        if(selfConfig.encrypt) {
          /**
           * 归一化处理加密方法，传入配置是回调，加密方法即为传入方法
           * 传入是true
           * 加密方法为默认加密方法
           */
          let encryptFun: (v:StoreValue) => string;

          if(!isFunction(selfConfig.encrypt)) {
            encryptFun = defaultEncrypt;
          }
          else {
            encryptFun = selfConfig.encrypt
          }

          /**
           * 将加密后数据存入store
           */
          try {
            s.setItem(key, encryptFun(v))
          }
          catch(err) {
            console.warn('数据加密失败!', err);
            throw new Error('encrypt failed!')
          }
        }
        else {
          s.setItem(key, JSON.stringify(v))
        }
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
 * 使用示例
 * 定义一个js文件，文件内容如下：
 * import createStorage from './storage';
 * 
 * const localStore = createStorage(localStorage);
 * 
 * export default localStore;
 * 
 * 在某个文件中：
 * import localStore as store from './localStore'
 * 
 * store.set('userinfo', {
 *  username: 'test',
 *  token: 'hj1kfkenjnejnengje'
 * })
 * 
 * 在某个地方
 * import localStore as store from './localStore';
 * 
 * const userinfo = store.get('userinfo');
 * 
 * 后续可以优化createStorage方法，加入异步的get和set的异步方法，但是加入异步的话得考虑has、delete、clear等方法。得确保这些方法能够得到正确有效执行
 */