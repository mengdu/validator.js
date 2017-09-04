## validator.js

一个简单的数据验证对象

代码正在完善中，请暂时不要用于开发。

## use

run:

```bat
npm install

// build
npm run build

// run
npm run dev

```
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
    {between: [3, 20], msg: 'name字段保持3~20字符'},
  ],
  nickname: {between: [3, 20], msg: 'nickname字段保持3~20字符'},
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


**Analyzer**：


+ `Analyzer.prototype.all(isArr)` 返回所有验证信息结果，对象；如果需要返回数组 `isArr` 为 `true` 即可。 
+ `Analyzer.prototype.fails()` 检查是否失败，如果存在字段检查不通过，则返回true，反之false
+ `Analyzer.prototype.has(field)` 判断字段是否存在错误，返回Boolean
+ `Analyzer.prototype.get(field, isOrigin)` 获取字段错误信息
+ `Analyzer.prototype.first(field)` 返回指定字段的第一条错误信息
+ `Analyzer.prototype.last(field)` 返回指定字段的最后一条错误信息


**rule**:




