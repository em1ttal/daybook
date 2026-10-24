// Renders the app icons in brand/icons/<id>/ into the files the web app serves.
// Usage: npm run icons   (rerun after changing or adding an icon; commit the output)
// Design and rules: docs/design/icon.md

import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import pngToIco from 'png-to-ico'
import sharp from 'sharp'

const root = path.resolve(import.meta.dirname, '..')
const iconsDir = path.join(root, 'brand/icons')
const publicDir = path.join(root, 'web/public')

// The drawing inside a master, without its outer <svg> tag.
const inner = (svg) => svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '')

// One SVG with both versions: browsers that support SVG favicons show the one matching their theme.
const combined = (light, dark) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <style>.dark{display:none}@media (prefers-color-scheme: dark){.light{display:none}.dark{display:inline}}</style>
  <g class="light">${inner(light)}</g>
  <g class="dark">${inner(dark)}</g>
</svg>
`

const png = (svg, size, background) => {
  let image = sharp(Buffer.from(svg)).resize(size, size)
  // iOS home-screen icons can't be transparent, so fill the rounded corners with the tile colour.
  if (background) image = image.flatten({ background })
  return image.png().toBuffer()
}

const { default: defaultId } = JSON.parse(
  await readFile(path.join(iconsDir, 'config.json'), 'utf8'),
)
const ids = (await readdir(iconsDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
if (!ids.includes(defaultId)) {
  throw new Error(`brand/icons/config.json: default "${defaultId}" is not one of ${ids.join(', ')}`)
}

// Start clean so a removed icon doesn't leave files behind.
await rm(path.join(publicDir, 'icons'), { recursive: true, force: true })

for (const id of ids) {
  const light = await readFile(path.join(iconsDir, id, 'light.svg'), 'utf8')
  const dark = await readFile(path.join(iconsDir, id, 'dark.svg'), 'utf8')
  await mkdir(path.join(publicDir, 'icons', id), { recursive: true })
  const favicon = combined(light, dark)
  await writeFile(path.join(publicDir, 'icons', id, 'favicon.svg'), favicon)

  // Files read before any script runs (old browsers, iPhone "Add to Home Screen") use the default icon.
  if (id === defaultId) {
    await writeFile(path.join(publicDir, 'favicon.svg'), favicon)
    const tile = light.match(/<rect[^>]*fill="(#[0-9A-Fa-f]{6})"/)[1]
    await writeFile(
      path.join(publicDir, 'favicon.ico'),
      await pngToIco([await png(light, 32), await png(light, 48)]),
    )
    await writeFile(path.join(publicDir, 'apple-touch-icon.png'), await png(light, 180, tile))
  }
}

console.log(`Icons: ${ids.join(', ')} (default: ${defaultId}) → web/public/`)
