# vdjs

A JavaScript data validation library.

**usage**

```ls
npm i vdjs
```

```js
const vdjs = require('vdjs')

vdjs.validate(data, rules).then(res => {
  if (res.fails()) alert(res.message)
})
```

## API

+ **vdjs.validate(data, rules)** 返回 `Promise<analyzerResult>`

**analyzerResult**:

```ts
type analyzerResult = {
  valid: { [key: string]: validRuleResult },
  fails: () => boolean,
  message: (isAll?: boolean) => string | string[]
}
```

**rules**

列出需要验证的 `键` 和 `ruleType`，信息可以是 `message` 或者 `msg`

```js
{
  key: { required: true, msg: 'Required `:attr`' },
  key2: [
    { required: true, msg: 'Required `:attr`' },
    { length: 10, msg: '`:attr` must be :ruleValue' },
  ],
  key2: { required: true, length: [6, 10], msg: 'Invalid parameters' },
}
```

## ruleType

支持的规则如下：

```ts
type ruleReturn = boolean | Promise<boolean>
type ruleValidator = (value: any) => ruleReturn
type variableType = 'string' | 'object' | 'array' | 'boolean' | 'number' | 'null' | 'undefined' | 'symbol' | 'NaN'

export interface ruleType {
  [key: string]: any;
  message?: string;
  msg?: string;

  /**
   * 必须的，非 undefined 则返回 true
   * **/
  required?: (value: any, ruleValue: boolean) => ruleReturn;

  /**
   * 自定义验证
   * **/
  validator?: (value: any, ruleValue: ruleValidator) => ruleReturn;

  /**
   * 等于 ===
   * **/
  eq?: (value: any, ruleValue: any) => ruleReturn;

  /**
   * 不等于 !==
   * **/
  not?: (value: any, ruleValue: any) => ruleReturn;

  /**
   * 类型判断
   * **/
  type?: (value: any, ruleValue: variableType) => ruleReturn;

  /**
   * 数值最小值，>=
   * **/
  min?: (value: any, ruleValue: number) => ruleReturn;

  /**
   * 数值最大值，<=
   * **/
  max?: (value: any, ruleValue: number) => ruleReturn;

  /**
   * 比较 >
   * **/
  gt?: (value: any, ruleValue: any) => ruleReturn;

  /**
   * 比较 >=
   * **/
  gte?: (value: any, ruleValue: any) => ruleReturn;

  /**
   * 比较 <
   * **/
  lt?: (value: any, ruleValue: any) => ruleReturn;

  /**
   * 比较 <=
   * **/
  lte?: (value: any, ruleValue: any) => ruleReturn;

  /**
   * 长度
   * **/
  length?: (value: any, ruleType: number | [number, number]) => ruleReturn;

  /**
   * 在范围之内
   * **/
  between?: (value: any, ruleValue: [any, any]) => ruleReturn;

  /**
   * 不在范围之内
   * **/
  notBetween?: (value: any, ruleValue: [any, any]) => ruleReturn;

  /**
   * 在里面，支持数组，字符，对象
   * **/
  in?: (value: any, ruleValue: any[] | string | object) => ruleReturn;

  /**
   * 不在里面，支持数组，字符，对象
   * **/
  notIn?: (value: any, ruleValue: any) => ruleReturn;

  /**
   * 符合正则
   * **/
  math?: (value: any, ruleValue: RegExp) => ruleReturn;

  /**
   * 不符合正则
   * **/
  notMath?: (value: any, ruleValue: RegExp) => ruleReturn;

  /**
   * 相似
   * **/
  like?: (value: any, ruleValue: string) => ruleReturn;

  /**
   * 非相似
   * **/
  notLike?: (value: any, ruleValue: string) => ruleReturn;

  /**
   * 匹配邮箱
   * **/
  email?: (value: any, ruleValue: RegExp | boolean) => ruleReturn;

  /**
   * true 时验证空，false时验证非空；'', null, undefined, [], {}, NaN
   * **/
  empty?: (value: any, ruleValue: boolean) => ruleReturn;
}
```
