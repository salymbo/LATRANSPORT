// Sert dist/ sous /LATRANSPORT/ pour simuler GitHub Pages en local.
import http from 'node:http'
import { createReadStream, existsSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'

const root = process.argv[2]
const port = Number(process.argv[3] || 8080)

const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
}

http
  .createServer((req, res) => {
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    if (!path.startsWith('/LATRANSPORT/')) {
      res.writeHead(404).end('not found')
      return
    }
    path = path.slice('/LATRANSPORT/'.length) || 'index.html'
    const file = normalize(join(root, path))
    if (!file.startsWith(normalize(root)) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404).end('not found')
      return
    }
    res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' })
    createReadStream(file).pipe(res)
  })
  .listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}/LATRANSPORT/ -> ${root}`))
