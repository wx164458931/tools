/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 依赖MD5加密插件
 * pnpm add md5
 * yarn add md5
 * npm i md5
 */
import md5 from "md5"

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
 */
export interface IStorageStore extends Storage {}

/**
 * 获取MD5加密hash
 * 利用MD5库实现
 * @param val 
 * @returns 
 */
const getHash = (val: StoreValue) => {
  const { value, date } = val;
  const valStr = JSON.stringify(value) + date + '';
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
 * 使用该方式创建一个存储对象
 * 使用这种方法的好处是解耦存储对象使用和实际存储对象，方便以后扩展切换
 * 例如传入localStorage，那么实际存储对象就是localStorage
 * 但是当需要切换成sessionStorage时，只需要传入sessionStorage即可
 * 这样就不用修改代码，只需要修改配置即可
 * @param store 
 * @returns 
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
        let res: StoreValue | null = null;

        if(!val) {
          return void 0;
        }

        /**
         * 如果开始默认加密
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
              s.removeItem(key);
              return null;
            }
          }

          res = decrypt(val as string);
        }
        /**
         * 如果启用了加密，且是自定义的加密方法
         */
        else if(selfConfig.encrypt && typeof selfConfig.encrypt === 'function') {
          /**
           * 判断是否存在解密方法，存在解密方法,调用解密方法，获取值
           */
          if(selfConfig.decrypt && typeof selfConfig.decrypt === 'function') {
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
          if(typeof selfConfig.expiration === 'function') {
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
           * 情况数据
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

          if(typeof selfConfig.encrypt !== 'function') {
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
 * 后续可以优化createStorage方法，加入一步的get和set的异步方法，但是加入异步的话得考虑has、delete、clear等方法。得确保这些方法能够得到有效执行
 */