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

export function isEmptyObject (val: object) {
  for (const key in val) {
    return false
  }

  return true
}

// '', null, undefined, [], {}, NaN
export function isEmpty (val: any) {
  if (isArr(val)) return val.length === 0
  if (isNull(val)) return true
  if (isObj(val)) return isEmptyObject(val)
  if (isUndefined(val)) return true
  if (isNaN(val)) return true
  if (val === '') return true

  return false
}
