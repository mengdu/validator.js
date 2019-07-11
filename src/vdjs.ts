import { isArr, isFun } from './utils'
import rulesFuns, { ruleType } from './rules'

type rulesType = { [key: string]: ruleType | ruleType[] }

async function validateRule (value: any, rules: ruleType | ruleType[]) {
  if (isArr(rules)) {
    const list = await Promise.all(rules.map((rule: ruleType) => validateRule(value, rule)))
    return list
  } else {
    for (const rule in rules) {
      if (rule !== 'message') {
        if (!isFun(rulesFuns[rule])) throw new Error(`Rules '${rule}' not defined.`)
        const ruleValue = (<ruleType>rules)[rule]

        return {
          [rule]: await rulesFuns[rule](value, ruleValue),
          ruleValue: ruleValue,
          message: (<ruleType>rules).message
        }
      }
    }
  }
}

function validate (data: { [key: string]: any }, rules: rulesType): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const keys = Object.keys(rules)

    const runs = keys.map(key => {
      return validateRule(data[key], rules[key])
    })

    const resultList = await Promise.all(runs)

    const result: { [key: string]: any } = {}

    for (const i in resultList) {
      result[keys[i]] = resultList[i]
    }

    resolve(result)
  })
}

export default validate
