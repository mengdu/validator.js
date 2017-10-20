import {isArray, inArray} from './utils'

export default {
  // 规则名 (待验证值, 规则值) {return Boolean}
  required (val, rval) {
    if (rval) {
      return val !== undefined
    }
    return true
  },
  eq (val, rval) {
    return val === rval
  },
  not (val, rval) {
    return val !== rval
  },
  type (val, rval) {
    if (val === null || val === undefined) {
      return val === rval
    }
    // String,Object,Array,Number,Boolean,Date,...包括自定义对象  (除null,undefined)
    return val.constructor === rval
  },
  length (val, rval) {
    if (!isArray(rval)) {
      return !!(val && val.length && (val.length === rval))
    }
    if (typeof val === 'string' || isArray(val)) {
      return val.length >= rval[0] && val.length <= rval[1]
    }
  },
  min (val, rval) {
    return val >= rval
  },
  max (val, rval) {
    return val <= rval
  },
  gt (val, rval) {
    return val > rval
  },
  gte (val, rval) {
    return val >= rval
  },
  lt (val, rval) {
    return val < rval
  },
  lte (val, rval) {
    return val <= rval
  },
  between (val, rval) {
    return rval[0] <= val && val <= rval[1]
  },
  notBetween (val, rval) {
    return val < rval[0] || val > rval[1]
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
  notIn (val, rval) {
    if (isArray(rval)) {
      return !inArray(val, rval)
    }
    if (typeof rval === 'object') {
      return !(val in rval)
    }
    if (typeof rval === 'string') {
      return (rval.indexOf(val) === -1)
    }
    return false
  },
  match (val, regexp) {
    if (typeof val !== 'string') return false
    var reg = new RegExp(regexp)
    return reg.test(val)
  },
  notMatch (val, regexp) {
    if (typeof val !== 'string') return false
    var reg = new RegExp(regexp)
    return !reg.test(val)
  },
  like (val, rval) {
    // like 
    //   %abc     /abc$/
    //   abc%     /^abc/
    //   a%bc     /^a.*bc$/
    //   %a%bc    /a.*cb$/
    //   a%bc%    /^a.*bc/
    //   %a%bc%   /a.*bc/
    if (typeof rval !== 'string') return false
    if (rval[0] !== '%') {
      rval = '^' + rval
    }
    if (rval[rval.length - 1] !== '%') {
      rval = rval + '$'
    }
    var regexp = new RegExp(rval.replace(/%/g, '.*'))
    return regexp.test(val)
  },
  notLike (val, rval) {
    if (typeof rval !== 'string') return false
    if (rval[0] !== '%') {
      rval = '^' + rval
    }
    if (rval[rval.length - 1] !== '%') {
      rval = rval + '$'
    }
    var regexp = new RegExp(rval.replace(/%/g, '.*'))
    return !regexp.test(val)
  },
  email (val, rval) {
    var regexp = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
    if (rval) {
      return regexp.test(val)
    }
    return true
  },
  upperCase (val, rval) {
    if (rval) {
      return val === val.toUpperCase()
    }
    return true
  },
  lowerCase (val, rval) {
    if (rval) {
      return val === val.toLowerCase()
    }
    return true
  },
  run (val, rval) {
    if (typeof rval === 'function') {
      return rval(val)
    }
    return true
  }
}
