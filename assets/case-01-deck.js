(function(){
  "use strict";

  var deck=document.querySelector("[data-deck]");
  if(!deck) return;
  var embedded=new URLSearchParams(location.search).has("embed");

  var slides=Array.from(deck.querySelectorAll("[data-slide]"));
  var currentEl=document.querySelector("[data-current]");
  var totalEl=document.querySelector("[data-total]");
  var sectionEl=document.querySelector("[data-deck-section]");
  var topPageEl=document.querySelector("[data-top-page]");
  var progressEl=document.querySelector("[data-progress]");
  var prevBtn=document.querySelector("[data-prev]");
  var nextBtn=document.querySelector("[data-next]");
  var overview=document.querySelector("[data-overview]");
  var overviewGrid=document.querySelector("[data-overview-grid]");
  var strip=document.querySelector("[data-strip]");
  var modal=document.querySelector("[data-demo-modal]");
  var modalFrame=document.querySelector("[data-demo-frame]");
  var index=0;
  var touchStartX=null;

  function pad(value){
    return String(value).padStart(2,"0");
  }

  function indexFromHash(){
    var match=location.hash.match(/^#p(\d+)$/);
    if(!match) return 0;
    return Math.min(slides.length-1,Math.max(0,Number(match[1])-1));
  }

  function updateOverview(){
    var section=slides[index].dataset.section||"";
    document.querySelectorAll("[data-strip] button").forEach(function(button){
      var on=Number(button.dataset.i)===index;
      button.classList.toggle("on",on);
      button.setAttribute("aria-current",on?"page":"false");
    });
    overviewGrid.querySelectorAll("[data-i]").forEach(function(button){
      var on=Number(button.dataset.i)===index;
      button.classList.toggle("on",on);
      button.setAttribute("aria-current",on?"page":"false");
    });
    overviewGrid.querySelectorAll(".chapter-group").forEach(function(group){
      var on=group.dataset.section===section;
      group.classList.toggle("on",on);
    });
    revealStrip(strip.querySelector(".on"));
    var menuOn=overviewGrid.querySelector(".chapter-page.on");
    if(overview.classList.contains("on")&&menuOn) menuOn.scrollIntoView({block:"nearest"});
  }

  function revealStrip(el){
    if(!el) return;
    var column=getComputedStyle(strip).flexDirection==="column";
    if(column) strip.scrollTop=el.offsetTop-strip.clientHeight/2+el.offsetHeight/2;
    else strip.scrollLeft=el.offsetLeft-strip.clientWidth/2+el.offsetWidth/2;
  }

  function syncLiveDemos(){
    document.querySelectorAll("[data-live-demo]").forEach(function(frame){
      var container=frame.closest(".media-frame--live");
      var slide=frame.closest("[data-slide]");
      var active=slide&&slide.classList.contains("is-active");
      var src=frame.getAttribute("data-live-demo");
      if(active){
        if(frame.getAttribute("src")!==src){
          container.classList.add("is-loading");
          frame.setAttribute("src",src);
        }
      }else if(frame.getAttribute("src")){
        frame.removeAttribute("src");
        container.classList.remove("is-loading");
      }
    });
  }

  document.querySelectorAll("[data-live-demo]").forEach(function(frame){
    var container=frame.closest(".media-frame--live");
    frame.addEventListener("load",function(){container.classList.remove("is-loading");});
    frame.addEventListener("error",function(){container.classList.remove("is-loading");});
  });

  function show(nextIndex,updateHash){
    index=Math.min(slides.length-1,Math.max(0,nextIndex));
    slides.forEach(function(slide,slideIndex){
      var active=slideIndex===index;
      slide.classList.toggle("is-active",active);
      slide.setAttribute("aria-hidden",active?"false":"true");
    });
    currentEl.textContent=pad(index+1);
    totalEl.textContent=pad(slides.length);
    sectionEl.textContent=slides[index].dataset.section||"MAGIC AI";
    topPageEl.textContent=index===0?"首页":slides[index].dataset.title||"MAGIC AI";
    progressEl.style.width=((index+1)/slides.length*100)+"%";
    prevBtn.disabled=index===0;
    nextBtn.disabled=index===slides.length-1;
    updateOverview();
    syncLiveDemos();
    document.title=(slides[index].dataset.title||"MAGIC AI")+" · 演示版";
    if(updateHash){
      history.replaceState(null,"","#p"+(index+1));
    }
  }

  function thumb(slideIndex){
    var slide=slides[slideIndex];
    var title=slide.dataset.title||"";
    return '<button type="button" data-i="'+slideIndex+'" aria-label="第 '+(slideIndex+1)+' 页 '+title.replace(/"/g,"")+'"><span>'+pad(slideIndex+1)+'</span><b>'+title+'</b></button>';
  }

  function escapeHTML(value){
    return String(value).replace(/[&<>"']/g,function(char){
      return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char];
    });
  }

  function buildOverview(){
    strip.innerHTML=slides.map(function(_,slideIndex){
      return '<button type="button" data-i="'+slideIndex+'" aria-label="第 '+(slideIndex+1)+' 页"><span>'+pad(slideIndex+1)+'</span></button>';
    }).join("");
    var chapters=[];
    slides.forEach(function(slide,slideIndex){
      var name=slide.dataset.section||"标题";
      var last=chapters[chapters.length-1];
      if(!last||last.name!==name){
        last={name:name,slides:[]};
        chapters.push(last);
      }
      last.slides.push({index:slideIndex,title:slide.dataset.title||"",navTitle:slide.dataset.navTitle||slide.dataset.title||""});
    });
    overviewGrid.innerHTML='<nav class="deck-directory" aria-label="演示文稿目录">'+chapters.map(function(chapter){
      var name=chapter.name==="标题"?"首页":chapter.name;
      return '<section class="chapter-group" data-section="'+escapeHTML(chapter.name)+'">'+
        '<h3 class="chapter-heading">'+escapeHTML(name)+'</h3>'+
        '<div class="chapter-pages">'+chapter.slides.map(function(page){
          return '<button class="chapter-page" type="button" data-i="'+page.index+'" aria-label="第 '+(page.index+1)+' 页 '+escapeHTML(page.title)+'"><span>'+pad(page.index+1)+'</span><b>'+escapeHTML(page.navTitle)+'</b></button>';
        }).join("")+'</div></section>';
    }).join("")+'</nav>';
  }

  function openOverview(){
    overview.classList.add("on");
    updateOverview();
    var selected=overviewGrid.querySelector(".chapter-page.on");
    if(selected) selected.focus();
  }

  function closeOverview(){
    overview.classList.remove("on");
  }

  function openDemo(button){
    modalFrame.title=button.dataset.demoTitle||"产品动态演示";
    modal.querySelector(".demo-panel").classList.add("is-loading");
    modalFrame.src=button.dataset.demoSrc;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden","false");
    document.querySelector("[data-demo-close]").focus();
  }

  function closeDemo(){
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden","true");
    modalFrame.src="about:blank";
    modal.querySelector(".demo-panel").classList.remove("is-loading");
  }

  modalFrame.addEventListener("load",function(){modal.querySelector(".demo-panel").classList.remove("is-loading");});
  modalFrame.addEventListener("error",function(){modal.querySelector(".demo-panel").classList.remove("is-loading");});

  prevBtn.addEventListener("click",function(){show(index-1,true)});
  nextBtn.addEventListener("click",function(){show(index+1,true)});
  document.querySelector("[data-grid-open]").addEventListener("click",function(){
    overview.classList.contains("on")?closeOverview():openOverview();
  });
  var fillBtn=document.querySelector("[data-fill]");
  var slidesRoot=document.querySelector(".slides");
  function setFill(on){
    slidesRoot.classList.toggle("is-fill",on);
    fillBtn.setAttribute("aria-pressed",on?"true":"false");
    fillBtn.setAttribute("aria-label",on?"退出页内全屏":"页内全屏");
    requestAnimationFrame(alignGrid);
  }
  fillBtn.addEventListener("click",function(){setFill(!slidesRoot.classList.contains("is-fill"))});
  strip.addEventListener("click",function(event){
    var button=event.target.closest("[data-i]");
    if(!button) return;
    show(Number(button.dataset.i),true);
  });
  overviewGrid.addEventListener("click",function(event){
    var button=event.target.closest("[data-i]");
    if(!button) return;
    closeOverview();
    show(Number(button.dataset.i),true);
  });
  document.querySelector("[data-demo-close]").addEventListener("click",closeDemo);
  document.querySelectorAll("[data-demo-src]").forEach(function(button){
    button.addEventListener("click",function(){openDemo(button)});
  });

  overview.addEventListener("click",function(event){
    if(event.target===overview) closeOverview();
  });
  modal.addEventListener("click",function(event){
    if(event.target===modal) closeDemo();
  });

  var back=document.querySelector("[data-deck-back]");
  if(embedded&&back){
    back.addEventListener("click",function(event){
      event.preventDefault();
      parent.postMessage({type:"c1-deck-close"},location.origin);
    });
  }

  document.addEventListener("keydown",function(event){
    if(modal.classList.contains("is-open")){
      if(event.key==="Escape") closeDemo();
      return;
    }
    if(event.key==="Escape"){
      if(slidesRoot.classList.contains("is-fill")){setFill(false);return}
      if(embedded) parent.postMessage({type:"c1-deck-close"},location.origin);
      else location.href="case-01.html";
      return;
    }
    var tag=document.activeElement&&document.activeElement.tagName;
    if(tag==="INPUT") return;
    if(event.key==="ArrowRight"||event.key==="PageDown"||event.key===" "){
      event.preventDefault();
      show(index+1,true);
    }else if(event.key==="ArrowLeft"||event.key==="PageUp"){
      event.preventDefault();
      show(index-1,true);
    }else if(event.key==="Home"){
      event.preventDefault();
      show(0,true);
    }else if(event.key==="End"){
      event.preventDefault();
      show(slides.length-1,true);
    }else if(event.key.toLowerCase()==="g"){
      event.preventDefault();
      openOverview();
    }
  });

  deck.addEventListener("pointerdown",function(event){
    if(event.pointerType==="touch") touchStartX=event.clientX;
  });
  deck.addEventListener("pointerup",function(event){
    if(touchStartX===null) return;
    var delta=event.clientX-touchStartX;
    touchStartX=null;
    if(Math.abs(delta)<48) return;
    show(index+(delta<0?1:-1),true);
  });

  window.addEventListener("hashchange",function(){show(indexFromHash(),false)});

  function alignGrid(){
    var stage=document.querySelector(".slides-stage");
    var fit=document.querySelector(".deck-fit");
    var canvas=document.querySelector(".deck-canvas");
    if(!stage||!fit||!canvas) return;
    var room=stage.getBoundingClientRect();
    var scale=Math.min(room.width/1920,room.height/1080);
    if(!isFinite(scale)||scale<=0) scale=1;
    fit.style.width=(1920*scale)+"px";
    fit.style.height=(1080*scale)+"px";
    canvas.style.transform="none";
    canvas.style.zoom=scale;
    var edge=canvas.getBoundingClientRect();
    document.body.style.setProperty("--paper-x",(edge.left-0.5)+"px");
    document.body.style.setProperty("--paper-y",(edge.top-0.5)+"px");
    document.body.style.setProperty("--deck-edge-left",Math.max(0,edge.left)+"px");
    document.body.style.setProperty("--deck-edge-right",Math.max(0,window.innerWidth-edge.right)+"px");
  }

  buildOverview();
  show(indexFromHash(),!location.hash);
  alignGrid();
  window.addEventListener("resize",alignGrid);
})();
