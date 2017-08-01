## validator.js

JavaScript 数据验证工具，轻量级（100多行），可扩展。

## use

build:

```
npm install
webpack
```
## demo

```
var Validator = require('./validator.js')
// 待验证数据
var data = {
  name: 'validator',
  nickname: 'validator.js',
  password: '123456',
  confirm_password: '1234561'
}
// 创建验证器
var valid = new Validator()

// 验证数据
valid.validate(data, {
  name: {type: String, between: [6, 30]},
  nickname: {type: String, between: [2, 30]},
  password: {type: String, between: [6, 30]},
  confirm_password: {type: String, value: data.password}
}, {
  'name': '字段验证不通过',
  'name.type': '类型不正确',
  'name.between': '长度不匹配',
  'nickname': '昵称字段验证通不过',
  "confirm_password.value": '两次输入密码不一致'
}, true)

$errors = valid.errors()

console.log(valid.fails(), $errors, $errors.has('name'))

```

## API

Validator.addRule(ruleKey, rule) //增加一条验证规则，静态方法
