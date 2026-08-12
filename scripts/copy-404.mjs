// Copies dist/index.html to dist/404.html after every build.
//
// Why this needs to exist: GitHub Pages is a static host, so a direct hit
// on a route like /projects/reign-of-elements has no server to interpret
// it — GitHub serves whatever's at 404.html instead. Making that file an
// exact copy of index.html means React Router boots normally and resolves
// the route client-side, rather than the visitor seeing GitHub's own 404.
//
// Why this is plain Node rather than a shell command or an npm package:
// the previous version used the Unix `cp` command, which doesn't exist on
// Windows — it failed on every single deploy with no visible error in the
// build output, silently skipping the actual publish step every time.
// A one-line npm package (cpy-cli) was tried as the fix and ALSO failed
// silently in testing (exit code 0, no file written) — so this uses only
// Node's built-in fs module, which every platform running these npm
// scripts already has proven to work. If this ever fails, it throws and
// stops the build/deploy outright, rather than failing quietly again.
import { copyFileSync, existsSync } from 'node:fs'

const src = 'dist/index.html'
const dest = 'dist/404.html'

if (!existsSync(src)) {
  console.error(`copy-404: ${src} doesn't exist — did the build actually run?`)
  process.exit(1)
}

copyFileSync(src, dest)

if (!existsSync(dest)) {
  console.error(`copy-404: copy silently failed, ${dest} still doesn't exist`)
  process.exit(1)
}

console.log(`copy-404: ${src} -> ${dest} ✓`)
