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

    // 提供了才验证
    const valid2 = await vdjs.validate({
      key: ''
    }, rules)

    expect(valid2.fails()).toBe(true)
    expect(valid2.message()).toBe('`key` === test')
  })

  test('multiple rules', async () => {
    const valid = await vdjs.validate({
      name: 'xxx'
    }, {
      name: { required: true, length: [5, 10], message: 'Required, length >= 5 and length <= 10' }
    })

    expect(valid.fails()).toBe(true)
    expect(valid.message()).toBe('Required, length >= 5 and length <= 10')
  })
})
