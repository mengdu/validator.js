export function isArr (val: any) {
  return Array.isArray ? Array.isArray(val) : Object.prototype.toString.call(val) === '[object Array]'
}

export function isFun (val: any) {
  return typeof val === 'function'
}

export function isAsyncFun (val: any) {
  return Object.prototype.toString.call(val) === '[object AsyncFunction]'
}
