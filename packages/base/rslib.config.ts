import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2022',
      dts: {
        bundle: true,
      },
      autoExtension: false,
      source: {
        entry: {
          index: './index.ts'
        }
      },
      output: {
        target: 'web',
        filename: {
          js: '[name].js',
        },
      },
    },
  ],
})
