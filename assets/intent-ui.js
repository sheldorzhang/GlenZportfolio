(function(){
  'use strict';
  var modes=['forms','cards','charts'];
  var tabs=Array.prototype.slice.call(document.querySelectorAll('.intent-mode-tabs [role="tab"]'));
  var dateSelect=document.getElementById('trip-date');
  var budgetSelect=document.getElementById('trip-budget');
  var trip={confirmed:false,date:dateSelect.value,budget:Number(budgetSelect.value),places:{moma:true,park:true,highline:true}};
  var placeNames={moma:'现代艺术博物馆',park:'中央公园',highline:'High Line'};
  var activityCosts={moma:460,park:0,highline:208};
  var baseCosts={lodging:2805,food:1402,transport:401};
  function money(n){return '¥'+n.toLocaleString('zh-CN')}
  function setText(selector,value){document.querySelectorAll(selector).forEach(function(node){node.textContent=value})}
  function setMode(mode,focus){
    if(modes.indexOf(mode)<0)return;
    tabs.forEach(function(tab){var active=tab.dataset.mode===mode;tab.setAttribute('aria-selected',active?'true':'false');tab.tabIndex=active?0:-1;if(active&&focus)tab.focus()});
    document.querySelectorAll('.intent-mode-panel').forEach(function(panel){panel.hidden=panel.dataset.panel!==mode});
    render();
  }
  tabs.forEach(function(tab,index){
    tab.addEventListener('click',function(){setMode(tab.dataset.mode,false)});
    tab.addEventListener('keydown',function(event){
      var next=event.key==='ArrowRight'?(index+1)%modes.length:event.key==='ArrowLeft'?(index+modes.length-1)%modes.length:-1;
      if(next>=0){event.preventDefault();setMode(modes[next],true)}
    });
  });
  document.querySelectorAll('[data-go-mode]').forEach(function(button){button.addEventListener('click',function(){setMode(button.dataset.goMode,true)})});
  function markUnconfirmed(){
    trip.date=dateSelect.value;
    trip.budget=Number(budgetSelect.value);
    trip.confirmed=false;
    document.getElementById('trip-feedback').textContent='旅行条件已修改，请重新确认后用于后续规划。';
    render();
  }
  dateSelect.addEventListener('change',markUnconfirmed);
  budgetSelect.addEventListener('change',markUnconfirmed);
  document.getElementById('trip-confirm').addEventListener('click',function(){
    trip.date=dateSelect.value;
    trip.budget=Number(budgetSelect.value);
    trip.confirmed=true;
    document.getElementById('trip-feedback').textContent='旅行条件已确认，地点与预算已同步。';
    setMode('cards',false);
  });
  document.querySelectorAll('[data-place]').forEach(function(input){input.addEventListener('change',function(){trip.places[input.dataset.place]=input.checked;render()})});
  function itinerary(){
    var plans=[
      ['第 1 天',[trip.places.moma?'现代艺术博物馆':null,trip.places.park?'中央公园':null]],
      ['第 2 天',[trip.places.highline?'High Line 街区体验':null,'美食与城市漫步']],
      ['第 3 天',['自由探索','整理行李与返程']]
    ];
    var container=document.getElementById('trip-itinerary');
    container.replaceChildren();
    plans.forEach(function(plan){
      var card=document.createElement('div');card.className='intent-day';
      var title=document.createElement('b');title.textContent=plan[0];
      var detail=document.createElement('span');detail.textContent=plan[1].filter(Boolean).join(' · ')||'自由活动';
      card.append(title,detail);container.appendChild(card);
    });
  }
  function render(){
    itinerary();
    var chosen=Object.keys(trip.places).filter(function(key){return trip.places[key]}).map(function(key){return placeNames[key]});
    document.getElementById('cards-text-state').textContent='当前选择：'+(chosen.length?chosen.join('、'):'暂未选择地点')+'。';
    var note=trip.confirmed?'已确认 '+trip.date+' · 预算 '+money(trip.budget):'日期与预算仍是建议条件；请在 Forms 中确认。';
    document.getElementById('cards-confirm-note').textContent=note;
    document.getElementById('charts-confirm-note').textContent=note;
    var activity=Object.keys(trip.places).reduce(function(sum,key){return sum+(trip.places[key]?activityCosts[key]:0)},0);
    var costs=[baseCosts.lodging,baseCosts.food,baseCosts.transport,activity];
    var total=costs.reduce(function(sum,cost){return sum+cost},0);
    var difference=trip.budget-total;
    var comparison=difference>=0?'比预算低 '+money(difference):'超出预算 '+money(-difference);
    setText('[data-trip-total]',money(total));
    setText('[data-trip-budget]',money(trip.budget));
    setText('[data-trip-diff]',difference>=0?'还剩 '+money(difference):'超出 '+money(-difference));
    document.getElementById('trip-total').textContent=money(total);
    document.getElementById('trip-budget-note').textContent=comparison;
    document.getElementById('trip-activities').textContent=money(activity);
    var chart=document.getElementById('trip-chart');
    chart.replaceChildren();
    var names=['住宿','餐饮','交通','活动'];
    var colors=['#292929','#777','#aaa','#ddd'];
    costs.forEach(function(cost,index){var bar=document.createElement('span');bar.style.width=(cost/total*100)+'%';bar.style.background=colors[index];bar.title=names[index]+' '+money(cost);chart.appendChild(bar)});
    chart.setAttribute('aria-label','预计费用构成：'+names.map(function(name,index){return name+money(costs[index])}).join('，'));
  }
  render();
})();
