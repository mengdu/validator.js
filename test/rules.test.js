'use strict'
const rules = require('../dest/rules').default

test('test required', () => {
  const val = undefined
  expect(rules.required(val, true)).toBe(false)
  expect(rules.required(val, false)).toBe(true)
})

test('test validator', async () => {
  expect(rules.validator(1, () => true)).toBe(true)
  expect(rules.validator(true, (v) => v)).toBe(true)
  expect(rules.validator(false, (v) => v)).toBe(false)

  const res = await rules.validator(false, async (v) => v)
  expect(res).toBe(false)
})

test('test eq and not', () => {
  expect(rules.eq(1, 1)).toBe(true)
  expect(rules.eq(1, true)).toBe(false)
  expect(rules.eq('1', 1)).toBe(false)
  expect(rules.eq(null, null)).toBe(true)

  expect(rules.not(1, 1)).toBe(false)
  expect(rules.not(true, true)).toBe(false)
  expect(rules.not('123', '')).toBe(true)
})

test('test type', () => {
  const val = undefined
  expect(rules.type(val, 'undefined')).toBe(true)
  expect(rules.type(1, 'number')).toBe(true)
  expect(rules.type(null, 'null')).toBe(true)
  expect(rules.type([], 'array')).toBe(true)
  expect(rules.type({}, 'object')).toBe(true)
  expect(rules.type([], 'object')).toBe(true)
  expect(rules.type(null, 'object')).toBe(true)
  expect(rules.type(true, 'boolean')).toBe(true)
  expect(rules.type(Symbol('t'), 'symbol')).toBe(true)
  expect(rules.type('123', 'string')).toBe(true)
  expect(rules.type('a' / 2, 'NaN')).toBe(true)
})

test('test min and max', () => {
  expect(rules.min(10, 11)).toBe(false)
  expect(rules.min(10, 1)).toBe(true)
  expect(rules.min(10, 10)).toBe(true)

  expect(rules.max(11, 10)).toBe(false)
  expect(rules.max(10, 10)).toBe(true)
  expect(rules.max(9, 10)).toBe(true)
})

test('test gt, gte, lt, lte', () => {
  expect(rules.gt(10, 9)).toBe(true)
  expect(rules.gt(10, 10)).toBe(false)
  expect(rules.gt(6, 9)).toBe(false)

  expect(rules.gte(6, 9)).toBe(false)
  expect(rules.gte(9, 9)).toBe(true)

  expect(rules.gt('c', 'b')).toBe(true)
  expect(rules.gte('b', 'b')).toBe(true)
  expect(rules.gt('a', 'b')).toBe(false)

  expect(rules.lt(1, 10)).toBe(true)
  expect(rules.lt(10, 10)).toBe(false)
  expect(rules.lt(11, 10)).toBe(false)

  expect(rules.lt('a', 'b')).toBe(true)
  expect(rules.lte('b', 'b')).toBe(true)
})

test('test length', () => {
  expect(rules.length('123', 3)).toBe(true)
  expect(rules.length('123', [3, 10])).toBe(true)
  expect(rules.length('1234', [3, 10])).toBe(true)
  expect(rules.length('123456', [3, 5])).toBe(false)
})

test('test between and notBetween', () => {
  expect(rules.between(10, [6, 15])).toBe(true)
  expect(rules.between(5, [6, 15])).toBe(false)

  expect(rules.notBetween(10, [6, 15])).toBe(false)
  expect(rules.notBetween(5, [6, 15])).toBe(true)
})

test('test in and notIn', () => {
  expect(rules.in(5, [1, 2, 3, 4, 5])).toBe(true)
  expect(rules.in(0, [1, 2, 3, 4, 5])).toBe(false)
  expect(rules.in('key', { key: 0 })).toBe(true)
  expect(rules.in('key', { })).toBe(false)
  expect(rules.in('test', 'this is a test')).toBe(true)
  expect(rules.in('aaa', 'this is a test')).toBe(false)

  expect(rules.notIn(5, [2, 1, 4])).toBe(true)
  expect(rules.notIn('key', { key: undefined })).toBe(false)
})

test('test math and notMath', () => {
  expect(rules.math('12345', /^\d+$/)).toBe(true)
  expect(rules.notMath('12345', /^\d+$/)).toBe(false)
})

test('test like and notLike', () => {
  expect(rules.like('123abc', '%abc')).toBe(true)
  expect(rules.like('123abc1', '%abc')).toBe(false)
  expect(rules.like('123ab1c', '%abc')).toBe(false)

  expect(rules.like('abc12', 'abc%')).toBe(true)
  expect(rules.like('aabc12', 'abc%')).toBe(false)

  expect(rules.like('a123bc', 'a%bc')).toBe(true)
  expect(rules.like('a123b1c', 'a%bc')).toBe(false)
  expect(rules.like('aabbc', 'a%bc')).toBe(true)

  expect(rules.like('xxxaxxxbc', '%a%bc')).toBe(true)
  expect(rules.like('123abc', '%a%bc')).toBe(true)
  expect(rules.like('123abc123', '%a%bc')).toBe(false)

  expect(rules.like('abc', 'a%bc%')).toBe(true)
  expect(rules.like('a123bc23', 'a%bc%')).toBe(true)

  expect(rules.like('abc', '%a%bc%')).toBe(true)
  expect(rules.like('xaxbcx', '%a%bc%')).toBe(true)
  expect(rules.like('xaxbxcx', '%a%bc%')).toBe(false)

  expect(rules.notLike('abc', 'a%bc')).toBe(false)
})

test('test email', () => {
  expect(rules.email('123456@qq.com', true)).toBe(true)
  expect(rules.email('asdfasd@126.com.cn', true)).toBe(true)
})

test('test empty', () => {
  expect(rules.empty('', true)).toBe(true)
  expect(rules.empty(null, true)).toBe(true)
  expect(rules.empty(undefined, true)).toBe(true)
  expect(rules.empty([], true)).toBe(true)
  expect(rules.empty({}, true)).toBe(true)
  expect(rules.empty(NaN, true)).toBe(true)
})
