/* Reading-only navigation. Deliberately does not load the slideshow controller. */
(function(){
 "use strict";
 var sections=Array.from(document.querySelectorAll('.chap[data-chapter]'));
 var links=Array.from(document.querySelectorAll('.toc-list a'));
 var ring=document.querySelector('.nav-btn');
 var menu=document.querySelector('.toc');
 var toggle=document.querySelector('.be4d-menu-toggle');
 var heading=document.querySelector('.case-head h1');
 var bar=document.querySelector('.be4d-mobile-bar');
 var title=document.querySelector('.be4d-nav-title');
 var titleFrame=0;
 var compact=matchMedia('(max-width:1000px)');
 var reduced=matchMedia('(prefers-reduced-motion:reduce)');
 function openMenu(open){
  menu.classList.toggle('is-open',open);
  toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'关闭章节目录':'打开章节目录');
 }
 function syncTitle(){
  titleFrame=0;
  if(!heading||!bar||!title) return;
  var label=heading.textContent.trim();
  if(title.textContent!==label){title.textContent=label;title.setAttribute('title',label)}
  var shown=compact.matches&&heading.getBoundingClientRect().bottom<=bar.getBoundingClientRect().bottom;
  title.classList.toggle('is-visible',shown);
  title.setAttribute('aria-hidden',String(!shown));
 }
 function scheduleTitle(){if(!titleFrame) titleFrame=requestAnimationFrame(syncTitle)}
 addEventListener('scroll',scheduleTitle,{passive:true});
 addEventListener('resize',scheduleTitle);
 addEventListener('pageshow',scheduleTitle);
 if(document.fonts) document.fonts.ready.then(scheduleTitle);
 syncTitle();
 ring.addEventListener('click',function(){location.href='index.html#thoughts'});
 toggle.addEventListener('click',function(){
  var open=!menu.classList.contains('is-open');openMenu(open);
  if(open){var current=menu.querySelector('[aria-current]')||links[0];if(current)current.focus({preventScroll:true})}
 });
 links.forEach(function(link){
  link.addEventListener('click',function(event){
   var target=document.getElementById(link.hash.slice(1));if(!target)return;
   event.preventDefault();openMenu(false);
   history.replaceState(null,'',link.hash);
   target.querySelector('h2').scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'start'});
   if(compact.matches)toggle.focus({preventScroll:true});
  });
 });
 document.addEventListener('click',function(event){if(!menu.contains(event.target)&&!toggle.contains(event.target))openMenu(false)});
 document.addEventListener('keydown',function(event){if(event.key==='Escape'&&menu.classList.contains('is-open')){openMenu(false);toggle.focus()}});
 compact.addEventListener('change',function(){openMenu(false)});
 var scheduled=0;
 function update(){
  scheduled=0;
  var max=document.documentElement.scrollHeight-innerHeight;
  ring.style.setProperty('--nav-progress',max>0?Math.min(100,scrollY/max*100):0);
  var current=null;sections.forEach(function(section){if(section.getBoundingClientRect().top<innerHeight*.4)current=section});
  links.forEach(function(link){var on=!!current&&link.hash==='#'+current.id;link.classList.toggle('on',on);if(on)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current')});
 }
 function schedule(){if(!scheduled)scheduled=requestAnimationFrame(update)}
 addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);addEventListener('load',schedule);update();
})();

/* Evidence chapter: horizontal strip, first card aligned to the text column. */
(function(){
 "use strict";
 var stage=document.querySelector("[data-evidence-stage]");
 if(!stage) return;
 var tabs=Array.from(stage.querySelectorAll('[role="tab"]'));
 var panels=Array.from(stage.querySelectorAll('[role="tabpanel"]'));
 var track=stage.querySelector("[data-evidence-track]");
 if(!track) return;
 var index=0,lock=0;
 function mark(next){
  if(next<0||next>=tabs.length) return;
  index=next;
  tabs.forEach(function(tab,i){
   var on=i===index;
   tab.classList.toggle("is-active",on);
   tab.setAttribute("aria-selected",String(on));
   tab.tabIndex=on?0:-1;
  });
  panels.forEach(function(panel){panel.removeAttribute("aria-hidden");panel.removeAttribute("inert")});
 }
 function scrollToPanel(i){
  var pad=parseFloat(getComputedStyle(track).scrollPaddingLeft)||0;
  var left=panels[i].getBoundingClientRect().left-track.getBoundingClientRect().left+track.scrollLeft-pad;
  lock=performance.now()+700;
  track.scrollTo({left:Math.max(0,left),behavior:matchMedia("(prefers-reduced-motion:reduce)").matches?"auto":"smooth"});
 }
 tabs.forEach(function(tab,i){
  tab.addEventListener("click",function(){
   mark(i);
   scrollToPanel(i);
  });
 });
 track.addEventListener("scroll",function(){
  if(performance.now()<lock) return;
  var origin=track.getBoundingClientRect().left+(parseFloat(getComputedStyle(track).scrollPaddingLeft)||0);
  var nearest=0,best=Infinity;
  panels.forEach(function(panel,i){
   var d=Math.abs(panel.getBoundingClientRect().left-origin);
   if(d<best){best=d;nearest=i}
  });
  if(nearest!==index) mark(nearest);
 },{passive:true});
 var drag=null;
 track.addEventListener("pointerdown",function(event){
  if(event.pointerType==="touch"||event.button!==0) return;
  /* Images own their click so the gallery's drag capture cannot swallow zoom. */
  if(event.target.closest("img[data-zoom], [data-zoom-src]")) return;
  drag={x:event.clientX,left:track.scrollLeft,moved:false};
  track.classList.add("is-drag");
  track.setPointerCapture(event.pointerId);
 });
 track.addEventListener("pointermove",function(event){
  if(!drag) return;
  var dx=event.clientX-drag.x;
  if(Math.abs(dx)>4) drag.moved=true;
  track.scrollLeft=drag.left-dx;
 });
 function endDrag(event){
  if(!drag) return;
  track.classList.remove("is-drag");
  if(drag.moved) event.preventDefault();
  drag=null;
 }
 track.addEventListener("pointerup",endDrag);
 track.addEventListener("pointercancel",endDrag);
 mark(0);
})();
