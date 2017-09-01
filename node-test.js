var valid = require('./dist/validator.js')

console.log(valid)
var data = {
  name: 'validator',
  nickname: 'validator.js',
  password: '123456',
  confirm_password: '1234561',
  age: 90,
  token: null,
  birthday: '2017-08-02 12:00'
}

valid.validate(data, {
  name: {type: String, msg: 'xxx'},
  test: { required: true, msg: '必填' },
  nickname: [
    {required: true, msg: '必填'},
    {type: String, msg: '必须字符串'}
  ]
})

