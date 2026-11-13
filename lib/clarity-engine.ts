/** Source-first retrieval helpers shared by the Clarity API and tests. */
export type ResearchSource = { id: string; title: string; body: string };
export type Evidence = { sourceId: string; title: string; quote: string; score: number };

const STOP = new Set('a an the and or of for on at with to from in by how why what which when where who does do is are it this that about can could should would i me my we our be as into using use through have has they their find tell help explain compare between versus vs'.split(' '));
export function terms(text: string): string[] {
  return [...new Set((text.toLowerCase().match(/[a-z0-9]{3,}/g) || []).filter(word => !STOP.has(word)))];
}
export function chunkSource(body: string): string[] {
  const text = body.replace(/\r/g, '').replace(/[ \t]+/g, ' ').trim();
  const sentences = (text.match(/[^.!?\n]+(?:[.!?]+|\n|$)/g) || [text]).map(x=>x.trim()).filter(x=>x.length > 28);
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if ((current+' '+sentence).length > 420 && current) { chunks.push(current.trim()); current=''; }
    current += `${current?' ':''}${sentence.slice(0,1000)}`;
  }
  if(current.trim()) chunks.push(current.trim());
  return chunks.length ? chunks : [text.slice(0,500)];
}
export function retrieve(question: string, sources: ResearchSource[], max=5): Evidence[] {
  const qTerms = terms(question);
  const ranked = sources.flatMap(source => chunkSource(source.body).map((quote,index)=>{
    const q = quote.toLowerCase();
    const matches = qTerms.filter(t=>q.includes(t));
    return { sourceId: source.id, title: source.title, quote, score: matches.length*10 + (qTerms.length && matches.length === qTerms.length ? 8 : 0) - index*.03 };
  })).sort((a,b)=>b.score-a.score);
  const dedup = new Set<string>();
  return ranked.filter(e=>{ const id=`${e.sourceId}:${e.quote.slice(0,100)}`; if(dedup.has(id)) return false; dedup.add(id); return true; }).slice(0,max);
}
