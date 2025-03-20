import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

const file = resolve(cwd(), 'dist/index.d.ts')
const content = readFileSync(file, { encoding: 'utf-8' })
writeFileSync(file, content.replace(/(?<=['"])type-fest/g, (str) => `./${str}`), { encoding: 'utf-8' })
