import {isArray} from './utils'
import Validator from './validator'
import Analyzer from './analyzer'
import Rules from './rules'
function formatConstraint (constraints) {
  var constraint = {}
  for (var i in constraints)
  for (var type in constraints[i]) {
    var cr = constraints[i]
    if (type !== 'msg') {
      constraint[type] = {val: cr[type], msg: cr.msg}
    }
  }
  return constraint
}

var valid = {
  Validator,
  Rule: Rules,
  validate: function (data, constraints, isOne) {
    var vdata = {}
    for (var key in constraints) {
      vdata[key] = {}
      if (isArray(constraints[key])) {
        vdata[key] = formatConstraint(constraints[key])
      } else if (typeof constraints[key] === 'object') {
        vdata[key] = formatConstraint([constraints[key]])
      }
    }
    // console.log('格式化后：', vdata)
    let valider = new Validator(data, vdata)
    valider.validate(isOne)
    return new Analyzer(valider)
  },
  pushRule: function (type, fun) {
    if (Rules.hasOwnProperty(type)) {
      console.warn('The rule type `' + type + '` is exist')
      return false
    }
    if (typeof fun !== 'function') {
      console.warn('The rule fun must be a function')
      return false
    }
    Rules[type] = fun
    console.log(Rules)
    return true
  }
}
export default valid
