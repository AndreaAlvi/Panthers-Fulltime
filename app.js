const W=1080,H=1350;
const RED='#AF1828';
const matchCalendar=[
 ['2026-09-27','Excelsior','Panthers 1977'],['2026-10-04','Panthers 1977','Monte Cremasco'],['2026-10-11','Casale Cremasco','Panthers 1977'],['2026-10-18','Panthers 1977','Spinese Oratorio'],['2026-10-25','Panthers 1977','Vailate'],['2026-11-01','Rivoltana','Panthers 1977'],['2026-11-08','Panthers 1977','Doverese'],['2026-11-15','Trescore','Panthers 1977'],['2026-11-22','Panthers 1977','Zelobuonpersico 1974'],['2026-11-29','Castelnuovo','Panthers 1977'],['2026-12-06','Panthers 1977','Ripaltese'],['2026-12-13','Montodinese','Panthers 1977'],['2026-12-20','Panthers 1977','Oratorio Castelleone'],['2027-01-10','Panthers 1977','Iseese'],['2027-01-17','Panthers 1977','Mombrettese'],['2027-01-24','Panthers 1977','Excelsior'],['2027-01-31','Monte Cremasco','Panthers 1977'],['2027-02-07','Panthers 1977','Casale Cremasco'],['2027-02-14','Spinese Oratorio','Panthers 1977'],['2027-02-21','Vailate','Panthers 1977'],['2027-02-28','Panthers 1977','Rivoltana'],['2027-03-07','Doverese','Panthers 1977'],['2027-03-14','Panthers 1977','Trescore'],['2027-03-21','Zelobuonpersico 1974','Panthers 1977'],['2027-04-04','Panthers 1977','Castelnuovo'],['2027-04-11','Ripaltese','Panthers 1977'],['2027-04-18','Panthers 1977','Montodinese'],['2027-04-25','Oratorio Castelleone','Panthers 1977']
].map(([date,home,away])=>({date,home,away}));
const logoFiles={
 'Casale Cremasco':'Casale cremasco.png','Castelnuovo':'Castelnuovo.png','Doverese':'Doverese.png','Excelsior':'Excelsior.png','Iseese':'Issese.png','Mombrettese':'Mombrettese.png','Monte Cremasco':'Monte cremasco.png','Montodinese':'Montodinese.png','Oratorio Castelleone':'Oratorio Castellone.png','Panthers 1977':'Panthers 1977.png','Ripaltese':'Ripaltese.png','Rivoltana':'Rivoltana.png','Spinese Oratorio':'Spinese oratorio.png','Vailate':'Vailate.png','Zelobuonpersico 1974':'ZELOBUONPERSICO 1974.png','Trescore':null
};
const canvas=document.getElementById('preview');
const ctx=canvas.getContext('2d',{alpha:false});
ctx.imageSmoothingEnabled=true;
ctx.imageSmoothingQuality='high';
const photoInput=document.getElementById('photoInput');
const scoreInput=document.getElementById('scoreInput');
const state={
 match:null,photo:null,selected:'photo',overlay:1,
 gradients:{top:false,bottom:false},
 titleVariant:'solid',
 photoTransform:{x:W/2,y:H/2,scale:1},
 title:{x:540,y:270,scale:1},score:{x:540,y:365,scale:1},
 titleBase:190,scoreBase:185,
 logoSize:110,logoY:1210
};
const assets={overlays:[],logos:{},gradients:{}};
function formatDate(s){return new Intl.DateTimeFormat('it-IT',{weekday:'long',day:'2-digit',month:'long',year:'numeric'}).format(new Date(s+'T12:00:00')).toUpperCase()}
function getTargetMatch(){
 const now=new Date();now.setHours(0,0,0,0);
 const today=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 return matchCalendar.find(m=>m.date===today)||matchCalendar.find(m=>m.date>today)||matchCalendar[matchCalendar.length-1];
}
function setMatch(){
 state.match=getTargetMatch();
 document.getElementById('matchDate').textContent=formatDate(state.match.date);
 document.getElementById('homeName').textContent=state.match.home;
 document.getElementById('awayName').textContent=state.match.away;
 const hl=document.getElementById('homeLogo'),al=document.getElementById('awayLogo');
 hl.src=logoFiles[state.match.home]?`assets/logos/${logoFiles[state.match.home]}`:'';
 al.src=logoFiles[state.match.away]?`assets/logos/${logoFiles[state.match.away]}`:'';
}
function loadImage(src){return new Promise(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src})}
async function loadImages(){
 const promises=[];
 for(let i=1;i<=12;i++) promises.push(loadImage(`assets/overlays/${i}.png`).then(im=>assets.overlays[i]=im));
 promises.push(loadImage('assets/SfumaturaSopra.png').then(im=>assets.gradients.top=im));
 promises.push(loadImage('assets/SfumaturaSotto.png').then(im=>assets.gradients.bottom=im));
 for(const [name,file] of Object.entries(logoFiles)) if(file) promises.push(loadImage(`assets/logos/${file}`).then(im=>assets.logos[name]=im));
 await Promise.all(promises);
}
function drawCoverImage(im,t){
 const iw=im.naturalWidth||im.width,ih=im.naturalHeight||im.height;
 const cover=Math.max(W/iw,H/ih)*t.scale;
 const dw=iw*cover,dh=ih*cover;
 ctx.drawImage(im,t.x-dw/2,t.y-dh/2,dw,dh);
}
function drawGradient(which){const im=assets.gradients[which];if(state.gradients[which]&&im)ctx.drawImage(im,0,0,W,H)}
function drawOverlay(){if(state.overlay&&assets.overlays[state.overlay])ctx.drawImage(assets.overlays[state.overlay],0,0,W,H)}
function drawLogo(name,cx){
 const im=assets.logos[name];if(!im)return;
 const size=state.logoSize;const ratio=(im.naturalWidth||im.width)/(im.naturalHeight||im.height);
 let w=size,h=size;if(ratio>1)h=size/ratio;else w=size*ratio;
 ctx.drawImage(im,cx-w/2,state.logoY-h/2,w,h);
}
function drawScoreText(){
 ctx.font=`${state.scoreBase*state.score.scale}px Florilane`;
 ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff';
 ctx.fillText(scoreInput.value||'0 — 0',state.score.x,state.score.y);
}
function drawTitle(){
  ctx.font=`${state.titleBase*state.title.scale}px FUD`;
  ctx.textAlign='center';
  ctx.textBaseline='middle';
  ctx.fillStyle='#fff';
  ctx.strokeStyle='#fff';

  const title='FULLTIME';

  if(state.titleVariant==='solid'){
    ctx.fillText(title,state.title.x,state.title.y);
    return;
  }

  const full=ctx.measureText('FULL').width;
  const time=ctx.measureText('TIME').width;

  // FULL + TIME senza spazio
  const total=full+time;
  const startX=state.title.x-total/2;

  // FULL pieno
  ctx.fillText(
    'FULL',
    startX+full/2,
    state.title.y
  );

  // TIME outline
  const timeX=startX+full+time/2;

  ctx.lineWidth=Math.max(
    1,
    state.titleBase*state.title.scale*0.006
  );

  ctx.strokeText(
    'TIME',
    timeX,
    state.title.y
  );
}
function getTitleMetrics(){
  ctx.save();
  ctx.font=`${state.titleBase*state.title.scale}px FUD`;

  let w,h;

  if(state.titleVariant==='solid'){
    w=ctx.measureText('FULLTIME').width;
  }else{
    w=ctx.measureText('FULL').width+ctx.measureText('TIME').width;
  }

  h=state.titleBase*state.title.scale*1.18;

  ctx.restore();

  return {w,h};
}
function getScoreMetrics(){
 ctx.save();ctx.font=`${state.scoreBase*state.score.scale}px Florilane`;
 const w=ctx.measureText(scoreInput.value||'0 — 0').width;const h=state.scoreBase*state.score.scale*1.1;ctx.restore();return {w,h};
}
function drawSelection(){
 const s=state.selected;ctx.save();ctx.strokeStyle=RED;ctx.lineWidth=5;ctx.setLineDash([10,8]);
 if(s==='photo')ctx.strokeRect(4,4,W-8,H-8);
 if(s==='title'){const m=getTitleMetrics();ctx.strokeRect(state.title.x-m.w/2-12,state.title.y-m.h/2,m.w+24,m.h)}
 if(s==='score'){const m=getScoreMetrics();ctx.strokeRect(state.score.x-m.w/2-12,state.score.y-m.h/2,m.w+24,m.h)}
 ctx.restore();
}
function render(showSelection=true){
 ctx.clearRect(0,0,W,H);ctx.fillStyle='#111';ctx.fillRect(0,0,W,H);
 if(state.photo)drawCoverImage(state.photo,state.photoTransform);else{ctx.fillStyle='#222';ctx.fillRect(0,0,W,H)}
 // readability gradients sit between the photo and the red graphic overlays
 drawGradient('top');drawGradient('bottom');
 drawOverlay();
 // texts and logos are always above the red overlays
 drawTitle();drawScoreText();
 if(state.match){drawLogo(state.match.home,460);drawLogo(state.match.away,620);}
 // separator between the two fixed logos
 ctx.save();ctx.fillStyle='#fff';ctx.font='600 16px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('—',540,state.logoY);ctx.restore();
 if(showSelection)drawSelection();
 document.getElementById('emptyState').style.display=state.photo?'none':'flex';
}
const labels={photo:'FOTO',title:'FULLTIME',score:'RISULTATO'};
function setSelected(layer){
 state.selected=layer;
 document.querySelectorAll('.layer-btn').forEach(b=>b.classList.toggle('active',b.dataset.layer===layer));
 document.getElementById('selectedLabel').textContent=labels[layer];
 document.getElementById('controlHint').textContent=layer==='photo'?'FOTO · frecce = posizione · +/− = zoom':`${labels[layer]} · frecce = posizione · +/− = dimensione`;
 document.getElementById('titleVariants').classList.toggle('visible',layer==='title');
 render();
}
function modify(action){
  const step = 10;
  const zoom = 0.05;

  const o = state.selected === 'photo'
    ? state.photoTransform
    : state[state.selected];

  if(!o)return;

  if(action === 'left')o.x -= step;
  if(action === 'right')o.x += step;
  if(action === 'up')o.y -= step;
  if(action === 'down')o.y += step;

  if(action === 'plus')o.scale += zoom;

  if(action === 'minus'){
    if(state.selected === 'photo'){
      o.scale = Math.max(1,o.scale - zoom);
    }else{
      o.scale = Math.max(0.1,o.scale - zoom);
    }
  }

  // LIMITI FOTO
  if(state.selected === 'photo' && state.photo){
    const iw = state.photo.naturalWidth || state.photo.width;
    const ih = state.photo.naturalHeight || state.photo.height;

    const cover = Math.max(W/iw,H/ih) * o.scale;

    const dw = iw * cover;
    const dh = ih * cover;

    o.x = Math.max(
      W - dw/2,
      Math.min(dw/2,o.x)
    );

    o.y = Math.max(
      H - dh/2,
      Math.min(dh/2,o.y)
    );
  }

  // LIMITI TESTO
  if(state.selected === 'title'){
    const m = getTitleMetrics();

    const halfW = m.w/2;
    const halfH = m.h/2;

    o.x = Math.max(
      halfW,
      Math.min(W-halfW,o.x)
    );

    o.y = Math.max(
      halfH,
      Math.min(H-halfH,o.y)
    );
  }

  if(state.selected === 'score'){
    const m = getScoreMetrics();

    const halfW = m.w/2;
    const halfH = m.h/2;

    o.x = Math.max(
      halfW,
      Math.min(W-halfW,o.x)
    );

    o.y = Math.max(
      halfH,
      Math.min(H-halfH,o.y)
    );
  }

  render();
}
function centerSelected(){
  const o = state.selected === 'photo'
    ? state.photoTransform
    : state[state.selected];

  if(!o)return;

  o.x = W / 2;

  // Mantiene invariata la posizione verticale
  // e applica i limiti laterali
  if(state.selected === 'photo' && state.photo){
    const iw = state.photo.naturalWidth || state.photo.width;
    const ih = state.photo.naturalHeight || state.photo.height;

    const cover = Math.max(W/iw,H/ih) * o.scale;
    const dw = iw * cover;

    o.x = Math.max(
      W - dw/2,
      Math.min(dw/2,o.x)
    );
  }

  render();
}
function populateOverlays(){
 const grid=document.getElementById('overlayGrid');
 for(let i=1;i<=12;i++){
  const b=document.createElement('button');b.className='overlay-btn'+(i===1?' active':'');
  b.innerHTML=`<img src="assets/overlays/${i}.png" alt="Overlay ${i}"><span>${String(i).padStart(2,'0')}</span>`;
  b.addEventListener('click',()=>{state.overlay=i;document.querySelectorAll('.overlay-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');render()});
  grid.appendChild(b);
 }
}
function setGradient(which){
 state.gradients[which]=!state.gradients[which];
 document.getElementById(which==='top'?'gradientTopBtn':'gradientBottomBtn').classList.toggle('active',state.gradients[which]);
 render();
}
function handlePhoto(file){
 if(!file)return;
 const url=URL.createObjectURL(file);const im=new Image();
 im.onload=()=>{state.photo=im;state.photoTransform={x:W/2,y:H/2,scale:1};URL.revokeObjectURL(url);setSelected('photo')};im.src=url;
}
photoInput.addEventListener('change',e=>handlePhoto(e.target.files[0]));
document.querySelectorAll('.layer-btn').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.layer==='photo'&&!state.photo){photoInput.click();return}setSelected(b.dataset.layer)}));
document.querySelectorAll('.control-btn').forEach(button => {
  let holdTimer = null;
  let repeatTimer = null;

  const stopHolding = () => {
    clearTimeout(holdTimer);
    clearInterval(repeatTimer);
    holdTimer = null;
    repeatTimer = null;
  };

  button.addEventListener('pointerdown', () => {
    const action = button.dataset.action;

    // Primo movimento immediato
    modify(action);

    // Dopo 300ms simula tanti click consecutivi
    holdTimer = setTimeout(() => {
      repeatTimer = setInterval(() => {
        modify(action);
      }, 80);
    }, 300);
  });

  button.addEventListener('pointerup', stopHolding);
  button.addEventListener('pointercancel', stopHolding);
  button.addEventListener('pointerleave', stopHolding);

  // Se il dito/mouse esce dal pulsante o viene rilasciato altrove
  window.addEventListener('pointerup', stopHolding);
});
document.getElementById('centerBtn').addEventListener('click',centerSelected);
document.getElementById('gradientTopBtn').addEventListener('click',()=>setGradient('top'));
document.getElementById('gradientBottomBtn').addEventListener('click',()=>setGradient('bottom'));
document.querySelectorAll('.variant-btn').forEach(b=>b.addEventListener('click',()=>{state.titleVariant=b.dataset.titleVariant;document.querySelectorAll('.variant-btn').forEach(x=>x.classList.toggle('active',x===b));render()}));
scoreInput.addEventListener('input',()=>render());
canvas.addEventListener('click',e=>{
 const r=canvas.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;
 const hit=(obj,m)=>x>=obj.x-m.w/2-22&&x<=obj.x+m.w/2+22&&y>=obj.y-m.h/2-22&&y<=obj.y+m.h/2+22;
 if(hit(state.title,getTitleMetrics()))return setSelected('title');
 if(hit(state.score,getScoreMetrics()))return setSelected('score');
 if(state.photo)return setSelected('photo');
});
// iOS/Safari: prevent double-tap page zoom and gesture zoom while keeping normal taps/buttons working.
document.addEventListener('dblclick',e=>e.preventDefault(),{passive:false});
document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
document.addEventListener('gesturechange',e=>e.preventDefault(),{passive:false});
document.addEventListener('gestureend',e=>e.preventDefault(),{passive:false});
let lastTouchEnd=0;document.addEventListener('touchend',e=>{const now=Date.now();if(now-lastTouchEnd<=280)e.preventDefault();lastTouchEnd=now},{passive:false});
document.getElementById('resetBtn').addEventListener('click',()=>{
 state.photo=null;state.overlay=1;state.gradients={top:false,bottom:false};state.titleVariant='solid';
 state.photoTransform={x:W/2,y:H/2,scale:1};state.title={x:540,y:270,scale:1};state.score={x:540,y:365,scale:1};scoreInput.value='0 — 0';
 document.querySelectorAll('.overlay-btn').forEach((b,i)=>b.classList.toggle('active',i===0));
 document.getElementById('gradientTopBtn').classList.remove('active');document.getElementById('gradientBottomBtn').classList.remove('active');
 document.querySelectorAll('.variant-btn').forEach((b,i)=>b.classList.toggle('active',i===0));
 setSelected('photo');render();
});
document.getElementById('exportBtn').addEventListener('click',()=>{
 render(false);canvas.toBlob(async blob=>{
  const fileName=`Panthers_Fulltime_${state.match?.date||'export'}.png`;
  try{
   const file=new File([blob],fileName,{type:'image/png'});
   if(navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:'Panthers Fulltime'});render(true);return}
  }catch(err){if(err?.name==='AbortError'){render(true);return}}
  const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fileName;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);render(true);
 },'image/png');
});
const dialog=document.getElementById('infoDialog');
if(dialog){
  const infoBtn=document.getElementById('infoBtn');
  const closeInfo=document.getElementById('closeInfo');

  if(infoBtn) infoBtn.addEventListener('click',()=>dialog.showModal());
  if(closeInfo) closeInfo.addEventListener('click',()=>dialog.close());
}
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js'));
(async()=>{setMatch();populateOverlays();await loadImages();render()})();
