import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { ROUTES } from '../routes';

config();

const build = () => {
  const hostname = (process.env.PUBLIC_URL || 'https://example.com').replace(/\/+$/, '');
  const outPath = path.resolve('build', 'sitemap.xml');

  const urls = Object.values(ROUTES).map((route) => {
    const clean = route === '/' ? '/' : `/${route.replace(/^\/+/, '')}`;
    return `  <url>\n    <loc>${hostname}${clean}</loc>\n  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, xml, 'utf-8');
  console.log(`Sitemap written at ${outPath}`);
};

build();
