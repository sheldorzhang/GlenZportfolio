/* 回放懒加载：首屏只放封面，点击后才插入当前产品回放 iframe */
(function(){
  var VERSION='magic-embedded-20261025-case3-expand-fix-v1';
  var LOCAL_PREVIEW_ORIGIN='http://127.0.0.1:4317';
  var activeFrame=null;
  var backdrop=null;
  var collapseButton=null;
  var expandedPlaceholder=null;
  var previousOverflow='';

  function notifyExpanded(frame,value){
    if(frame&&frame.contentWindow)frame.contentWindow.postMessage({type:'magic-replay:expanded',value:value},location.protocol==='file:'?'*':location.origin);
  }
  function resolveReplaySource(source){
    return location.protocol==='file:' ? new URL(source,LOCAL_PREVIEW_ORIGIN+'/').href : source;
  }
  function closeExpanded(){
    if(!activeFrame)return;
    var frame=activeFrame;activeFrame=null;
    frame.classList.remove('is-web-expanded');
    if(expandedPlaceholder&&expandedPlaceholder.parentNode){
      expandedPlaceholder.parentNode.insertBefore(frame,expandedPlaceholder);
      expandedPlaceholder.remove();
    }
    expandedPlaceholder=null;
    if(backdrop)backdrop.remove();
    if(collapseButton)collapseButton.remove();
    backdrop=null;collapseButton=null;
    document.body.classList.remove('embed-modal-open');
    document.body.style.overflow=previousOverflow;
    notifyExpanded(frame,false);
    frame.focus({preventScroll:true});
  }
  function openExpanded(frame){
    if(activeFrame===frame){closeExpanded();return;}
    closeExpanded();
    activeFrame=frame;
    frame.inert=false;
    previousOverflow=document.body.style.overflow;
    backdrop=document.createElement('div');
    backdrop.className='embed-modal-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    backdrop.addEventListener('click',closeExpanded);
    collapseButton=document.createElement('button');
    collapseButton.className='embed-modal-collapse';
    collapseButton.type='button';
    collapseButton.setAttribute('aria-label','缩小回放窗口');
    collapseButton.title='缩小回放窗口';
    collapseButton.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8h5V3M21 8h-5V3M3 16h5v5M21 16h-5v5"/></svg>';
    collapseButton.addEventListener('click',closeExpanded);
    document.body.append(backdrop,collapseButton);
    document.body.classList.add('embed-modal-open');
    document.body.style.overflow='hidden';
    expandedPlaceholder=document.createComment('expanded replay placeholder');
    frame.parentNode.insertBefore(expandedPlaceholder,frame);
    document.body.appendChild(frame);
    frame.classList.add('is-web-expanded');
    notifyExpanded(frame,true);
    collapseButton.focus({preventScroll:true});
  }

  function mountReplay(box,cover,focusFrame){
    if(box.classList.contains('is-loading')||box.classList.contains('is-loaded'))return;
    var loading=cover.querySelector('.embed-loading');
    if(!loading){
      loading=document.createElement('span');
      loading.className='embed-loading';
      loading.setAttribute('role','status');
      loading.setAttribute('aria-live','polite');
      loading.innerHTML='<span class="embed-loading-spinner" aria-hidden="true"></span><span class="embed-loading-text">正在加载交互演示…</span>';
      cover.appendChild(loading);
    }
    loading.querySelector('.embed-loading-text').textContent='正在加载交互演示…';
    box.classList.remove('is-error');
    box.classList.add('is-loading');
    var f=document.createElement('iframe');
    f.__embedOwner=box;
    var u=resolveReplaySource(box.getAttribute('data-embed-src'));
    f.className='embed-frame';
    f.width=1440;
    f.height=900;
    // An offscreen demo must not steal focus or scroll its ancestor article.
    f.inert=true;
    if('IntersectionObserver' in window){
      var visibility=new IntersectionObserver(function(entries){
        f.inert=!entries[0].isIntersecting&&activeFrame!==f;
      });
      visibility.observe(f);
    }else{
      f.inert=false;
    }
    f.src=u+(u.indexOf('?')>=0?'&':'?')+'v='+VERSION;
    f.setAttribute('allow','autoplay; fullscreen');
    f.title=box.getAttribute('data-embed-title')||cover.getAttribute('aria-label')||'MAGIC 回放';
    // The wrapper document loading does not mean its nested product is ready.
    // Keep the cover visible until the replay explicitly reports readiness.
    f.addEventListener('load',function(){box.dataset.embedShell='loaded';});
    function failed(){
      if(!box.classList.contains('is-loading'))return;
      clearTimeout(box._embedTimeout);
      f.remove();
      box.classList.remove('is-loading');
      box.classList.add('is-error');
      loading.querySelector('.embed-loading-text').textContent='加载超时，点击重试';
      if(cover.tagName==='BUTTON')cover.setAttribute('aria-label','演示加载超时，点击重试');
    }
    f.addEventListener('error',failed);
    box._embedTimeout=setTimeout(failed,25000);
    cover.insertAdjacentElement('afterend',f);
    if(focusFrame){f.inert=false;f.focus({preventScroll:true});}
  }

  document.querySelectorAll('[data-embed-src]').forEach(function(box){
    var cover=box.querySelector('.embed-cover');if(!cover)return;
    if(box.hasAttribute('data-embed-autoplay')){
      cover.setAttribute('aria-hidden','true');
      cover.addEventListener('click',function(){if(box.classList.contains('is-error'))mountReplay(box,cover,true);});
      if('IntersectionObserver' in window){
        var observer=new IntersectionObserver(function(entries){
          if(!entries[0]||!entries[0].isIntersecting)return;
          observer.disconnect();
          mountReplay(box,cover,false);
        },{rootMargin:'80px 0px'});
        observer.observe(box);
      }else{
        mountReplay(box,cover,false);
      }
      return;
    }
    cover.addEventListener('click',function(){mountReplay(box,cover,true);});
  });
  addEventListener('message',function(event){
    if((location.protocol!=='file:'&&event.origin!==location.origin)||!event.data)return;
    var frames=document.querySelectorAll('.embed-frame');
    for(var i=0;i<frames.length;i++){
      if(event.source!==frames[i].contentWindow)continue;
      if(event.data.type==='magic-replay:ready'){
        var owner=frames[i].__embedOwner||frames[i].closest('[data-embed-src]');
        if(owner){
          clearTimeout(owner._embedTimeout);
          owner.classList.remove('is-loading','is-error');
          owner.classList.add('is-loaded');
        }
      }else if(event.data.type==='magic-replay:toggle-expand'){
        openExpanded(frames[i]);
      }
      break;
    }
  });
  addEventListener('keydown',function(event){if(event.key==='Escape')closeExpanded();});
})();
