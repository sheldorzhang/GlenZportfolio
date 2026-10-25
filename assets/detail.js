/* detail.js — 统一详情模板：默认平铺叙事（进度胶囊 + 章节菜单 + 前后对比）+ 幻灯片模式（全屏逐页 / 键盘 / 滑动 / 缩略图条 / 网格总览） */
(function(){
var $=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var pill=document.getElementById('nav');if(!pill)return;
var nameEl=pill.querySelector('.nav-name'),pctEl=pill.querySelector('.nav-pct'),ring=pill.querySelector('.nav-btn'),menu=pill.querySelector('.nav-panel'),list=pill.querySelector('.nav-menu'),gbtn=pill.querySelector('.nav-btn'),modeBtn=pill.querySelector('.nav-mode');
var chaps=$('.chap[data-chapter]').map(function(s){return {id:s.id,name:s.getAttribute('data-nav')||s.querySelector('h2').textContent,el:s,figs:$('.fig',s)}});
var figs=$('.chap .fig');
var slideFigs=figs.filter(function(f){return !!f.querySelector('img')});
var toc=document.querySelector('.toc-list');var tocHTML=chaps.map(function(c,k){return '<a href="#'+c.id+'" data-k="'+k+'"><span>'+String(k+1).padStart(2,'0')+'</span>'+c.name+'</a>'}).join('');if(toc)toc.innerHTML=tocHTML;
list.innerHTML=chaps.map(function(c,k){return '<a data-k="'+k+'"><span>'+String(k+1).padStart(2,'0')+'</span>'+c.name+'</a>'}).join('');
var mode='scroll',cur=0;
function chapOfFig(i){return chaps.filter(function(c){return c.figs.indexOf(figs[i])>-1})[0]}
function setPill(c,pct){gbtn.setAttribute('aria-label',(document.body.classList.contains('c1')||document.body.classList.contains('direct-back'))?'返回首页':'打开导航 · 当前：'+(c?c.name:'概览')+' '+Math.round(pct)+'%');nameEl.textContent=c?c.name:'概览';pctEl.textContent=Math.round(pct)+'%';ring.style.setProperty('--nav-progress',pct);$('a',list).concat($('.toc-list a')).forEach(function(a){a.classList.toggle('on',!!c&&chaps[a.dataset.k]===c)})}
/* ---- scroll mode ---- */
var lock=null,lockT=0;
function current(){var y=innerHeight*.35,c=null;chaps.forEach(function(ch){if(ch.el.getBoundingClientRect().top<y)c=ch});var max=document.documentElement.scrollHeight-innerHeight;if(max>0&&scrollY>=max-4)c=chaps[chaps.length-1];return c}
function render(){if(mode!=='scroll')return;var max=document.documentElement.scrollHeight-innerHeight,pct=max>0?Math.min(100,scrollY/max*100):0;setPill(lock||current(),pct)}
function settle(){if(!lock)return;var h=lock.el.querySelector('h2'),off=h.getBoundingClientRect().top-parseFloat(getComputedStyle(h).scrollMarginTop||0);if(Math.abs(off)>4&&scrollY<document.documentElement.scrollHeight-innerHeight-4)window.scrollBy({top:off,behavior:'instant'});lock=null;render()}
addEventListener('scroll',function(){render();if(lock){clearTimeout(lockT);lockT=setTimeout(settle,160)}},{passive:true});addEventListener('resize',render);
function jump(k){var c=chaps[k];if(!c)return;if(mode==='slides'){var hit=c.figs.map(function(f){return slideFigs.indexOf(f)}).filter(function(i){return i>-1})[0];if(hit>-1)return go(hit);return}lock=c;render();c.el.querySelector('h2').scrollIntoView({behavior:'smooth'});clearTimeout(lockT);lockT=setTimeout(settle,1500)}
/* ---- slides mode: overlay built from the same figures ---- */
var ov=document.createElement('div');ov.className='slides';ov.setAttribute('aria-label','幻灯片模式');
ov.innerHTML='<div class="slides-bar"><i></i></div><button class="icon-btn btn-close slides-tool slides-close" aria-label="关闭幻灯片（Esc）"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button><button class="icon-btn slides-tool slides-fillbtn" type="button" aria-pressed="false" aria-label="页内全屏"><svg class="icon i-off" aria-hidden="true" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg><svg class="icon i-on" aria-hidden="true" viewBox="0 0 24 24"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg></button><button class="icon-btn slides-tool slides-gridbtn" aria-label="总目录（G）"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/></svg></button><div class="slides-stage"></div><button class="icon-btn slides-nav slides-prev" aria-label="上一页"><svg class="icon" aria-hidden="true"><use href="#i-arrow-left"/></svg></button><button class="icon-btn slides-nav slides-next" aria-label="下一页"><svg class="icon" aria-hidden="true"><use href="#i-arrow-right"/></svg></button><div class="slides-bottom"><div class="slides-meta"><span class="slides-title"></span><span class="slides-help">← → 翻页 · Esc 退出</span><span class="slides-count"></span></div><div class="slides-strip"></div></div><div class="slides-grid"></div>';
document.body.appendChild(ov);
var stage=ov.querySelector('.slides-stage'),strip=ov.querySelector('.slides-strip'),grid=ov.querySelector('.slides-grid'),bar=ov.querySelector('.slides-bar i'),cnt=ov.querySelector('.slides-count'),pv=ov.querySelector('.slides-prev'),nx=ov.querySelector('.slides-next');
ov.querySelector('.slides-title').textContent=(document.querySelector('h1')||{}).textContent||'';
var srcOf=function(f){var img=f.querySelector('img');return img?img.getAttribute('src'):''};
stage.innerHTML=slideFigs.map(function(f){return '<figure class="slides-slide"><img loading="lazy" width="1920" height="1080" src="'+srcOf(f)+'" alt=""></figure>'}).join('');
var slides=$('.slides-slide',stage),n=slides.length;
var th=function(i){return '<button data-i="'+i+'" aria-label="第 '+(i+1)+' 页"><img loading="lazy" src="'+srcOf(slideFigs[i])+'" alt=""><span>'+(i+1)+'</span></button>'};
strip.innerHTML=slideFigs.map(function(_,i){return th(i)}).join('');
grid.innerHTML='<div class="g">'+chaps.map(function(c,k){var first=c.figs.map(function(f){return slideFigs.indexOf(f)}).filter(function(i){return i>-1})[0];if(first==null)return '';return '<button data-i="'+first+'" data-k="'+k+'"><span>'+String(k+1).padStart(2,'0')+'</span><b>'+c.name+'</b></button>'}).join('')+'</div>';
function chapOfSlide(i){var f=slideFigs[i];return chaps.filter(function(c){return c.figs.indexOf(f)>-1})[0]}
function go(k){if(!n)return;cur=Math.max(0,Math.min(n-1,k));slides.forEach(function(s,i){s.classList.toggle('cur',i===cur);if(Math.abs(i-cur)<=1)s.querySelector('img').loading='eager'});
 var p=(cur+1)/n*100;bar.style.width=p+'%';cnt.textContent=(cur+1)+' / '+n;setPill(chapOfSlide(cur),p);
 var chap=chapOfSlide(cur);$('button',strip).forEach(function(b){b.classList.toggle('on',+b.dataset.i===cur)});$('button',grid).forEach(function(b){b.classList.toggle('on',!!chap&&chaps[b.dataset.k]===chap)});
 var sb=strip.querySelector('[data-i="'+cur+'"]');if(sb){var column=getComputedStyle(strip).flexDirection==='column';if(column)strip.scrollTop=sb.offsetTop-strip.clientHeight/2+sb.offsetHeight/2;else strip.scrollLeft=sb.offsetLeft-strip.clientWidth/2+sb.offsetWidth/2}var menuOn=grid.querySelector('.on');if(menuOn)grid.scrollTop=menuOn.offsetTop-grid.clientHeight/2+menuOn.offsetHeight/2;pv.disabled=cur===0;nx.disabled=cur===n-1;
 history.replaceState(null,'','#p'+(cur+1))}
function openGrid(on){grid.classList.toggle('on',on);if(on){var b=grid.querySelector('.on');b&&b.scrollIntoView({block:'center'})}}
function setMode(m,start){if(m===mode)return;
 if(m==='slides'){if(!n)return;var y=innerHeight*.5,k=0;slideFigs.forEach(function(f,i){if(f.getBoundingClientRect().top<y)k=i});mode='slides';document.body.classList.add('ss');ov.classList.add('on');go(start!=null?start:k)}
 else{mode='scroll';ov.classList.remove('on');openGrid(false);document.body.classList.remove('ss');history.replaceState(null,'',location.pathname);if(slideFigs[cur])slideFigs[cur].scrollIntoView({behavior:'instant',block:'center'});render()}
 modeBtn.querySelector('.nav-mode-t').textContent=mode==='slides'?'平铺':'幻灯片';modeBtn.setAttribute('aria-pressed',mode==='slides')}
var slidesHref=document.body.getAttribute('data-slides-href');
function openSlidesMode(start){
 if(slidesHref){location.href=slidesHref;return}
 setMode('slides',start)
}
modeBtn.addEventListener('click',function(e){e.stopPropagation();openNav(false);if(slidesHref){openSlidesMode();return}setMode(mode==='slides'?'scroll':'slides')});
ov.querySelector('.slides-close').addEventListener('click',function(){setMode('scroll')});
var fillBtn=ov.querySelector('.slides-fillbtn');
function setFill(on){ov.classList.toggle('is-fill',on);fillBtn.setAttribute('aria-pressed',on?'true':'false');fillBtn.setAttribute('aria-label',on?'退出页内全屏':'页内全屏')}
fillBtn.addEventListener('click',function(){setFill(!ov.classList.contains('is-fill'))});
ov.querySelector('.slides-gridbtn').addEventListener('click',function(){openGrid(!grid.classList.contains('on'))});
function pick(e){var b=e.target.closest('[data-i]');if(!b)return;if(ov.classList.contains('is-fill'))openGrid(false);go(+b.dataset.i)}
strip.addEventListener('click',pick);grid.addEventListener('click',pick);
pv.addEventListener('click',function(){go(cur-1)});nx.addEventListener('click',function(){go(cur+1)});
/* ---- shared: chapter menu, keys, swipe ---- */
gbtn.addEventListener('click',function(e){e.stopPropagation();openNav(!menu.classList.contains('on'))});menu.addEventListener('click',function(e){if(!e.target.closest('a,button'))e.stopPropagation()});
function openNav(on){menu.classList.toggle('on',on);pill.classList.toggle('open',on);gbtn.setAttribute('aria-expanded',on);if(on){var f=list.querySelector('a.on')||list.querySelector('a');f&&f.focus({preventScroll:true})}}
document.addEventListener('click',function(){openNav(false)});
list.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;e.stopPropagation();openNav(false);openGrid(false);jump(+a.dataset.k)});
document.addEventListener('keydown',function(e){
 if(e.key==='Escape'&&menu.classList.contains('on')){openNav(false);gbtn.focus();return}
 if(mode!=='slides'||(document.getElementById('lb')||{classList:{contains:function(){}}}).classList.contains('on'))return;
 if(e.key==='Escape'){if(ov.classList.contains('is-fill'))setFill(false);else setMode('scroll');return}
 if(grid.classList.contains('on'))return;
 if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();go(cur+1)}else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(cur-1)}
 else if(e.key==='Home')go(0);else if(e.key==='End')go(n-1);else if(e.key==='g'||e.key==='G')openGrid(true)});
var tx=null,ty=0;stage.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
stage.addEventListener('touchmove',function(e){if(tx!==null&&Math.abs(e.touches[0].clientX-tx)>Math.abs(e.touches[0].clientY-ty))e.preventDefault()},{passive:false});
stage.addEventListener('touchend',function(e){if(tx===null)return;var dx=e.changedTouches[0].clientX-tx,dy=e.changedTouches[0].clientY-ty;tx=null;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))go(cur+(dx<0?1:-1))});
if(toc)toc.addEventListener('click',function(e){var a=e.target.closest('a');if(!a)return;e.preventDefault();jump(+a.dataset.k)});
var tm=document.querySelector('.toc-mode');if(tm)tm.addEventListener('click',function(){openSlidesMode()});
/* before/after */
$('.compare').forEach(function(ba){var r=ba.querySelector('input');var set=function(){ba.style.setProperty('--compare-pos',r.value+'%')};r.addEventListener('input',set);set()});
var m=location.hash.match(/^#p(\d+)$/);if(m&&!slidesHref)setMode('slides',+m[1]-1);
render();window.__d={jump:jump,chaps:chaps,go:go,setMode:setMode,mode:function(){return mode},cur:function(){return cur},grid:openGrid};
})();
