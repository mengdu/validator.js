import {isArray, inArray} from './utils'

export default {
  // 规则名 (待验证值, 规则值) {return Boolean}
  required (target, val) {
    if (val) {
      return target !== undefined
    }
    return true
  },
  eq (target, value) {
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
    return !!(target && target.length && (target.length === val))
  },
  min (target, val) {
    if (typeof target === 'string' || isArray(target)) {
      return target.length >= val
    }
    return target >= val
  },
  max (target, val) {
    if (typeof target === 'string' || isArray(target)) {
      return target.length <= val
    }
    return target <= val
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
  },
  match (val, regexp) {
    if (typeof val !== 'string') return false
    var reg = new RegExp(regexp)
    return reg.test(val)
  }
}
