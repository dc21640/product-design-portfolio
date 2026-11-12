export type Visual = {
  id: string;
  title: string;
  src: string;
  category: 'Photography' | 'Typography' | 'Textures' | 'Form';
  tags: string[];
  origin: 'sample' | 'upload';
  credit: string;
};

// Every visual is bundled for a dependable demo. A mixture of authored art and
// openly distributed scientific sample media; attribution appears in README/UI.
export const seedVisuals: Visual[] = [
  { id:'poster-01', title:'Studies in motion', src:'/demo-media/poster-01.jpg', category:'Typography', tags:['shape','green','editorial'], origin:'sample', credit:'Original composition for this prototype' },
  { id:'photo-coffee', title:'The morning ritual', src:'/demo-media/photo-coffee.jpg', category:'Photography', tags:['warm','ritual','still life'], origin:'sample', credit:'scikit-image sample photograph' },
  { id:'poster-02', title:'After light', src:'/demo-media/poster-02.jpg', category:'Typography', tags:['coral','rhythm','type'], origin:'sample', credit:'Original composition for this prototype' },
  { id:'photo-astronaut', title:'Portrait in color', src:'/demo-media/photo-astronaut.jpg', category:'Photography', tags:['portrait','space','color'], origin:'sample', credit:'NASA / scikit-image sample photograph' },
  { id:'poster-03', title:'Still / here', src:'/demo-media/poster-03.jpg', category:'Form', tags:['blue','lines','geometry'], origin:'sample', credit:'Original composition for this prototype' },
  { id:'photo-brick', title:'The surface of things', src:'/demo-media/photo-brick.jpg', category:'Textures', tags:['material','pattern','neutral'], origin:'sample', credit:'scikit-image sample texture' },
  { id:'poster-04', title:'Imperfect systems', src:'/demo-media/poster-04.jpg', category:'Form', tags:['lavender','geometry','pattern'], origin:'sample', credit:'Original composition for this prototype' },
  { id:'photo-cat', title:'Soft company', src:'/demo-media/photo-cat.jpg', category:'Photography', tags:['portrait','warm','animal'], origin:'sample', credit:'scikit-image sample photograph' },
  { id:'poster-05', title:'Matter & meaning', src:'/demo-media/poster-05.jpg', category:'Typography', tags:['olive','type','composition'], origin:'sample', credit:'Original composition for this prototype' },
  { id:'photo-rocket', title:'Above the atmosphere', src:'/demo-media/photo-rocket.jpg', category:'Photography', tags:['space','blue','technology'], origin:'sample', credit:'NASA / scikit-image sample photograph' },
  { id:'poster-06', title:'Perspective', src:'/demo-media/poster-06.jpg', category:'Form', tags:['coral','circles','study'], origin:'sample', credit:'Original composition for this prototype' },
  { id:'photo-grass', title:'Field texture', src:'/demo-media/photo-grass.jpg', category:'Textures', tags:['green','organic','texture'], origin:'sample', credit:'scikit-image sample texture' },
  { id:'photo-hubble', title:'A field of stars', src:'/demo-media/photo-hubble.jpg', category:'Photography', tags:['cosmos','dark','scale'], origin:'sample', credit:'NASA / scikit-image sample photograph' },
  { id:'photo-camera', title:'Seeing in monochrome', src:'/demo-media/photo-camera.jpg', category:'Photography', tags:['black and white','photography','analog'], origin:'sample', credit:'scikit-image sample photograph' },
  { id:'photo-color', title:'Color theory', src:'/demo-media/photo-color.jpg', category:'Form', tags:['color','spectrum','reference'], origin:'sample', credit:'scikit-image sample illustration' },
];

export type BoardItem =
  | {id:string; kind:'visual'; visualId:string; x:number; y:number}
  | {id:string; kind:'note'; text:string; color:'yellow'|'pink'|'blue'; x:number; y:number};
export type MuseBoard = {id:string; name:string; description:string; items:BoardItem[]; createdAt:number};
export const seedBoards: MuseBoard[] = [
  {id:'board-textures', name:'Quiet structures', description:'Material, negative space and considered form.', createdAt:Date.UTC(2026,9,14),items:[
    {id:'i-01',kind:'visual',visualId:'photo-brick',x:50,y:75},
    {id:'i-02',kind:'visual',visualId:'poster-05',x:325,y:70},
    {id:'i-03',kind:'visual',visualId:'photo-grass',x:620,y:96},
    {id:'i-04',kind:'note',text:'What if the interface felt more like a well-loved book than a dashboard?',color:'yellow',x:365,y:396},
    {id:'i-05',kind:'visual',visualId:'poster-03',x:98,y:396},
  ]},
  {id:'board-light', name:'Light & perspective', description:'Color, imagery and moments worth keeping.', createdAt:Date.UTC(2026,9,27),items:[
    {id:'i-06',kind:'visual',visualId:'photo-coffee',x:58,y:68},
    {id:'i-07',kind:'visual',visualId:'poster-02',x:333,y:106},
    {id:'i-08',kind:'visual',visualId:'photo-astronaut',x:622,y:50},
    {id:'i-09',kind:'note',text:'Warmth without clutter. Make the image the hero.',color:'pink',x:319,y:418},
  ]}
];

export type ReviewState = 'pending'|'approved'|'revisions';
export type Photo = {
  id:string; name:string; src:string; source:'demo'|'upload';
  rating:number; picked:boolean; review:ReviewState;
  caption:string; comment:string;
};
export const seedPhotos:Photo[] = [
  {id:'e01',name:'frame_001.jpg',src:'/demo-media/photo-astronaut.jpg',source:'demo',rating:5,picked:true,review:'approved',caption:'A portrait in movement',comment:'Strong expression and color.'},
  {id:'e02',name:'frame_002.jpg',src:'/demo-media/photo-coffee.jpg',source:'demo',rating:4,picked:true,review:'pending',caption:'Morning coffee',comment:''},
  {id:'e03',name:'frame_003.jpg',src:'/demo-media/photo-rocket.jpg',source:'demo',rating:3,picked:false,review:'pending',caption:'Looking upward',comment:''},
  {id:'e04',name:'frame_004.jpg',src:'/demo-media/photo-cat.jpg',source:'demo',rating:0,picked:false,review:'pending',caption:'The quiet moment',comment:''},
  {id:'e05',name:'frame_005.jpg',src:'/demo-media/photo-hubble.jpg',source:'demo',rating:5,picked:true,review:'pending',caption:'A sky full of stories',comment:''},
  {id:'e06',name:'frame_006.jpg',src:'/demo-media/photo-camera.jpg',source:'demo',rating:2,picked:false,review:'revisions',caption:'Behind the lens',comment:'Consider another crop.'},
  {id:'e07',name:'frame_007.jpg',src:'/demo-media/photo-grass.jpg',source:'demo',rating:0,picked:false,review:'pending',caption:'Surface study',comment:''},
  {id:'e08',name:'frame_008.jpg',src:'/demo-media/photo-brick.jpg',source:'demo',rating:3,picked:false,review:'pending',caption:'Urban texture',comment:''},
  {id:'e09',name:'frame_009.jpg',src:'/demo-media/photo-color.jpg',source:'demo',rating:4,picked:true,review:'approved',caption:'Color in motion',comment:''},
];
