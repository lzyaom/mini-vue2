import babel from '@rollup/plugin-babel'
import common from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import ts from '@rollup/plugin-typescript'

export default {
  input: './packages/index.ts',// 入口
  output: {
    file: './dist/vue.js',// 出口
    name: 'Vue',// global.Vue
    format: "umd",// esm es6 commonjs IIFE umd
    sourcemap: true,// 可以调试代码
  },
  plugins: [
    resolve(),
    common(),
    ts(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'// 排除 node_modules 中的所有文件
    }),
  ],
  onwarn: (msg, warn) => {
    if (!/Circular/.test(msg)) {
      warn(msg)
    }
  }
}