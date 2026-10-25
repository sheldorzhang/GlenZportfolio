/* Article chapter menu shares the slideshow's compact breakpoint. */
(function(){
  "use strict";
  var toggle=document.querySelector(".c1-menu-toggle"),menu=document.getElementById("c1-article-toc");
  if(!toggle||!menu) return;
  var compact=matchMedia("(max-width:1000px)");
  var heading=document.querySelector(".case-head h1"),bar=document.querySelector(".c1-mobile-bar"),title=document.querySelector(".c1-nav-title"),titleFrame=0;
  function syncTitle(){
    titleFrame=0;
    if(!heading||!bar||!title) return;
    var label=heading.textContent.trim();
    if(title.textContent!==label){title.textContent=label;title.setAttribute("title",label)}
    var shown=compact.matches&&heading.getBoundingClientRect().bottom<=bar.getBoundingClientRect().bottom;
    title.classList.toggle("is-visible",shown);
    title.setAttribute("aria-hidden",String(!shown));
  }
  function scheduleTitle(){if(!titleFrame) titleFrame=requestAnimationFrame(syncTitle)}
  addEventListener("scroll",scheduleTitle,{passive:true});
  addEventListener("resize",scheduleTitle);
  addEventListener("pageshow",scheduleTitle);
  if(document.fonts) document.fonts.ready.then(scheduleTitle);
  syncTitle();

  function setOpen(open){
    menu.classList.toggle("is-open",open);
    toggle.setAttribute("aria-expanded",String(open));
    toggle.setAttribute("aria-label",open?"关闭章节目录":"打开章节目录");
  }
  toggle.addEventListener("click",function(){
    var open=!menu.classList.contains("is-open");setOpen(open);
    if(open){var selected=menu.querySelector(".toc-list a.on")||menu.querySelector(".toc-list a");if(selected)selected.focus({preventScroll:true})}
  });
  menu.addEventListener("click",function(event){if(compact.matches&&event.target.closest("a,button")){setOpen(false);toggle.focus({preventScroll:true})}});
  document.addEventListener("click",function(event){if(!menu.contains(event.target)&&!toggle.contains(event.target))setOpen(false)});
  document.addEventListener("keydown",function(event){
    if(event.key==="Escape"&&compact.matches&&menu.classList.contains("is-open")){
      event.preventDefault();event.stopImmediatePropagation();setOpen(false);toggle.focus({preventScroll:true});
    }
  },true);
  compact.addEventListener("change",function(){setOpen(false)});
})();
