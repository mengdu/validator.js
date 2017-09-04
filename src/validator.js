import {isArray} from './utils'
import Rule from './rules'

function Validator (data, constraints) {
  if (!this instanceof Validator){
    throw new Error('Validator is a constructor and should be called with the `new` keyword')
  }
  this.data = data
  this.constraints = constraints
  this.results = null
  this.count = 0
}

Validator.prototype.validate = function (isOne) {
  var result = {}
  for (let field in this.constraints) {
    let constraint = this.constraints[field]
    result[field] = {}
    var count = 0
    for (let type in constraint) {
      var rule = constraint[type]
      var bool = this.validRule(type, this.data[field], rule)
      count += ~~!bool
      result[field][type] = {val: rule.val, msg: rule.msg, result: bool}
    }
    // console.log(field, count, constraint.required)
    if (count > 0) {
      if (constraint.required && constraint.required.val) {
        this.count++
        if (isOne)
          break
      }
      if (this.data[field] !== undefined) {
        this.count++
        if (isOne)
          break
      }
    }
  }
  this.results = result
  // console.log('验证结果：', result)
  return result
}

Validator.prototype.validRule = function (type, val, rule) {
  var ruleFun = Rule[type]
  if (!ruleFun) {
    throw new Error('undefined rule type: `'+ type +'`')
  }
  return ruleFun.apply(this.constraints || null, [val, rule.val])
}

export default Validator
