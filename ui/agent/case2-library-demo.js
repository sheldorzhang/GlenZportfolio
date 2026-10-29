(function () {
  if (new URLSearchParams(location.search).get('demo') !== 'case2') return;

  const cards = [
    { name: '首购新客二次复购经营', goal: '留存', date: '2026-10-22 14:20:52', desc: '首购新客二次复购经营。针对已完成首次购买的新客，在首单完成后 15 天内窗口期，通过三波递进式经营节奏推动用户完成第二次复购。' },
    { name: '会员复购关怀', goal: '留存', date: '2026-10-15 16:37:17', desc: '会员复购关怀。面向近 90 天内有消费的会员，在活动周期内通过短信与企微的连续关怀，促进会员再次购买。' },
    { name: '沉睡会员召回经营', goal: '唤醒', date: '2026-10-12 21:01:17', desc: '沉睡会员召回经营。面向连续 90 天未活跃的存量老客，通过多波次、多渠道召回触达，结合会员价值分层匹配差异化召回权益。', opensDetail: true },
    { name: '沉睡会员短信召回策略', goal: '唤醒', date: '2026-10-10 16:39:44', desc: '沉睡会员召回。针对进入沉睡状态的会员进行主动召回，通过短信渠道触达，按会员价值分层发送差异化召回内容，推动沉睡会员重新活跃。' },
    { name: '近期消费会员复购关怀策略', goal: '留存', date: '2026-10-08 11:03:55', desc: '面向近期有消费记录的会员，通过短信关怀与导购企微回访的连续配合，引导会员使用本期福利并促成复购。' },
    { name: '优衣库商品促销策略', goal: '转化', date: '2026-09-29 14:19:56', desc: '面向优衣库客户进行商品促销触达，根据人群分群属性与实验分流决定是否推送短信。' }
  ];

  const style = document.createElement('style');
  style.textContent = `
    body.case2-library-open .case2-replay-bar{display:none}
    .case2-library-demo{position:absolute;inset:0;z-index:180;display:flex;flex-direction:column;background:#fff;color:#1c1c1c;font-family:PingFang SC,-apple-system,BlinkMacSystemFont,sans-serif;overflow:hidden}
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
    .case2-library-demo__detail{max-width:980px;margin:22px auto;padding:26px;border:1px solid #e5e5e5;border-radius:10px;background:#fff}
    .case2-library-demo__detail h1{margin:0;font-size:22px;line-height:1.4;font-weight:600}
    .case2-library-demo__detail-meta{display:flex;gap:18px;margin-top:10px;color:#777;font-size:13px}
    .case2-library-demo__detail-desc{margin:24px 0 30px;color:#666;font-size:14px;line-height:1.8}
    @media(max-width:900px){.case2-library-demo__body{padding:16px}.case2-library-demo__filters{flex-wrap:wrap;gap:10px}.case2-library-demo__search{margin-left:0}.case2-library-demo__grid{grid-template-columns:1fr}.case2-library-demo__segment{position:static;transform:none}}
    @media(max-width:620px){.case2-library-demo__header{height:auto;min-height:64px;padding:10px 16px;gap:10px;flex-wrap:wrap}.case2-library-demo__tabs{gap:10px;font-size:14px}.case2-library-demo__segment{order:3;width:100%;justify-content:center}.case2-library-demo__back{font-size:12px}.case2-library-demo__body{padding:14px}.case2-library-demo__filters{align-items:flex-start;gap:12px}.case2-library-demo__filter{flex-wrap:wrap;white-space:normal;gap:6px}.case2-library-demo__filter>span:not(:first-child){padding:6px 8px;font-size:12px}.case2-library-demo__search{width:100%;min-width:0}.case2-library-demo__grid{gap:12px}.case2-library-demo__card{min-height:0;padding:14px}.case2-library-demo__detail{margin:8px auto;padding:18px}.case2-library-demo__detail h1{font-size:19px}}
  `;
  document.head.appendChild(style);

  let library = null;
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

  function renderStrategyDetail(card) {
    if (!library) return;
    const back = library.querySelector('.case2-library-demo__back');
    back.textContent = '返回策略库';
    back.onclick = renderLibraryList;
    library.querySelector('.case2-library-demo__body').innerHTML = `
      <article class="case2-library-demo__detail">
        <h1>${escape(card.name)}</h1>
        <div class="case2-library-demo__detail-meta"><span>目标：${escape(card.goal)}</span><span>已发布</span></div>
        <p class="case2-library-demo__detail-desc">${escape(card.desc)}</p>
        <div class="case2-library-demo__date">更新时间：${escape(card.date)}</div>
      </article>`;
  }

  function renderLibraryList() {
    if (!library) return;
    const back = library.querySelector('.case2-library-demo__back');
    back.textContent = '返回策略详情';
    back.onclick = () => { library.remove(); library = null; document.body.classList.remove('case2-library-open'); };
    library.querySelector('.case2-library-demo__body').innerHTML = `
      <div class="case2-library-demo__filters">
        <div class="case2-library-demo__filter"><span>状态：</span>${['全部','草稿','待澄清','编译中','失败','已发布'].map((label,index) => `<span class="${index===0?'is-current':''}" aria-disabled="true">${label}</span>`).join('')}</div>
        <div class="case2-library-demo__filter"><span>目标：</span>${['全部','拉新','促活','留存','转化','唤醒'].map((label,index) => `<span class="${index===0?'is-current':''}" aria-disabled="true">${label}</span>`).join('')}</div>
        <input class="case2-library-demo__search" type="search" placeholder="搜索策略名称" aria-label="搜索策略名称" disabled>
      </div>
      <div class="case2-library-demo__grid"></div>`;
    if (!library) return;
    library.querySelector('.case2-library-demo__grid').innerHTML = cards.map(card => `
      ${card.opensDetail ? '<article class="case2-library-demo__card is-clickable" role="button" tabindex="0" data-open-detail aria-label="打开沉睡会员召回经营策略详情">' : '<article class="case2-library-demo__card">'}
        <div class="case2-library-demo__card-head"><span class="case2-library-demo__icon" aria-hidden="true"></span><div class="case2-library-demo__title">${escape(card.name)}<small>目标：${escape(card.goal)}</small></div><span class="case2-library-demo__published">已发布</span></div>
        <p class="case2-library-demo__desc">${escape(card.desc)}</p><div class="case2-library-demo__date">更新时间：${escape(card.date)}</div>
      </article>`).join('');
    const detailCard = library.querySelector('[data-open-detail]');
    const selectedCard = cards.find(card => card.opensDetail);
    detailCard.addEventListener('click', () => renderStrategyDetail(selectedCard));
    detailCard.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); renderStrategyDetail(selectedCard); }
    });
  }

  function showLibrary() {
    const main = document.querySelector('main');
    if (!main || library) return;
    main.style.position = 'relative';
    library = document.createElement('section');
    document.body.classList.add('case2-library-open');
    library.className = 'case2-library-demo';
    library.setAttribute('aria-label', '策略库列表');
    library.innerHTML = `
      <header class="case2-library-demo__header">
        <div class="case2-library-demo__tabs"><strong>活动策略</strong><span aria-disabled="true">活动规则</span></div>
        <div class="case2-library-demo__segment"><span aria-disabled="true">智能策略</span><b>策略库</b></div>
        <button class="case2-library-demo__back" type="button">返回策略详情</button>
      </header>
      <div class="case2-library-demo__body"></div>`;
    main.appendChild(library);
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
