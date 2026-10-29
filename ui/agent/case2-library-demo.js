(function () {
  if (new URLSearchParams(location.search).get('demo') !== 'case2') return;

  const cards = [
    { name: '沉睡会员召回经营', goal: '唤醒', date: '2026-10-12 21:01:17', desc: '沉睡会员召回经营。面向连续 90 天未活跃的存量老客，通过多波次、多渠道召回触达，结合会员价值分层匹配差异化召回权益。', opensDetail: true }
  ];

  const style = document.createElement('style');
  style.textContent = `
    body.case2-library-open .case2-replay-bar{display:none}
    html.case2-library-open,body.case2-library-open{overflow:hidden!important}
    .case2-library-demo{position:fixed;inset:0;width:100vw;height:100vh;max-width:100vw;z-index:180;display:flex;flex-direction:column;background:#fff;color:#1c1c1c;font-family:PingFang SC,-apple-system,BlinkMacSystemFont,sans-serif;overflow:hidden}
    .case2-library-demo *{box-sizing:border-box}
    .case2-library-demo__header{height:72px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:0 28px;border-bottom:1px solid #eee}
    .case2-library-demo__tabs{display:flex;align-items:center;gap:18px;font-size:16px}
    .case2-library-demo__tabs strong{display:inline-flex;align-items:center;height:34px;padding:0 12px;border-radius:7px;background:#1c1c1c;color:#fff;font-weight:500}
    .case2-library-demo__tabs span{color:#6f6f6f}
    .case2-library-demo__segment{position:absolute;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:2px;padding:4px;border-radius:9px;background:#f3f3f3;font-size:14px}
    .case2-library-demo__segment span,.case2-library-demo__segment b{padding:6px 15px;border-radius:7px;white-space:nowrap}
    .case2-library-demo__segment span{color:#777;font-weight:400}
    .case2-library-demo__segment b{background:#fff;font-weight:600}
    .case2-library-demo__back{border:0;background:transparent;color:#505050;font:inherit;font-size:13px;cursor:pointer;padding:8px;border-radius:6px}
    .case2-library-demo__back:hover{background:#f4f4f4}
    .case2-library-demo__back:focus-visible,.case2-library-demo__filter button:focus-visible,.case2-library-demo__search:focus-visible{outline:2px solid #5555ec;outline-offset:2px}
    .case2-library-demo__body{flex:1;min-height:0;overflow:auto;padding:20px 28px 32px}
    .case2-library-demo__filters{display:flex;align-items:center;gap:22px;margin-bottom:18px}
    .case2-library-demo__filter{display:flex;align-items:center;gap:7px;white-space:nowrap}
    .case2-library-demo__filter>span{color:#999;font-size:14px;margin-right:3px}
    .case2-library-demo__filter>span:not(:first-child){border-radius:6px;background:#f6f6f6;color:#4b4b4b;padding:7px 10px;font-size:13px;white-space:nowrap}
    .case2-library-demo__filter>span.is-current{background:#f0efff;color:#5555ec}
    .case2-library-demo__search{margin-left:auto;min-width:190px;width:220px;height:34px;border:1px solid #ddd;border-radius:7px;background:#fff;padding:0 12px;font:inherit;font-size:13px;pointer-events:none}
    .case2-library-demo__search:disabled{background:#fafafa;color:#888;cursor:not-allowed}
    .case2-library-demo__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
    .case2-library-demo__card{min-height:178px;padding:16px 18px;display:flex;flex-direction:column;border:1px solid #e3e3e3;border-radius:9px;background:#fff}
    .case2-library-demo__card.is-clickable{cursor:pointer;transition:border-color .15s ease,background .15s ease}
    .case2-library-demo__card.is-clickable:hover{border-color:#c9c5ff;background:#fdfcff}
    .case2-library-demo__card.is-clickable:focus-visible{outline:2px solid #5555ec;outline-offset:2px}
    .case2-library-demo__card-head{display:flex;align-items:flex-start;gap:12px}
    .case2-library-demo__icon{position:relative;display:block;width:40px;height:40px;flex:none;border-radius:8px;background:#f2edff}
    .case2-library-demo__icon:before{position:absolute;left:12px;top:10px;width:17px;height:21px;border-radius:3px;background:#9666f4;box-shadow:3px 2px 0 #c39cff;content:""}
    .case2-library-demo__icon:after{position:absolute;left:17px;top:15px;width:8px;height:9px;border:2px solid #fff;border-left-color:transparent;border-radius:50%;content:""}
    .case2-library-demo__title{min-width:0;flex:1;font-size:17px;line-height:24px;font-weight:600}
    .case2-library-demo__title small{display:block;margin-top:3px;color:#999;font-size:12px;font-weight:400;line-height:18px}
    .case2-library-demo__published{color:#28bfa5;font-size:12px;white-space:nowrap;padding-top:2px}
    .case2-library-demo__desc{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;margin:14px 0 13px;color:#858585;font-size:12px;line-height:20px}
    .case2-library-demo__date{margin-top:auto;color:#929292;font-size:12px}
    .case2-library-demo__empty{padding:56px;text-align:center;color:#777;font-size:14px}
    @media(max-width:1100px){.case2-library-demo__header{height:auto;min-height:64px;padding:10px 16px;gap:10px;flex-wrap:wrap}.case2-library-demo__tabs{gap:10px;font-size:14px}.case2-library-demo__segment{position:relative;inset:auto;left:auto;transform:none;order:3;width:100%;justify-content:center}.case2-library-demo__body{padding:16px}.case2-library-demo__filters{flex-wrap:wrap;gap:10px}.case2-library-demo__filter{flex-wrap:wrap;white-space:normal}.case2-library-demo__search{width:100%;min-width:0;margin-left:0}.case2-library-demo__grid{grid-template-columns:1fr}}
    @media(max-width:620px){.case2-library-demo__header{height:auto;min-height:64px;padding:10px 16px;gap:10px;flex-wrap:wrap}.case2-library-demo__tabs{gap:10px;font-size:14px}.case2-library-demo__segment{position:relative;inset:auto;left:auto;transform:none;order:3;width:100%;justify-content:center}.case2-library-demo__back{font-size:12px}.case2-library-demo__body{padding:14px}.case2-library-demo__filters{align-items:flex-start;gap:12px}.case2-library-demo__filter{flex-wrap:wrap;white-space:normal;gap:6px}.case2-library-demo__filter>span:not(:first-child){padding:6px 8px;font-size:12px}.case2-library-demo__search{width:100%;min-width:0}.case2-library-demo__grid{gap:12px}.case2-library-demo__card{min-height:0;padding:14px}}
  `;
  document.head.appendChild(style);

  let library = null;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  function renderLibraryList() {
    if (!library) return;
    const back = library.querySelector('.case2-library-demo__back');
    back.textContent = '返回策略详情';
    back.onclick = () => { library.remove(); library = null; document.body.classList.remove('case2-library-open'); document.documentElement.classList.remove('case2-library-open'); };
    library.querySelector('.case2-library-demo__body').innerHTML = `
      <div class="case2-library-demo__filters">
        <div class="case2-library-demo__filter"><span>状态：</span>${['全部','草稿','待澄清','编译中','失败','已发布'].map((label,index) => `<span class="${index===0?'is-current':''}" aria-disabled="true">${label}</span>`).join('')}</div>
        <div class="case2-library-demo__filter"><span>目标：</span>${['全部','拉新','促活','留存','转化','唤醒'].map((label,index) => `<span class="${index===0?'is-current':''}" aria-disabled="true">${label}</span>`).join('')}</div>
        <input class="case2-library-demo__search" type="search" placeholder="搜索策略名称" aria-label="搜索策略名称" disabled>
      </div>
      <div class="case2-library-demo__grid"></div>`;
    if (!library) return;
    library.querySelector('.case2-library-demo__grid').innerHTML = cards.map(card => `
      <article class="case2-library-demo__card is-clickable" role="button" tabindex="0" data-open-detail aria-label="打开沉睡会员召回经营策略详情">
        <div class="case2-library-demo__card-head"><span class="case2-library-demo__icon" aria-hidden="true"></span><div class="case2-library-demo__title">${escape(card.name)}<small>目标：${escape(card.goal)}</small></div><span class="case2-library-demo__published">已发布</span></div>
        <p class="case2-library-demo__desc">${escape(card.desc)}</p><div class="case2-library-demo__date">更新时间：${escape(card.date)}</div>
      </article>`).join('');
    const detailCard = library.querySelector('[data-open-detail]');
    const openStrategyDetail = () => {
      if (!library) return;
      library.remove();
      library = null;
      document.body.classList.remove('case2-library-open');
      document.documentElement.classList.remove('case2-library-open');
    };
    detailCard.addEventListener('click', openStrategyDetail);
    detailCard.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openStrategyDetail(); }
    });
  }

  function showLibrary() {
    const main = document.querySelector('main');
    if (!main || library) return;
    library = document.createElement('section');
    document.body.classList.add('case2-library-open');
    document.documentElement.classList.add('case2-library-open');
    window.scrollTo(0, 0);
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
    library.className = 'case2-library-demo';
    library.setAttribute('aria-label', '策略库列表');
    library.innerHTML = `
      <header class="case2-library-demo__header">
        <div class="case2-library-demo__tabs"><strong>活动策略</strong><span aria-disabled="true">活动规则</span></div>
        <div class="case2-library-demo__segment"><span aria-disabled="true">智能策略</span><b>策略库</b></div>
        <button class="case2-library-demo__back" type="button">返回策略详情</button>
      </header>
      <div class="case2-library-demo__body"></div>`;
    document.documentElement.appendChild(library);
    renderLibraryList();
  }

  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target.closest('.pmh-breadcrumb__link,.pmh-breadcrumb__back') : null;
    if (!target || target.textContent.trim() !== '策略库') return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showLibrary();
  }, true);
})();
