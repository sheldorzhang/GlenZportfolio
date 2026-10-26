(function(){
  "use strict";
  var deck=document.querySelector("[data-deck]");
  if(!deck)return;
  var slides=Array.prototype.slice.call(deck.querySelectorAll("[data-slide]"));
  var current=0;
  var currentEl=document.querySelector("[data-current]");
  var totalEl=document.querySelector("[data-total]");
  var sectionEl=document.querySelector("[data-deck-section]");
  var progressEl=document.querySelector("[data-progress]");
  var prev=document.querySelector("[data-prev]");
  var next=document.querySelector("[data-next]");
  var strip=document.querySelector("[data-strip]");
  var overview=document.querySelector("[data-overview]");
  var overviewGrid=document.querySelector("[data-overview-grid]");
  var root=document.querySelector(".slides");
  function pad(value){return String(value).padStart(2,"0")}
  function fromHash(){var match=location.hash.match(/^#p(\d+)$/);return match?Math.max(0,Math.min(slides.length-1,Number(match[1])-1)):0}
  function thumb(index){var slide=slides[index],img=slide.querySelector("img");return '<button type="button" data-index="'+index+'" aria-label="第 '+(index+1)+' 页 '+slide.dataset.title+'"><span>'+pad(index+1)+'</span>'+(img?'<img loading="lazy" decoding="async" width="384" height="216" src="'+(img.getAttribute("data-thumb")||img.getAttribute("src"))+'" alt="">':'')+'</button>'}
  function buildOverview(){
    strip.innerHTML=slides.map(function(_,index){return thumb(index)}).join("");
    var chapters=[];
    slides.forEach(function(slide,index){var name=slide.dataset.section||slide.dataset.title||"案例";var last=chapters[chapters.length-1];if(!last||last.name!==name)chapters.push({name:name,index:index})});
    overviewGrid.innerHTML='<div class="g">'+chapters.map(function(chapter,chapterIndex){return '<button type="button" data-index="'+chapter.index+'" data-section="'+chapter.name+'" title="'+chapter.name+'" aria-label="'+pad(chapterIndex+1)+' '+chapter.name+'"><span>'+pad(chapterIndex+1)+'</span><b>'+chapter.name+'</b></button>'}).join("")+'</div>';
  }
  function select(index,writeHash){
    current=Math.max(0,Math.min(slides.length-1,index));
    slides.forEach(function(slide,slideIndex){var active=slideIndex===current;slide.classList.toggle("is-active",active);slide.setAttribute("aria-hidden",active?"false":"true")});
    currentEl.textContent=pad(current+1);totalEl.textContent=pad(slides.length);sectionEl.textContent=slides[current].dataset.section||"案例";progressEl.style.width=((current+1)/slides.length*100)+"%";prev.disabled=current===0;next.disabled=current===slides.length-1;
    var section=slides[current].dataset.section||slides[current].dataset.title||"";
    document.querySelectorAll("[data-strip] [data-index]").forEach(function(button){button.classList.toggle("on",Number(button.dataset.index)===current)});
    document.querySelectorAll(".slides-grid button").forEach(function(button){button.classList.toggle("on",button.dataset.section===section)});
    var activeStrip=strip.querySelector(".on");if(activeStrip){var column=getComputedStyle(strip).flexDirection==="column";if(column)strip.scrollTop=activeStrip.offsetTop-strip.clientHeight/2+activeStrip.offsetHeight/2;else strip.scrollLeft=activeStrip.offsetLeft-strip.clientWidth/2+activeStrip.offsetWidth/2}var menuOn=overview.querySelector(".on");if(menuOn)overview.scrollTop=menuOn.offsetTop-overview.clientHeight/2+menuOn.offsetHeight/2;
    document.title="腾讯企点商通 IM - 作品案例";
    if(writeHash)history.replaceState(null,"","#p"+(current+1));
  }
  function openGrid(open){overview.classList.toggle("on",open);if(open){var selected=overviewGrid.querySelector(".on");if(selected)selected.focus()}}
  function setFill(on){root.classList.toggle("is-fill",on);var button=document.querySelector("[data-fill]");button.setAttribute("aria-pressed",on?"true":"false");button.setAttribute("aria-label",on?"退出页内全屏":"页内全屏");align()}
  function align(){var stage=document.querySelector(".slides-stage"),fit=document.querySelector(".deck-fit"),canvas=document.querySelector(".deck-canvas");if(!stage||!fit||!canvas)return;var room=stage.getBoundingClientRect(),scale=Math.min(room.width/1920,room.height/1080);if(!isFinite(scale)||scale<=0)scale=1;fit.style.width=(1920*scale)+"px";fit.style.height=(1080*scale)+"px";canvas.style.transform="none";canvas.style.zoom="1";canvas.style.width=(1920*scale)+"px";canvas.style.height=(1080*scale)+"px";var edge=canvas.getBoundingClientRect();document.body.style.setProperty("--paper-x",(edge.left-.5)+"px");document.body.style.setProperty("--paper-y",(edge.top-.5)+"px")}
  function choose(event){var button=event.target.closest("[data-index]");if(!button)return;openGrid(false);select(Number(button.dataset.index),true)}
  prev.addEventListener("click",function(){select(current-1,true)});next.addEventListener("click",function(){select(current+1,true)});strip.addEventListener("click",choose);overviewGrid.addEventListener("click",choose);
  document.querySelector("[data-grid-open]").addEventListener("click",function(){openGrid(!overview.classList.contains("on"))});document.querySelector("[data-fill]").addEventListener("click",function(){setFill(!root.classList.contains("is-fill"))});
  document.addEventListener("keydown",function(event){if(event.key==="Escape"){if(root.classList.contains("is-fill"))setFill(false);else location.href="index.html";return}if(event.key==="ArrowRight"||event.key==="PageDown"||event.key===" "){event.preventDefault();select(current+1,true)}else if(event.key==="ArrowLeft"||event.key==="PageUp"){event.preventDefault();select(current-1,true)}else if(event.key==="Home"){select(0,true)}else if(event.key==="End"){select(slides.length-1,true)}});
  window.addEventListener("hashchange",function(){select(fromHash(),false)});window.addEventListener("resize",align);
  buildOverview();select(fromHash(),!location.hash);align();
})();
