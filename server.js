const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.mp4': 'video/mp4', '.json': 'application/json', '.svg': 'image/svg+xml',
};

http.createServer((req, res) => {
  let filePath = path.join(ROOT, decodeURIComponent(req.url === '/' ? '/index.html' : req.url));
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] || 'application/octet-stream';

  fs.stat(filePath, (err, stat) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': mime, 'Content-Length': stat.size });
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
