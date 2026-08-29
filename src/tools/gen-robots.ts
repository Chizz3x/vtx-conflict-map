import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';
import { ROUTES } from '../routes';

config();

const build = () => {
  const hostname = process.env.PUBLIC_URL || 'https://example.com';
  const outPath = path.resolve('build', 'robots.txt');

  const lines: string[] = [];
  lines.push('# https://www.robotstxt.org/robotstxt.html');
  lines.push('User-agent: *');
  lines.push('Allow: /');
  lines.push('');
  lines.push(`Sitemap: ${hostname}/sitemap.xml`);

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, lines.join('\n'), 'utf-8');
  console.log(`Robots.txt written at ${outPath}`);
};

build();
