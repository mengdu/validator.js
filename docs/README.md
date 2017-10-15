## validator.js

一个简单的数据验证对象，适用于浏览器与node环境。

[文档](https://mengdu.github.io/validator.js/docs)

## use

run:

```bat
npm install

// build
npm run build

// run
npm run dev

```
非es6环境，请使用生成的 `dist/validator.js` 。

## demo

```js
var validator = require('./dist/validator.js')
// 待验证数据
var data = {
  name: 'validator',
  nickname: 'validator.js',
  password: '123456',
  confirm_password: '1234561'
}

// 验证数据
var valid = validator.validate(data, {
  name: [
    {required: true, msg: 'name字段不能为空'},
    {type: String, msg: 'name字段必须是字符串'},
    {length: [3, 20], msg: 'name字段保持3~20字符'},
  ],
  nickname: {length: [3, 20], msg: 'nickname字段保持3~20字符'},
  password: {required: true, not: '123456', min: 6, msg: 'password验证不通过'},
  confirm_password: {eq: data.password, msg: '两次输入密码不一致'}
})

console.log(valid.fails(), valid.valider(), valid.has('name'), valid.all(true))

```

## API

**validator**：

+ `validator.validate(data, constraints [, isOne])` 验证数据，返回验证结果对象Analyzer
  
  - `data` 待验证数据
  - `constraints` 数据限制要求
  - `isOne` 检查到错误字段即停止
+ `validator.pushRule(type, fun)` 添加规则
+ `validator.Rule[type](val, rval)` 验证，返回bool；如：`validator.Rule.between(50, [20, 100])` 返回 `true`


**Analyzer**：


+ `Analyzer.prototype.all(isArr)` 返回所有验证信息结果，对象；如果需要返回数组 `isArr` 为 `true` 即可。 
+ `Analyzer.prototype.fails()` 检查是否失败，如果存在字段检查不通过，则返回true，反之false
+ `Analyzer.prototype.has(field)` 判断字段是否存在错误，返回Boolean
+ `Analyzer.prototype.get(field, isOrigin)` 获取字段错误信息
+ `Analyzer.prototype.first(field)` 返回指定字段的第一条错误信息
+ `Analyzer.prototype.last(field)` 返回指定字段的最后一条错误信息
+ `Analyzer.prototype.valider()` 返回验证对象

## constraints

`constraints` 数据限制

**用法**:

```js
validator.validate(data, constraints)
```


**constraints格式**:
```
字段: {规则名: 规则值, msg: '提示信息'}
```

**例:**

```js
{
  name: {
    required: true, msg: '用户名必须存在'
  },
  nickname: [
    {required: true, not: '', msg: '不能为空'}, //可以存在两个rule，共用msg
    {type: String, msg: '昵称必须是字符串'},
    {length: [3, 20], msg: '昵称长度3~20字符，(包含3与20)'}
  ]
}
```

## Rule

  + **`required`** 验证数据中必须存在
  + **`eq`** 值相等
  + **`not`** 非
  + **`type`** 符合的数据类型，支持 `String`, `Object`, `Array`, `Number`, `Boolean`, `Date`, ...包括自定义对象  (除`null` , `undefined`)
  + **`length`** 长度，支持数组与字符串数据
  + **`min`** 小于，支持数字，字符串
  + **`max`** 大于
  + **`between`** 数字范围，注：字符串比较问题 `'60' >= 100`
  + **`in`** 在里面，支持数组，对象，字符串
  + **`match`** 正则

## 自定义Rule

```js
// 添加回文规则
validator.pushRule('palindromic', function (val, rval) {
  if (rval) {
    console.log(val.split('').reverse())
    return val.split('').reverse().join('') === val
  }
  return true
})

```


