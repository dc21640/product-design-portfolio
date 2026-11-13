import type { MuseBoard, Visual } from './creative-data';

/** Create a standalone, high-resolution PNG of the composed board.
 * Images are either bundled same-origin assets or local data URLs. No network upload.
 */
function wrap(ctx:CanvasRenderingContext2D,text:string,x:number,y:number,maxWidth:number,lineHeight:number,maxLines:number){
 const words=text.split(/\s+/);let line='';let lines=0;
 for(const word of words){const next=line?`${line} ${word}`:word;
  if(ctx.measureText(next).width>maxWidth&&line){ctx.fillText(line,x,y);lines++;if(lines>=maxLines)return;y+=lineHeight;line=word;}
  else line=next;
 }
 if(line&&lines<maxLines)ctx.fillText(line,x,y);
}
async function loadImage(src:string):Promise<HTMLImageElement>{
 return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(new Error('Image failed to load'));img.src=src;});
}
function drawCover(ctx:CanvasRenderingContext2D,img:HTMLImageElement,x:number,y:number,w:number,h:number){
 const aspect=Math.max(w/img.naturalWidth,h/img.naturalHeight);
 const sw=w/aspect,sh=h/aspect;
 ctx.drawImage(img,(img.naturalWidth-sw)/2,(img.naturalHeight-sh)/2,sw,sh,x,y,w,h);
}
export async function makeBoardPng(board:MuseBoard,visuals:Visual[]):Promise<Blob>{
 const canvas=document.createElement('canvas');const ratio=2;
 canvas.width=1010*ratio;canvas.height=755*ratio;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas export is not available in this browser.');
 ctx.scale(ratio,ratio);ctx.fillStyle='#f5f0e9';ctx.fillRect(0,0,1010,755);
 ctx.fillStyle='#d3c7ba';for(let y=11;y<755;y+=22){for(let x=11;x<1010;x+=22)ctx.fillRect(x,y,1,1);}
 const imageById=new Map(visuals.map(v=>[v.id,v]));
 for(const item of board.items){
  const x=item.x,y=item.y;
  ctx.save();ctx.shadowColor='#5a422031';ctx.shadowBlur=15;ctx.shadowOffsetY=8;
  if(item.kind==='visual'){
   ctx.fillStyle='#fffdf9';ctx.fillRect(x,y,201,225);ctx.restore();
   const visual=imageById.get(item.visualId);
   ctx.save();ctx.beginPath();ctx.rect(x+9,y+9,183,188);ctx.clip();
   if(visual){try{const image=await loadImage(visual.src);drawCover(ctx,image,x+9,y+9,183,188);}catch{ctx.fillStyle='#d9d6cb';ctx.fillRect(x+9,y+9,183,188);}}
   ctx.restore();ctx.fillStyle='#4e4034';ctx.font='bold 12px Arial, sans-serif';
   wrap(ctx,visual?.title??'Unavailable image',x+9,y+214,182,14,1);
  } else {
   ctx.fillStyle=({yellow:'#fff2b9',pink:'#fbd8cf',blue:'#dbecf0'} as const)[item.color];ctx.fillRect(x,y,214,180);ctx.restore();
   ctx.fillStyle='#68513f';ctx.font='bold 10px Arial, sans-serif';ctx.fillText('A THOUGHT / MUSE',x+18,y+30);
   ctx.fillStyle='#3f352c';ctx.font='18px Georgia, serif';wrap(ctx,item.text,x+18,y+66,180,24,4);
  }
 }
 return new Promise<Blob>((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not encode the board as PNG.')),'image/png'));
}
