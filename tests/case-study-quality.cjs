const fs=require('node:fs'); const assert=require('node:assert/strict');
const read=p=>fs.readFileSync(p,'utf8');
const data=read('lib/design-evidence.ts'); const casePage=read('app/projects/[slug]/page.tsx');
const study=read('components/usability-study.tsx');const muse=read('components/muse-app.tsx');
const clarity=read('components/clarity-lab.tsx');const home=read('app/layout.tsx');
for(const slug of ['clarity-ai','muse']){assert.ok(data.includes(`${slug}:`)||data.includes(`'${slug}':`),`Missing evidence plan for ${slug}`);assert.ok(fs.existsSync('app/study/[slug]/page.tsx'));}
for(const word of ['hypothesis','openQuestions','testQuestion','designerContribution','Explored, not selected'])assert.ok(data.includes(word),`Missing ${word}`);
assert.ok(study.includes('localStorage.setItem')&&study.includes('Export CSV')&&study.includes('participantCode'),'Research workspace must provide anonymous local sessions + export');
assert.ok(study.includes('Not attempted')&&study.includes('Could not complete')&&study.includes('completed independently'),'No fabricated outcomes / need observable task status');
assert.ok(casePage.includes('DesignDeepDive')&&casePage.includes('isFocusProject'),'Focused case studies must be integrated');
assert.ok(muse.includes('makeBoardPng')&&muse.includes('Export image (PNG)'),'Visual export missing');
assert.ok(clarity.includes('selectedEvidence.quote')&&clarity.includes('Read full source text'),'Citation must show selected passage');
assert.ok(home.includes('interview-ready.css'),'Interview-ready stylesheet missing');
assert.ok(fs.existsSync('docs/INTERVIEW-WALKTHROUGH.md')&&fs.existsSync('docs/USABILITY-RESEARCH-PROTOCOL.md'));
console.log('Case-study checks passed: alternatives, testable tasks, honest research status, local session CSV, citation excerpts, PNG board export and interview guide.');
