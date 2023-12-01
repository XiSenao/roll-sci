import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import babel from '@rollup/plugin-babel'
// import gzipPlugin from 'rollup-plugin-gzip'
// import terser from '@rollup/plugin-terser'
import typescript from '@rollup/plugin-typescript'
import nodePolyfills from 'rollup-plugin-polyfill-node';
import builtins from 'rollup-plugin-node-builtins';
import nodeGlobal from 'rollup-plugin-node-globals';

// import camelCase from 'lodash.camelcase'

// import pkg from './package.json' assert { type: "json" };

// const libraryName = pkg.name;

// Set if rollup is used in development/watch mode and switch variables based on that value
const isDev = process.env.ROLLUP_WATCH === 'true'
const baseDir = isDev ? 'dev/dist/' : 'dist/'
const tsconfig = isDev ? './tsconfig.dev.json' : './tsconfig.json'

const plugins = [
  builtins(),
  nodePolyfills(),
  nodeGlobal(),
  json(),
  typescript({ tsconfig, exclude: ['node_modules'] }),
  commonjs(),
  resolve({
    browser: true,
    preferBuiltins: true,
    mainFields: ['browser']
  }),
  babel({
    exclude: 'node_modules/**',
    extensions: ['.js', '.ts'],
    babelHelpers: "runtime",
    presets: ['@babel/preset-env']
  })
]

export default [
  {
    input: `src/index.ts`,
    output: [
      {
        dir: baseDir,
        format: 'esm',
        chunkFileNames: 'chunk-[format]-[hash].js',
      }
    ],
    plugins
  },
  {
    input: 'src/cli.ts',
    output: {
      dir: baseDir,
      format: 'esm',
      chunkFileNames: 'chunk-[format]-[hash].js',
    },
    plugins
  }
]
