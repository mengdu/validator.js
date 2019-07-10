export function isArr (val: any) {
  return Array.isArray ? Array.isArray(val) : Object.prototype.toString.call(val) === '[object Array]'
}
