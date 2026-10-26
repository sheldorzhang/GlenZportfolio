import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const port = Number(process.env.PORT || 4318);
const types = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.pdf', 'application/pdf'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
]);

createServer((request, response) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  const target = resolve(root, `.${pathname}`);
  if (target !== root && !target.startsWith(`${root}${sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  let file = target;
  try {
    if (statSync(file).isDirectory()) file = resolve(file, 'index.html');
    const stat = statSync(file);
    if (!stat.isFile()) throw new Error('Not a file');
    response.writeHead(200, {
      'content-length': stat.size,
      'content-type': types.get(extname(file).toLowerCase()) || 'application/octet-stream',
      'cache-control': 'no-cache',
      'x-content-type-options': 'nosniff',
    });
    if (request.method === 'HEAD') response.end();
    else createReadStream(file).pipe(response);
  } catch {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' }).end('Not found');
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Portfolio preview: http://127.0.0.1:${port}`);
});
