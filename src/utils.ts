export function isArr (val: any) {
  return Array.isArray ? Array.isArray(val) : Object.prototype.toString.call(val) === '[object Array]'
}

export function isObj (val: any) {
  return typeof val === 'object'
}

export function isFun (val: any) {
  return typeof val === 'function'
}

export function isAsyncFun (val: any) {
  return Object.prototype.toString.call(val) === '[object AsyncFunction]'
}

export function isUndefined (val: any) {
  return typeof val === 'undefined'
}

export function isNull (val: any) {
  return Object.prototype.toString.call(val) === '[object Null]'
}

export function isSymbol (val: any) {
  return Object.prototype.toString.call(val) === '[object Symbol]'
}

export function isRegExp (val: any) {
  return Object.prototype.toString.call(val) === '[object RegExp]'
}
