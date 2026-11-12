const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const cover = read('components/project-preview.tsx');
const muse = read('components/muse-app.tsx');
const exposure = read('components/exposure-app.tsx');
const css = read('app/creative-polish.css');
const layout = read('app/layout.tsx');
assert.match(cover, /creative-cover-title[^\n]*Muse/, 'Muse cover must show an explicit name');
assert.match(cover, /creative-cover-title[^\n]*Exposure/, 'Exposure cover must show an explicit name');
assert.ok(css.includes('.creative-cover-copy') && css.includes('.muse-cover-gallery'), 'Covers should separate titles from imagery');
assert.ok(layout.includes('creative-polish.css'), 'Refinement stylesheet must be loaded');
assert.ok(muse.includes("type:'visual'"), 'Muse image detail dialog missing');
assert.ok(muse.includes('muse-visual-detail') && muse.includes('muse-start-card'), 'Muse navigation and detail affordances missing');
assert.ok(exposure.includes('expo-workflow') && exposure.includes('expo-guidance'), 'Exposure onboarding missing');
assert.ok(exposure.includes('expo-empty-proof') && exposure.includes("filter(p=>p.picked)"), 'Selected-only proofing and empty state missing');
for(const file of ['poster-02.jpg','photo-coffee.jpg','poster-04.jpg','photo-camera.jpg','photo-astronaut.jpg','photo-cat.jpg','photo-rocket.jpg']){
 assert.ok(fs.existsSync(path.join(root,'public/demo-media',file)), `Missing cover asset ${file}`);
}
console.log('Creative design integration checks passed: readable cover components, onboarding, source detail, selected-only proofing, bundled media.');
