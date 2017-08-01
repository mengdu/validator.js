
function isArray (val) {
  return Object.prototype.toString.call(val) === '[object Array]'
}

/**
* 判断一值是否存在数组里
***/
const inArray = (val, arr) => {
  for (let k in arr) {
    if (arr[k] === val) return true
  }
  return false
}

export default {
  // 规则名 (待验证值, 规则值) {return Boolean}
  required (target, value) {
    if (value) {
      return !!target
    }
    return true
  },
  value (target, value) {
    return target === value
  },
  not (target, value) {
    return target !== value
  },
  type (target, val) {
    if (target === null || target === undefined) {
      return target === val
    }
    // String,Object,Array,Number,Boolean,Date,...包括自定义对象  (除null,undefined)
    return target.constructor === val
  },
  length (target, val) {
    return target.length === val
  },
  min (target, val) {
    if (typeof target === 'string' || isArray(target)) {
      return target.length > val
    }
    return target > val
  },
  max (target, val) {
    if (typeof target === 'string' || isArray(target)) {
      return target.length < val
    }
    return target < val
  },
  between (target, val) {
    if (typeof target === 'string' || isArray(target)) {
      return target.length >= val[0] && target.length <= val[1]
    }
    return target >= val[0] && target <= val[1]
  },
  in (targetVal, ruleVal) {
    if (isArray(ruleVal)) {
      return inArray(targetVal, ruleVal)
    }
    if (typeof ruleVal === 'object') {
      return targetVal in ruleVal
    }
    if (typeof ruleVal === 'string') {
      return ruleVal.indexOf(targetVal) > -1
    }
    return false
  }
}
