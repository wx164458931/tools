/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
const getUsefullValue = (str: any) => {
  if(str === null || str === undefined) return ''
  return str
}

const getUsefullLog = (title: string, content: string) => {
  let res = '';
  if(title) res += ` %c ${title}`;
  if(content) res += ` %c ${content}`;

  if(res) {
    res += ` %c`;
  }

  return res;
}

const getUserInfoStyle = (title: string, content: string, color: string) => {
  const res = [];

  if(title && content) {
    res.push(`background:${color};border:1px solid ${color}; padding: 1px; border-radius: 2px 0 0 2px; color: #fff;`)
    res.push(`border:1px solid ${color}; padding: 1px; border-radius: 0 2px 2px 0; color: ${color};`)
    res.push('background:transparent')
  }
  else if(title){
    res.push(`background:${color};border:1px solid ${color}; padding: 1px 6px 1px 1px; border-radius: 2px 2px 2px 2px; color: #fff;`)
    res.push('background:transparent')
  }
  else if(content) {
    res.push(`border:1px solid ${color}; padding: 1px; border-radius: 2px 2px 2px 2px; color: ${color};`)
    res.push('background:transparent')
  }

  return res;
}

const infoColor = '#67C23A';
const logColor = '#909399';
const warnColor = '#E6A23C';
const errorColor = '#F56C6C';
const debugColor = '#409EFF';

const _console = console;
const _info = console.info;
const _log = console.log;
const _warn = console.warn;
const _error = console.error;
const _debug = console.debug

const _infoToConsole = (text: string, title:string = 'info', color: string = infoColor, ...args: any[]) => {
  _info(
    getUsefullLog(title, text),
    ...getUserInfoStyle(title, text, color),
    ...args
  );
}

const _logToConsole = (text: string, title:string = 'log', color: string = logColor, ...args: any[]) => {
  _log(
    getUsefullLog(title, text),
    ...getUserInfoStyle(title, text, color),
    ...args
  );
}

const _warningToConsole = (text: string, title:string = 'warning', color: string = warnColor, ...args: any[]) => {
  _warn(
    getUsefullLog(title, text),
    ...getUserInfoStyle(title, text, color),
    ...args
  );
}

const _errorToConsole = (text: string, title: string = 'error', color: string = errorColor, ...args: any[]) => {
  _error(
    getUsefullLog(title, text),
    ...getUserInfoStyle(title, text, color),
    ...args
  );
}

const _debugToConsole = (text: string, title: string = 'error', color: string = debugColor, ...args: any[]) => {
  _debug(
    getUsefullLog(title, text),
    ...getUserInfoStyle(title, text, color),
    ...args
  );
}

const log = (content: string, ...args: any[]) => {
  _logToConsole(getUsefullValue(content), 'Log', logColor, ...args)
}

const info = (content: string, ...args: any[]) => {
  _infoToConsole(getUsefullValue(content), 'Info', infoColor, ...args)
}

const warn = (content: string, ...args: any[]) => {
  _warningToConsole(getUsefullValue(content), 'Warning', warnColor, ...args)
}

const error = (content: string, ...args: any[]) => {
  _errorToConsole(getUsefullValue(content), 'Error', errorColor, ...args)
}

const debug = (content: string, ...args: any[]) => {
  _debugToConsole(getUsefullValue(content), 'Debug', debugColor, ...args)
}

const logWithTitle = (title: string, content: string) => {
  _logToConsole(getUsefullValue(content), getUsefullValue(title), logColor)
}

const infoWithTitle = (title: string, content: string) => {
  _infoToConsole(getUsefullValue(content), getUsefullValue(title), infoColor)
}

const warnWithTitle = (title: string, content: string) => {
  _warningToConsole(getUsefullValue(content), getUsefullValue(title), warnColor)
}

const errorWithTitle = (title: string, content: string) => {
  _errorToConsole(getUsefullValue(content), getUsefullValue(title), errorColor)
}

const debugWithTitle = (title: string, content: string) => {
  _debugToConsole(getUsefullValue(content), getUsefullValue(title), debugColor)
}

const img = (url: string, scale: number = 1) => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
      const c = document.createElement('canvas');
      const ctx = c.getContext('2d');
      if (ctx) {
          c.width = img.width;
          c.height = img.height;
          ctx.fillStyle = 'red';
          ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0);
          const dataUri = c.toDataURL('image/png');

          _log(
              `%c sup?`,
              `font-size: 1px;
              padding: ${Math.floor((img.height * scale) / 2)}px ${Math.floor((img.width * scale) / 2)}px;
              background-image: url(${dataUri});
              background-repeat: no-repeat;
              background-size: ${img.width * scale}px ${img.height * scale}px;
              color: transparent;
              `
          );
      }
  };
  img.src = url;
}

export function registerPerttyLog(withTitle: boolean = false) {
  if(!withTitle) {
    globalThis.console = {
      ...globalThis.console,
      log,
      info,
      warn,
      error,
      debug,
      //@ts-ignore
      img,
      logWithTitle,
      infoWithTitle,
      warnWithTitle,
      errorWithTitle,
      debugWithTitle
    }
  }
  else {
    globalThis.console = {
      ...globalThis.console,
      log: logWithTitle,
      info: infoWithTitle,
      warn: warnWithTitle,
      error: errorWithTitle,
      debug: debugWithTitle,
      //@ts-ignore
      img,
      oLog: log,
      oInfo: info,
      oWarn: warn,
      oError: error,
      oDebug: debug,
    }
  }
}

export default {
  ..._console,
  log,
  info,
  warn,
  error,
  debug,
  img
}