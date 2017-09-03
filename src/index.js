
function isArray (val) {
  return Object.prototype.toString.call(val) === '[object Array]'
}

function formatCondition (cts) {
  var condition = {}
  for (var i in cts)
  for (var type in cts[i]) {
    var ct = cts[i]
    if (type !== 'msg') {
      condition[type] = {val: ct[type]}
      if (ct.msg) {
        condition[type].msg = ct.msg
      }
      break
    }
  }
  return condition
}

var valid = {
  validate: function (data, conditions) {
    var vdata = {}
    for (var key in conditions) {
      vdata[key] = {}
      if (isArray(conditions[key])) {
        vdata[key] = formatCondition(conditions[key])
      } else if (typeof conditions[key] === 'object') {
        vdata[key] = formatCondition([conditions[key]])
      }
    }
  },
  verify: function (val, condition) {

  }
}
console.log('xxxx')
export default valid

// if (typeof module !== 'undefined' && module.exports) {
//   console.log('xxx')
//   module.exports = valid
// } else {
//   window.validator = valid
// }
