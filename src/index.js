import rules from './rules'


function Validator() {
  if (!this instanceof Validator){
    throw new Error('Validator is a constructor and should be called with the `new` keyword')
  }
  this.msg = {}
  this.count = 0
  this.attr = {}
}

Validator.addRule = function (type, rule) {
  if (typeof type !== 'string')  throw new Error('rule key must be string')
  if (typeof rule !== 'function')  throw new Error('rule must be function')
  rules[type] = rule
}

Validator.prototype.validateValue = function (value, ruleType, ruleVal) {
  if (!rules[ruleType]) {
    throw new Error(`Validation rule type:$ruleType is not supported`)
  }
  return rules[ruleType].call(null, value, ruleVal)
}

Validator.prototype.validateRules = function (key, value, rule, msgs) {
  for (var ruleType in rule) {
    var result = this.validateValue(value, ruleType, rule[ruleType])
    this.attr[key] = result
    // 如果验证失败
    if (!result) {
      this.count++
      // msgs[key] && msgs[]
      if (msgs[key]) {
        if (!this.msg[key]) {
          this.msg[key] = [msgs[key]]
        }
      }
      var msgKey = key + '.' + ruleType
      if (msgs[msgKey]) {
        if (!this.msg[key]) {
          this.msg[key] = [msgs[msgKey]]
        } else {
          // console.log(msgs[msgKey])
          this.msg[key].push(msgs[msgKey])
        }
      }
    }
  }
}

Validator.prototype.validate = function (obj, rules, msgs, isAll) {
  for (var ruleKey in rules) {
    var rule = rules[ruleKey]
    this.validateRules(ruleKey, obj[ruleKey], rule, msgs)
    // 如果isAll==false只要有字段验证不通则返回
    if (!isAll && this.count > 0) {
      break
    }
  }
  return this
}

Validator.prototype.fails = function () {
  return !!this.count
}


Validator.prototype.errors = function () {
  // return this.msg
  return new Message(this.msg)
}

function Message (msgs) {
  this.msg = msgs
}

Message.prototype.has = function (key) {
  return this.msg[key] ? true : false
}

Message.prototype.add = function (key, msg) {
  this.msg[key] ? this.msg[key].push(msg) : this.msg[key] = [msg]
}

Message.prototype.first = function () {
  for (var key in this.msg) {
    return this.msg[key][0]
    break
  }
  return ''
}
// if (window) window.Validator = Validator
export default Validator
