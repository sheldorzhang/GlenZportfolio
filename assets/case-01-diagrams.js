/* Match each inline diagram and its enlargement to the measured source canvas. */
(function(){
  "use strict";
  addEventListener("message",function(event){
    var offline=location.protocol==="file:";
    if((offline?event.origin!=="null":event.origin!==location.origin)||!event.data||event.data.type!=="portfolio:diagram-size") return;
    var width=Number(event.data.width),height=Number(event.data.height);
    if(!isFinite(width)||!isFinite(height)||width<1||height<1||width>10000||height>10000) return;
    document.querySelectorAll(".c1-shift-frame, #lb iframe.lb-frame").forEach(function(frame){
      if(frame.contentWindow!==event.source) return;
      var ratio=width+"/"+height;
      if(frame.classList.contains("c1-shift-frame")){
        frame.style.aspectRatio=ratio;
        var button=frame.parentElement.querySelector("[data-zoom-ratio]");
        if(button) button.setAttribute("data-zoom-ratio",ratio);
      }else{
        var room=Math.min(1440,innerWidth-48,(innerHeight-96)*width/height);
        frame.style.width=Math.max(1,Math.floor(room))+"px";
        frame.style.height=Math.max(1,Math.floor(room*height/width))+"px";
      }
    });
  });
})();
