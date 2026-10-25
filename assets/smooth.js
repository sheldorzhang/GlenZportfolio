/* smooth.js（v5.8）— 自写的 lerp 平滑滚动，不依赖第三方库、可离线。参数取自 karimsaleh.design 的实测：
   纵向 = Lenis({lerp:.1, smoothWheel:true, syncTouch:false}) 的等价实现；
   横排 = wheel 每帧 lerp .22 逼近目标 + 停止 80ms 后：速度 <80px/s 吸附到最近卡片，否则惯性（power .4, timeConstant 320ms）后吸附。
   只在桌面精确指针（鼠标/触控板）启用；触屏、prefers-reduced-motion 时整体不启用，回到原生滚动。 */
(function(){
var mq=function(q){return window.matchMedia&&matchMedia(q).matches};
if(mq('(prefers-reduced-motion: reduce)')||mq('(pointer: coarse)'))return;
var root=document.documentElement,cs=getComputedStyle(root),tok=function(n,d){var v=parseFloat(cs.getPropertyValue(n));return isNaN(v)?d:v};
var OFF=tok('--card-off-scale',.86),LERP=tok('--ix-scroll-lerp',.1),WM=tok('--ix-scroll-wheel',1),HL=tok('--ix-rail-lerp',.22),POW=tok('--ix-rail-power',.4),TC=tok('--ix-rail-time',320),IDLE=tok('--ix-rail-idle',80),SNAPV=tok('--ix-rail-snap-v',80),TH=tok('--ix-rail-drag-th',6),TPM=tok('--ix-rail-tp-mult',1),TPL=tok('--ix-rail-tp-lerp',.35),TPMAX=tok('--ix-rail-tp-max',40),WMH=tok('--ix-rail-wheel-mult',.6),MAXC=tok('--ix-rail-max-cards',1),SNAPD=tok('--ix-rail-snap-dur',500),SNAP=tok('--ix-rail-snap',1),ZONE=tok('--ix-rail-snap-zone',24);
var norm=function(e,v){return e.deltaMode===1?v*16:e.deltaMode===2?v*innerHeight:v};
root.classList.add('smooth-on');
/* ---------- 纵向页面 ---------- */
var target=scrollY,cur=scrollY,raf=0,lastSet=-1;
var maxY=function(){return root.scrollHeight-innerHeight};
function canScrollInside(el,dy,dx){for(;el&&el!==document.body&&el!==root;el=el.parentElement){if(el.hasAttribute&&el.hasAttribute('data-smooth-prevent'))return true;var s=getComputedStyle(el);
 if(dy&&/(auto|scroll)/.test(s.overflowY)&&el.scrollHeight>el.clientHeight+1)return true;if(dx&&/(auto|scroll)/.test(s.overflowX)&&el.scrollWidth>el.clientWidth+1)return true}return false}
function tick(){var d=target-cur;if(Math.abs(d)<.5){cur=target;raf=0}else{cur+=d*LERP;raf=requestAnimationFrame(tick)}window.scrollTo(0,cur);lastSet=scrollY}
addEventListener('wheel',function(e){if(e.ctrlKey||e.defaultPrevented||root.classList.contains('sheet-lock')||document.body.style.overflow==='hidden')return;
 var dy=norm(e,e.deltaY),dx=norm(e,e.deltaX);if(Math.abs(dx)>Math.abs(dy))return; /* 横向手势交给横排/原生 */
 if(canScrollInside(e.target,dy,0))return;e.preventDefault();
 if(!raf){cur=scrollY;target=scrollY}target=Math.max(0,Math.min(maxY(),target+dy*WM));if(!raf)raf=requestAnimationFrame(tick)},{passive:false});
/* 键盘、锚点、菜单跳转、滚动条拖动等原生滚动：立刻同步，停止我们的动画，避免抢滚动 */
addEventListener('scroll',function(){if(raf&&Math.abs(scrollY-lastSet)<2)return;if(raf){cancelAnimationFrame(raf);raf=0}cur=target=scrollY},{passive:true});
addEventListener('resize',function(){target=Math.min(target,maxY())});
/* 页内锚点：用同一 lerp 动画滚到目标（替代 CSS scroll-behavior），并更新地址栏 hash */
document.addEventListener('click',function(e){if(e.defaultPrevented||e.button||e.metaKey||e.ctrlKey)return;var a=e.target.closest('a[href^="#"]');if(!a||a.hasAttribute('data-resume'))return;var id=a.getAttribute('href').slice(1);if(!id||id==='resume')return;var el=id==='top'?root:document.getElementById(id);if(!el)return;e.preventDefault();
 var y=id==='top'?0:el.getBoundingClientRect().top+scrollY;target=Math.max(0,Math.min(maxY(),y));cur=scrollY;if(!raf)raf=requestAnimationFrame(tick);history.replaceState(null,'','#'+id)});
window.__smooth={stop:function(){if(raf)cancelAnimationFrame(raf);raf=0;cur=target=scrollY}};
/* ---------- 横排媒体 v5.10（Cheer Mac 触控板实测后调软） ----------
   · 触控板（deltaMode 0、小而连续的 deltaX）：1:1 跟随 × --ix-rail-tp-mult，轻 lerp --ix-rail-tp-lerp，不加额外惯性（macOS 自带惯性事件流），停 --ix-rail-idle 后温和吸附（--ix-rail-snap-dur ease-out）。
   · 鼠标滚轮（大步长离散）：× --ix-rail-wheel-mult，lerp --ix-rail-lerp；停后惯性 power --ix-rail-power / timeConstant --ix-rail-time，单次手势最多 --ix-rail-max-cards 张。
   · 拖拽：跟手；松手速度 > --ix-rail-snap-v 才加惯性（同上限），否则只吸附最近卡；吸附只从「当前位置」找最近点，不回弹到起点。
   · 吸附点：每张卡左缘对齐 780 容器；最后一张 = 卡片居中于视口（尾部 padding 足够），焦点缩放按吸附点距离计算，所以末卡居中时 scale=1。 */
[].forEach.call(document.querySelectorAll('.rail'),function(t){
 t.classList.add('rail-js');
 var tgt=0,anim=0,idle=0,vel=0,lastT=0,mode=null,kind=null,down=false,moved=false,x0=0,s0=0,samples=[],g0=0,smallRun=0;
 var cards=[].slice.call(t.children),rest=[],cw=0,sp=[];
 var maxX=function(){return t.scrollWidth-t.clientWidth};
 var clampX=function(x){return Math.max(0,Math.min(maxX(),x))};
 function measure(){var p=t.scrollLeft,o=t.getBoundingClientRect().left;cards.forEach(function(c){c.style.transform=''});rest=cards.map(function(c){return c.getBoundingClientRect().left-o+p});cw=cards[0]?cards[0].offsetWidth:0;
  sp=rest.map(function(r,i){return clampX(i===rest.length-1&&i>0?r-(t.clientWidth/2-cw/2):r-rest[0])});layout()}
 function idxNear(x){var b=0;sp.forEach(function(v,i){if(Math.abs(v-x)<Math.abs(sp[b]-x))b=i});return b}
 function stop(){if(anim)cancelAnimationFrame(anim);anim=0;mode=null}
 function lerpTo(){var k=kind==='tp'?TPL:HL,d=tgt-t.scrollLeft;if(Math.abs(d)<1.5){t.scrollLeft=tgt;anim=0;mode=null;return}var st=d*k;if(Math.abs(st)<1)st=d>0?1:-1;t.scrollLeft+=st;anim=requestAnimationFrame(lerpTo)}
 function ease(to,dur){stop();var from=t.scrollLeft,amp=to-from,t0=performance.now();if(Math.abs(amp)<.5){t.scrollLeft=to;return}mode='snap';
  (function step(n){var u=Math.min(1,(n-t0)/dur),e=1-Math.pow(1-u,3);t.scrollLeft=from+amp*e;if(u<1)anim=requestAnimationFrame(step);else{anim=0;mode=null}})(t0)}
 function settle(v,useInertia){/* v: px/s */ var x=t.scrollLeft,proj=x;
  if(useInertia&&Math.abs(v)>SNAPV)proj=x+v*POW;
  var i=idxNear(proj),i0=idxNear(g0);if(useInertia&&Math.abs(v)>SNAPV){/* 有速度：顺方向落到下一张，不回退 */ if(v>0){while(i<sp.length-1&&sp[i]<x+1)i++}else{while(i>0&&sp[i]>x-1)i--}}if(useInertia){i=Math.max(i0-MAXC,Math.min(i0+MAXC,i))}
  if(!SNAP){if(proj!==x)ease(clampX(proj),TC*1.5);return}
  var to=sp[i];if(Math.abs(to-proj)>ZONE&&!(useInertia&&Math.abs(v)>SNAPV)){if(proj!==x)ease(clampX(proj),SNAPD);return} /* 软吸附：离吸附点太远且速度低时就停在原地 */
  ease(to,Math.abs(proj-x)>2?Math.max(SNAPD,TC*1.5):SNAPD)}
 t.addEventListener('wheel',function(e){var dx=norm(e,e.deltaX),dy=norm(e,e.deltaY);var horiz=Math.abs(dx)>Math.abs(dy)||e.shiftKey;if(!horiz)return;
  var d=e.shiftKey&&!dx?dy:dx;if(!maxX())return;e.preventDefault();var now=performance.now(),gap=lastT?now-lastT:1e9;
  /* 触控板判定：像素模式 + 小步长或高频连续事件 */
  var tp=e.deltaMode===0&&(Math.abs(d)<TPMAX||(gap<40&&kind==='tp')||d%1!==0);
  if(mode!=='wheel'){stop();tgt=t.scrollLeft;vel=0;g0=t.scrollLeft;mode='wheel'}
  kind=tp?'tp':'wheel';var v=gap<IDLE?d/Math.max(8,gap)*1e3:0;vel=.7*vel+.3*v;lastT=now;
  tgt=clampX(tgt+d*(tp?TPM:WMH));if(!anim)anim=requestAnimationFrame(lerpTo);
  clearTimeout(idle);idle=setTimeout(function(){lastT=0;var k=kind;mode=null;var wait=function(){if(anim&&mode!=='snap'&&Math.abs(tgt-t.scrollLeft)>1.5&&(wait.n=(wait.n||0)+1)<60){requestAnimationFrame(wait);return}stop();settle(vel,k!=='tp')};wait()},IDLE)},{passive:false});
 t.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button)return;stop();down=true;moved=false;x0=e.clientX;s0=g0=t.scrollLeft;samples=[[performance.now(),e.clientX]]});
 addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(!moved&&Math.abs(dx)>TH){moved=true;t.classList.add('drag')}if(moved){t.scrollLeft=s0-dx;samples.push([performance.now(),e.clientX]);if(samples.length>6)samples.shift()}});
 addEventListener('pointerup',function(){if(!down)return;down=false;if(!moved)return;var a=samples[0],b=samples[samples.length-1],dt=Math.max(16,b[0]-a[0]),v=-(b[1]-a[1])/dt*1e3;if(performance.now()-b[0]>100)v=0;setTimeout(function(){t.classList.remove('drag')},0);settle(v,true)});
 t.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
 t.addEventListener('keydown',function(){stop()});
 /* 焦点缩放：k = 当前 scrollLeft 到该卡吸附点的距离 / 相邻吸附点间距；scale = 1 - smoothstep(k)*(1-OFF)；translate 补偿保持紧挨 */
 function layout(){if(!cards.length||!sp.length)return;var x=t.scrollLeft,f=idxNear(x);
  var sc=cards.map(function(c,i){var gapw=Math.max(1,i<sp.length-1?sp[i+1]-sp[i]:sp[i]-sp[i-1]||1);if(x<sp[i]&&i>0)gapw=Math.max(1,sp[i]-sp[i-1]);var k=Math.min(1,Math.abs(sp[i]-x)/gapw);return 1-k*k*(3-2*k)*(1-OFF)});
  var sh=new Array(cards.length);sh[f]=0;var acc=-cw*(1-sc[f])/2,i,di;
  for(i=f+1;i<cards.length;i++){di=cw*(1-sc[i]);sh[i]=acc-di/2;acc-=di}
  acc=cw*(1-sc[f])/2;for(i=f-1;i>=0;i--){di=cw*(1-sc[i]);sh[i]=acc+di/2;acc+=di}
  cards.forEach(function(c,i){c.style.transform='translate3d('+sh[i].toFixed(2)+'px,0,0) scale('+sc[i].toFixed(4)+')'})}
 var lq=0;t.addEventListener('scroll',function(){if(!lq)lq=requestAnimationFrame(function(){lq=0;layout()})},{passive:true});
 addEventListener('resize',measure);if(document.readyState==='complete')measure();else addEventListener('load',measure);measure();
});
})();
