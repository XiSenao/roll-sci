import dts from 'rollup-plugin-dts';
import pkg from './package.json' assert { type: "json" };

export default {
  input: './temp/types/index.d.ts',
  output: {
    file: './dist/index.d.ts',
    format: 'es',
  },
  external: [
    /^node:*/,
    ...Object.keys(pkg.dependencies),
    ...Object.keys(pkg.devDependencies),
  ],
  plugins: [dts({ respectExternal: true })],
};
