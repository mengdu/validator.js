import { isArr, isNull, isSymbol, isRegExp, isEmpty } from './utils'

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

const rules: ruleType = {
  required (value, ruleValue) {
    return ruleValue ? typeof value !== 'undefined' : true
  },

  validator (value, fn) {
    return fn(value)
  },

  eq (value, ruleValue) {
    return value === ruleValue
  },

  not (value, ruleValue) {
    return value !== ruleValue
  },

  type (value, ruleType) {
    if (ruleType === 'array') return isArr(value)
    if (ruleType === 'null') return isNull(value)
    if (ruleType === 'symbol') return isSymbol(value)
    if (ruleType === 'NaN') return Number.isNaN(value)

    /* eslint-disable-next-line valid-typeof */
    return typeof value === ruleType
  },

  min (value, ruleValue) {
    return !!(this.type && this.type(value, 'number')) && value >= ruleValue
  },

  max (value, ruleValue) {
    return !!(this.type && this.type(value, 'number')) && value <= ruleValue
  },

  gt (value, ruleValue) {
    return value > ruleValue
  },

  gte (value, ruleValue) {
    return value >= ruleValue
  },

  lt (value, ruleValue) {
    return value < ruleValue
  },

  lte (value, ruleValue) {
    return value <= ruleValue
  },

  length (value, ruleValue) {
    if (isArr(ruleValue)) {
      return (<[number, number]>ruleValue)[0] <= value.length && value.length <= (<[number, number]>ruleValue)[1]
    }

    return value.length === ruleValue
  },

  between (value, ruleValue) {
    if (!isArr(ruleValue) && ruleValue.length < 2) {
      console.warn(`The 'between' rule value must be an Array[any, any]`)
      return false
    }

    return ruleValue[0] <= value && value <= ruleValue[1]
  },

  notBetween (value, ruleValue) {
    return this.between ? !this.between(value, ruleValue) : true
  },

  in (value, ruleValue) {
    if (isArr(ruleValue) || typeof ruleValue === 'string') return (<any[] | string>ruleValue).indexOf(value) > -1

    return typeof (<object>ruleValue) === 'undefined'
  },

  notIn (value, ruleValue) {
    return this.in ? !this.in(value, ruleValue) : true
  },

  math (value, ruleValue) {
    return ruleValue.test(value)
  },

  notMath (value, ruleValue) {
    return this.math ? !this.math(value, ruleValue) : true
  },

  like (value, ruleValue) {
    //   %abc     /abc$/
    //   abc%     /^abc/
    //   a%bc     /^a.*bc$/
    //   %a%bc    /a.*bc$/
    //   a%bc%    /^a.*bc/
    //   %a%bc%   /a.*bc/

    if (typeof ruleValue !== 'string') {
      console.warn(`The 'like' rule value must be string`)
      return false
    }

    // 如果第一个字符不是%，在前面加^
    if (ruleValue[0] !== '%') ruleValue = '^' + ruleValue

    // 如果z最后一个字符不是%，在后面加$
    if (ruleValue[ruleValue.length - 1] !== '%') ruleValue = ruleValue + '$'

    ruleValue = ruleValue.replace(/%/g, '.*')

    return new RegExp(ruleValue).test(value)
  },

  notLike (value, ruleValue) {
    if (typeof ruleValue !== 'string') {
      console.warn(`The 'like' rule value must be string`)
      return false
    }

    return this.like ? !this.like(value, ruleValue) : true
  },

  email (value, ruleValue) {
    if (isRegExp(ruleValue)) {
      return (<RegExp>ruleValue).test(value)
    }

    if (ruleValue) return /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(value)

    return true
  },

  empty (value, ruleValue) {
    return ruleValue ? isEmpty(value) : !isEmpty(value)
  }
}

export default rules
