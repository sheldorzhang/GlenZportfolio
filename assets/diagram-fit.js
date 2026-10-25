/* Shared diagram sizing: preserve the complete canvas in inline, deck and lightbox frames. */
(function(){
  "use strict";
  var canvases=document.querySelectorAll(".canvas");
  if(canvases.length!==1) return;
  var canvas=canvases[0], embedded=window.parent!==window, scheduled=0;
  var initialHeight=getComputedStyle(canvas).height;
  var flexibleHeight=canvas.scrollHeight>canvas.clientHeight || !getComputedStyle(canvas).getPropertyValue("--fig-h").trim();
  function fit(){
    scheduled=0;
    var width=canvas.offsetWidth;
    // A flex/grid board can grow after screenshots or web fonts finish loading.
    canvas.style.height=initialHeight;
    var style=getComputedStyle(canvas),padding=parseFloat(style.paddingTop)+parseFloat(style.paddingBottom);
    var content=Array.from(canvas.children).filter(function(el){return getComputedStyle(el).position!=="absolute"});
    var required=content.reduce(function(total,el){
      var css=getComputedStyle(el);
      return total+Math.max(el.offsetHeight,el.scrollHeight)+parseFloat(css.marginTop||0)+parseFloat(css.marginBottom||0);
    },0)+Math.max(0,content.length-1)*(parseFloat(style.rowGap)||0)+padding;
    var height=Math.max(canvas.offsetHeight,required);
    if(flexibleHeight) height=Math.max(height,canvas.scrollHeight);
    canvas.style.height=Math.ceil(height)+"px";
    var margin=embedded?0:Math.min(72,innerWidth*.04,innerHeight*.04);
    var scale=Math.min((innerWidth-margin*2)/width,(innerHeight-margin*2)/height);
    if(!embedded) scale=Math.min(1,scale);
    if(!isFinite(scale)||scale<=0) return;
    canvas.style.position="absolute";
    canvas.style.transformOrigin="top left";
    canvas.style.left=Math.max(0,(innerWidth-width*scale)/2)+"px";
    canvas.style.top=Math.max(0,(innerHeight-height*scale)/2)+"px";
    canvas.style.transform="scale("+scale+")";
    if(embedded){
      document.documentElement.style.background=document.body.style.background="#fafafa";
      parent.postMessage({type:"portfolio:diagram-size",width:width,height:height},location.protocol==="file:"?"*":location.origin);
    }
  }
  function schedule(){if(!scheduled) scheduled=requestAnimationFrame(fit)}
  addEventListener("resize",schedule);
  addEventListener("load",schedule);
  document.querySelectorAll("img").forEach(function(img){img.addEventListener("load",schedule);img.addEventListener("error",schedule)});
  if(document.fonts) document.fonts.ready.then(schedule);
  fit();
})();
