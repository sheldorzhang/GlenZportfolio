/* 完整简历阅读层：正文与 2026-10-25 文字简历 PDF 同步。 */
(function(){
var PDF='assets/张耕-产品体验设计师-文字简历.pdf';
var d=document.createElement('div');d.id='resume';d.className='sheet';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','rs-title');d.hidden=true;
var resumeMarkup=`
  <header class="sheet-head">
    <h2 id="rs-title">张耕</h2>
    <p>UX / 产品体验设计师</p>
    <ul class="hero-tags"><li>AI-native 体验</li><li>AI Agent</li><li>复杂业务设计</li><li>设计系统</li><li>设计到实现</li></ul>
    <p class="sheet-contact"><a href="tel:18602806752">18602806752</a> ｜ 微信 coda0415 ｜ <a href="mailto:sheldorzhang@gmail.com">sheldorzhang@gmail.com</a></p>
  </header>
  <section class="sheet-sec sheet-core"><h3>核心能力</h3><ul>
    <li><b>业务驱动与全链路设计</b>：具备 10 年 B2B/B2C 产品体验设计经验，覆盖 SaaS、IM、电商营销等复杂场景。从业务目标与真实用户任务出发，统筹体验策略、交互逻辑与视觉表达，以用户研究和体验数据驱动设计决策，推动方案落地与效果验证。</li>
    <li><b>AI-native 与 AI Agent 体验设计</b>：具备 AI Agent、Multi-Agent 和生成式交互设计实践。围绕用户意图、任务执行及人机协作，设计动态界面、结构化产物、状态反馈与关键操作确认机制，兼顾效率、可解释性及用户控制权。</li>
    <li><b>设计体系与工程落地</b>：具备设计系统、组件化及 Design Token 实践经验，理解 React 前端技术体系；通过 AI Coding 构建可运行方案，协同产品、前后端及算法团队完成设计验证与工程落地。</li>
  </ul></section>
  <section class="sheet-sec"><h3>工作经历</h3>
    <div class="sheet-row"><h4>腾讯｜CSIG｜产品体验设计师</h4><span>2021.04 – 至今</span></div>
    <ul><li>负责企点营销云、企点商通、腾讯云 Mall 及鹅享团的体验设计，覆盖 AI Agent、B2B 行业协作、商家运营与消费端交易。</li><li>通过客户访谈、场景分析与体验走查梳理 90+ 项体验问题，方案采纳率约 90%；参与 TDesign 电商组件库共建，相关研发成本降低 20%，协同产品、研发与算法推动落地。</li></ul>
    <div class="sheet-row"><h4>喜马拉雅｜主播生态事业部｜UI 设计师</h4><span>2018.08 – 2021.04</span></div>
    <ul><li>主导有声节目制作平台体验重构，优化版权方、主播与运营的协作流程；撮合效率提升 20%、运营成本降低 70%，支撑 2000+ 音频节目上线。</li><li>推动多端设计规范建设，组件复用率提升 40%；参与「万物声」社交分享设计，任务完成率提升 50%。</li></ul>
    <div class="sheet-row"><h4>言几又（书店）/ AIUX 设计咨询公司｜UI 设计师</h4><span>2016.07 – 2018.08</span></div>
    <ul><li>负责 O2O 电商小程序、会员服务及品牌数字化体验设计，并建立门店物料规范。</li></ul>
  </section>
  <section class="sheet-sec"><h3>核心项目</h3>
    <div class="sheet-row"><h4>01｜腾讯企点营销云 MAGIC AI</h4><span>2024 – 至今</span></div>
    <p>企业级 AI Agent 产品体验设计。负责 Agent 基础配置、对话体验及营销云 AI 设计体系，推动从功能操作向意图驱动的任务协作转型。</p>
    <ul><li><b>体验策略</b>：针对营销工具分散和跨模块操作成本，依据任务复杂度、意图清晰度与执行风险，构建内嵌式 AI、Copilot、Multi-Agent 三类交互模式。</li><li><b>关键设计</b>：设计 Skill、知识库、工具配置及任务澄清、可编辑 Generative UI、状态反馈、执行确认与异常恢复；抽象表达、协作、产物三类组件及跨场景规范。</li><li><b>交付与验证</b>：协同产品、算法和研发推进 MAGIC Agent 自 2026 年初面向零售、文旅等客户交付；提出「14 天首次价值率」指标，用于引导流程与激活体验评估。</li></ul>
    <div class="sheet-row"><h4>02｜腾讯企点商通</h4><span>2023.04 – 至今</span></div>
    <p>B2B IM 与行业交易协作体验。负责金融 OTC、电子采配等行业的企业 IM 客户端、行业应用集成及 AI 交易辅助体验。</p>
    <ul><li><b>业务流程</b>：通过行业调研识别消息分散与跨系统切换问题，优化业务消息分类、筛选及会话组织，将查询、计算、询报价能力集成至会话侧边栏。</li><li><b>AI 应用</b>：将 NLP 与 Agent 能力融入 IM，设计群聊商机信息聚合、供需识别和潜在交易对象呈现，支持业务人员自主判断与跟进。</li><li><b>项目成果</b>：电子采配场景单次报价时间由约 20 分钟缩短至 30 秒（项目实测），相关能力持续应用于企业交易协作场景。</li></ul>
    <div class="sheet-row"><h4>03｜腾讯云 Mall / 鹅享团</h4><span>2021 – 2022</span></div>
    <p>零售电商与 B/C 双端增长体验。负责营销促销、商品交易、会员成长与商家后台，连接品牌商家、平台运营及消费者的关键任务。</p>
    <ul><li><b>消费端体验</b>：优化商品、购物车及结算链路的优惠规则、适用条件与收益表达，降低消费者理解成本，改善购买决策体验。</li><li><b>商家与增长设计</b>：优化营销模板、活动规则配置及会员成长机制；结合微信社群场景，设计团长开团、帮卖与参团流程，衔接营销参与与交易转化。</li><li><b>产品成果</b>：云 Mall 支持 4+ 行业解决方案，后台操作效率提升 40%，参与活动商家 GMV 增长 20%+；鹅享团冷启动单月 GMV 200 万+，平台注册用户 60 万+。</li></ul>
  </section>
  <section class="sheet-sec"><h3>其他项目</h3><div class="sheet-row"><h4>企点营销云 企微互动 SCRM</h4><span>2022</span></div><p>负责导购获客、客户运营及营销触达的跨端 MVP 体验设计；配置效率提升 30%，支持 6+ 客户付费。</p></section>
  <section class="sheet-sec"><h3>实践与探索</h3><div class="sheet-row"><h4>Be4D｜设计系统 × AI Coding</h4></div><p>探索 Design Token、组件规范与交互范式在 AI Coding 工作流中的复用，通过可运行方案连接设计资产、方案探索与前端实现。</p><div class="sheet-row"><h4>Intent UI｜意图驱动的生成式交互</h4></div><p>探索自然语言、动态表单与结构化结果的组合方式，构建 Generative UI 概念原型，研究 AI 任务协作中的动态交互体验。</p></section>
  <section class="sheet-sec"><h3>技能与工具</h3><ul><li><b>体验设计</b>：UX Research、Interaction Design、Information Architecture、User Journey、Service Blueprint、Usability Testing。</li><li><b>AI 产品</b>：AI-native Design、AI Agent、Multi-Agent、Workflow、Generative UI、Human-in-the-loop、Prompt Design。</li><li><b>设计与开发</b>：Figma、TDesign、Design Token、Cursor、CodeBuddy、React、Next.js、Tailwind CSS。</li></ul></section>
  <section class="sheet-sec"><h3>荣誉与教育</h3><p>腾讯 OUTSTANDING CONTRIBUTOR｜2022 年上半年</p><p>成都理工大学｜工业设计｜本科（学士）｜2016</p></section>
`;
d.innerHTML='<div class="sheet-scroll"><article class="sheet-paper">'+resumeMarkup+'</article></div><div class="sheet-bar"><button type="button" class="btn-close sheet-close" aria-label="关闭简历（Esc）"><svg class="icon icon-16" aria-hidden="true"><use href="#i-x"/></svg>关闭</button><a class="sheet-dl" href="'+PDF+'" download="张耕-产品体验设计师-文字简历.pdf"><svg class="icon icon-16" aria-hidden="true"><use href="#i-download"/></svg>下载 PDF</a></div>';
document.body.appendChild(d);
var last=null,sc=d.querySelector('.sheet-scroll'),paper=d.querySelector('.sheet-paper');
function focusables(){return [].slice.call(d.querySelectorAll('a[href],button'))}
function open(push){if(!d.hidden)return;last=document.activeElement;d.hidden=false;document.documentElement.classList.add('sheet-lock');sc.scrollTop=0;requestAnimationFrame(function(){d.classList.add('on')});d.querySelector('.sheet-close').focus({preventScroll:true});if(location.hash!=='#resume')history.replaceState(null,'',location.pathname+location.search+'#resume')}
function close(){if(d.hidden)return;d.classList.remove('on');d.hidden=true;document.documentElement.classList.remove('sheet-lock');if(location.hash==='#resume')history.replaceState(null,'',location.pathname+location.search);if(last&&last.focus)last.focus({preventScroll:true})}
window.__resume={open:open,close:close};
document.addEventListener('click',function(e){var t=e.target.closest('[data-resume],a[href="#resume"]');if(t){e.preventDefault();e.stopPropagation();open()}},true);
d.querySelector('.sheet-close').addEventListener('click',close);
sc.addEventListener('click',function(e){if(!paper.contains(e.target))close()});
document.addEventListener('keydown',function(e){if(d.hidden)return;if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return}
 if(e.key==='Tab'){var f=focusables(),a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}else if(!d.contains(document.activeElement)){e.preventDefault();a.focus()}}},true);
addEventListener('hashchange',function(){location.hash==='#resume'?open():close()});
if(location.hash==='#resume')open();
})();
