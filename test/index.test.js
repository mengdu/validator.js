const vdjs = require('../dest')

describe('test void params', function () {
  test('not params', function () {
    return vdjs.validate().catch(err => {
      expect(err).toEqual(new Error('The params `data` and `rules` must be an Object'))
    })
  })

  test('not `rules` params', function () {
    return vdjs.validate({}).catch(err => {
      expect(err).toEqual(new Error('The params `data` and `rules` must be an Object'))
    })
  })

  test('not `data` params', function () {
    return vdjs.validate(null, {}).catch(err => {
      expect(err).toEqual(new Error('The params `data` and `rules` must be an Object'))
    })
  })

  test('other params', function () {
    return vdjs.validate(1, '').catch(err => {
      expect(err).toEqual(new Error('The params `data` and `rules` must be an Object'))
    })
  })
})

describe('test validate function', function () {
  test('success', async () => {
    const valid = await vdjs.validate({
      name: 'test'
    }, {
      name: {
        required: true,
        msg: 'Required :attr'
      }
    })
    expect(valid.fails()).toBe(false)
    expect(valid.message()).toBe('')
  })

  test('fail', async () => {
    const valid = await vdjs.validate({
      // name: 'test'
    }, {
      name: {
        required: true,
        msg: 'Required `:attr` param'
      }
    })
    expect(valid.fails()).toBe(true)
    expect(valid.message()).toBe('Required `name` param')
    expect(valid.message(true)).toEqual(['Required `name` param'])
  })

  test('not required skip valid', async () => {
    const rules = {
      key: { eq: 'test', msg: '`:attr` === test' }
    }
    const valid = await vdjs.validate({}, rules)

    expect(valid.fails()).toBe(false)
    expect(valid.message()).toBe('')
    expect(valid.valid.key.valid.eq.result).toBe(true)

    // 提供了才验证
    const valid2 = await vdjs.validate({
      key: ''
    }, rules)

    expect(valid2.fails()).toBe(true)
    expect(valid2.message()).toBe('`key` === test')
    expect(valid2.valid.key.valid.eq.result).toBe(false)

    // required = false
    const res = await vdjs.validate({}, {
      key: { required: false, msg: '' }
    })

    expect(res.fails()).toBe(false)
    expect(res.valid.key.valid.required.result).toBe(true)

    // required = false & 提供了key
    const res2 = await vdjs.validate({ key: 'xx' }, {
      key: { required: false, msg: '' }
    })

    expect(res2.fails()).toBe(false)
    expect(res2.valid.key.valid.required.result).toBe(true)
  })

  test('multiple rules', async () => {
    const valid = await vdjs.validate({
      name: 'xxx'
    }, {
      name: { required: true, length: [5, 10], message: 'Required, length >= 5 and length <= 10' }
    })

    expect(valid.fails()).toBe(true)
    expect(valid.valid.name.valid.required.result).toBe(true)
    expect(valid.valid.name.valid.length.result).toBe(false)
    expect(valid.message()).toBe('Required, length >= 5 and length <= 10')

    // 多个rule
    const res = await vdjs.validate({
      key: '123'
    }, {
      key: [
        { not: '123456', msg: 'not :ruleValue' },
        { like: '123%', msg: 'like 123' },
        { math: /^\d+$/, msg: 'number string' },
        { length: [6, 10], msg: 'length 6 ~ 10' }
      ]
    })

    expect(res.fails()).toBe(true)
    expect(res.message(true)).toEqual(['length 6 ~ 10'])
    expect(res.valid.key.valid.not.result).toBe(true)
    expect(res.valid.key.valid.like.result).toBe(true)
    expect(res.valid.key.valid.math.result).toBe(true)
    expect(res.valid.key.valid.length.result).toBe(false)

    // 多个键
    const res2 = await vdjs.validate({
      page: 1,
      pageSize: 100,
      doPage: true
    }, {
      page: { type: 'number', msg: 'number' },
      pageSize: { type: 'number', between: [1, 50], msg: '`:attr` not verification passed' },
      doPage: { type: 'boolean', msg: 'boolean' }
    })

    expect(res2.fails()).toBe(true)
    expect(res2.message(true)).toEqual(['`pageSize` not verification passed'])
    expect(res2.valid.page.valid.type.result).toBe(true)
    expect(res2.valid.pageSize.valid.between.result).toBe(false)
    expect(res2.valid.doPage.valid.type.result).toBe(true)
  })
})

test('test format message', async () => {
  const res = await vdjs.validate({
    key: '123'
  }, {
    key: { not: '123', message: ':attr - :rule - :ruleValue - :input' },
    key2: { required: true, message: ':attr - :rule - :ruleValue - :input' },
  })

  expect(res.fails()).toBe(true)
  expect(res.message(true)).toEqual(['key - not - 123 - 123', 'key2 - required - true - undefined'])
})
