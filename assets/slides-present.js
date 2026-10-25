/* 页内全屏：上栏标题 + 退出，下栏翻页 / 列表 / 重新开始。靠近上下边缘唤起，停住后收起。 */
(function(){
  "use strict";
  var IDLE = 1600;
  var TOP = 88;
  var BOTTOM = 128;
  var LEFT = 88;

  function icon(paths){
    return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">'+paths+"</svg>";
  }

  function deckTitle(root){
    var named = root.getAttribute("data-deck-title");
    if(named) return named;
    var h1 = document.querySelector(".case-head h1, h1");
    if(h1 && h1.textContent.trim()) return h1.textContent.trim();
    return (document.title || "").split("·")[0].trim() || "幻灯片";
  }

  function readCount(root){
    var curEl = root.querySelector("[data-current]");
    var totEl = root.querySelector("[data-total]");
    if(curEl && totEl && curEl.textContent.trim() && totEl.textContent.trim()){
      return {cur: parseInt(curEl.textContent, 10), tot: parseInt(totEl.textContent, 10)};
    }
    var count = root.querySelector(".slides-count");
    var match = count ? String(count.textContent).match(/(\d+)\s*\/\s*(\d+)/) : null;
    if(!match) return null;
    return {cur: parseInt(match[1], 10), tot: parseInt(match[2], 10)};
  }

  function click(root, selector){
    var node = root.querySelector(selector);
    if(node) node.click();
    return node;
  }

  function closeGrid(root){
    var grid = root.querySelector(".slides-grid");
    if(grid && grid.classList.contains("on")) click(root, "[data-grid-open], .slides-gridbtn");
  }

  function bind(root){
    if(!root || root.dataset.presentBound) return;
    root.dataset.presentBound = "1";

    var chrome = document.createElement("div");
    chrome.className = "present-chrome";
    chrome.setAttribute("aria-hidden", "true");
    chrome.innerHTML =
      '<div class="present-hot present-hot-top"></div>'+
      '<div class="present-hot present-hot-left"></div>'+
      '<div class="present-hot present-hot-bottom"></div>'+
      '<header class="present-top">'+
        '<p class="present-title"></p>'+
        '<button class="present-exit" type="button">'+icon('<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>')+"退出全屏</button>"+
      "</header>";
    var heading = document.createElement("p");
    heading.className = "slides-heading";
    heading.textContent = deckTitle(root);
    root.appendChild(heading);
    var back = root.querySelector(".slides-close");
    if(back){
      back.innerHTML = icon('<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>');
      var backLabel = back.getAttribute("data-back-label") || "返回文章";
      back.setAttribute("aria-label", backLabel + "（Esc）");
      back.setAttribute("title", backLabel);
    }
    root.appendChild(chrome);
    chrome.querySelector(".present-title").textContent = deckTitle(root);
    root.querySelectorAll(".slides-grid button").forEach(function(button){
      var label = button.textContent.trim();
      // Fixed-position labels escape the scrollable number rail without clipping.
      function positionLabel(){
        var box = button.getBoundingClientRect();
        button.style.setProperty("--chapter-hint-x", (box.right + 12) + "px");
        button.style.setProperty("--chapter-hint-y", (box.top + box.height / 2) + "px");
      }
      button.addEventListener("pointerenter", positionLabel);
      button.addEventListener("focus", positionLabel);
      button.setAttribute("aria-label", label);
    });
    var gridButton = root.querySelector("[data-grid-open], .slides-gridbtn");
    var gridPanel = root.querySelector(".slides-grid");
    if(gridButton && gridPanel){
      if(!gridPanel.id) gridPanel.id = "slide-menu-" + Array.from(document.querySelectorAll(".slides")).indexOf(root);
      gridButton.setAttribute("aria-controls", gridPanel.id);
      gridButton.setAttribute("aria-expanded", gridPanel.classList.contains("on") ? "true" : "false");
    }
    // Escape closes the current menu before the deck handles fullscreen or return.
    document.addEventListener("keydown", function(event){
      if(event.key !== "Escape" || !gridPanel || !gridPanel.classList.contains("on") || getComputedStyle(root).display === "none") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      gridPanel.classList.remove("on");
      if(gridButton && getComputedStyle(gridButton).display !== "none") gridButton.focus();
    }, true);
    root.addEventListener("focusin", function(){reveal()});
    var timer = 0;
    var holding = false;
    var wasFill = root.classList.contains("is-fill");

    function gridOpen(){
      var grid = root.querySelector(".slides-grid");
      return !!(grid && grid.classList.contains("on"));
    }

    function setShown(on){
      var fill = root.classList.contains("is-fill");
      var show = !fill || on || gridOpen();
      root.classList.toggle("is-chrome", fill && show);
      chrome.setAttribute("aria-hidden", fill && show ? "false" : "true");
      root.querySelectorAll(".slides-gridbtn, .slides-nav, .slides-restart, .present-exit").forEach(function(button){
        button.tabIndex = show ? 0 : -1;
      });
    }

    function arm(){
      clearTimeout(timer);
      if(holding || gridOpen() || chrome.contains(document.activeElement)) return;
      timer = setTimeout(function(){setShown(false)}, IDLE);
    }

    function reveal(){
      if(!root.classList.contains("is-fill")) return;
      setShown(true);
      arm();
    }

    function inBand(event){
      if(!root.classList.contains("is-fill") || root.hidden) return false;
      var box = root.getBoundingClientRect();
      if(box.width < 2 || box.height < 2) return false;
      var x = event.clientX;
      var y = event.clientY;
      return y <= box.top + TOP || y >= box.bottom - BOTTOM || x <= box.left + LEFT;
    }

    chrome.querySelector(".present-exit").addEventListener("click", function(){
      closeGrid(root);
      click(root, "[data-fill], .slides-fillbtn");
    });
    chrome.addEventListener("pointerdown", function(){holding = true; clearTimeout(timer)});
    chrome.addEventListener("pointerup", function(){holding = false; arm()});
    chrome.addEventListener("pointercancel", function(){holding = false; arm()});
    chrome.addEventListener("focusin", function(){setShown(true); clearTimeout(timer)});
    chrome.addEventListener("focusout", function(){arm()});

    function restart(){
      closeGrid(root);
      var first = root.querySelector(".slides-strip [data-i='0'], .slides-strip [data-index='0']");
      if(first) first.click();
      else click(root, "[data-prev], .slides-prev");
    }

    document.addEventListener("pointerdown", function(event){
      var grid = root.querySelector(".slides-grid");
      if(!grid || !grid.classList.contains("on")) return;
      if(grid.contains(event.target) || event.target.closest(".slides-gridbtn, [data-grid-open]")) return;
      grid.classList.remove("on");
    });
    document.addEventListener("pointermove", function(event){
      if(!root.classList.contains("is-fill")) return;
      if(inBand(event) || chrome.contains(event.target) || event.target.closest(".slides-gridbtn, .slides-nav, .slides-count, .slides-restart, .slides-help")) reveal();
    });
    document.addEventListener("keydown", function(event){
      if(!root.classList.contains("is-fill")) return;
      if(event.key !== "r" && event.key !== "R") return;
      if(event.metaKey || event.ctrlKey || event.altKey) return;
      var tag = document.activeElement && document.activeElement.tagName;
      if(tag === "INPUT" || tag === "TEXTAREA") return;
      if(getComputedStyle(root).display === "none") return;
      event.preventDefault();
      restart();
      reveal();
    });

    new MutationObserver(function(){
      var grid = root.querySelector(".slides-grid");
      if(grid){
        root.classList.toggle("is-grid", grid.classList.contains("on"));
        if(!root.classList.contains("is-fill") && grid.scrollWidth > grid.clientWidth){
          var active = grid.querySelector("button.on");
          if(active){
            var itemBox = active.getBoundingClientRect(), menuBox = grid.getBoundingClientRect();
            grid.scrollLeft += itemBox.left - menuBox.left - (menuBox.width - itemBox.width) / 2;
          }
        }
        if(gridButton) gridButton.setAttribute("aria-expanded", grid.classList.contains("on") ? "true" : "false");
      }
      var fill = root.classList.contains("is-fill");
      if(fill !== wasFill){
        wasFill = fill;
      if(fill){
        var grid = root.querySelector(".slides-grid");
        if(grid) grid.classList.remove("on");
        reveal();
      }else {clearTimeout(timer); setShown(false)}
      }else if(gridOpen()){
        setShown(true);
        clearTimeout(timer);
      }
    }).observe(root, {attributes: true, attributeFilter: ["class"], subtree: true});
  }

  function scan(){
    document.querySelectorAll(".slides").forEach(bind);
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan);
  else scan();
  new MutationObserver(scan).observe(document.documentElement, {childList: true, subtree: true});
})();
