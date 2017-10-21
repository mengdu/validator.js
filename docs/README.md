## validator.js

一个简单的数据验证对象，适用于浏览器与node环境。


[文档](https://mengdu.github.io/validator.js)

[在线例子](https://mengdu.github.io/validator.js/#/demo)

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

  + **`required`** 验证字段必须存在，`undefined` 为不存在。
  + **`eq`** 值相等；`{eq: '123456', msg: '必须是123456'}`。
  + **`not`** 非。
  + **`type`** 符合的数据类型，支持 `String`, `Object`, `Array`, `Number`, `Boolean`, `Date`, ...包括自定义对象  (除`null` , `undefined`)。
  + **`length`** 长度，支持数组与字符串数据；`{length: 6, msg: '值必须6位'}` 或者 `{length: [6, 20], msg: '6~20字符'}`。
  + **`min`** 大于等于，支持数字，字符串。
  + **`max`** 小于等于。
  + **`gt`** 大于 > 。
  + **`gte`** 大于等于 >= (同min)。
  + **`lt`** 小于 < 。
  + **`lte`** 小于等于 <= (同max)。
  + **`between`** 数字范围；`{between: [6, 20]}` 注：字符串比较问题 `'60' >= '100'`；如：待验证值100，`{between: ['60', '100']}`。
  + **`notBetween`** 不在范围。
  + **`in`** 在里面，支持数组，对象，字符串；`{in: ['aa', 'bb']}`，`{in: 'this is a test', msg: ''}`。
  + **`notIn`** 不在里面。
  + **`match`** 匹配正则；`{match: /abc$/, msg: '必须以abc结尾'}`。
  + **`notMatch`** 不匹配正则。
  + **`like`** 模糊匹配，类似sql中的like规则；例如：`{like: 'abc%', '必须以abc开头'}` 。
  + **`notLike`** `like` 反义。
  + **`email`** 匹配邮箱；内部正则：`/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/`，可能存在一些不匹配情况。
  + **`upperCase`** 匹配大写。
  + **`lowerCase`** 匹配小写。
  + **`run`** 自定义执行过程，执行函数必须同步返回，暂不支持async/await；例如：`{run: (id) => {return true}, msg: ''}`。
  
  
  **required**

  在不提供 `required` 规则的情况或者`required: true` 时，只有data中对应字段不为undefined才会输出其他规则匹配结果。

  例如：

```js
var data = {}
var valid = validator.validate(data, {
  name: {length: 12, msg: '长度必须是12'}
})
```
这里 `valid.fails()` 结果是 `false` 的。


```js
var data = {name: 'abc'}
var valid = validator.validate(data, {
  name: {length: 12, msg: '长度必须是12'}
})
```
这里 `valid.fails()` 结果是 `true` 的。

以上两种情况，增加 `required: false` 是一样的结果。

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

## http请求验证例子

http请求需要注意的是空字段的问题，比如 `xxx?query=`， `query` 字段值是空的字符串，而不是null

```
var valid = validator.validate(ctx.request.body, {
  email: [
    {required: true, not: '', msg: '邮箱不能为空'},
    {match: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, msg: '邮箱格式不对'}
  ],
  name: [
    {required: true, not: '', msg: '名字不能为空'}
  ],
  tel: [
    {required: true, not: '', msg: '电话号码不能为空'},
    {match: /^1[3|4|5|7|8][0-9]{9}$/, msg: '手机号码格式不正确'}
  ]
})

```
