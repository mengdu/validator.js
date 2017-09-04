var valid = require('./dist/validator.js')

// console.log(valid)
var data = {
  name: 'validator',
  nickname: 'validator.js',
  password: '123456',
  confirm_password: '1234561',
  age: 90,
  token: null,
  birthday: '2017-08-02 12:00'
}


var valider = valid.validate(data, {
  name: {type: Number, between: [6, 8]},
  nickname: [
    {required: true, msg: '必填'},
    {type: String, msg: '必须字符串'}
  ]
})

console.log(valider.fails(), valider.all())
