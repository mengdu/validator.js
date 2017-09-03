import babel from 'rollup-plugin-babel'
export default {
  entry: 'src/index.js',
  format: 'umd',//iife(web) , cjs(node) , umd(web&node)
  name: 'validator',
  dest: 'dist/validator.js', // 相当于 --output
  watch: {
    include: 'src/**'
  },
  sourceMap: false,
  plugins: [
    babel({
      exclude: 'node_modules/**'
    })
  ]
}