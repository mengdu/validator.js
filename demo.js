var valid = require('./dist/validator.js')

// console.log(valid)
var data = {
  name: 'validator',
  nickname: 'validator.js',
  password: '123456',
  email: '123456@qq.com'
}


var valider = valid.validate(data, {
  name: [
    {required: true, not: '', msg: 'name不能为空'},
    {length: [3, 10], msg: '长度3~10'}
  ],
  nickname: [
    {not: '', msg: '不能为空'},
    {type: String, msg: '必须字符串'}
  ],
  password: {length: [6, 32], msg: '6~32字符'},
  email: {email: true, msg: '邮箱格式不对'}
})

console.log(valider.fails(), valider.all())
