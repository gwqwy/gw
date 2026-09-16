/* Uiverse 精选组件 — 精选自 uiverse.io/galaxy（MIT License）
 * 来源：https://github.com/uiverse.io/galaxy ，原作者见各 desc。
 * 适配说明：类名加 uv- 前缀命名空间，样式随设计器/导出一起输出。
 * 精选组件同样提供专属属性（文字/速度/标题等），通过 propDefs 在属性面板编辑。 */
(function () {
  "use strict";
  const T = window.M3E_TOKENS;

  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  /* 霓虹描边按钮 — Uiverse.io by menezes11 */
  window.M3E_REG.add({
    kind: "uvBtnNeon", name: "霓虹按钮", cat: "uiverse", icon: "bolt",
    spec: { w: 170, h: 52, txt: "NEON" },
    props: [],
    propDefs: [{ k: "txt", label: "按钮文字", type: "txt" }],
    render(it) {
      return `<div class="uv-btnneon"><button type="button"><span></span><span></span><span></span><span></span>${esc(it.txt || "NEON")}</button></div>`;
    },
    desc: it => `一个霓虹描边按钮（文字「${it.txt || "NEON"}」，深色底、紫光 hover 特效，来源 Uiverse.io by menezes11，MIT）`,
  });

  /* 蓝光充能按钮 — Uiverse.io by fanishah */
  window.M3E_REG.add({
    kind: "uvBtnSciFi", name: "科幻发光按钮", cat: "uiverse", icon: "bolt",
    spec: { w: 170, h: 56, txt: "Button" },
    props: [],
    propDefs: [{ k: "txt", label: "按钮文字", type: "txt" }],
    render(it) {
      return `<div class="uv-btnscifi"><a href="javascript:void(0)" class="button"><span></span><span></span><span></span><span></span>${esc(it.txt || "Button")}</a></div>`;
    },
    desc: it => `一个蓝光充能按钮（文字「${it.txt || "Button"}」，hover 时填充发光，来源 Uiverse.io by fanishah，MIT）`,
  });

  /* 白点滑出按钮 — Uiverse.io by 0x-Sarthak */
  window.M3E_REG.add({
    kind: "uvBtnCta", name: "白点滑出按钮", cat: "uiverse", icon: "bolt",
    spec: { w: 170, h: 52, txt: "Contact Us" },
    props: [],
    propDefs: [{ k: "txt", label: "按钮文字", type: "txt" }],
    render(it) {
      return `<div class="uv-btncta"><button type="button" class="cta"><span>${esc(it.txt || "Contact Us")} &nbsp;</span><svg viewBox="0 0 13 10" height="10px" width="15px"><path d="M1,5 L11,5"></path><polyline points="8 1 12 5 8 9"></polyline></svg></button></div>`;
    },
    desc: it => `一个白色圆点滑出按钮（文字「${it.txt || "Contact Us"}」，紫色胶囊、hover 动效，来源 Uiverse.io by 0x-Sarthak，MIT）`,
  });

  /* 几何加载器 — Uiverse.io by mobinkakei（原型 Aaron Iker） */
  window.M3E_REG.add({
    kind: "uvLoaderGeo", name: "几何加载器", cat: "uiverse", icon: "motion_blur",
    spec: { w: 72, h: 72, speed: 1 },
    props: [],
    propDefs: [{ k: "speed", label: "速度倍率", type: "num", min: 0.5, max: 3, step: 0.1 }],
    render(it) {
      const dur = (3 / Math.max(0.1, it.speed || 1)).toFixed(2);
      return `<div class="uv-loadgeo"><div class="loader" style="--duration:${dur}s;"><svg viewBox="0 0 80 80"><circle r="32" cy="40" cx="40"></circle></svg></div></div>`;
    },
    desc: it => `一个几何变形加载动画（圆点绕行+描边动画，速度 ${it.speed || 1}×，来源 Uiverse.io by mobinkakei，MIT）`,
  });

  /* 红白跳加载 — Uiverse.io by JaydipPrajapati1910 */
  window.M3E_REG.add({
    kind: "uvLoaderBounce", name: "红白加载器", cat: "uiverse", icon: "motion_blur",
    spec: { w: 90, h: 90, speed: 1 },
    props: [],
    propDefs: [{ k: "speed", label: "速度倍率", type: "num", min: 0.5, max: 3, step: 0.1 }],
    render(it) {
      const dur = (5 / Math.max(0.1, it.speed || 1)).toFixed(2);
      return `<div class="uv-loadbounce"><style>.uv-loadbounce .loader,.uv-loadbounce .loader:before,.uv-loadbounce .loader:after{animation-duration:${dur}s !important;}</style><div class="loader"></div></div>`;
    },
    desc: it => `一个深色底红白加载动画（速度 ${it.speed || 1}×，来源 Uiverse.io by JaydipPrajapati1910，MIT）`,
  });

  /* 金属拨动开关 — Uiverse.io by vinodjangid07 */
  window.M3E_REG.add({
    kind: "uvSwitchMetal", name: "金属拨动开关", cat: "uiverse", icon: "toggle_on",
    spec: { w: 100, h: 52, checked: false },
    props: ["checked"],
    render(it) {
      return `<div class="uv-swmetal"><label class="toggleSwitch"><input type="checkbox"${it.checked ? " checked" : ""}/></label></div>`;
    },
    desc: it => `一个拟物金属拨动开关（当前${it.checked ? "开启" : "关闭"}，来源 Uiverse.io by vinodjangid07，MIT）`,
  });

  /* On/Off 文字开关 — Uiverse.io by AbanoubMagdy1 */
  window.M3E_REG.add({
    kind: "uvSwitchOnOff", name: "On/Off 开关", cat: "uiverse", icon: "toggle_on",
    spec: { w: 96, h: 40, checked: false },
    props: ["checked"],
    render(it) {
      return `<div class="uv-swoff"><label class="switch"><input type="checkbox"${it.checked ? " checked" : ""}/><span class="slider"></span><span class="text on">On</span><span class="text off">Off</span></label></div>`;
    },
    desc: it => `一个 On/Off 文字开关（当前${it.checked ? "开启" : "关闭"}，来源 Uiverse.io by AbanoubMagdy1，MIT）`,
  });

  /* 博客卡片 — Uiverse.io by Yaya12085 */
  window.M3E_REG.add({
    kind: "uvCardBlog", name: "博客卡片", cat: "uiverse", icon: "web_asset",
    spec: { w: 320, h: 150, ttl: "如何写好一篇博客？", dsc: "这里是卡片描述文本，介绍文章的主要内容与亮点。" },
    props: [],
    propDefs: [
      { k: "ttl", label: "标题", type: "txt" },
      { k: "dsc", label: "描述", type: "txt" },
    ],
    render(it) {
      return `<div class="uv-cardblog"><div class="card"><div class="date-time-container"><time class="date-time"><span>2026</span><span class="separator"></span><span>9月10日</span></time></div><div class="content"><div class="infos"><span class="title">${esc(it.ttl || "如何写好一篇博客？")}</span><p class="description">${esc(it.dsc || "这里是卡片描述文本。")}</p></div><span class="action">阅读全文</span></div></div></div>`;
    },
    desc: it => `一个博客文章卡片（标题「${it.ttl || ""}」，左侧日期竖条+描述+阅读入口，来源 Uiverse.io by Yaya12085，MIT）`,
  });
})();
