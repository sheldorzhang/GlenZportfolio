/* magic-demo：霍格沃茨场景回放。脚本驱动，不连后端；数据全部虚构。 */
(function(){
var I=function(n,c){return '<svg class="icon icon-16'+(c?' '+c:'')+'" aria-hidden="true"><use href="#i-'+n+'"/></svg>'};
var row=function(k,v){return '<div class="demo-row"><span>'+k+'</span><b>'+v+'</b></div>'};
var rule=function(t,s,off){return '<div class="demo-rule"><p>'+t+'<small>'+s+'</small></p><span class="demo-toggle'+(off?' off':'')+'" role="img" aria-label="'+(off?'已关闭':'已开启')+'"></span></div>'};
var tier=function(n,p,s,cls){return '<div class="demo-tier'+(cls?' '+cls:'')+'"><b>'+n+'</b><span class="pct">'+p+'%</span><i style="--w:'+p+'%"></i><small>'+s+'</small></div>'};
var node=function(d,t,cls){return '<div class="demo-node'+(cls?' '+cls:'')+'"><b>'+d+'</b>'+t+'</div>'};
var poster=function(t,m,cls,ic){return '<div class="demo-poster'+(cls?' '+cls:'')+'"><div class="art"><span>霍格沃茨</span><b>'+t+'</b><span>秋冬上新</span></div><div class="meta">'+(ic?I(ic):'')+m+'</div></div>'};
var fn=function(k,w,v,c){return '<div class="demo-fn'+(c?' drop':'')+'"><span>'+k+'</span><i style="--w:'+w+'%"></i><em>'+v+'</em></div>'};
var chk=function(t,on){return '<div class="demo-check'+(on?' on':'')+'"><i>'+(on?I('check'):'')+'</i><p>'+t+'</p></div>'};
var card=function(ic,h,body,small){return '<div class="demo-card"><div class="demo-card-h">'+I(ic)+h+(small?'<small>'+small+'</small>':'')+'</div>'+body+'</div>'};

var clarify=function(done){return card('list-checks','还差几项信息',row('活动时间','10/25 – 11/10')+row('利益点',done?'<s>满 299 减 30</s>满 2 件 9 折':'满 299 减 30')+row('触达渠道','企微 + 短信')+(done?'':'<div class="demo-btns"><span class="demo-btn">稍后再说</span><span class="demo-btn pri">就按这个</span></div>'),'已预填 · 1 轮')};
var rules=card('file-text','这次会用到的规则',rule('① 老会员 = 近 12 个月买过 2 次以上','品牌规则 · 人群口径')+rule('② 近 30 天收到过营销消息的不再打扰','品牌规则 · 频次')+rule('③ 利益点必须写明有效期','品牌规则 · 文案合规'),'可关闭某条，方案随之重算');
var tiers=function(m){return card('users','策略草案 · 人群分档',tier('外套偏好',m?67:52,'命中规则 ① · 主推羊毛外套 · 满 2 件 9 折')+tier('靴履偏好',33,'命中规则 ① · 主推短靴 · 满 2 件 9 折')+tier('两类都买',m?0:15,m?'已并入外套偏好':'命中规则 ① · 外套 + 靴子搭配',m?'merged':''),'按品类偏好 · 占目标人群比例')+(m?'':'')};
var journey=function(e){return card('route','触达旅程',
 '<div class="demo-journey">'+node('D0','企微 + 短信推送')+node(e?'<s>D3</s> D4':'D3','未购再提醒',e?'edit':'')+node('购买','已购即停')+node('11/10','活动结束')+'</div>'+
 '<div class="demo-copy">D0 文案：'+(e?'【霍格沃茨】秋冬新款到店，羊毛外套和短靴满 2 件 9 折，11/10 截止。':'【霍格沃茨】秋冬新款到了，满 2 件 9 折，11/10 截止。')+'</div>'+
 '<span class="demo-fold">'+I('chevron-down')+'完整画布（分支、频控）在营销平台中查看</span>','2 档人群 · 4 个节点')};
var posters=function(f){return card('image','活动图文',
 '<div class="demo-chips" style="margin-bottom:12px"><span class="demo-chip on">'+I('check')+'暖调街拍</span><span class="demo-chip">简洁棚拍</span><span class="demo-chip">素材：外套 2 · 短靴 2</span></div>'+
 '<div class="demo-posters">'+poster('羊毛外套',f?'已选':'可选',f?'sel':'',f?'circle-check':'')+poster('短靴','可选','')+(f?poster('满 2 件 9 折','已补价格 · 已选','sel','circle-check'):poster('秋冬搭配','没有折扣价，利益点没写','flag','triangle-alert'))+'</div>','3 张 · 重绘插图')};
var checklist=function(s){return card('list-checks','发布前检查',row('人群','2 档（外套 67% · 靴履 33%）')+row('旅程','4 个节点')+row('文案','2 条')+row('海报','2 张')+row('时间','10/25 – 11/10')+
 '<div class="demo-btns">'+(s?'<span class="demo-status">'+I('clock')+'已提交审批</span>':'<span class="demo-btn">返回修改</span><span class="demo-btn pri">提交</span>')+'</div>')};
var funnel=card('chart-column','活动复盘',
 '<div class="demo-funnel">'+fn('触达',100,'100')+fn('打开',46,'46')+fn('进店',18,'18',1)+fn('下单',7,'7')+'</div><p class="demo-dropnote">打开 → 进店流失最多（相对指数，以触达 = 100）</p>','示例数据');
var sugg=function(on){return card('wrench','下一轮建议',chk('① 靴履档改到晚间推送',on)+chk('② D4 提醒换成新款图',false)+'<div class="demo-btns"><span class="demo-btn'+(on?' pri':'')+'">带入下一轮</span></div>')};

var S=[
{n:'发起',ann:{t:'先把要走的路摆出来',p:'一开始先把后面几步列出来，用户知道要走多远，中途才敢停下来改。',c:'无，用户可以直接改输入',d:'品牌 霍格沃茨（户外鞋服）；活动名「秋冬换季上新」'},
 items:[{k:'card',h:'<div class="demo-scenes"><div class="demo-scene on"><b>营销策略</b>策划一场活动</div><div class="demo-scene"><b>人群洞察</b>看看会员结构</div><div class="demo-scene"><b>活动复盘</b>分析上一场</div></div>'},
 {k:'user',t:'十月底做秋冬换季活动，唤醒老会员，主推外套和靴子。'},
 {k:'agent',t:'好的，这是一次活动策划。我们按这几步来：确认信息 → 人群 → 旅程 → 图文 → 发布。每一步你确认后我再往下走。'}]},
{n:'澄清卡',ann:{t:'只问会影响方案的空缺',p:'选项先帮用户填好，用户只需要改不对的那一项。问一轮就够了，问多了用户会烦。',c:'改了利益点后点「就按这个」',d:'日期与折扣均为虚构'},
 items:[{k:'agent',t:'还差 3 项信息，我先按品牌常用设置填好了，你看看哪项不对。'},
 {k:'card',id:'c2',h:clarify(false)},{k:'act',t:'把利益点改成「满 2 件 9 折」，点了「就按这个」'},{k:'swap',id:'c2',h:clarify(true)}]},
{n:'依据',ann:{t:'系统替运营记住规则',p:'这些规则是运营平时记在脑子里的。系统先替他记住，他只需要检查有没有用错。',c:'可以关掉某条规则，方案随之重算',d:'3 条规则均为虚构示例'},
 items:[{k:'tool',ic:'users',t:'调用 人群圈选 技能',tm:'1.2s'},{k:'tool',ic:'file-text',t:'读取 品牌规则 3 条',tm:'0.4s'},{k:'card',h:rules}]},
{n:'策略与人群',ann:{t:'分档要让人看得懂',p:'分档按品类偏好来，运营一眼看得懂为什么这群人收到这条消息。确认之前不会往下走。',c:'合并一档后点「确认策略」',d:'只用相对比例，不出现人数'},
 items:[{k:'agent',t:'按品类偏好分了三档，每档标了命中的规则和主推品类。'},{k:'card',id:'c4',h:tiers(false)},
 {k:'act',t:'把「两类都买」并入外套档'},{k:'swap',id:'c4',h:tiers(true)},{k:'act',ok:1,t:'确认策略'}]},
{n:'旅程与文案',ann:{t:'只露出要拍板的节点',p:'只露出需要用户拍板的几个节点，分支和频控交给营销平台。',c:'把 D3 改成 D4，改了一句文案',d:'文案为虚构示例'},
 items:[{k:'agent',t:'旅程按两档人群生成，文案里的利益点用的是你刚才确认的内容。'},{k:'card',id:'c5',h:journey(false)},
 {k:'act',t:'提醒改到 D4，D0 文案改了一句'},{k:'swap',id:'c5',h:journey(true)}]},
{n:'图文生成',ann:{t:'没依据的宁可空着',p:'查不到依据的信息宁可空着并标黄，也不让 AI 编一个价格出来。',c:'补上折扣价，选 2 张后确认',d:'素材为重绘插图，不用真实商品图'},
 items:[{k:'tool',ic:'image',t:'生成 海报 3 张 · 暖调街拍',tm:'6.8s'},{k:'card',id:'c6',h:posters(false)},
 {k:'agent',t:'第 3 张没有查到折扣价，利益点先空着，需要你补一下。'},{k:'act',t:'补上折扣价，选了 2 张'},{k:'swap',id:'c6',h:posters(true)},{k:'act',ok:1,t:'确认图文'}]},
{n:'确认发布',ann:{t:'发出去要走审批',p:'Agent 只能把方案交到这一步。真正发出去，要走企业原有的审批流程。',c:'点「提交」，状态变为「已提交审批」',d:'同上'},
 items:[{k:'agent',t:'这是这次的完整方案，确认后会提交到品牌的审批流程。'},{k:'card',id:'c7',h:checklist(false)},{k:'act',t:'点了「提交」'},{k:'swap',id:'c7',h:checklist(true)}]},
{n:'营销复盘',ann:{t:'复盘直接变成下一轮的起点',p:'复盘的结果直接变成下一轮的起点，不用把报告再看一遍、手动抄过去。',c:'勾选建议 ①，点「带入下一轮」',d:'漏斗只用相对指数'},
 items:[{k:'sep',t:'活动结束后'},{k:'tool',ic:'chart-column',t:'读取 活动数据',tm:'2.1s'},{k:'card',h:funnel},{k:'card',id:'c8',h:sugg(false)},
 {k:'act',t:'勾选建议 ①，点「带入下一轮」'},{k:'swap',id:'c8',h:sugg(true)}]}
];

var $=function(id){return document.getElementById(id)};
var chat=$('dChat'),ann=$('dAnn'),rail=$('dRail'),prog=$('dProg'),btnP=$('dPlay');
var RM=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var cur=0,playing=true,timers=[],DWELL=4800,GAP=RM?0:650;
S.forEach(function(s,i){
  rail.insertAdjacentHTML('beforeend','<li><span class="n">'+(i+1)+'</span>'+s.n+'</li>');
  var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','第 '+(i+1)+' 步：'+s.n);
  b.addEventListener('click',function(){go(i,true)});prog.appendChild(b);
});
function clear(){timers.forEach(clearTimeout);timers=[];if(raf)cancelAnimationFrame(raf)}
function el(it,i,anim){
  var d=document.createElement('div');
  if(it.k==='user'){d.className='demo-msg user';d.textContent=it.t}
  else if(it.k==='agent'){d.className='demo-msg agent';d.textContent=it.t}
  else if(it.k==='tool'){d.className='demo-tool';d.innerHTML=I(it.ic)+'<span>'+it.t+'</span>'+I('check')+'<em>'+it.tm+'</em>'}
  else if(it.k==='act'){d.className='demo-act';d.innerHTML='<span>'+I(it.ok?'circle-check':'pointer')+(it.ok?'已确认：':'')+it.t+'</span>'}
  else if(it.k==='sep'){d.className='demo-sep';d.textContent=it.t}
  else{d.innerHTML=it.h;d=d.firstElementChild;if(it.id)d.dataset.id=it.id}
  if(anim&&!RM)d.classList.add('demo-in');
  return d;
}
function place(it,anim){
  if(it.k==='swap'){var o=chat.querySelector('[data-id="'+it.id+'"]');if(o){var n=el({k:'card',h:it.h,id:it.id},0,false);o.replaceWith(n)}return}
  var d=el(it,0,anim);
  if(anim&&it.k==='agent'&&!RM){var full=it.t,k=0;d.textContent='';d.classList.add('demo-caret');
    var tick=function(){k+=2;d.textContent=full.slice(0,k);if(k<full.length)timers.push(setTimeout(tick,28));else d.classList.remove('demo-caret')};tick()}
  chat.appendChild(d);
}
function stepDur(s){var t=0;s.items.forEach(function(it){t+=GAP+(it.k==='agent'&&!RM?it.t.length*14:0)});return t}
var raf=0;
function go(i,user){
  clear();cur=Math.max(0,Math.min(S.length-1,i));
  chat.innerHTML='';
  for(var j=0;j<cur;j++){chat.appendChild(el({k:'sep',t:(j+1)+' · '+S[j].n}));S[j].items.forEach(function(it){if(it.k!=='sep')place(it,false)})}
  chat.appendChild(el({k:'sep',t:(cur+1)+' · '+S[cur].n},0,true));
  var s=S[cur],t=0;
  s.items.forEach(function(it){t+=GAP;timers.push(setTimeout(function(){if(it.k!=='sep')place(it,true);chat.scrollTop=chat.scrollHeight},t));if(it.k==='agent'&&!RM)t+=it.t.length*14});
  timers.push(setTimeout(function(){chat.scrollTop=chat.scrollHeight},t+60));
  var a=s.ann;
  ann.innerHTML='<span class="k">步骤 '+(cur+1)+' / '+S.length+' · '+s.n+'</span><h2>'+a.t+'</h2><p>'+a.p+'</p><dl><dt>人工确认</dt><dd>'+a.c+'</dd><dt>示例数据</dt><dd>'+a.d+'</dd></dl>';
  if(!RM){ann.classList.remove('demo-in');void ann.offsetWidth;ann.classList.add('demo-in')}
  [].forEach.call(rail.children,function(li,k){li.className=k<cur?'done':k===cur?'on':''});
  $('dBarStep').textContent=(cur+1)+' / '+S.length;$('dCount').textContent=(cur+1)+'/'+S.length;
  [].forEach.call(prog.children,function(b,k){b.style.setProperty('--f',k<cur?'100%':'0%');b.toggleAttribute('aria-current',k===cur)});
  $('dPrev').disabled=cur===0;$('dNext').disabled=cur===S.length-1;
  var total=t+DWELL,b=prog.children[cur],t0=performance.now();
  if(playing){
    var loop=function(now){var f=Math.min(1,(now-t0)/total);b.style.setProperty('--f',(f*100).toFixed(1)+'%');if(f<1)raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
    if(cur<S.length-1)timers.push(setTimeout(function(){go(cur+1)},total));
    else timers.push(setTimeout(function(){setPlay(false);b.style.setProperty('--f','100%')},total));
  }else b.style.setProperty('--f','100%');
}
function setPlay(p){playing=p;btnP.setAttribute('aria-label',p?'暂停':'播放');btnP.querySelector('use').setAttribute('href',p?'#i-pause':'#i-play')}
btnP.addEventListener('click',function(){if(playing){setPlay(false);clear();prog.children[cur].style.setProperty('--f','100%')}else{setPlay(true);go(cur===S.length-1?0:cur)}});
$('dPrev').addEventListener('click',function(){setPlay(false);go(cur-1,true)});
$('dNext').addEventListener('click',function(){setPlay(false);go(cur+1,true)});
$('dReplay').addEventListener('click',function(){setPlay(true);go(0)});
document.addEventListener('keydown',function(e){if(e.target.closest('input,textarea'))return;if(e.key==='ArrowRight'){setPlay(false);go(cur+1,true)}else if(e.key==='ArrowLeft'){setPlay(false);go(cur-1,true)}});
setPlay(!RM);go(0);
})();
