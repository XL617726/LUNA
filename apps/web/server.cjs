/**
 * LUNA Production Server
 * 用于本地预览生产构建或部署到 Node.js 环境
 *
 * Usage:
 *   node server.js          # 默认端口 3000
 *   PORT=8080 node server.js # 自定义端口
 */
const http = require('http')
const fs = require('fs')
const path = require('path')

const PORT = process.env.PORT || 3000
const DIST = path.join(__dirname, 'dist')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

const server = http.createServer((req, res) => {
  let url = req.url.split('?')[0]
  // SPA fallback: all routes serve index.html
  const filePath = url === '/' || !path.extname(url)
    ? path.join(DIST, 'index.html')
    : path.join(DIST, url)

  const ext = path.extname(filePath)
  const contentType = MIME[ext] || 'application/octet-stream'

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // SPA fallback for client-side routing
      fs.readFile(path.join(DIST, 'index.html'), (err2, data2) => {
        if (err2) {
          res.writeHead(404)
          res.end('Not Found')
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
          res.end(data2)
        }
      })
    } else {
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(data)
    }
  })
})

server.listen(PORT, () => {
  console.log('')
  console.log('  🌙 LUNA v1.0 Production Server')
  console.log(`  http://localhost:${PORT}`)
  console.log('')
  console.log('  Share with your friend:')
  console.log(`  http://localhost:${PORT}/gift`)
  console.log('')
})
