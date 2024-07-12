import md5 from "md5";

export function getCanvasFingerprint() {
  if(!Object.prototype.hasOwnProperty.call(globalThis, 'document') || !document.createElement || typeof document.createElement !== 'function') {
    return '';
  }

  const canvas = document.createElement('canvas') || {};

  canvas.width = 256;
  canvas.height = 256;

  const ctx = canvas?.getContext('2d');

  if(canvas && ctx) {
    ctx.fillStyle = 'rgb(255, 0, 0)';
    ctx.fillRect(0, 0, 100, 100);

    ctx.fillStyle = 'rgb(0, 255, 0)';
    ctx.fillRect(0, 100, 100, 100);

    ctx.fillStyle = 'rgb(0, 0, 255)';
    ctx.fillRect(100, 100, 100, 100);

    ctx.font = '16px Arial';
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillText('canvas fingerprint', 0, 100);

    const dataURL = canvas.toDataURL();

    return simpleStringHash(dataURL)
  }

  return '';
}

function simpleStringHash(str: string) {
  /**
   * 如果不适用MD5方式获取hash
   * 可以使用以下简单的方式
   */
  // let hash = 0;  
  // for (let i = 0; i < str.length; i++) {  
  //     // 假设charCodeAt()返回的是0-255之间的值  
  //     // 使用位运算左移和异或操作来混合哈希值  
  //     // 这样可以保证每个字符都对最终的哈希值有所贡献  
  //     hash = (hash << 5) - hash + str.charCodeAt(i);  
  //     hash = hash & hash; // 确保hash值是一个32位整数  
  // }  
  // return hash + '';  

  return md5(str);
}

export default getCanvasFingerprint();