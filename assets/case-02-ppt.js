(function () {
  'use strict';
  if (!document.body.classList.contains('case03-ppt')) return;
  var back = document.querySelector('.nav-btn');
  if (back) back.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    location.href = 'index.html';
  }, true);

  var images = Array.from(document.querySelectorAll('.ppt-page img[data-zoom]'));
  images.forEach(function (image) {
    image.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        image.click();
      }
    });
  });

  // Keep existing slide mode; use small previews instead of full-size thumbnails.
  ['.slides-strip button img', '.slides-grid .g button img'].forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (thumbnail, index) {
      if (images[index]) thumbnail.src = images[index].dataset.thumb;
      thumbnail.width = 384;
      thumbnail.height = 216;
    });
  });
  document.querySelectorAll('.slides-slide img').forEach(function (image, index) {
    if (!images[index]) return;
    image.srcset = images[index].srcset;
    image.sizes = '100vw';
  });

  // Let native panning and pinch zoom reach every part of a large mobile slide.
  var panel = document.querySelector('#lb .lb-panel');
  if (panel) {
    ['touchstart', 'touchmove', 'touchend'].forEach(function (name) {
      panel.addEventListener(name, function (event) {
        if (matchMedia('(max-width: 767px)').matches) event.stopPropagation();
      }, {passive: true});
    });
    new MutationObserver(function () {
      if (!document.querySelector('#lb.on')) return;
      panel.scrollTop = 0;
      panel.scrollLeft = 0;
      var expanded = panel.querySelector('img');
      var source = images.find(function (image) {
        return image.getAttribute('data-zoom-src') === expanded.getAttribute('src');
      });
      if (source) expanded.alt = source.alt;
    }).observe(panel.querySelector('img'), {attributes: true, attributeFilter: ['src']});
  }
})();
