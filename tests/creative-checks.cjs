// Dependency-free smoke checks for portfolio integration and local demo assets.
const fs=require('node:fs');const path=require('node:path');const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');const read=(p)=>fs.readFileSync(path.join(root,p),'utf8');
const data=read('lib/creative-data.ts');
const visuals=[...data.matchAll(/src:'(\/demo-media\/[^']+)'/g)].map(m=>m[1]);
assert.ok(visuals.length>=20,'Expected visual and exposure demo image entries');
for(const asset of new Set(visuals))assert.ok(fs.existsSync(path.join(root,'public',asset)),'Missing demo asset '+asset);
for(const slug of ['clarity-ai','transitflow','muse','exposure']){
 assert.ok(read('lib/site.ts').includes(`slug: "${slug}"`),`Missing ${slug} project metadata`);
 assert.ok(fs.existsSync(path.join(root,'app','lab',slug,'page.tsx')),'Missing lab route '+slug);
}
for(const key of ['muse','exposure']){
 const text=read(`components/${key}-app.tsx`);
 assert.ok(text.includes("'use client'"),`Missing client boundary for ${key}`);
 assert.ok(text.includes('role="status"'),`Missing result announcements for ${key}`);
}
assert.ok(fs.existsSync(path.join(root,'public','resume.pdf')),'Resume must be present');
console.log('Creative product checks passed:',new Set(visuals).size,'bundled visuals, 4 projects, 4 app routes, resume.');
