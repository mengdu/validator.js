import babel from 'rollup-plugin-babel'
const uglify = require('rollup-plugin-uglify')
var production = process.env.NODE_ENV === 'production'
var filename = production ? 'validator.min.js' : 'validator.js'
export default {
  entry: 'src/index.js',
  format: 'umd',//iife(web) , cjs(node) , umd(web&node)
  name: 'validator',
  dest: 'dist/' + filename,
  watch: {
    include: 'src/**'
  },
  sourceMap: true,
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    (production && uglify())
  ]
}
