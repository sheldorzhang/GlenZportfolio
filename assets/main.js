(function(){
var $=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var closingScreen=document.querySelector('.home-gradient');
if(closingScreen&&'IntersectionObserver' in window){
 var closingObserver=new IntersectionObserver(function(entries){
  document.body.classList.toggle('is-home-gradient-visible',entries[0].intersectionRatio>=.9);
 },{threshold:[0,.9,1]});
 closingObserver.observe(closingScreen);
}
var reveal=$('main.wrap>.hero, main.wrap .work>.view-bar, main.wrap .work>.reel, main.wrap>.cv, main.wrap>.closing, .case-main>*');
if(reveal.length&&'IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
 var observer=new IntersectionObserver(function(entries){
  var visible=entries.filter(function(entry){return entry.isIntersecting}).sort(function(a,b){return a.boundingClientRect.top-b.boundingClientRect.top});
  visible.forEach(function(entry,index){
   entry.target.style.setProperty('--reveal-delay',Math.min(index,3)*60+'ms');
   entry.target.classList.add('is-revealed');
   observer.unobserve(entry.target);
  });
 },{threshold:0,rootMargin:'0px 0px -24px 0px'});
 reveal.forEach(function(el){el.classList.add('reveal-pending');observer.observe(el)});
}
// 首页合并导航：头像进度环 + 当前区块标签 + 区块列表
var gn=document.getElementById('nav');
if(gn&&gn.dataset.mode==='home'){
 // v5c：首页 = 回到顶部 + 进度环，无面板（详情页面板逻辑在 detail.js）
 var ring=gn.querySelector('.nav-btn');
 var gupd=function(){var max=document.documentElement.scrollHeight-innerHeight;ring.style.setProperty('--nav-progress',max>0?Math.min(100,scrollY/max*100):0)};
 addEventListener('scroll',gupd,{passive:true});gupd();
 ring.addEventListener('click',function(){scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})});
 // v6：首屏头像可见时隐藏左上按钮；头像离开视口后淡入（IntersectionObserver）
 var heroAv=document.querySelector('.hero .avatar');
 var setNav=function(show){gn.classList.toggle('is-hidden',!show);if(show){gn.removeAttribute('aria-hidden');ring.removeAttribute('tabindex')}else{gn.setAttribute('aria-hidden','true');ring.setAttribute('tabindex','-1');if(document.activeElement===ring)ring.blur()}};
 if(heroAv&&'IntersectionObserver' in window){setNav(false);new IntersectionObserver(function(es){setNav(!es[0].isIntersecting)},{threshold:0}).observe(heroAv)}
}
// lightbox (groups via data-group)
var lb=document.createElement('div');lb.id='lb';lb.setAttribute('role','dialog');lb.setAttribute('aria-modal','true');lb.setAttribute('aria-label','图片放大查看');lb.innerHTML='<div class="lb-panel"><img alt=""><button class="icon-btn btn-close lb-close" aria-label="缩小图片（Esc）" title="缩小图片"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h5V3M21 8h-5V3M3 16h5v5M21 16h-5v5"/></svg></button></div><button class="icon-btn lb-arrow lb-prev" aria-label="上一张"><svg class="icon" aria-hidden="true"><use href="#i-arrow-left"/></svg></button><button class="icon-btn lb-arrow lb-next" aria-label="下一张"><svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg></button><div class="lb-count"></div>';document.body.appendChild(lb);
var im=lb.querySelector('img'),cnt=lb.querySelector('.lb-count'),list=[],i=0;
function frameEl(){return lb.querySelector('iframe.lb-frame')}
function show(arr,k){
 list=arr;i=(k+list.length)%list.length;
 var src=list[i]||'',frame=frameEl();
 if(src.indexOf('frame:')===0){
  im.style.display='none';
  if(!frame){frame=document.createElement('iframe');frame.className='lb-frame';frame.title='示意图大图';lb.querySelector('.lb-panel').insertBefore(frame,im)}
  var ratio=(zs[i]&&zs[i].getAttribute('data-zoom-ratio'))||'16/9',parts=ratio.split('/'),rw=+parts[0]||16,rh=+parts[1]||9;
  var inset=innerWidth<=767?12:24;
  var w=Math.min(1440,innerWidth-2*inset-2,(innerHeight-2*inset-2)*rw/rh);
  frame.style.display='block';
  frame.style.width=Math.round(w)+'px';
  frame.style.height=Math.round(w*rh/rw)+'px';
  frame.style.aspectRatio='auto';
  if(frame.getAttribute('src')!==src.slice(6))frame.src=src.slice(6);
 }else{
  if(frame){frame.style.display='none';frame.removeAttribute('src');frame.style.width='';frame.style.height=''}
  im.style.display='';
  im.src=src;
 }
 lb.classList.remove('zoom');cnt.textContent=(i+1)+' / '+list.length;lb.classList.add('on');document.body.style.overflow='hidden'
}
function close(){lb.classList.remove('on');document.body.style.overflow='';var frame=frameEl();if(frame){frame.style.display='none';frame.removeAttribute('src')}}
var zs=$('img[data-zoom], [data-zoom-src]'),srcs=zs.map(function(z){return z.getAttribute('data-zoom-src')||z.getAttribute('src')});
function openZoom(z){var k=zs.indexOf(z);if(k>-1)show(srcs,k)}
/* Use one document-level handler so zoom remains available inside draggable galleries. */
zs.forEach(function(z){
 z.setAttribute('tabindex','0');
 z.setAttribute('role','button');
 if(!z.getAttribute('aria-label'))z.setAttribute('aria-label','放大查看图片：'+(z.getAttribute('alt')||'示意图'));
});
document.addEventListener('click',function(e){
 var z=e.target.closest&&e.target.closest('img[data-zoom], [data-zoom-src]');
 if(z&&zs.indexOf(z)>-1)openZoom(z);
},true);
document.addEventListener('keydown',function(e){
 if(e.key!=='Enter'&&e.key!==' ')return;
 var z=e.target.closest&&e.target.closest('img[data-zoom], [data-zoom-src]');
 if(!z||zs.indexOf(z)<0)return;
 e.preventDefault();openZoom(z);
});
lb.addEventListener('click',function(e){if(e.target===im)return;if(e.target.closest('.lb-prev'))return show(list,i-1);if(e.target.closest('.lb-next'))return show(list,i+1);close()});
var sx=null,sy=0;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX;sy=e.touches[0].clientY},{passive:true});
lb.addEventListener('touchmove',function(e){if(sx!==null)e.preventDefault()},{passive:false});
lb.addEventListener('touchend',function(e){if(sx===null)return;var dx=e.changedTouches[0].clientX-sx,dy=e.changedTouches[0].clientY-sy;sx=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)){e.preventDefault();show(list,i+(dx<0?1:-1))}else if(dy>90){e.preventDefault();close()}});
window.__lb={show:function(k){show(srcs,k)},next:function(){show(list,i+1)},close:close};
document.addEventListener('keydown',function(e){if(!lb.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowRight')show(list,i+1);if(e.key==='ArrowLeft')show(list,i-1)});
})();

/* v5b · 近期作品：视图切换 + 横向拖拽；底部 dock：高亮 + 拖动 */
(function(){var rw=document.querySelector('.work');if(!rw)return;var sw=rw.querySelector('.view-switch'),menu=rw.querySelector('.view-menu'),cur=rw.querySelector('.view-cur');if(!sw||!menu||!cur)return;
function setV(v){rw.dataset.view=v;menu.querySelectorAll('button').forEach(function(b){b.setAttribute('aria-checked',b.dataset.v===v)});cur.textContent=v==='list'?'列表':'网格';try{localStorage.setItem('rwView',v)}catch(e){}}
try{var sv=localStorage.getItem('rwView');if(sv)setV(sv)}catch(e){}
function close(){menu.hidden=true;sw.setAttribute('aria-expanded','false')}
sw.addEventListener('click',function(e){e.stopPropagation();var o=menu.hidden;menu.hidden=!o;sw.setAttribute('aria-expanded',o)});
menu.addEventListener('click',function(e){var b=e.target.closest('button');if(b){setV(b.dataset.v);close()}});
document.addEventListener('click',function(e){if(!rw.querySelector('.view-bar').contains(e.target))close()});document.addEventListener('keydown',function(e){if(e.key==='Escape')close()});
})();
(function(){var d=document.getElementById('dock');if(!d)return;var ls=[].slice.call(d.querySelectorAll(':scope>a[data-t],.dock-work>a'));
var lock=null,lT=0;function upd(){if(lock){ls.forEach(function(a){a.classList.toggle('on',a===lock)});return}var y=innerHeight*.4,c=null;ls.forEach(function(a){var el=document.getElementById(a.dataset.t);if(el&&el.getBoundingClientRect().top<y)c=a});if(scrollY>40&&innerHeight+scrollY>=document.documentElement.scrollHeight-4)c=ls[ls.length-1];ls.forEach(function(a){a.classList.toggle('on',a===c);a.toggleAttribute('aria-current',a===c)})}
ls.forEach(function(a){if(a.dataset.t==='cases')return;a.addEventListener('click',function(){lock=a;upd();clearTimeout(lT);lT=setTimeout(function(){lock=null;upd()},1800)})});
/* v5.12：dock 常显，仅加载时淡入一次 */ function vis(){d.classList.add('in')}requestAnimationFrame(function(){requestAnimationFrame(vis)});
addEventListener('scroll',upd,{passive:true});upd();
var w=d.querySelector('.dock-work>a'),m=document.getElementById('dock-menu');function sh(o){m.hidden=!o;w.setAttribute('aria-expanded',o)}
w.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();sh(m.hidden)});
m.addEventListener('click',function(e){if(e.target.closest('a'))sh(false)});
document.addEventListener('click',function(e){if(!m.contains(e.target))sh(false)});vis();document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!m.hidden){sh(false);w.focus()}});})();

