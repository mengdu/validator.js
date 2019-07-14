import { isArr, isFun, isUndefined, isObj } from './utils'
/* eslint-disable-next-line no-unused-vars */
import rulesFuns, { ruleType } from './rules'

type rulesType = { [key: string]: ruleType | ruleType[] }
type validRuleResult = { value: any, valid: { [key: string]: { result: boolean, ruleValue: any, message: string } } }
type analyzerResult = {
  valid: { [key: string]: validRuleResult },
  fails: () => boolean,
  message: (isAll?: boolean) => string | string[]
}

/**
 * @param {any} value - 待验证值
 * @param {ruleType | ruleType[]} rules - 验证描述
 * @returns {Promise<validRuleResult>}
 * **/
async function validateRule (value: any, rules: ruleType | ruleType[]): Promise<validRuleResult> {
  if (isArr(rules)) {
    const list = await Promise.all((<ruleType[]>rules).map((rule: ruleType) => validateRule(value, rule)))
    const valid: {[key: string]: any} = {}

    // 合并到一个对象
    for (let i in list) {
      Object.assign(valid, list[i].valid)
    }

    return {
      value: value,
      valid: valid
    }
  } else {
    const dit: {[key: string]: { result: boolean, ruleValue: any, message: string }} = {}

    for (const key in rules) {
      if (['message', 'msg'].indexOf(key) === -1) {
        if (!isFun(rulesFuns[key])) {
          console.warn(`Skip not defined rule '${key}'.`)
          continue
        }

        const ruleValue = (<ruleType>rules)[key]
        let validResult = false

        if (key === 'required' && rulesFuns.required) {
          validResult = !ruleValue ? true : await rulesFuns.required(value, ruleValue)
        } else {
          validResult = isUndefined(value) ? true : await rulesFuns[key](value, ruleValue)
        }

        const message = (<ruleType>rules).message || (<ruleType>rules).msg || ''

        dit[key] = {
          result: validResult,
          ruleValue: ruleValue,
          message: message
        }
      }
    }

    return {
      value: value,
      valid: dit
    }
  }
}

/**
 * 格式化信息
 * @param {string} msg - 信息
 * @param {string} attr - 键
 * @param {string} rule - 规则名
 * @param {any} input - 输入
 * @param {any} ruleValue - 规则值
 * @returns {string}
 * **/
function formatMessage (msg: string, attr: string, rule: string, input: any, ruleValue: any) {
  return msg
    .replace(/:attr/g, attr)
    .replace(/:ruleValue/g, ruleValue)
    .replace(/:rule/g, rule)
    .replace(/:input/g, input)
}

/**
 * 返回分析对象
 * **/
function analyzer (data: { [key: string]: validRuleResult }): analyzerResult {
  return {
    valid: data,
    fails () {
      for (const key in data) {
        for (const ruleKey in data[key].valid) {
          const rule = data[key].valid[ruleKey]
          // console.log(key,ruleKey ,rule.result)
          if (!rule.result) return true
        }
      }

      return false
    },
    message (isAll: boolean = false) {
      const msgs = []
      for (const key in data) {
        for (const ruleKey in data[key].valid) {
          const rule = data[key].valid[ruleKey]
          // console.log(key,ruleKey ,rule.result)
          if (!rule.result) {
            if (isAll) {
              msgs.push(formatMessage(rule.message, key, ruleKey, data[key].value, rule.ruleValue))
            } else {
              return formatMessage(rule.message, key, ruleKey, data[key].value, rule.ruleValue)
            }
          }
        }
      }

      return isAll ? msgs : ''
    }
  }
}

/**
 * 验证
 * @param {object} data - 待验证数据
 * @param {rulesType} rules - 验证规则
 * @returns {Promise<analyzerResult>}
 * **/
function validate (data: { [key: string]: any }, rules: rulesType): Promise<analyzerResult> {
  return new Promise(async (resolve, reject) => {
    if (!isObj(data) || !isObj(rules)) return reject(new Error('The params `data` and `rules` must be an Object'))

    const keys = Object.keys(rules)

    const runs = keys.map(key => {
      return validateRule(data[key], rules[key])
    })

    let resultList = null

    try {
      resultList = await Promise.all(runs)
    } catch (err) {
      return reject(err)
    }

    const result: { [key: string]: any } = {}

    for (const i in resultList) {
      result[keys[i]] = resultList[i]
    }

    resolve(analyzer(result))
  })
}

export {
  validate,
  validateRule
}
