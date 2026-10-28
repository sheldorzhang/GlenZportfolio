/* 完整简历阅读层：正文与 2026-10-27 文字简历 PDF 同步。 */
(function(){
var PDF='assets/张耕-产品体验设计师-文字简历.pdf?v=20261028-portfolio-url';
var d=document.createElement('div');d.id='resume';d.className='sheet';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-labelledby','rs-title');d.hidden=true;
var resumeMarkup=`
  <header class="sheet-head">
    <h2 id="rs-title">张耕</h2>
    <p>UX / 产品体验设计师</p>
    <ul class="hero-tags"><li>AI-native 体验</li><li>AI Agent</li><li>复杂业务设计</li><li>设计系统</li><li>设计到实现</li></ul>
    <p class="sheet-contact"><a href="tel:18602806752">18602806752</a> ｜ 微信 coda0415 ｜ <a href="mailto:sheldorzhang@gmail.com">sheldorzhang@gmail.com</a></p>
    <img class="sheet-photo" src="assets/resume-photo.jpg?v=20261028-v1" alt="张耕职业头像" width="600" height="600" loading="lazy" decoding="async">
  </header>
  <section class="sheet-sec sheet-core"><h3>核心能力</h3><ul>
    <li><b>业务驱动与产品判断</b>：具备 10 年 B2B/B2C 产品体验设计经验，覆盖企业 SaaS、IM 与电商营销；通过访谈和场景分析识别问题，平衡用户、业务与技术约束，推动方案落地验证。</li>
    <li><b>AI Agent 与人机协作体验</b>：具备企业级 AI Agent 设计实践，依据任务复杂度、意图清晰度与执行风险设计澄清、确认、状态反馈及结构化产物，兼顾效率与用户控制权。</li>
    <li><b>设计体系与实现验证</b>：主导营销云 AI 设计体系，参与 TDesign 电商组件库共建；结构化设计规范、页面范式与知识资产，支持 AI Coding 规范化交付和可运行原型验证。</li>
  </ul></section>
  <section class="sheet-sec"><h3>工作经历</h3>
    <div class="sheet-row"><h4>腾讯｜CSIG｜产品体验设计师</h4><span>2021.04 – 至今</span></div>
    <ul><li><b>AI 产品交付与体验演进</b>：主导营销云 AI 设计体系，沉淀「表达、协作、产物」组件规范并推动关键能力上线；依据客户反馈、行为数据与竞品分析维护问题方案清单，跟进采纳落地，以 AI Coding 与工程联调推动实现。</li><li><b>行业协作与业务效率</b>：在电子采配有库存场景中，将询价信息最快约 30 秒呈现于 IM 侧边栏并支持一键回复；通过 NLP 识别与业务系统集成优化信息获取和响应流程。</li><li><b>业务覆盖</b>：负责企业营销、行业交易及零售电商体验设计；参与 TDesign 电商公共组件共建。</li></ul>
    <div class="sheet-row"><h4>喜马拉雅｜主播生态事业部｜UI 设计师</h4><span>2018.08 – 2021.04</span></div>
    <ul><li><b>内容生产与协作体验</b>：重构有声节目制作平台协作流程，支撑 2000+ 节目上线；推动多端规范与组件复用，参与「万物声」音频社交电商设计。</li></ul>
    <div class="sheet-row"><h4>言几又（书店）｜UI 设计师</h4><span>2017.06 – 2018.08</span></div>
    <ul><li><b>新零售与品牌体验</b>：负责品牌电商小程序、会员及 O2O 消费体验，建立门店运营物料规范。</li></ul>
    <div class="sheet-row"><h4>AIUX 设计咨询公司｜产品设计师</h4><span>2016.09 – 2017.06</span></div>
    <ul><li><b>多客户产品设计</b>：参与鲁大师、PandaPia、芒果云项目，负责体验方案与高保真原型，协同推进评审交付。</li></ul>
  </section>
  <section class="sheet-sec"><h3>核心项目</h3>
    <div class="sheet-row"><h4>01｜腾讯企点营销云 MAGIC AI</h4><span>2024 – 至今</span></div>
    <p>企业级 AI Agent 产品体验设计。负责 Agent 基础配置、任务协作与营销云 AI 设计体系，推动三类体验模式及关键协作机制落地，支持行业客户交付。</p>
    <ul><li><b>体验策略</b>：结合营销任务及其复杂度、意图清晰度与执行风险，设计内嵌式 AI、Copilot、Multi-Agent 三类模式；通过过程分层、问题澄清与计划确认，支持用户判断与决策。</li><li><b>设计系统与工作流</b>：针对多角色 AI Coding 产出质量不一，结构化设计规范、页面范式与知识库，沉淀 AI 可用资产与 Skill，完善生成、走查和迭代流程，推动跨角色规范化交付。</li></ul>
    <div class="sheet-row"><h4>02｜腾讯企点商通</h4><span>2023.04 – 至今</span></div>
    <p>B2B IM 与行业交易协作体验。负责金融 OTC、电子采配等行业的企业 IM 与行业应用体验设计，依托 QQ B2B 行业社交生态，将 IM 从沟通工具延伸为业务协作入口。</p>
    <ul><li><b>行业场景与任务整合</b>：针对行业关系和业务沟通集中于 IM、独立系统难以建联的问题，将库存查询、计算与询报价能力融入会话侧边栏，支持业务人员在沟通中获取信息并快速响应。</li><li><b>AI 驱动的交易辅助</b>：结合 NLP 与 Agent 能力，设计面向电子行业的「电子通」及询报价机器人，帮助业务人员从会话中识别交易线索，再自主判断与跟进。</li></ul>
    <div class="sheet-row"><h4>03｜腾讯云 Mall / 鹅享团</h4><span>2021 – 2022</span></div>
    <p>零售电商与 B/C 双端增长体验。负责零售电商与社群团购产品体验，以商家运营效率和消费者交易转化为重点，覆盖营销配置、商品交易、会员成长及 KA 客户定制化交付。</p>
    <ul><li><b>商家端｜营销配置与运营效率</b>：围绕复杂营销规则与活动搭建成本，优化营销模板、批量操作、所见即所得配置及会员成长机制，降低商家运营负担。</li><li><b>消费端｜购买决策与交易转化</b>：优化商品、购物车及结算链路的优惠规则、适用条件与收益表达；结合微信社群场景设计团长开团、帮卖与参团流程，衔接营销参与、购买决策与交易转化。</li><li><b>项目成果</b>：云 Mall 支持 4+ 行业方案，后台操作效率提升 40%，参与活动商家 GMV 增长 20%+；鹅享团冷启动单月 GMV 200 万+，平台注册用户 60 万+。</li></ul>
  </section>
  <section class="sheet-sec"><h3>其他项目</h3><div class="sheet-row"><h4>企点营销云 企微互动 SCRM</h4><span>2022</span></div><p>负责导购获客、客户运营及营销触达的跨端 MVP 体验设计，营销配置效率提升 30%，产品支持 6+ 付费客户使用。</p></section>
  <section class="sheet-sec"><h3>实践与探索</h3><div class="sheet-row"><h4>Be4D｜设计系统 × AI Coding</h4></div><p>探索 AI Coding 前置设计约束的方法，将 Design Token、组件规范与交互范式应用于可运行原型，研究标准化复用与创造性探索的平衡。</p><div class="sheet-row"><h4>Intent UI｜意图驱动的生成式体验</h4></div><p>探索自然语言、动态表单与结构化产物的组合方式，构建 Generative UI 概念原型，研究用户意图变化下的动态界面与人机协作体验。</p></section>
  <section class="sheet-sec"><h3>技能与工具</h3><ul><li><b>产品与体验设计</b>：UX Research、Complex Workflow、Information Architecture、User Journey、Service Blueprint、Usability Testing。</li><li><b>AI 产品体验</b>：AI Agent UX、Multi-Agent、Human-AI Interaction、Generative UI、Human-in-the-loop、Agent Workflow。</li><li><b>设计系统与实现</b>：Design Systems、Design Tokens、Figma、TDesign、AI Coding（Cursor、CodeBuddy）；React、Next.js、Tailwind CSS（可运行原型与工程协作）。</li></ul></section>
  <section class="sheet-sec"><h3>荣誉与教育</h3><p>腾讯 OUTSTANDING CONTRIBUTOR｜2022 年上半年</p><p>成都理工大学｜工业设计｜本科（学士）｜2016</p></section>
`;
var resumeMarkupEn=`
  <header class="sheet-head">
    <h2 id="rs-title">Geng Zhang</h2>
    <p>UX / Product Experience Designer</p>
    <ul class="hero-tags"><li>AI-native Experience</li><li>AI Agents</li><li>Complex Business Design</li><li>Design Systems</li><li>Design to Delivery</li></ul>
    <p class="sheet-contact"><a href="tel:18602806752">18602806752</a> ｜ WeChat coda0415 ｜ <a href="mailto:sheldorzhang@gmail.com">sheldorzhang@gmail.com</a></p>
    <img class="sheet-photo" src="assets/resume-photo.jpg?v=20261028-v1" alt="Portrait of Geng Zhang" width="600" height="600" loading="lazy" decoding="async">
  </header>
  <section class="sheet-sec sheet-core"><h3>Core Capabilities</h3><ul>
    <li><b>Business-driven Product Judgment</b>: 10 years of B2B and B2C product experience design across enterprise SaaS, IM, and e-commerce marketing. Identify problems through interviews and scenario analysis, balance user, business, and technical constraints, and validate solutions in practice.</li>
    <li><b>AI Agent and Human-AI Collaboration</b>: Enterprise AI Agent design experience. Shape clarification, confirmation, status feedback, and structured outputs around task complexity, intent clarity, and execution risk—balancing efficiency with user control.</li>
    <li><b>Design Systems and Implementation Validation</b>: Led the AI design system for Marketing Cloud and contributed to the TDesign e-commerce component library. Structured design guidelines, page patterns, and knowledge assets to support consistent AI-assisted delivery and runnable prototype validation.</li>
  </ul></section>
  <section class="sheet-sec"><h3>Experience</h3>
    <div class="sheet-row"><h4>Tencent | CSIG | Product Experience Designer</h4><span>Apr 2021 – Present</span></div>
    <ul><li><b>AI Product Delivery and Experience Evolution</b>: Led the Marketing Cloud AI design system, codified component patterns for expression, collaboration, and deliverables, and drove key capabilities to launch. Maintained a prioritized problem-solution backlog using customer feedback, behavioral data, and competitive analysis; followed through on adoption and delivery with AI coding and engineering collaboration.</li><li><b>Industry Collaboration and Business Efficiency</b>: In electronics procurement scenarios with available inventory, brought inquiry details into the IM sidebar in as little as 30 seconds and enabled one-click replies. Used NLP and business-system integrations to improve information access and response workflows.</li><li><b>Business Coverage</b>: Designed experiences across enterprise marketing, industry transactions, and retail e-commerce; contributed to shared TDesign e-commerce components.</li></ul>
    <div class="sheet-row"><h4>Himalaya | Creator Ecosystem | UI Designer</h4><span>Aug 2018 – Apr 2021</span></div>
    <ul><li><b>Content Production and Collaboration</b>: Reworked collaboration workflows for an audio program production platform, supporting the launch of 2,000+ programs. Promoted cross-platform standards and component reuse, and contributed to the “Wan Wu Sheng” audio social-commerce experience.</li></ul>
    <div class="sheet-row"><h4>Yanji You Bookstore | UI Designer</h4><span>Jun 2017 – Aug 2018</span></div>
    <ul><li><b>New Retail and Brand Experience</b>: Designed the brand's e-commerce mini program, membership, and O2O shopping experience; established in-store operations and marketing-material guidelines.</li></ul>
    <div class="sheet-row"><h4>AIUX Design Consultancy | Product Designer</h4><span>Sep 2016 – Jun 2017</span></div>
    <ul><li><b>Multi-client Product Design</b>: Contributed to projects for Lu Master, PandaPia, and Mango Cloud, delivering experience concepts and high-fidelity prototypes and collaborating through reviews and handoff.</li></ul>
  </section>
  <section class="sheet-sec"><h3>Selected Projects</h3>
    <div class="sheet-row"><h4>01 | Tencent Qidian Marketing Cloud MAGIC AI</h4><span>2024 – Present</span></div>
    <p>Enterprise AI Agent experience design. Owned foundational Agent setup, task collaboration, and the Marketing Cloud AI design system. Delivered three experience modes and key collaboration mechanisms to support enterprise customer adoption.</p>
    <ul><li><b>Experience Strategy</b>: Designed embedded AI, Copilot, and Multi-Agent modes around marketing-task complexity, intent clarity, and execution risk. Used progressive process disclosure, clarification, and plan confirmation to support user judgment and decisions.</li><li><b>Design System and Workflow</b>: Addressed inconsistent AI coding outputs across roles by structuring design guidelines, page patterns, and a knowledge base. Created AI-ready assets and Skills, improved generation, review, and iteration workflows, and enabled consistent cross-functional delivery.</li></ul>
    <div class="sheet-row"><h4>02 | Tencent Qidian Merchant IM</h4><span>Apr 2023 – Present</span></div>
    <p>B2B IM and industry transaction collaboration. Designed enterprise IM and industry application experiences for sectors including financial OTC and electronic procurement. Building on QQ's B2B social ecosystem, extended IM from a communication tool into an entry point for business collaboration.</p>
    <ul><li><b>Industry Scenarios and Task Integration</b>: Addressed fragmented industry relationships and business conversations by bringing inventory lookup, calculations, and quote requests into the conversation sidebar—so teams can find information and respond without leaving the conversation.</li><li><b>AI-assisted Transactions</b>: Combined NLP and Agent capabilities to design “Dianzi Tong” and quote-request bots for the electronics industry, helping teams identify transaction leads in conversations and decide how to follow up.</li></ul>
    <div class="sheet-row"><h4>03 | Tencent Cloud Mall / E-Xiang Tuan</h4><span>2021 – 2022</span></div>
    <p>Retail e-commerce and B2C growth. Designed retail and community group-buying experiences focused on merchant operations and customer conversion, spanning campaign setup, product transactions, membership growth, and tailored delivery for key accounts.</p>
    <ul><li><b>Merchant Experience | Campaign Setup and Operations</b>: Simplified complex campaign rules and setup through reusable templates, bulk actions, WYSIWYG configuration, and membership-growth features—reducing merchants' operational workload.</li><li><b>Customer Experience | Purchase Decisions and Conversion</b>: Clarified promotions, eligibility, and savings across product, cart, and checkout flows. Designed group-leader launch, assisted-selling, and participation flows for WeChat communities, connecting campaign engagement to purchase and conversion.</li><li><b>Results</b>: Supported 4+ industry solutions; improved back-office task efficiency by 40%; increased GMV among participating Cloud Mall merchants by 20%+. E-Xiang Tuan reached RMB 2M+ GMV in its first month and 600K+ registered users.</li></ul>
  </section>
  <section class="sheet-sec"><h3>Additional Project</h3><div class="sheet-row"><h4>Qidian Marketing Cloud | WeCom Engagement SCRM</h4><span>2022</span></div><p>Designed a cross-platform MVP for store-associate acquisition, customer operations, and marketing outreach. Improved campaign-configuration efficiency by 30%; adopted by 6+ paying customers.</p></section>
  <section class="sheet-sec"><h3>Practice and Exploration</h3><div class="sheet-row"><h4>Be4D | Design Systems × AI Coding</h4></div><p>Explored how to bring design constraints earlier into AI coding by applying Design Tokens, component guidelines, and interaction patterns to runnable prototypes—balancing standardization and creative exploration.</p><div class="sheet-row"><h4>Intent UI | Intent-driven Generative Experiences</h4></div><p>Explored combinations of natural language, dynamic forms, and structured outputs through a Generative UI concept prototype, studying adaptive interfaces and human-AI collaboration as user intent changes.</p></section>
  <section class="sheet-sec"><h3>Skills and Tools</h3><ul><li><b>Product and Experience Design</b>: UX Research, Complex Workflows, Information Architecture, User Journeys, Service Blueprint, Usability Testing.</li><li><b>AI Product Experience</b>: AI Agent UX, Multi-Agent Systems, Human-AI Interaction, Generative UI, Human-in-the-loop, Agent Workflows.</li><li><b>Design Systems and Implementation</b>: Design Systems, Design Tokens, Figma, TDesign, AI Coding (Cursor, CodeBuddy); React, Next.js, and Tailwind CSS for runnable prototypes and engineering collaboration.</li></ul></section>
  <section class="sheet-sec"><h3>Recognition and Education</h3><p>Tencent Outstanding Contributor | H1 2022</p><p>Chengdu University of Technology | Industrial Design | Bachelor's Degree | 2016</p></section>
`;
d.innerHTML='<div class="sheet-scroll"><article class="sheet-paper">'+resumeMarkup+'</article></div><div class="sheet-bar"><button type="button" class="btn-close sheet-close" aria-label="关闭简历（Esc）"><svg class="icon icon-16" aria-hidden="true"><use href="#i-x"/></svg><span class="sheet-close-label">关闭</span></button><button type="button" class="sheet-lang" aria-label="Switch resume to English" aria-pressed="false">EN</button><a class="sheet-dl" href="'+PDF+'" download="张耕-产品体验设计师-文字简历.pdf" aria-label="下载中文 PDF"><svg class="icon icon-16" aria-hidden="true"><use href="#i-download"/></svg><span class="sheet-dl-label">下载 PDF</span></a></div>';
document.body.appendChild(d);
var last=null,sc=d.querySelector('.sheet-scroll'),paper=d.querySelector('.sheet-paper'),langBtn=d.querySelector('.sheet-lang'),closeLabel=d.querySelector('.sheet-close-label'),dlLabel=d.querySelector('.sheet-dl-label'),dlLink=d.querySelector('.sheet-dl');
var isEnglish=false;
function setLanguage(english){var scrollTop=sc.scrollTop;isEnglish=english;paper.innerHTML=english?resumeMarkupEn:resumeMarkup;paper.lang=english?'en':'zh-CN';langBtn.textContent=english?'中文':'EN';langBtn.setAttribute('aria-pressed',String(english));langBtn.setAttribute('aria-label',english?'Switch resume to Chinese':'Switch resume to English');closeLabel.textContent=english?'Close':'关闭';d.querySelector('.sheet-close').setAttribute('aria-label',english?'Close resume (Esc)':'关闭简历（Esc）');dlLabel.textContent=english?'Download Chinese PDF':'下载 PDF';dlLink.setAttribute('aria-label',english?'Download Chinese PDF':'下载中文 PDF');requestAnimationFrame(function(){sc.scrollTop=scrollTop})}
langBtn.addEventListener('click',function(){setLanguage(!isEnglish)});
function focusables(){return [].slice.call(d.querySelectorAll('a[href],button'))}
function open(push){if(!d.hidden)return;setLanguage(false);last=document.activeElement;d.hidden=false;document.documentElement.classList.add('sheet-lock');sc.scrollTop=0;requestAnimationFrame(function(){d.classList.add('on')});d.querySelector('.sheet-close').focus({preventScroll:true});if(location.hash!=='#resume')history.replaceState(null,'',location.pathname+location.search+'#resume')}
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
