export const isArray = (val) => {
  return Object.prototype.toString.call(val) === '[object Array]'
}

/**
* 判断一值是否存在数组里
***/
export const inArray = (val, arr) => {
  for (let k in arr) {
    if (arr[k] === val) return true
  }
  return false
}
