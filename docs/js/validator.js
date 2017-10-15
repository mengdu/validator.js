(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.validator = factory());
}(this, (function () { 'use strict';

var isArray = function isArray(val) {
  return Object.prototype.toString.call(val) === '[object Array]';
};

/**
* 判断一值是否存在数组里
***/
var inArray = function inArray(val, arr) {
  for (var k in arr) {
    if (arr[k] === val) return true;
  }
  return false;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

var Rule = {
  // 规则名 (待验证值, 规则值) {return Boolean}
  required: function required(target, val) {
    if (val) {
      return target !== undefined;
    }
    return true;
  },
  eq: function eq(target, value) {
    return target === value;
  },
  not: function not(target, value) {
    return target !== value;
  },
  type: function type(target, val) {
    if (target === null || target === undefined) {
      return target === val;
    }
    // String,Object,Array,Number,Boolean,Date,...包括自定义对象  (除null,undefined)
    return target.constructor === val;
  },
  length: function length(target, val) {
    if (!isArray(val)) {
      return !!(target && target.length && target.length === val);
    }
    if (typeof target === 'string' || isArray(target)) {
      return target.length >= val[0] && target.length <= val[1];
    }
  },
  min: function min(target, val) {
    return target >= val;
  },
  max: function max(target, val) {
    return target <= val;
  },
  between: function between(target, val) {
    return target >= val[0] && target <= val[1];
  },
  in: function _in(targetVal, ruleVal) {
    if (isArray(ruleVal)) {
      return inArray(targetVal, ruleVal);
    }
    if ((typeof ruleVal === 'undefined' ? 'undefined' : _typeof(ruleVal)) === 'object') {
      return targetVal in ruleVal;
    }
    if (typeof ruleVal === 'string') {
      return ruleVal.indexOf(targetVal) > -1;
    }
    return false;
  },
  match: function match(val, regexp) {
    if (typeof val !== 'string') return false;
    var reg = new RegExp(regexp);
    return reg.test(val);
  }
};

function Validator(data, constraints) {
  if (!this instanceof Validator) {
    throw new Error('Validator is a constructor and should be called with the `new` keyword');
  }
  this.data = data;
  this.constraints = constraints;
  this.results = null;
  this.count = 0;
}

Validator.prototype.validate = function (isOne) {
  var result = {};
  for (var field in this.constraints) {
    var constraint = this.constraints[field];
    result[field] = {};
    var count = 0;
    for (var type in constraint) {
      var rule = constraint[type];
      var bool = this.validRule(type, this.data[field], rule);
      count += ~~!bool;
      result[field][type] = { val: rule.val, msg: rule.msg, result: bool };
    }
    // console.log(field, count, constraint.required)
    if (count > 0) {
      if (constraint.required && constraint.required.val) {
        this.count++;
        if (isOne) break;
      }
      if (this.data[field] !== undefined) {
        this.count++;
        if (isOne) break;
      }
    }
  }
  this.results = result;
  // console.log('验证结果：', result)
  return result;
};

Validator.prototype.validRule = function (type, val, rule) {
  var ruleFun = Rule[type];
  if (!ruleFun) {
    throw new Error('undefined rule type: `' + type + '`');
  }
  return ruleFun.apply(this.constraints || null, [val, rule.val]);
};

// 验证分析
function Analyzer(validator) {

  // console.log(validator)
  this.valider = function () {
    return validator;
  };
  this.errors = null;
  this.msgs = [];
  // 代理
  // return new Proxy(validator.results, {
  //   get (target, key) {
  //     // 优先访问results
  //     if (target[key]) {
  //       return target[key]
  //     } else {
  //       return that[key]
  //     }
  //   }
  // })
}
Analyzer.prototype.parseMsg = function (msg) {
  return msg;
};
Analyzer.prototype.fails = function () {
  return this.valider().count > 0;
};
Analyzer.prototype.all = function (isArr) {
  if (!this.errors) {
    this.errors = {};
    for (var field in this.valider().results) {
      this.errors[field] = this.get(field);
    }
  }
  if (isArr) {
    var err = [];
    for (var _field in this.errors) {
      if (this.errors[_field].length > 0) {
        for (var i in this.errors[_field]) {
          err.push(this.errors[_field][i]);
        }
      }
    }
    return err;
  } else {
    return this.errors;
  }
};

Analyzer.prototype.get = function (field, isOrign) {
  var result = this.valider().results[field];
  if (!result) {
    console.warn('The field does not exist in constraints');
    return [];
  }
  if (isOrign) {
    return result;
  }
  // 当需要验证数据不存在此字段并且不必须的字段时，返回[]
  if (this.valider().data[field] === undefined) {
    // 不提供required验证情况
    if (!result.hasOwnProperty('required')) {
      return [];
    }
    // 存在required验证情况
    if (result.hasOwnProperty('required') && result.required.result) {
      return [];
    }
  }
  var msg = [];
  for (var type in result) {
    if (!result[type].result) {
      msg.push(this.parseMsg(result[type].msg));
    }
  }
  return msg;
};
Analyzer.prototype.has = function (field) {
  return this.get(field).length > 0;
};
Analyzer.prototype.first = function (field) {
  if (field) {
    return this.get(field)[0];
  }
  if (!this.errors) {
    this.all();
  }
  for (var _field2 in this.errors) {
    if (this.errors[_field2].length > 0) {
      return this.errors[_field2][0];
    }
  }
};
Analyzer.prototype.last = function (field) {
  var msgs = this.get(field);
  return msgs[msgs.length - 1];
};

function formatConstraint(constraints) {
  var constraint = {};
  for (var i in constraints) {
    for (var type in constraints[i]) {
      var cr = constraints[i];
      if (type !== 'msg') {
        constraint[type] = { val: cr[type], msg: cr.msg };
      }
    }
  }return constraint;
}

var valid = {
  Validator: Validator,
  Rule: Rule,
  validate: function validate(data, constraints, isOne) {
    var vdata = {};
    for (var key in constraints) {
      vdata[key] = {};
      if (isArray(constraints[key])) {
        vdata[key] = formatConstraint(constraints[key]);
      } else if (_typeof(constraints[key]) === 'object') {
        vdata[key] = formatConstraint([constraints[key]]);
      }
    }
    // console.log('格式化后：', vdata)
    var valider = new Validator(data, vdata);
    valider.validate(isOne);
    return new Analyzer(valider);
  },
  pushRule: function pushRule(type, fun) {
    if (Rule.hasOwnProperty(type)) {
      console.warn('The rule type `' + type + '` is exist');
      return false;
    }
    if (typeof fun !== 'function') {
      console.warn('The rule fun must be a function');
      return false;
    }
    Rule[type] = fun;
    console.log(Rule);
    return true;
  }
};

return valid;

})));
