import { isArr } from './utils'

interface ruleType {
  message?: string,
  required?: boolean,
  validator?: () => boolean | Promise<boolean>
}

type rulesType = { [key: string]: ruleType | ruleType[] }

function validateRule (rules: ruleType | ruleType[]) {
  // todo
}

function validate (data: {[key: string]: any}, rules: rulesType, isOne = false): Promise<any> {
  return new Promise((resolve, reject) => {
    const dit: { [key: string]: any } = {}

    for (let key in data) {
      dit[key] = validateRule(data[key])
    }
  })
}

export default validate
