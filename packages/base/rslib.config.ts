import { defineConfig } from '@rslib/core'

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: 'es2022',
      dts: true,
      autoExtension: false,
      source: {
        entry: {
          index: './index.ts',
        },
      },
      output: {
        target: 'web',
        filename: {
          js: '[name].js',
        },
        copy: [
          {
            context: './node_modules/type-fest',
            from: '**/*.d.ts',
            to: 'type-fest',
          },
        ],
      },
    },
  ],
})
