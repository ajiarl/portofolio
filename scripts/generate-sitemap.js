import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BASE_URL = 'https://portofolio-ajiarlando.vercel.app';

const toSlug = (title) =>
  title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

async function generateSitemap() {
  console.log('⏳ Fetching projects from Supabase...');
  
  const { data: projects, error } = await supabase
    .from('projects')
    .select('Title, created_at');

  if (error) {
    console.error('❌ Error fetching projects:', error.message);
    return;
  }

  const staticRoutes = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
  ];

  const projectRoutes = (projects || []).map((p) => ({
    url: `/project/${toSlug(p.Title)}`,
    priority: '0.8',
    changefreq: 'monthly',
    lastmod: p.created_at?.split('T')[0],
  }));

  const allRoutes = [...staticRoutes, ...projectRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    ${route.lastmod ? `<lastmod>${route.lastmod}</lastmod>` : ''}
  </url>`
  )
  .join('\n')}
</urlset>`;

  try {
    writeFileSync('./public/sitemap.xml', sitemap);
    console.log(`✅ Sitemap generated successfully with ${allRoutes.length} URLs!`);
  } catch (err) {
    console.error('❌ Error writing sitemap.xml:', err.message);
  }
}

generateSitemap();
