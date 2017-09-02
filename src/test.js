
// console.log(module, exports)
console.log('run test.js')
var valid = {
    age: 123,
    version: '1.0',
    fun () {console.log('x')}
}
// module.exports = valid

// if (typeof module !== 'undefined' && module.exports) {
//   console.log('env node')
//   module.exports = valid
// } else {
//   console.log('env browse')
//   window.validator = valid
// }
export default valid