/* Default page entry starts at the top; explicit deep links remain addressable. */
(function(){
  "use strict";
  if("scrollRestoration" in history) history.scrollRestoration="manual";
  var isHome=/(?:^|\/)index\.html$/.test(location.pathname)||location.pathname.endsWith("/");
  function top(){
    if(window.__smooth) window.__smooth.stop();
    window.scrollTo({top:0,left:0,behavior:"instant"});
  }
  if(!location.hash) top();
  addEventListener("pageshow",function(event){
    var entry=performance.getEntriesByType("navigation")[0];
    var historyReturn=event.persisted||(entry&&entry.type==="back_forward");
    if(isHome&&historyReturn&&location.hash!=="#resume"){
      history.replaceState(history.state,"",location.pathname+location.search);
      top();
    }else if(!location.hash) top();
  });
})();
