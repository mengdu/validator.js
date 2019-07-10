const rules = {
  required (value: any, ruleValue: boolean) {
    return ruleValue ? typeof value !== 'undefined' : true
  }
}

export default rules
