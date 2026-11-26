// Répare un fichier UTF-8 qui a été relu en Windows-1252 puis réécrit en UTF-8.
// Usage : node scripts/fix-encoding.mjs <fichier> [fichier...]
import { readFileSync, writeFileSync } from 'node:fs'

const decoder = new TextDecoder('windows-1252')
const toByte = new Map()
for (let i = 0; i < 256; i++) toByte.set(decoder.decode(Uint8Array.of(i)), i)

for (const file of process.argv.slice(2)) {
  const text = readFileSync(file, 'utf8')
  const bytes = []
  let unmappable = 0
  for (const ch of text) {
    if (toByte.has(ch)) bytes.push(toByte.get(ch))
    else if (ch.codePointAt(0) < 128) bytes.push(ch.codePointAt(0))
    else {
      unmappable++
      bytes.push(63)
    }
  }
  const fixed = Buffer.from(bytes).toString('utf8')
  const before = (text.match(/Ã|â€/g) || []).length
  const after = (fixed.match(/Ã|â€/g) || []).length
  writeFileSync(file, fixed, 'utf8')
  console.log(`${file}: ${before} -> ${after} séquences cassées, non mappables: ${unmappable}`)
}
