const esbuild = require('esbuild')

esbuild.build({
  entryPoints: ['./src/preload/index.ts'],
  tsconfig: './src/preload/tsconfig.json',
  bundle: true,
  platform: 'node',
  external: ['electron'],
  outfile: 'dev-out/preload.js',
})
