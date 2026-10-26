(() => {
  const host = document.querySelector('[data-home-gradient]');
  if (!host) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    import('./home-gradient/home-gradient.js').catch(() => {
      host.dataset.gradientFailed = 'true';
    });
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        observer.disconnect();
        start();
      }
    }, { rootMargin: '400px 0px' });
    observer.observe(host);
  } else {
    start();
  }
})();
