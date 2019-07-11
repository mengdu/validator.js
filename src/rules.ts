type ruleReturn = boolean | Promise<boolean>
type ruleValidator = (value: any) => ruleReturn
export interface ruleType {
  [key: string]: any;
  message?: string;
  required?: (value: any, ruleValue: boolean) => ruleReturn;
  validator?: (value: any, ruleValue: ruleValidator) => ruleReturn;
  eq?: (value: any, ruleValue: any) => ruleReturn;
  not?: (value: any, ruleValue: any) => ruleReturn;
  type?: (value: any, ruleValue: string) => ruleReturn;
  min?: (value: any, ruleValue: number) => ruleReturn;
  max?: (value: any, ruleValue: number) => ruleReturn;
}

const rules: ruleType = {
  required (value, ruleValue) {
    return ruleValue ? typeof value !== 'undefined' : true
  },
  eq (value, ruleValue) {
    return value === ruleValue
  },
  not (value, ruleValue) {
    return value !== ruleValue
  },
  min (value, ruleValue) {
    return value >= ruleValue
  },
  max (value, ruleValue) {
    return value <= ruleValue
  }
}

export default rules
