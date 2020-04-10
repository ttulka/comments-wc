import {terser} from 'rollup-plugin-terser';
export default {
  input: 'src/comments/App.js',
  output: {
    file: 'build/comments.min.js',
    format: 'iife',
    plugins: [terser()]
  }
};