/* glen logo：眼珠跟指针；指针进入左侧导航（窄屏为顶栏）时改为往上看 */
(function(){
var CS=getComputedStyle(document.documentElement);function ix(n,d){var v=parseFloat(CS.getPropertyValue(n));return isNaN(v)?d:v}
var rainbow=(CS.getPropertyValue('--glen-spell-palette').trim()||'#e53935,#f57c00,#c9a227,#43a047,#1e88e5,#3949ab,#8e24aa').split(/\s*,\s*/);
var NEAR=ix('--ix-glen-near',28),NEAR_R=ix('--ix-glen-near-ratio',.55),WAVE_DUR=ix('--ix-glen-wave-dur',620),WAVE_DEG=ix('--ix-glen-wave-deg',18),WAVE_PEAK=ix('--ix-glen-wave-peak',.4),EYE_LERP=ix('--ix-glen-eye-lerp',.18),EYE_RANGE=ix('--ix-glen-eye-range',.65),TAG_SHIMMER_START=ix('--hero-tag-shimmer-start',750),TAG_SHIMMER_DURATION=ix('--hero-tag-shimmer-duration',3000);
var marks=[].slice.call(document.querySelectorAll('.glen'));
if(!marks.length||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var eyes=marks.map(function(svg){return{svg:svg,g:svg.querySelector('.glen-eyes'),x:0,y:0}});
var wands=marks.map(function(svg){return{svg:svg,g:svg.querySelector('.glen-wand'),armed:true,playing:false}});
function shown(svg){var nav=svg.closest('#nav');if(nav&&nav.classList.contains('is-hidden'))return false;var r=svg.getBoundingClientRect();return r.width>1&&r.bottom>0&&r.top<innerHeight}
function closeTo(svg){if(px==null||!shown(svg))return false;var r=svg.getBoundingClientRect(),pad=Math.max(NEAR,r.width*NEAR_R),cx=Math.min(Math.max(px,r.left),r.right),cy=Math.min(Math.max(py,r.top),r.bottom);return Math.hypot(px-cx,py-cy)<pad}
function spellEl(svg){return svg.parentElement&&svg.parentElement.querySelector('.glen-spell')}
function showSpell(svg){var spell=spellEl(svg);if(!spell)return;var ang=Math.random()*Math.PI*2;if(ang>Math.PI*.12&&ang<Math.PI*.88)ang+=Math.PI;var home=svg.parentElement.getBoundingClientRect(),box=svg.getBoundingClientRect(),rx=box.width*.62,ry=box.height*.58;spell.style.left=(box.left-home.left+box.width/2+Math.cos(ang)*rx)+'px';spell.style.top=(box.top-home.top+box.height/2+Math.sin(ang)*ry)+'px';spell.style.color=rainbow[Math.random()*rainbow.length|0];spell.classList.add('on')}
function hideSpell(svg){var spell=spellEl(svg);if(spell)spell.classList.remove('on')}
function playWave(w,automatic,amplitude){if(!w.g||w.playing||(!automatic&&!w.armed))return;w.armed=false;w.playing=true;if(w.svg.classList.contains('avatar')&&!automatic)showSpell(w.svg);var t0=performance.now(),dur=WAVE_DUR,degMax=amplitude||WAVE_DEG;function step(now){var t=Math.min(1,(now-t0)/dur),deg;if(t<WAVE_PEAK){var u=t/WAVE_PEAK;deg=degMax*(1-Math.pow(1-u,3))}else{var u=(t-WAVE_PEAK)/(1-WAVE_PEAK);deg=degMax*(1-u*u)}w.g.setAttribute('transform','rotate('+deg.toFixed(2)+' 98.5 96)');if(t<1)requestAnimationFrame(step);else{w.g.removeAttribute('transform');w.playing=false;wandTick()}}requestAnimationFrame(step)}
function wandTick(){wands.forEach(function(w){if(closeTo(w.svg))playWave(w);else{w.armed=true;if(w.svg.classList.contains('avatar'))hideSpell(w.svg)}})}
var heroWand=wands.find(function(w){return w.svg.classList.contains('avatar')&&w.g});if(heroWand){setTimeout(function(){function shimmerWave(){heroWand.armed=true;playWave(heroWand,true,8)}shimmerWave();setInterval(shimmerWave,TAG_SHIMMER_DURATION)},TAG_SHIMMER_START)}
var px=null,py=null,raf=0,HOLE_DX=ix('--ix-glen-eye-dx',8.5),HOLE_DY=ix('--ix-glen-eye-dy',.2),MAX=ix('--ix-glen-eye-max',8.2);
function inSidebar(x,y){var el=document.elementFromPoint(x,y);return !!(el&&el.closest&&el.closest('#dock'))}
function aim(svg){
 if(px==null)return{x:0,y:0};
 if(inSidebar(px,py))return{x:HOLE_DX,y:HOLE_DY-MAX};
 var r=svg.getBoundingClientRect();if(!r.width)return{x:0,y:0};
 var dx=px-(r.left+r.width/2),dy=py-(r.top+r.height/2),dist=Math.hypot(dx,dy);
 if(dist<1)return{x:0,y:0};
 var mag=MAX*Math.min(1,dist/(r.width*EYE_RANGE)),ang=Math.atan2(dy,dx);
 return{x:HOLE_DX+Math.cos(ang)*mag,y:HOLE_DY+Math.sin(ang)*mag};
}
function frame(){
 var moving=false;
 eyes.forEach(function(e){
  var t=aim(e.svg);e.x+=(t.x-e.x)*EYE_LERP;e.y+=(t.y-e.y)*EYE_LERP;
  if(Math.abs(t.x-e.x)>0.04||Math.abs(t.y-e.y)>0.04)moving=true;
  e.g.setAttribute('transform','translate('+e.x.toFixed(2)+' '+e.y.toFixed(2)+')');
 });
 raf=moving?requestAnimationFrame(frame):0;
}
function kick(){if(!raf)raf=requestAnimationFrame(frame)}
addEventListener('pointermove',function(ev){if(ev.pointerType&&ev.pointerType!=='mouse')return;px=ev.clientX;py=ev.clientY;wandTick();kick()},{passive:true});
document.addEventListener('pointerout',function(ev){if(ev.relatedTarget||(ev.pointerType&&ev.pointerType!=='mouse'))return;px=null;py=null;wandTick();kick()});
})();

/* v5.4 · 简历长列表默认只显示前 2 条要点 */
(function(){[].forEach.call(document.querySelectorAll('.cv .cv-list'),function(l){var li=l.querySelectorAll('li');if(li.length<=2)return;for(var k=2;k<li.length;k++)li[k].classList.add('more');var b=document.createElement('button');b.type='button';b.className='cv-list-toggle';b.setAttribute('aria-expanded','false');var n=li.length-2;b.textContent='展开其余 '+n+' 条 +';b.addEventListener('click',function(){var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o);b.textContent=o?'收起 −':'展开其余 '+n+' 条 +'});l.after(b)})})();
