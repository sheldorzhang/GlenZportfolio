(function(){
'use strict';
var STATE={running:'执行中',pending:'待确认',confirmed:'已确认',done:'已完成'};
var ICO={
 chev:'<svg class="chev" viewBox="0 0 10 10"><path d="M3 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
 think:'<svg class="rp-ico" viewBox="0 0 16 16"><circle cx="8" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M6 13h4" stroke="currentColor" stroke-width="1.2"/></svg>',
 tool:'<svg class="rp-ico" viewBox="0 0 16 16"><rect x="2.5" y="3.5" width="11" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M5 7l2 1.5L5 10" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>',
 ok:'<svg class="rp-ico" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5" fill="currentColor"/><path d="M5 8.2l2 2 4-4.2" fill="none" stroke="#fff" stroke-width="1.5"/></svg>',
 spin:'<svg class="rp-ico" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="1.5"/><path d="M8 2a6 6 0 0 1 6 6" fill="none" stroke="currentColor" stroke-width="1.5"><animateTransform attributeName="transform" type="rotate" from="0 8 8" to="360 8 8" dur="1s" repeatCount="indefinite"/></path></svg>',
 play:'<svg class="rp-ico" viewBox="0 0 16 16"><path d="M5 3l8 5-8 5z" fill="currentColor"/></svg>',
 pause:'<svg class="rp-ico" viewBox="0 0 16 16"><path d="M4.5 3h2.5v10H4.5zM9 3h2.5v10H9z" fill="currentColor"/></svg>',
 replay:'<svg class="rp-ico" viewBox="0 0 16 16"><path d="M3 8a5 5 0 1 0 1.6-3.7" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M3 2.5V5.5h3" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>'
};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function h(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e;}
function md(src){
  var lines=src.split('\n'),out=[],i=0;
  function inl(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>');}
  while(i<lines.length){
    var l=lines[i];
    if(/^\s*\|/.test(l)){
      var rows=[];while(i<lines.length&&/^\s*\|/.test(lines[i])){rows.push(lines[i]);i++;}
      var t='<table>';rows.forEach(function(r,ri){
        if(/^\s*\|[\s\-:|]+\|?\s*$/.test(r))return;
        var cells=r.trim().replace(/^\||\|$/g,'').split('|');
        var tg=ri===0?'th':'td';t+='<tr>'+cells.map(function(c){return '<'+tg+'>'+inl(c.trim())+'</'+tg+'>';}).join('')+'</tr>';});
      out.push(t+'</table>');continue;}
    if(/^#{1,3}\s/.test(l)){out.push('<h2>'+inl(l.replace(/^#+\s/,''))+'</h2>');i++;continue;}
    if(/^\s*-\s/.test(l)){var li='<ul>';while(i<lines.length&&/^\s*-\s/.test(lines[i])){li+='<li>'+inl(lines[i].replace(/^\s*-\s/,''))+'</li>';i++;}out.push(li+'</ul>');continue;}
    if(/^>\s?/.test(l)){out.push('<blockquote>'+inl(l.replace(/^>\s?/,''))+'</blockquote>');i++;continue;}
    if(l.trim())out.push('<p>'+inl(l)+'</p>');i++;
  }
  return out.join('');
}
function fmt(ms){var s=Math.max(0,Math.round(ms/1000));return Math.floor(s/60)+':'+('0'+s%60).slice(-2);}

function Player(root,data){
  this.root=root;this.d=data;this.t=0;this.playing=false;this.speed=data.meta&&data.meta.defaultSpeed||1;
  this.build();this.compile();this.reset();this.renderTo(0);
}
var P=Player.prototype;
P.build=function(){
  var r=this.root;r.innerHTML='';
  var stage=h('div','rp-stage');
  var chat=h('div','rp-chat');
  this.bar=h('div','rp-bar');chat.appendChild(this.bar);
  this.scroll=h('div','rp-scroll');chat.appendChild(this.scroll);
  stage.appendChild(chat);
  this.side=h('aside','rp-side');var si=h('div','rp-side-in');this.side.appendChild(si);
  si.innerHTML='<h5>任务编排 <em class="prog-t">0/5</em></h5><div class="rp-progress"><i></i></div>';
  this.dagBox=h('div');si.appendChild(this.dagBox);
  this.jBox=h('div');si.appendChild(this.jBox);
  this.outHead=h('h5',null,'产出 <em class="out-n">0</em>');this.outHead.style.display='none';si.appendChild(this.outHead);
  this.outBox=h('div');si.appendChild(this.outBox);
  stage.appendChild(this.side);r.appendChild(stage);
  var c=h('div','rp-ctrl');var self=this;
  this.bPlay=h('button','rp-btn',ICO.play);this.bPlay.setAttribute('aria-label','播放');
  this.bPlay.onclick=function(){self.playing?self.pause():self.play();};
  var bRe=h('button','rp-btn',ICO.replay+'重播');bRe.onclick=function(){self.seek(0);self.play();};
  var tw=h('div','rp-track-wrap');this.track=h('div','rp-track','<div class="fill"></div><div class="knob"></div>');
  this.chapBox=h('div','rp-chaps');tw.appendChild(this.track);tw.appendChild(this.chapBox);
  this.track.onclick=function(e){var b=self.track.getBoundingClientRect();self.seek((e.clientX-b.left)/b.width*self.total);};
  this.timeEl=h('span','rp-time');
  var sp=h('div','rp-speeds');this.spBtns=[];
  (this.d.meta.speeds||[1,1.5,2]).forEach(function(v){var b=h('button','rp-btn',v+'x');b.onclick=function(){self.speed=v;self.syncSpeed();};b._v=v;self.spBtns.push(b);sp.appendChild(b);});
  [this.bPlay,bRe,tw,this.timeEl,sp].forEach(function(x){c.appendChild(x);});
  r.appendChild(c);this.syncSpeed();
};
P.syncSpeed=function(){var s=this.speed;this.spBtns.forEach(function(b){b.classList.toggle('on',b._v===s);});};
P.compile=function(){
  var tl=[],cur=0,chStart={};
  this.d.steps.forEach(function(s){
    var t=Math.max(s.startMs||0,cur);
    if(!(s.chapter in chStart))chStart[s.chapter]=t;
    s.parts.forEach(function(p,i){
      var dur=p.estMs||400;
      if(p.type==='status'&&p.state==='pending'&&i>0&&s.parts[i-1].type==='confirm')p._skip=true;
      tl.push({s:s,p:p,i:i,start:t,dur:dur});t+=dur;});
    cur=Math.max(t,(s.startMs||0)+(s.estMs||0));
  });
  this.tl=tl;this.total=Math.max(cur,this.d.meta.totalMs||0);
  this.chapters=this.d.chapters.map(function(c){return {id:c.id,title:c.title,start:c.id in chStart?chStart[c.id]:c.startMs};});
  var self=this;this.chapBox.innerHTML='';this.track.querySelectorAll('.mk').forEach(function(m){m.remove();});
  this.chapters.forEach(function(c){
    var pct=c.start/self.total*100;
    var mk=h('div','mk');mk.style.left=pct+'%';self.track.appendChild(mk);
    var b=h('button',null,esc(c.title));b.style.left=Math.min(pct,94)+'%';b.onclick=function(){self.seek(c.start+1);};c.btn=b;self.chapBox.appendChild(b);
  });
};
P.reset=function(){
  this.scroll.innerHTML='';this.bar.className='rp-bar';this.bar.innerHTML='';
  this.side.classList.remove('on');this.nodes={};this.done=0;this.dagBox.innerHTML='';this.jBox.innerHTML='';
  this.outBox.innerHTML='';this.outHead.style.display='none';this.outs={};
  this.side.querySelector('.prog-t').textContent='0/5';this.side.querySelector('.rp-progress i').style.width='0';
  this.msgs={};this.idx=0;this.active=[];this.t=0;this.barState=null;
  this.tl.forEach(function(e){e.el=null;e.fin=false;e.st=null;});
};
P.msgFor=function(s){
  if(!this.msgs[s.id]){var m=h('div','rp-msg '+s.role);this.scroll.appendChild(m);this.msgs[s.id]=m;}
  return this.msgs[s.id];
};
P.setBar=function(o){
  var b=this.bar;this.barState=Object.assign(this.barState||{},o);var st=this.barState;
  b.classList.add('on');
  b.innerHTML='<span class="rp-bar-label">'+esc(st.label||'')+'</span><span class="rp-chip '+st.state+'">'+
   (st.state==='confirmed'||st.state==='done'?ICO.ok:'<i class="dot"></i>')+esc(STATE[st.state]||'')+'</span><span class="rp-bar-desc">'+esc(st.state==='pending'&&st.reason?st.reason:(st.desc||''))+'</span>';
};
// returns element (or null) and an update(progress) function
P.make=function(e){
  var p=e.p,self=this,m;
  switch(p.type){
  case 'status':
    return {up:function(){if(p._skip)return;self.setBar({label:p.label,state:p.state,desc:p.desc||self.barState&&self.barState.desc,reason:p.reason});}};
  case 'flow':
    return {up:function(){self.flow(p);}};
  case 'text':
    m=this.msgFor(e.s);var el=h('div','rp-text');m.appendChild(el);
    var typing=e.s.role==='assistant';
    return {up:function(k){var n=typing?Math.round(p.text.length*k):p.text.length;el.innerHTML=md(p.text.slice(0,n));el.classList.toggle('rp-caret',typing&&k<1);}};
  case 'thinking':
    m=this.msgFor(e.s);return this.think(m,p);
  case 'tool':
    m=this.msgFor(e.s);var tr=this.tool(p);m.appendChild(tr);return {up:function(){}};
  case 'plan':
    m=this.msgFor(e.s);var c=h('div','rp-card rp-plan');
    c.innerHTML='<h4>'+esc(p.title)+'</h4><p class="muted">'+esc(p.objective||'')+'</p>'+
      (p.assumptions?'<div class="rp-tags">'+p.assumptions.map(function(a){return '<span class="rp-tag">'+esc(a)+'</span>';}).join('')+'</div>':'')+
      '<ol>'+(p.tasks||[]).map(function(t){return '<li>'+esc(t.title)+'<small>'+esc(t.desc||'')+'</small></li>';}).join('')+'</ol>';
    m.appendChild(c);return {up:function(){}};
  case 'confirm':
    m=this.msgFor(e.s);return this.confirm(m,e);
  case 'worker':
    m=this.msgFor(e.s);return this.worker(m,p);
  case 'artifact':
    return {up:function(){self.addOut(p);}};
  case 'summary':
    m=this.msgFor(e.s);var sc=h('div','rp-card rp-summary');
    sc.innerHTML='<div class="rp-tool" style="color:var(--color-fg)">'+ICO.ok+'<b>任务完成</b></div><h4 style="margin-top:4px">'+esc(p.title)+'</h4><div class="rp-files">'+
     p.files.map(function(f){return '<div class="rp-file" data-ref="'+esc(f.ref)+'"><span class="ext">'+esc(f.ext)+'</span><span>'+esc(f.name)+'</span></div>';}).join('')+'</div>';
    if(p.link){var a=h('button','rp-link',esc(p.link.label));a.onclick=function(){self.focusOut();};sc.appendChild(a);}
    sc.querySelectorAll('.rp-file').forEach(function(f){f.style.cursor='pointer';f.onclick=function(){self.focusOut(f.getAttribute('data-ref'));};});
    p.files.forEach(function(f){self.addOut({id:f.ref,name:f.name,ext:f.ext});});
    m.appendChild(sc);return {up:function(){}};
  }
  return {up:function(){}};
};
P.think=function(parent,p){
  var d=h('details','rp-fold rp-think');
  d.innerHTML='<summary>'+ICO.chev+ICO.think+'<span class="ttl"></span></summary><div class="rp-fold-body"></div>';
  parent.appendChild(d);var ttl=d.querySelector('.ttl'),body=d.querySelector('.rp-fold-body');var opened=false;
  return {el:d,up:function(k){
    if(k<1){if(!opened){d.open=true;opened=true;}d.classList.add('live');ttl.textContent=(p.title||'深度思考')+'中';body.textContent=p.text.slice(0,Math.round(p.text.length*k));}
    else{d.classList.remove('live');ttl.textContent=(p.title||'深度思考')+' · 已完成';body.textContent=p.text;if(opened&&!d._kept){d.open=false;d._kept=true;}}
  }};
};
P.tool=function(p){
  return h('div','rp-tool',ICO.tool+'<span><b>'+esc(p.label)+'</b>'+(p.input?'：'+esc(p.input):'')+(p.output?' · '+esc(p.output):'')+'</span>');
};
P.confirm=function(m,e){
  var p=e.p,self=this,c=h('div','rp-card rp-confirm');
  c.innerHTML='<h4>'+esc(p.title)+'</h4><div class="rp-opts">'+p.options.map(function(o){return '<div class="rp-opt" data-id="'+esc(o.id)+'"><i class="radio"></i>'+esc(o.text)+'</div>';}).join('')+'</div><div class="state"></div>';
  m.appendChild(c);var st=c.querySelector('.state');var pick=p.pick||p.options[0].id;var picked=false,pend=false;
  var nx=e.s.parts[e.i+1];
  return {up:function(k){
    if(!pend){pend=true;self.setBar({state:'pending',reason:nx&&nx.type==='status'&&nx.reason||'待确认'});st.innerHTML='<i class="dot"></i>等待确认';}
    if(!picked&&k*e.dur>=(p.autoPickMs||e.dur*0.6)){picked=true;
      c.querySelectorAll('.rp-opt').forEach(function(o){var on=o.getAttribute('data-id')===pick;o.classList.add(on?'picked':'dim');});
      st.innerHTML=ICO.ok+'已确认';self.setBar({state:'confirmed'});}
  }};
};
P.worker=function(m,p){
  var d=h('details','rp-fold rp-worker');
  d.innerHTML='<summary>'+ICO.chev+'<span class="wi">'+ICO.spin+'</span><b>'+esc(p.title)+'</b><span class="wsub"></span></summary><div class="rp-fold-body"></div>';
  m.appendChild(d);var body=d.querySelector('.rp-fold-body'),sub=d.querySelector('.wsub'),wi=d.querySelector('.wi');
  var kids=p.children||[],n=kids.length,shown=0,cur=null,self=this;
  return {up:function(k){
    var target=k>=1?n:Math.floor(k*(n+0.5));
    while(shown<target&&shown<n){
      if(cur)cur.up(1);
      var c=kids[shown];cur=null;
      if(c.type==='tool'){body.appendChild(self.tool(c));sub.textContent=c.label+(c.input?'：'+c.input:'');}
      else if(c.type==='thinking'){cur=self.think(body,c);sub.textContent='思考中';}
      else if(c.type==='text'){var t=h('div','rp-text');t.innerHTML=md(c.text);body.appendChild(t);}
      else if(c.type==='artifact'){body.appendChild(h('div','rp-file','<span class="ext">'+esc(c.ext)+'</span><span>'+esc(c.name)+'</span>'));self.addOut(c);}
      shown++;
    }
    if(cur&&k<1){var seg=1/(n+0.5);cur.up(Math.min(0.99,(k-(shown-1)*seg)/seg));}
    if(k>=1){if(cur)cur.up(1);wi.innerHTML=ICO.ok;wi.style.color='var(--color-fg)';sub.textContent=p.result||p.desc||'';
      if(p.result&&!d._r){d._r=1;body.appendChild(h('div','wres',esc(p.result)));}}
  }};
};
P.flow=function(p){
  this.side.classList.add('on');var self=this;
  (p.ops||[]).forEach(function(o){self.nodes[o.node]=o.state;});
  if(p.progress){this.side.querySelector('.prog-t').textContent=p.progress.done+'/'+p.progress.total;
    this.side.querySelector('.rp-progress i').style.width=(p.progress.done/p.progress.total*100)+'%';}
  this.drawDag();
  if(this.nodes[5]==='done')this.drawJourney();
};
P.drawDag=function(){
  var f=this.d.flow,L=f.layout,W=118,H=34,GX=130,GY=48,self=this;
  var pos=function(id){var c=L[id];return {x:6+c[0]*GX,y:6+c[1]*GY};};
  var s='<svg class="rp-dag" viewBox="0 0 '+(12+2*GX+W)+' '+(12+2*GY+H)+'">';
  f.nodes.forEach(function(n){if(!self.nodes[n.id])return;var b=pos(n.id);
    n.deps.forEach(function(dp){if(!self.nodes[dp])return;var a=pos(dp);var x1=a.x+W,y1=a.y+H/2,x2=b.x,y2=b.y+H/2,mx=(x1+x2)/2;
      s+='<path class="e" d="M'+x1+' '+y1+'C'+mx+' '+y1+' '+mx+' '+y2+' '+x2+' '+y2+'"/>';});});
  f.nodes.forEach(function(n){var st=self.nodes[n.id];if(!st)return;var b=pos(n.id);
    s+='<g class="n '+st+'" transform="translate('+b.x+','+b.y+')"><rect width="'+W+'" height="'+H+'" rx="8"/>'+
      (st==='done'?'<circle cx="14" cy="17" r="5" fill="var(--color-fg)"/>':'<circle cx="14" cy="17" r="4.5" fill="none" stroke="var(--color-accent)" stroke-width="1.5"/>')+
      '<text x="25" y="21">'+esc(n.title.length>8?n.title.slice(0,8)+'…':n.title)+'</text></g>';});
  this.dagBox.innerHTML=s+'</svg>';
};
P.drawJourney=function(){
  var j=this.d.journey;if(!j||this.jBox.innerHTML)return;
  var y=0,s='',W=300;
  j.nodes.forEach(function(n,i){
    var shape=n.kind==='decision'?'<path d="M'+(W/2-80)+' '+(y+17)+'L'+(W/2)+' '+y+'L'+(W/2+80)+' '+(y+17)+'L'+(W/2)+' '+(y+34)+'Z" fill="var(--color-surface)" stroke="var(--color-line)"/>':
      '<rect x="'+(W/2-90)+'" y="'+y+'" width="180" height="34" rx="'+(n.kind==='trigger'?17:8)+'" fill="'+(n.kind==='delay'?'var(--color-surface-sunken)':'var(--color-surface)')+'" stroke="var(--color-line)"/>';
    s+=shape+'<text x="'+W/2+'" y="'+(y+21)+'" text-anchor="middle">'+esc(n.title)+'</text>';
    if(n.outcomes)s+='<text x="'+(W/2+84)+'" y="'+(y+21)+'" font-size="10" fill="var(--color-fg-3)">'+esc(n.outcomes[0])+'</text><text x="'+(W/2+6)+'" y="'+(y+48)+'" font-size="10" fill="var(--color-fg-3)">'+esc(n.outcomes[1])+'</text>';
    y+=34;if(i<j.nodes.length-1){s+='<path d="M'+W/2+' '+y+'v20" stroke="var(--color-fg-3)"/>';y+=20;}
  });
  this.jBox.innerHTML='<h5>旅程预览 <em>示例</em></h5><svg class="rp-jsvg rp-dag" viewBox="0 0 '+W+' '+(y+4)+'">'+s+'</svg>';
};
P.addOut=function(a){
  if(this.outs[a.id])return;this.outHead.style.display='flex';
  var f=h('div','rp-file','<span class="ext">'+esc(a.ext)+'</span><span>'+esc(a.name)+'</span>');
  var pv=h('div','rp-prev');pv.innerHTML=a.preview?md(a.preview):'';var wrap=h('div');wrap.appendChild(f);wrap.appendChild(pv);
  f.onclick=function(){pv.classList.toggle('on');};
  this.outBox.appendChild(wrap);this.outs[a.id]={f:f,pv:pv};
  this.outHead.querySelector('.out-n').textContent=Object.keys(this.outs).length;
};
P.focusOut=function(ref){
  var self=this;this.side.classList.add('on');
  Object.keys(this.outs).forEach(function(k){var o=self.outs[k];var hit=!ref||k===ref;o.f.classList.toggle('flash',hit);if(ref&&hit)o.pv.classList.add('on');});
  this.outHead.scrollIntoView({behavior:'smooth',block:'nearest'});
};
P.renderTo=function(t){
  if(t<this.t||this.idx===undefined){this.reset();}
  this.t=t;var tl=this.tl;
  while(this.idx<tl.length&&tl[this.idx].start<=t){var e=tl[this.idx];e.st=this.make(e);this.active.push(e);this.idx++;}
  this.active=this.active.filter(function(e){var k=Math.min(1,(t-e.start)/e.dur);e.st.up(k);return k<1;});
  var pct=t/this.total*100;this.track.querySelector('.fill').style.width=pct+'%';this.track.querySelector('.knob').style.left=pct+'%';
  this.timeEl.textContent=fmt(t)+' / '+fmt(this.total);
  var cc=null;this.chapters.forEach(function(c){if(t>=c.start)cc=c;});this.chapters.forEach(function(c){c.btn.classList.toggle('cur',c===cc);});
};
P.stick=function(){this.scroll.scrollTop=this.scroll.scrollHeight;};
P.seek=function(t){t=Math.max(0,Math.min(this.total,t));if(t<this.t)this.reset();this.renderTo(t);this.stick();};
P.play=function(){
  if(this.t>=this.total)this.seek(0);
  this.playing=true;this.bPlay.innerHTML=ICO.pause;this.bPlay.setAttribute('aria-label','暂停');var self=this,last=performance.now();
  var loop=function(now){if(!self.playing)return;var dt=Math.min(100,now-last)*self.speed;last=now;
    var nt=Math.min(self.total,self.t+dt);var nearBottom=self.scroll.scrollHeight-self.scroll.scrollTop-self.scroll.clientHeight<120;
    self.renderTo(nt);if(nearBottom)self.stick();
    if(nt>=self.total){self.pause();self.root.dispatchEvent(new CustomEvent('rp:end'));return;}
    self.raf=requestAnimationFrame(loop);};
  this.raf=requestAnimationFrame(loop);
};
P.pause=function(){this.playing=false;cancelAnimationFrame(this.raf);this.bPlay.innerHTML=ICO.play;this.bPlay.setAttribute('aria-label','播放');};

function boot(){
  document.querySelectorAll('.rp[data-src]').forEach(function(root){
    fetch(root.getAttribute('data-src')).then(function(r){return r.json();}).then(function(d){
      var t=document.getElementById('rp-title'),n=document.getElementById('rp-note');
      if(t&&d.title)t.textContent=d.title;if(n&&d.note)n.textContent=d.note;
      var pl=new Player(root,d);root._player=pl;window.__rp=pl;
      if(d.meta&&d.meta.autoplayOnVisible&&'IntersectionObserver' in window){
        var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!pl._auto){pl._auto=1;pl.play();}});},{threshold:.3});io.observe(root);
      }
    }).catch(function(err){root.textContent='回放数据加载失败';console.error(err);});
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
