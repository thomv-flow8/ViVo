// Eenvoudige lokale previewserver voor het ViVo-project (alleen voor ontwikkeling).
// Draaien: node tools/serve.mjs [poort]  — standaard poort 5178
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const poort = Number(process.argv[2]) || 5178;
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.svg': 'image/svg+xml', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};

createServer(async (req, res) => {
  let pad = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (pad.endsWith('/')) pad += 'index.html';
  const bestand = normalize(join(root, pad));
  if (!bestand.startsWith(root)) { res.writeHead(403); return res.end(); }
  try {
    const data = await readFile(bestand);
    res.writeHead(200, { 'Content-Type': TYPES[extname(bestand)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Niet gevonden');
  }
}).listen(poort, () => console.log(`ViVo preview: http://localhost:${poort}/`));
