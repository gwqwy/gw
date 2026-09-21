/* gw Designer — 组件注册表
 * 每个组件一个定义：spec(默认尺寸/内容) → render(画布与导出共用的 HTML) → 提示词描述。
 * ★ 新增组件：仿照任一条目调用 M3E_REG.add({...}) 即可，无需改其他文件。
 *
 * 签名属性（sig + propDefs）：每个内置组件都有一个**专属属性**（sig 键在全部内置组件中唯一），
 * 用于区分外观/功能相近的组件；propDefs 是数据驱动的通用属性描述，属性面板自动渲染：
 *   { k, label, type:"sel"|"num"|"chk"|"txt"|"icon", opts / min / max / step }
 * type 说明：sel=下拉(opts:[[值,显示名]])，num=数字(min/max/step)，chk=开关，txt=文本，icon=图标名。 */
(function () {
  "use strict";
  const T = window.M3E_TOKENS;
  const ICONS = () => window.M3E_ICONS;

  const esc = s => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");

  /** 内联 SVG 图标（与导出一致）；fill=true 用实心变体 */
  function svgTag(name, size, fill) {
    const set = ICONS() || {};
    const e = set[name] || set.check_box_outline_blank;
    if (!e) return `<svg viewBox="0 -960 960 960" width="${size}" height="${size}" aria-hidden="true"><circle cx="480" cy="-480" r="280"/></svg>`;
    const body = fill && e.f ? e.f : e.b;
    return `<svg viewBox="0 -960 960 960" width="${size}" height="${size}" aria-hidden="true">${body}</svg>`;
  }
  function ic(name, size, fill) {
    return `<span class="m3e-ic">${svgTag(name, size, fill)}</span>`;
  }

  const REG = { defs: {}, order: T.KIND_ORDER.slice(), esc, ic };

  REG.add = function (def) {
    REG.defs[def.kind] = def;
    if (!REG.order.includes(def.kind)) REG.order.push(def.kind);
  };

  /** 主题形状 → 圆角：square=0 / rounded=基准 / full=胶囊 */
  REG.rr = function (it, base) {
    const shape = (it._theme && it._theme.shape) || "rounded";
    if (shape === "square") return 0;
    if (shape === "full") return Math.max(base, Math.floor(Math.min(it.w, it.h) / 2));
    return base;
  };
  /** 组件自身的圆角（卡片 20、FAB 16…），随形状缩放 */
  REG.cr = (it, base) => REG.rr(it, base);

  const VARIANTS = {
    button: ["filled", "tonal", "elevated", "outlined", "text"],
    splitButton: ["filled", "tonal"],
    iconButton: ["standard", "filled", "tonal", "outlined"],
    fab: ["primary", "tonal", "surface"],
    extendedFab: ["primary", "tonal", "surface"],
    fabMenu: ["tonal", "primary", "filled"],
    chip: ["outlined", "elevated"],
    toolbar: ["tonal", "surface"],
    card: ["elevated", "tonal", "filled", "outlined"],
    textField: ["outlined", "filled"],
    select: ["outlined", "filled"],
  };
  const VN = { filled: "填充", tonal: "色调", elevated: "浮起", outlined: "描边", text: "文本", standard: "标准", primary: "主色", surface: "表面" };
  const FILL_TOKENS = ["surfaceContainerLow", "surfaceContainer", "surfaceContainerHigh", "surfaceContainerHighest",
    "primaryContainer", "secondaryContainer", "tertiaryContainer", "inverseSurface", "surface", "primary"];
  const FV = { surfaceContainerLow: "低层容器", surfaceContainer: "容器", surfaceContainerHigh: "高层容器", surfaceContainerHighest: "最高层容器", primaryContainer: "主色容器", secondaryContainer: "次色容器", tertiaryContainer: "第三容器", inverseSurface: "反色表面", surface: "表面", primary: "主色" };

  /** 通用：条目外壳内联样式（画布与导出一致）；radius 可被条目覆盖以调圆角 */
  REG.shellStyle = function (it) {
    const r = REG.rr(it, REG.shellRadius(it));
    const ovf = it.kind === "tooltip" ? "" : "overflow:hidden;";
    return `left:${it.x}px;top:${it.y}px;width:${it.w}px;height:${it.h}px;border-radius:${r}px;${ovf}`;
  };
  REG.shellRadius = function (it) {
    if (it.radius != null) return it.radius; // 组件可自定义圆角
    switch (it.kind) {
      case "topAppBar": case "bottomNav": case "navRail": case "tabs": case "divider": case "text": case "slider": case "linearProgress": return 0;
      case "box": return it.radius != null ? it.radius : 28;
      case "card": return 20;
      case "listItem": return 28;
      case "snackbar": return 8;
      case "toolbar": return 32;
      case "fabMenu": return 16;
      case "chip": return 8;
      case "button": return 28;
      case "iconButton": return 24;
      case "fab": case "extendedFab": return 16;
      case "splitButton": return 28;
      case "dialog": return 28;
      case "searchBar": return 28;
      case "textField": case "select": case "switch": return 16;
      case "image": case "camera": case "map": return 20;
      case "badge": return 8;
      case "loadingIndicator": case "circularProgress": return 24;
      case "checkbox": case "radio": return 4;
      default: return 0;
    }
  };

  const tabsOf = it => Array.isArray(it.tabs) ? it.tabs : [];
  const opt = (c, cls, inner) => `<div class="${cls}">${inner}</div>`;
  const pct = v => Math.max(0, Math.min(100, v == null ? 0 : v));

  /* ============ 组件定义 ============ */

  REG.add({
    kind: "button", name: "按钮", cat: "actions", icon: "buttons_alt",
    inter: "toggle-btn",
    sig: "iconPos",
    spec: { w: 128, h: 56, variant: "filled", label: "按钮", icon: "add", iconPos: "left" },
    props: ["label", "icon", "variant"],
    propDefs: [{ k: "iconPos", label: "图标位置", type: "sel", opts: [["left", "左侧"], ["right", "右侧"], ["none", "仅文字"]] }],
    variantList: VARIANTS.button,
    render(it) {
      const pos = it.iconPos || "left";
      const i = it.icon && pos !== "none" ? ic(it.icon, 20) : "";
      const only = !it.label && it.icon && pos !== "none";
      const lb = `<span class="lb">${esc(it.label)}</span>`;
      return `<button class="m3e-btn v-${it.variant || "filled"}${only ? " icon-only" : ""}">${pos === "right" ? lb + i : i + lb}</button>`;
    },
    desc: it => `一个「${it.label || "按钮"}」按钮（${VN[it.variant] || it.variant}样式${it.icon && it.iconPos !== "none" ? `，带 ${it.icon} 图标（${it.iconPos === "right" ? "右侧" : "左侧"}）` : "，纯文字"}）`,
  });

  REG.add({
    kind: "iconButton", name: "图标按钮", cat: "actions", icon: "radio_button_checked",
    sig: "dot",
    spec: { w: 48, h: 48, variant: "tonal", icon: "favorite", dot: false },
    props: ["icon", "variant"],
    propDefs: [{ k: "dot", label: "红点角标", type: "chk" }],
    variantList: VARIANTS.iconButton,
    render(it) {
      const dot = it.dot ? `<span style="position:absolute;top:9px;right:9px;width:8px;height:8px;border-radius:50%;background:var(--err);"></span>` : "";
      return `<button class="m3e-iconbtn v-${it.variant || "standard"}" style="position:relative;">${ic(it.icon, 24)}${dot}</button>`;
    },
    desc: it => `一个 ${it.icon || ""} 图标按钮（${VN[it.variant] || it.variant}${it.dot ? "，带红点角标" : ""}）`,
  });

  REG.add({
    kind: "fab", name: "FAB（悬浮按钮）", cat: "actions", icon: "add_circle",
    sig: "fbadge",
    spec: { w: 56, h: 56, variant: "tonal", icon: "edit", size: 24, fbadge: "" },
    props: ["icon", "variant", "size"],
    propDefs: [{ k: "fbadge", label: "数字角标", type: "txt" }],
    variantList: VARIANTS.fab,
    render(it) {
      const b = it.fbadge ? `<span style="position:absolute;top:4px;right:4px;min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:var(--err);color:var(--on-err);font-size:10px;font-weight:600;display:inline-flex;align-items:center;justify-content:center;">${esc(it.fbadge)}</span>` : "";
      return `<button class="m3e-fab v-${it.variant || "tonal"}" style="position:relative;">${ic(it.icon, 24)}${b}</button>`;
    },
    desc: it => `一个悬浮操作按钮（FAB，${VN[it.variant] || it.variant}，${it.icon || "edit"} 图标${it.fbadge ? `，角标「${it.fbadge}」` : ""}）`,
  });

  REG.add({
    kind: "extendedFab", name: "扩展 FAB", cat: "actions", icon: "add_box",
    sig: "loading",
    spec: { w: 160, h: 56, variant: "tonal", label: "新建", icon: "edit", loading: false },
    props: ["label", "icon", "variant"],
    propDefs: [{ k: "loading", label: "加载中（图标转圈）", type: "chk" }],
    variantList: VARIANTS.extendedFab,
    render(it) {
      const lead = it.loading
        ? `<span class="m3e-extfab-spin">${svgTag("progress_activity", 24)}</span>`
        : ic(it.icon, 24);
      return `<button class="m3e-extfab v-${it.variant || "tonal"}">${lead}<span class="lb">${esc(it.label)}</span></button>`;
    },
    desc: it => `一个扩展 FAB（${it.loading ? "加载中状态，图标转圈" : `图标+「${it.label}」文字`}）`,
  });

  REG.add({
    kind: "splitButton", name: "拆分按钮", cat: "actions", icon: "splitscreen_right",
    sig: "splitAt",
    spec: { w: 200, h: 56, variant: "filled", label: "发送", icon: "send", splitAt: 62 },
    props: ["label", "icon", "variant"],
    propDefs: [{ k: "splitAt", label: "主区宽度占比（%）", type: "num", min: 40, max: 90 }],
    variantList: VARIANTS.splitButton,
    render(it) {
      const w = Math.min(90, Math.max(40, it.splitAt || 62));
      return `<div class="m3e-split v-${it.variant || "filled"}"><button class="main" style="flex:none;width:${w}%;">${ic(it.icon, 20)}<span class="lb">${esc(it.label)}</span></button><button class="act">${ic("arrow_drop_down", 20)}</button></div>`;
    },
    desc: it => `一个拆分按钮：主区「${it.label}」占 ${Math.min(90, Math.max(40, it.splitAt || 62))}% 宽，右侧下拉箭头区`,
  });

  REG.add({
    kind: "fabMenu", name: "FAB 菜单", cat: "actions", icon: "add_circle",
    inter: "tabs",
    tabsMeta: it => ({ wrap: `m3e-fabmenu v-${it.variant || "tonal"}`, child: "mi" }),
    sig: "expand",
    spec: { w: 220, h: 72, variant: "tonal", icon: "close", expand: "up", tabs: [{ icon: "edit", label: "笔记" }] },
    props: ["tabs", "variant"],
    propDefs: [{ k: "expand", label: "展开方向", type: "sel", opts: [["up", "向上（首项在顶）"], ["down", "向下（首项在底）"]] }],
    variantList: VARIANTS.fabMenu,
    render(it) {
      let rows = tabsOf(it).map(t => `<div class="mi">${ic(t.icon, 24)}<span>${esc(t.label)}</span></div>`).join("");
      if (it.expand === "down") rows = tabsOf(it).slice().reverse().map(t => `<div class="mi">${ic(t.icon, 24)}<span>${esc(t.label)}</span></div>`).join("");
      return `<div class="m3e-fabmenu v-${it.variant || "tonal"}">${rows}</div>`;
    },
    desc: it => `一个 FAB 菜单（${it.expand === "down" ? "向下展开" : "向上展开"}）：${tabsOf(it).map(t => t.label).join("、")}`,
  });

  REG.add({
    kind: "chip", name: "标签片", cat: "actions", icon: "label",
    inter: "toggle",
    sig: "removable",
    spec: { w: 108, h: 32, variant: "outlined", label: "标签", checked: false, removable: false },
    props: ["label", "icon", "variant", "checked"],
    propDefs: [{ k: "removable", label: "可关闭（尾部 ×）", type: "chk" }],
    variantList: VARIANTS.chip,
    render(it) {
      const lead = it.icon ? ic(it.icon, 18) : "";
      const rm = it.removable ? ic("close", 16) : "";
      return `<button class="m3e-chip v-${it.variant || "outlined"}${it.checked ? " on" : ""}"><span class="ld">${lead}</span>${ic("check", 18)}<span class="lb">${esc(it.label)}</span>${rm}</button>`;
    },
    desc: it => `一个「${it.label}」标签片（${it.checked ? "已选中态" : VN[it.variant] || it.variant}${it.removable ? "，可关闭" : ""}）`,
  });

  REG.add({
    kind: "segmented", name: "分段按钮", cat: "actions", icon: "view_week",
    inter: "tabs",
    tabsMeta: it => ({ wrap: `m3e-seg${it.segTight ? " outline" : ""}`, child: "sg" }),
    sig: "segTight",
    spec: {
      w: 240, h: 40, selected: 0, segTight: false,
      tabs: [{ icon: "", label: "日" }, { icon: "", label: "周" }, { icon: "", label: "月" }],
    },
    props: ["tabs", "selected"], tabsName: "段", propLabels: { selected: "当前选中" },
    propDefs: [{ k: "segTight", label: "描边样式（不填充选中底色）", type: "chk" }],
    render(it) {
      const ds = tabsOf(it).map((t, i) =>
        `<div class="sg${i === it.selected ? " sel" : ""}">${t.icon ? ic(t.icon, 18) : ""}<span>${esc(t.label)}</span></div>`).join("");
      return `<div class="m3e-seg${it.segTight ? " outline" : ""}">${ds}</div>`;
    },
    desc: it => `一组${it.segTight ? "描边" : "填充"}分段按钮：${tabsOf(it).map(t => t.label).join("、")}，当前选中「${(tabsOf(it)[it.selected] || {}).label || ""}」`,
  });

  REG.add({
    kind: "topAppBar", name: "顶部应用栏", cat: "navigation", icon: "toolbar",
    sig: "centerT",
    spec: { w: T.PHONE_W, h: T.APPBAR_H, label: "标题", icon: "menu", icon2: "more_vert", centerT: false },
    props: ["label", "icon", "icon2"],
    propDefs: [{ k: "centerT", label: "标题居中", type: "chk" }],
    render(it) {
      return `<div class="m3e-appbar${it.centerT ? " center-t" : ""}"><div style="height:${T.STATUS_BAR_H}px;flex:none;"></div><div class="bar">${ic(it.icon, 24)}<span class="ttl">${esc(it.label)}</span>${ic(it.icon2, 24)}</div></div>`;
    },
    desc: it => `顶部应用栏：左侧 ${it.icon} 菜单图标，标题「${it.label}」${it.centerT ? "居中" : "靠左"}，右侧 ${it.icon2} 图标`,
  });

  REG.add({
    kind: "bottomNav", name: "导航栏", cat: "navigation", icon: "bottom_navigation",
    inter: "tabs",
    tabsMeta: it => ({ wrap: "m3e-bnav", child: "dest", ind: true, label: it.hideLb ? "" : "dl" }),
    sig: "hideLb",
    spec: {
      w: T.PHONE_W, h: T.BOTTOMNAV_H, selected: 0, hideLb: false,
      tabs: [{ icon: "home", label: "首页" }, { icon: "search", label: "搜索" }, { icon: "favorite", label: "收藏" }, { icon: "settings", label: "设置" }],
    },
    props: ["tabs", "selected"],
    propDefs: [{ k: "hideLb", label: "纯图标模式", type: "chk" }],
    render(it) {
      const ds = tabsOf(it).map((t, i) =>
        `<div class="dest${i === it.selected ? " sel" : ""}"><div class="ind">${ic(t.icon, 24, i === it.selected)}</div>${it.hideLb ? "" : `<span class="dl">${esc(t.label)}</span>`}</div>`).join("");
      return `<div class="m3e-bnav">${ds}</div>`;
    },
    desc: it => `底部导航栏${it.hideLb ? "（纯图标）" : ""}，${tabsOf(it).length} 个目的地：${tabsOf(it).map(t => t.label).join("、")}，当前选中「${(tabsOf(it)[it.selected] || {}).label || ""}」`,
  });

  REG.add({
    kind: "navRail", name: "侧边导航栏", cat: "navigation", icon: "side_navigation",
    inter: "tabs",
    tabsMeta: it => ({ wrap: "m3e-rail", child: "dest", ind: true, label: "dl", pre: `<div class="hd">${ic("menu", 24)}</div>` }),
    sig: "hideHd",
    spec: {
      w: 80, h: T.PHONE_H, selected: 0, hideHd: false,
      tabs: [{ icon: "home", label: "首页" }, { icon: "search", label: "搜索" }, { icon: "favorite", label: "收藏" }, { icon: "settings", label: "设置" }],
    },
    props: ["tabs", "selected"],
    propDefs: [{ k: "hideHd", label: "隐藏顶部菜单钮", type: "chk" }],
    render(it) {
      const hd = it.hideHd ? "" : `<div class="hd">${ic("menu", 24)}</div>`;
      const ds = tabsOf(it).map((t, i) =>
        `<div class="dest${i === it.selected ? " sel" : ""}"><div class="ind">${ic(t.icon, 24, i === it.selected)}</div><span class="dl">${esc(t.label)}</span></div>`).join("");
      return `<div class="m3e-rail">${hd}${ds}</div>`;
    },
    desc: it => `左侧导航栏（宽 80${it.hideHd ? "，无顶部菜单钮" : ""}），目的地：${tabsOf(it).map(t => t.label).join("、")}`,
  });

  REG.add({
    kind: "toolbar", name: "悬浮工具栏", cat: "navigation", icon: "toolbar",
    sig: "noMore",
    spec: {
      w: 280, h: 64, variant: "tonal", noMore: false,
      tabs: [{ icon: "edit", label: "" }, { icon: "mic", label: "" }, { icon: "photo_camera", label: "" }, { icon: "attach_file", label: "" }],
    },
    props: ["tabs", "variant"],
    propDefs: [{ k: "noMore", label: "隐藏更多按钮", type: "chk" }],
    variantList: VARIANTS.toolbar,
    render(it) {
      const ics = tabsOf(it).map(t => ic(t.icon, 24)).join("");
      return `<div class="m3e-tb v-${it.variant || "tonal"}">${ic("menu", 24)}<span class="sp"></span>${ics}<span class="sp"></span>${it.noMore ? "" : ic("more_vert", 24)}</div>`;
    },
    desc: it => `一个悬浮胶囊工具栏，图标：${tabsOf(it).map(t => t.icon).join("、")}${it.noMore ? "（无更多按钮）" : ""}`,
  });

  REG.add({
    kind: "tabs", name: "标签页", cat: "navigation", icon: "tab",
    inter: "tabs",
    tabsMeta: it => ({ wrap: `m3e-tabs${it.indStyle === "underline" ? " underline" : ""}`, child: "tab" }),
    sig: "indStyle",
    spec: { w: T.PHONE_W, h: 48, selected: 0, indStyle: "pill", tabs: [{ icon: "", label: "推荐" }, { icon: "", label: "关注" }, { icon: "", label: "热门" }, { icon: "", label: "最新" }] },
    props: ["tabs", "selected"],
    propDefs: [{ k: "indStyle", label: "指示器样式", type: "sel", opts: [["pill", "胶囊（次级标签页）"], ["underline", "下划线（主标签页）"]] }],
    render(it) {
      const ds = tabsOf(it).map((t, i) =>
        `<div class="tab${i === it.selected ? " sel" : ""}">${t.icon ? ic(t.icon, 18) : ""}<span>${esc(t.label)}</span></div>`).join("");
      return `<div class="m3e-tabs${it.indStyle === "underline" ? " underline" : ""}">${ds}</div>`;
    },
    desc: it => `一排${it.indStyle === "underline" ? "下划线式" : "胶囊式"}标签页：${tabsOf(it).map(t => t.label).join("、")}，当前选中「${(tabsOf(it)[it.selected] || {}).label || ""}」`,
  });

  REG.add({
    kind: "searchBar", name: "搜索栏", cat: "navigation", icon: "search",
    sig: "suggest",
    spec: { w: T.CONTENT_W, h: 56, label: "搜索", icon: "search", icon2: "mic", suggest: "" },
    props: ["label", "icon", "icon2"],
    propDefs: [{ k: "suggest", label: "联想词气泡", type: "txt" }],
    render(it) {
      const sug = it.suggest ? `<span style="position:absolute;left:52px;bottom:5px;display:inline-flex;align-items:center;gap:4px;font-size:11px;color:var(--on-sur-var);background:var(--sur);border-radius:8px;padding:2px 8px;max-width:70%;overflow:hidden;white-space:nowrap;">${ic("search", 12)}${esc(it.suggest)}</span>` : "";
      return `<div class="m3e-search" style="position:relative;">${ic(it.icon, 24)}<span class="hint">${esc(it.label)}</span>${ic(it.icon2, 24)}${sug}</div>`;
    },
    desc: it => `一个胶囊搜索栏，占位文字「${it.label}」，右侧麦克风图标${it.suggest ? `，下方联想词「${it.suggest}」` : ""}`,
  });

  REG.add({
    kind: "card", name: "卡片", cat: "containment", icon: "web_asset",
    sig: "noImage",
    spec: { w: T.CONTENT_W, h: 223, variant: "tonal", label: "卡片标题", supporting: "这里是辅助说明文字。", icon: "image", noImage: false },
    props: ["label", "supporting", "variant", "noImage"],
    propDefs: [{ k: "noImage", label: "隐藏图片区", type: "chk" }],
    variantList: VARIANTS.card,
    render(it) {
      const img = it.noImage ? "" : `<div class="img" style="height:128px;flex:none;">${it.src ? `<img src="${it.src}" alt=""/>` : ic(it.icon || "image", 32)}</div>`;
      return `<div class="m3e-card v-${it.variant || "tonal"}">${img}<div class="bd"><div class="hl">${esc(it.label)}</div><div class="sp">${esc(it.supporting)}</div></div></div>`;
    },
    desc: it => `一张${it.noImage ? "纯文字" : "带图"}卡片：标题「${it.label}」，正文「${it.supporting}」（${VN[it.variant] || it.variant}样式）`,
  });

  REG.add({
    kind: "listItem", name: "列表项", cat: "containment", icon: "list",
    sig: "meta",
    spec: { w: T.CONTENT_W, h: 72, label: "列表项", icon: "person", supporting: "辅助文本", icon2: "chevron_right", fill: "surfaceContainerLow", meta: "" },
    props: ["label", "supporting", "icon", "icon2", "fill"],
    propDefs: [{ k: "meta", label: "尾部文字（如时间）", type: "txt" }],
    fillList: FILL_TOKENS,
    render(it) {
      const leadBg = it.fill && it.fill !== "none" ? `background:var(--${tokVar(it.fill)});border-radius:50%;` : "";
      return `<div class="m3e-li"><div class="lead" style="${leadBg}">${ic(it.icon, 24)}</div><div class="txs"><div class="hl">${esc(it.label)}</div>${it.supporting ? `<div class="sub">${esc(it.supporting)}</div>` : ""}</div>${it.meta ? `<span style="font-size:12px;color:var(--on-sur-var);white-space:nowrap;">${esc(it.meta)}</span>` : ""}${ic(it.icon2, 24)}</div>`;
    },
    desc: it => `一个列表项：主文字「${it.label}」${it.supporting ? `，副文字「${it.supporting}」` : ""}，左侧 ${it.icon} 圆形头像图标${it.meta ? `，尾部文字「${it.meta}」` : ""}，右侧 ${it.icon2 || "无"} 箭头`,
  });

  REG.add({
    kind: "box", name: "容器框", cat: "containment", icon: "web_asset",
    sig: "frame",
    spec: { w: T.PHONE_W, h: 220, fill: "surfaceContainerLow", radius: 28, frame: "none" },
    props: ["fill"], /* 圆角由属性面板的通用「圆角」字段覆盖，不在此重复 */
    propDefs: [{ k: "frame", label: "边框样式", type: "sel", opts: [["none", "无"], ["line", "实线"], ["dash", "虚线（占位区）"]] }],
    fillList: FILL_TOKENS,
    render(it) {
      const fr = it.frame === "line" ? "border:1px solid var(--out-var);" : it.frame === "dash" ? "border:1.5px dashed var(--out);" : "";
      return `<div class="m3e-box" style="${fr}"></div>`;
    },
    desc: it => `一个圆角容器框（${it.frame === "dash" ? "虚线占位样式" : it.frame === "line" ? "实线边框" : "无边框"}，用于分组或占位）`,
  });

  REG.add({
    kind: "dialog", name: "对话框", cat: "containment", icon: "chat_bubble",
    sig: "dismiss",
    spec: { w: 312, h: 220, label: "确认", icon: "info", supporting: "要执行此操作吗？", dismiss: false },
    props: ["label", "supporting", "icon"],
    propDefs: [{ k: "dismiss", label: "标题栏关闭 ×", type: "chk" }],
    render(it) {
      const x = it.dismiss ? `<span class="m3e-ic" style="margin-left:auto;color:var(--on-sur-var);">${svgTag("close", 20)}</span>` : "";
      return `<div class="m3e-dialog"><div class="hd">${ic(it.icon, 24)}<span class="ttl">${esc(it.label)}</span>${x}</div><div class="bd">${esc(it.supporting)}</div><div class="acts"><button class="abtn">取消</button><button class="abtn">${esc(it.label)}</button></div></div>`;
    },
    desc: it => `一个对话框：标题「${it.label}」（带 ${it.icon} 图标${it.dismiss ? "和关闭按钮" : ""}），内容「${it.supporting}」，操作按钮「取消」「${it.label}」`,
  });

  REG.add({
    kind: "snackbar", name: "消息条", cat: "containment", icon: "call_to_action",
    sig: "iconL",
    spec: { w: 344, h: 48, label: "已保存", supporting: "撤销", iconL: "" },
    props: ["label", "supporting"],
    propDefs: [{ k: "iconL", label: "左侧图标", type: "icon" }],
    render(it) {
      return `<div class="m3e-snack">${it.iconL ? ic(it.iconL, 20) : ""}<span class="lb">${esc(it.label)}</span><span class="act">${esc(it.supporting)}</span></div>`;
    },
    desc: it => `一个底部消息条：${it.iconL ? `${it.iconL} 图标，` : ""}文字「${it.label}」，右侧操作「${it.supporting}」`,
  });

  REG.add({
    kind: "table", name: "表格", cat: "containment", icon: "table_chart",
    sig: "rows",
    spec: { w: T.CONTENT_W, h: 240, rows: 4, tabs: [{ icon: "", label: "列 A" }, { icon: "", label: "列 B" }, { icon: "", label: "列 C" }] },
    props: ["tabs", "rows"], tabsName: "列", tabsHideIcon: true, propLabels: { rows: "数据行数" },
    render(it) {
      const cols = tabsOf(it);
      const head = `<div class="tr">${cols.map(c => `<div class="th">${esc(c.label)}</div>`).join("")}</div>`;
      let body = "";
      for (let r = 0; r < (it.rows || 0); r++) body += `<div class="tr">${cols.map((c, ci) => `<div class="td">${esc(it[`c${r}_${ci}`] || "数据")}</div>`).join("")}</div>`;
      return `<div class="m3e-table">${head}${body}</div>`;
    },
    desc: it => `一个 ${it.rows || 0} 行数据表格，列为「${tabsOf(it).map(c => c.label).join("、")}」`,
  });

  REG.add({
    kind: "accordion", name: "折叠面板", cat: "containment", icon: "vertical_split",
    sig: "dense",
    spec: { w: T.CONTENT_W, h: 128, selected: 0, dense: false, tabs: [{ icon: "", label: "第一组" }, { icon: "", label: "第二组" }] },
    props: ["tabs", "selected"], tabsName: "分组", tabsHideIcon: true, propLabels: { selected: "展开项" },
    propDefs: [{ k: "dense", label: "紧凑模式", type: "chk" }],
    render(it) {
      const rows = tabsOf(it).map((t, i) =>
        `<div class="ai${i === it.selected ? " open" : ""}"${it.dense ? ' style="font-size:13px;min-height:0;"' : ""}>${esc(t.label)}${ic(i === it.selected ? "keyboard_arrow_down" : "chevron_right", 22)}</div>`).join("");
      return `<div class="m3e-acc">${rows}</div>`;
    },
    desc: it => `一个折叠面板${it.dense ? "（紧凑模式）" : ""}，分组：${tabsOf(it).map(t => t.label).join("、")}，当前展开「${(tabsOf(it)[it.selected] || {}).label || "无"}」`,
  });

  REG.add({
    kind: "bottomSheet", name: "底部弹层", cat: "containment", icon: "call_to_action",
    sig: "hideGrip",
    spec: { w: T.PHONE_W, h: 280, label: "选择操作", supporting: "选择一项以继续", hideGrip: false },
    props: ["label", "supporting"],
    propDefs: [{ k: "hideGrip", label: "隐藏拖动手柄", type: "chk" }],
    render(it) {
      return `<div class="m3e-sheet">${it.hideGrip ? "" : '<span class="grip"></span>'}<span class="ttl">${esc(it.label)}</span><span class="sub">${esc(it.supporting)}</span><div class="acts"><button class="abtn">取消</button><button class="abtn">确认</button></div></div>`;
    },
    desc: it => `一个底部弹层：标题「${it.label}」，副文「${it.supporting}」，右下「取消」「确认」${it.hideGrip ? "（无手柄）" : ""}`,
  });

  REG.add({
    kind: "banner", name: "横幅通知", cat: "containment", icon: "info",
    sig: "tone",
    spec: { w: T.CONTENT_W, h: 88, icon: "info", label: "新版本已发布", supporting: "立即更新以体验新功能", supporting2: "", tone: "info" },
    props: ["label", "supporting", "icon"],
    propDefs: [{ k: "tone", label: "通知级别", type: "sel", opts: [["info", "信息（中性）"], ["warn", "警告（琥珀）"], ["err", "错误（红）"]] }],
    render(it) {
      return `<div class="m3e-banner tone-${it.tone || "info"}">${ic(it.icon, 24)}<div class="tx"><div class="l1">${esc(it.label)}</div><div class="l2">${esc(it.supporting)}</div></div><div class="act"><button class="abtn">忽略</button><button class="abtn">查看</button></div></div>`;
    },
    desc: it => `一条${{ info: "信息", warn: "警告", err: "错误" }[it.tone || "info"]}级横幅通知：「${it.label}」（${it.supporting}），带「忽略」「查看」操作`,
  });

  REG.add({
    kind: "listGroup", name: "列表组", cat: "containment", icon: "list",
    sig: "divid",
    spec: {
      w: T.CONTENT_W, h: 232, divid: false,
      tabs: [{ icon: "person", label: "个人信息" }, { icon: "notifications", label: "消息通知" }, { icon: "settings", label: "通用设置" }],
    },
    props: ["tabs"], tabsName: "列表项",
    propDefs: [{ k: "divid", label: "行间分隔线", type: "chk" }],
    render(it) {
      const rows = tabsOf(it).map(t =>
        `<div class="li">${ic(t.icon, 22)}<span class="lb">${esc(t.label)}</span><span class="tr">${svgTag("chevron_right", 18)}</span></div>`).join("");
      return `<div class="m3e-lgroup${it.divid ? " divid" : ""}">${rows}</div>`;
    },
    desc: it => `一个分组列表（圆角容器${it.divid ? "，带分隔线" : ""}）：${tabsOf(it).map(t => t.label).join("、")}`,
  });

  REG.add({
    kind: "textField", name: "文本输入框", cat: "inputs", icon: "text_fields",
    inter: "input",
    sig: "hint",
    spec: { w: T.CONTENT_W, h: 56, variant: "outlined", label: "标签", value: "", icon: "search", hint: "" },
    props: ["label", "value", "icon", "variant"],
    propDefs: [{ k: "hint", label: "占位提示（空值时显示）", type: "txt" }],
    variantList: VARIANTS.textField,
    render(it) {
      const hasIc = it.icon ? " has-ic" : "";
      const shown = it.value ? esc(it.value) : (it.hint ? `<span style="opacity:.45;">${esc(it.hint)}</span>` : "");
      return `<div class="m3e-tf v-${it.variant || "outlined"}${hasIc}">${it.label ? `<span class="cap">${esc(it.label)}</span>` : ""}<span class="val">${shown}</span>${it.icon ? ic(it.icon, 24) : ""}</div>`;
    },
    desc: it => `一个文本输入框，浮动标签「${it.label}」，${it.value ? `已输入「${it.value}」` : it.hint ? `空值显示占位「${it.hint}」` : "空值"}${it.icon ? `，尾部 ${it.icon} 图标` : ""}（${VN[it.variant] || it.variant}样式）`,
  });

  REG.add({
    kind: "select", name: "下拉菜单", cat: "inputs", icon: "arrow_drop_down_circle",
    inter: "select",
    sig: "assist",
    spec: { w: T.CONTENT_W, h: 56, variant: "outlined", label: "标签", selected: 0, assist: "", tabs: [{ icon: "", label: "选项 1" }, { icon: "", label: "选项 2" }, { icon: "", label: "选项 3" }] },
    props: ["label", "tabs", "selected", "variant"],
    propDefs: [{ k: "assist", label: "辅助说明（框下小字）", type: "txt" }],
    variantList: VARIANTS.select,
    render(it) {
      const v = (tabsOf(it)[it.selected] || {}).label || "";
      const box = `<div class="m3e-select v-${it.variant || "outlined"}" style="flex:1;min-height:0;">${it.label ? `<span class="cap">${esc(it.label)}</span>` : ""}<span class="val">${esc(v)}</span><span class="arr">${ic("arrow_drop_down", 24)}</span></div>`;
      return `<div style="width:100%;height:100%;display:flex;flex-direction:column;gap:4px;">${box}${it.assist ? `<span style="font-size:11px;color:var(--on-sur-var);padding:0 4px;flex:none;">${esc(it.assist)}</span>` : ""}</div>`;
    },
    desc: it => `一个下拉选择框，标签「${it.label}」，选项：${tabsOf(it).map(t => t.label).join("、")}，当前「${(tabsOf(it)[it.selected] || {}).label || ""}」${it.assist ? `，框下说明「${it.assist}」` : ""}`,
  });

  REG.add({
    kind: "switch", name: "开关", cat: "inputs", icon: "toggle_on",
    inter: "toggle",
    sig: "noCheck",
    spec: { w: 160, h: 48, label: "通知", checked: false, noCheck: false },
    props: ["label", "checked", "noCheck"],
    render(it) {
      const ck = it.noCheck ? "" : ic("check", 14);
      return `<div class="m3e-sw${it.checked ? " on" : ""}"><span class="lb">${esc(it.label)}</span><span class="track"><span class="knob">${ck}</span></span></div>`;
    },
    desc: it => `一个「${it.label}」开关行，当前${it.checked ? "开启" : "关闭"}${it.noCheck ? "（手柄无对勾）" : ""}`,
  });

  REG.add({
    kind: "checkbox", name: "复选框", cat: "inputs", icon: "check_box",
    inter: "toggle",
    sig: "tri",
    spec: { w: 140, h: 40, label: "我同意", checked: false, tri: false },
    props: ["label", "checked"],
    propDefs: [{ k: "tri", label: "支持半选态", type: "chk" }],
    render(it) {
      const mark = it.checked ? ic("check", 14) : (it.tri ? ic("remove", 14) : "");
      return `<div class="m3e-cb${it.checked || it.tri ? " on" : ""}"><span class="box">${mark}</span><span class="lb">${esc(it.label)}</span></div>`;
    },
    desc: it => `一个「${it.label}」复选框，当前${it.checked ? "勾选" : it.tri ? "半选（部分选中）" : "未勾选"}`,
  });

  REG.add({
    kind: "radio", name: "单选按钮", cat: "inputs", icon: "radio_button_checked",
    inter: "radio",
    sig: "posR",
    spec: { w: 120, h: 40, label: "选项", checked: false, posR: false },
    props: ["label", "checked"],
    propDefs: [{ k: "posR", label: "圆点在右", type: "chk" }],
    render(it) {
      const lb = `<span class="lb">${esc(it.label)}</span>`;
      const cir = `<span class="cir"></span>`;
      return `<div class="m3e-rd${it.checked ? " on" : ""}">${it.posR ? lb + cir : cir + lb}</div>`;
    },
    desc: it => `一个「${it.label}」单选项（圆点${it.posR ? "在右" : "在左"}），当前${it.checked ? "选中" : "未选中"}`,
  });

  REG.add({
    kind: "slider", name: "滑块", cat: "inputs", icon: "sliders",
    inter: "slider",
    sig: "steps",
    spec: { w: T.CONTENT_W, h: 44, value: 50, steps: 0 },
    props: ["value"],
    propDefs: [{ k: "steps", label: "刻度档位（0=无）", type: "num", min: 0, max: 20 }],
    render(it) {
      const p = pct(it.value);
      const n = Math.max(0, Math.min(20, it.steps | 0));
      let ticks = "";
      for (let i = 1; i < n; i++) ticks += `<span style="position:absolute;top:50%;left:${(i * 100 / n).toFixed(2)}%;width:2px;height:12px;transform:translate(-50%,-50%);border-radius:1px;background:var(--out-var);"></span>`;
      return `<div class="m3e-slider">${ticks}<span class="dot"></span><span class="trk"></span><span class="fil" style="width:calc(${p}% - 2px);"></span><span class="hnd" style="left:${p}%;"></span></div>`;
    },
    desc: it => `一个滑块（M3 细条手柄），当前值 ${pct(it.value)}%${n2zh(it.steps)} `,
    });
  function n2zh(n) { n = Math.max(0, Math.min(20, n | 0)); return n ? `，带 ${n} 档刻度` : ""; }

  REG.add({
    kind: "rating", name: "评分", cat: "inputs", icon: "star",
    sig: "count",
    spec: { w: 160, h: 40, value: 80, count: 5 },
    props: ["value"], propLabels: { value: "评分（0-100）" },
    propDefs: [{ k: "count", label: "星星数量", type: "num", min: 3, max: 10 }],
    render(it) {
      const n = Math.max(3, Math.min(10, it.count || 5));
      const full = Math.round(pct(it.value) / 100 * n);
      let stars = "";
      for (let i = 1; i <= n; i++) stars += `<span class="m3e-ic ${i <= full ? "on" : "off"}">${svgTag("star", 24, i <= full)}</span>`;
      return `<div class="m3e-rating">${stars}</div>`;
    },
    desc: it => `一个${it.count || 5}星评分（亮 ${Math.round(pct(it.value) / 100 * (it.count || 5))} 颗）`,
  });

  REG.add({
    kind: "dateField", name: "日期输入", cat: "inputs", icon: "event_available",
    inter: "input",
    sig: "range",
    spec: { w: 200, h: 56, variant: "outlined", label: "日期", value: "2026-09-10", range: false },
    props: ["label", "value", "variant"], variantList: VARIANTS.textField,
    propDefs: [{ k: "range", label: "区间选择模式", type: "chk" }],
    render(it) {
      const val = it.range ? `${esc(it.value || "")} ~ 结束日期` : esc(it.value || "");
      return `<div class="m3e-tf v-${it.variant || "outlined"}">${it.label ? `<span class="cap">${esc(it.label)}</span>` : ""}<span class="val">${val}</span>${ic("event", 24)}</div>`;
    },
    desc: it => `一个${it.range ? "日期区间" : "日期"}输入框，值「${it.value}」，尾部日历图标`,
  });

  REG.add({
    kind: "timeField", name: "时间输入", cat: "inputs", icon: "schedule",
    inter: "input",
    sig: "secs",
    spec: { w: 160, h: 56, variant: "outlined", label: "时间", value: "10:30", secs: false },
    props: ["label", "value", "variant"], variantList: VARIANTS.textField,
    propDefs: [{ k: "secs", label: "显示秒位", type: "chk" }],
    render(it) {
      const val = it.secs ? `${esc(it.value || "10:30")}:00` : esc(it.value || "");
      return `<div class="m3e-tf v-${it.variant || "outlined"}">${it.label ? `<span class="cap">${esc(it.label)}</span>` : ""}<span class="val">${val}</span>${ic("schedule", 24)}</div>`;
    },
    desc: it => `一个时间输入框，值「${it.value}${it.secs ? ":00" : ""}」，尾部时钟图标`,
  });

  REG.add({
    kind: "textarea", name: "多行输入框", cat: "inputs", icon: "subject",
    inter: "input",
    sig: "taRows",
    spec: { w: T.CONTENT_W, h: 120, variant: "filled", label: "备注", value: "", taRows: 4 },
    props: ["label", "value", "variant"], variantList: VARIANTS.textField,
    propDefs: [{ k: "taRows", label: "设计行数", type: "num", min: 2, max: 8 }],
    render(it) {
      const shown = it.value ? esc(it.value) : `<span style="opacity:.45;">请输入内容…</span>`;
      return `<div class="m3e-ta v-${it.variant || "filled"}">${it.label ? `<span class="cap">${esc(it.label)}</span>` : ""}<span class="val">${shown}</span></div>`;
    },
    desc: it => `一个多行文本输入框，标签「${it.label}」，${it.value ? `内容「${it.value}」` : "空值占位"}（约 ${it.taRows || 4} 行，${VN[it.variant] || it.variant}样式）`,
  });

  REG.add({
    kind: "text", name: "文本", cat: "content", icon: "title",
    sig: "align",
    spec: { w: 160, h: 40, label: "标题", size: 28, bold: false, align: "left" },
    props: ["label", "size", "bold"],
    propDefs: [{ k: "align", label: "对齐方式", type: "sel", opts: [["left", "左对齐"], ["center", "居中"], ["right", "右对齐"]] }],
    render(it) {
      const st = `font-size:${it.size || 28}px;${it.bold ? "font-weight:700;" : ""}text-align:${it.align || "left"};`;
      return `<div class="m3e-text" style="${st}">${esc(it.label)}</div>`;
    },
    desc: it => `文本「${it.label}」（${it.size || 28}px${it.bold ? "，加粗" : ""}，${{ left: "左对齐", center: "居中", right: "右对齐" }[it.align || "left"]}）`,
  });

  REG.add({
    kind: "image", name: "图片", cat: "content", icon: "image",
    sig: "fit",
    spec: { w: 200, h: 200, icon: "image", fit: "cover" },
    props: ["src"],
    propDefs: [{ k: "fit", label: "填充模式", type: "sel", opts: [["cover", "裁切填满"], ["contain", "完整显示"], ["fill", "拉伸铺满"]] }],
    render(it) {
      return `<div class="m3e-image">${it.src ? `<img src="${it.src}" alt="" style="object-fit:${it.fit || "cover"};"/>` : ic(it.icon, 48)}</div>`;
    },
    desc: it => `一个图片区域${it.src ? `（已填入图片，${{ cover: "裁切填满", contain: "完整显示", fill: "拉伸铺满" }[it.fit || "cover"]}）` : "（占位）"}`,
  });

  REG.add({
    kind: "camera", name: "相机", cat: "content", icon: "photo_camera",
    sig: "rec",
    spec: { w: T.CONTENT_W, h: Math.round(T.CONTENT_W * 4 / 3), icon: "photo_camera", rec: true },
    props: [],
    propDefs: [{ k: "rec", label: "显示 REC 角标", type: "chk" }],
    render(it) {
      return `<div class="m3e-camera">${it.rec !== false ? '<span class="rec">REC</span>' : ""}${ic("photo_camera", 48)}</div>`;
    },
    desc: it => `一个相机取景占位区（深色背景 + 相机图标${it.rec !== false ? "，REC 录制角标" : ""}）`,
  });

  REG.add({
    kind: "map", name: "地图", cat: "content", icon: "map",
    sig: "pin",
    spec: { w: T.CONTENT_W, h: Math.round(T.CONTENT_W * 3 / 4), icon: "map", pin: false },
    props: [],
    propDefs: [{ k: "pin", label: "定位标记（用「组件名称」作地名）", type: "chk" }],
    render(it) {
      const pin = it.pin ? `<span style="position:absolute;left:14px;bottom:12px;display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--on-sur);background:var(--sur);border-radius:999px;padding:4px 12px 4px 8px;box-shadow:0 1px 4px rgba(0,0,0,.25);"><span style="width:10px;height:10px;border-radius:50%;background:var(--err);display:inline-block;"></span>${esc(it.name || "位置标记")}</span>` : "";
      return `<div class="m3e-map" style="position:relative;">${ic("map", 48)}${pin}</div>`;
    },
    desc: it => `一个地图占位区（路网纹理背景 + 地图图标${it.pin ? "，左下角定位标记" : ""}）`,
  });

  REG.add({
    kind: "badge", name: "徽标", cat: "content", icon: "notifications_unread",
    sig: "dotOnly",
    spec: { w: 24, h: 16, label: "3", dotOnly: false },
    props: ["label"],
    propDefs: [{ k: "dotOnly", label: "红点模式（不显示数字）", type: "chk" }],
    render(it) {
      if (it.dotOnly) return `<span class="m3e-badge" style="width:10px;height:10px;min-width:10px;padding:0;border-radius:50%;"></span>`;
      return `<span class="m3e-badge">${esc(it.label)}</span>`;
    },
    desc: it => it.dotOnly ? `一个红点徽标（无数字）` : `一个数字徽标「${it.label}」`,
  });

  REG.add({
    kind: "divider", name: "分割线", cat: "content", icon: "horizontal_rule",
    sig: "vertical",
    spec: { w: T.CONTENT_W, h: 16, vertical: false },
    props: [],
    propDefs: [{ k: "vertical", label: "垂直分割线", type: "chk" }],
    render(it) {
      return `<div class="m3e-divider${it.vertical ? " vert" : ""}"><span class="ln"></span></div>`;
    },
    desc: it => it.vertical ? `一条垂直分割线` : `一条水平分割线`,
  });

  REG.add({
    kind: "loadingIndicator", name: "加载指示器", cat: "progress", icon: "motion_blur",
    sig: "speed",
    spec: { w: 48, h: 48, speed: 1 },
    props: [],
    propDefs: [{ k: "speed", label: "速度倍率", type: "num", min: 0.5, max: 3, step: 0.1 }],
    render(it) {
      const dur = (1.4 / (it.speed || 1)).toFixed(2);
      const seg = (rot, op) => `<circle cx="24" cy="24" r="18" stroke="var(--pri)" stroke-width="5" stroke-linecap="round" stroke-dasharray="20 93" transform="rotate(${rot} 24 24)" opacity="${op}"/>`;
      return `<div class="m3e-loading"><svg viewBox="0 0 48 48" fill="none" style="animation-duration:${dur}s;">${seg(0, 1)}${seg(90, .72)}${seg(180, .45)}${seg(270, .2)}</svg></div>`;
    },
    desc: it => `一个 M3 四段式加载指示器（扇形旋转动画，速度 ${it.speed || 1}×）——与圆形进度条不同，它表达"处理中"而非进度`,
  });

  REG.add({
    kind: "linearProgress", name: "线性进度条", cat: "progress", icon: "linear_scale",
    sig: "wavy",
    spec: { w: T.CONTENT_W, h: 24, value: 60, wavy: false },
    props: ["value", "wavy"],
    propDefs: [{ k: "wavy", label: "波浪线样式（M3 Expressive）", type: "chk" }],
    render(it) {
      const indet = it.value == null || it.value < 0;
      if (it.wavy) {
        const wave = `<svg viewBox="0 0 100 12" preserveAspectRatio="none" style="display:block;width:100%;height:12px;"><path d="M0 6 Q 3.125 0, 6.25 6 T 12.5 6 T 18.75 6 T 25 6 T 31.25 6 T 37.5 6 T 43.75 6 T 50 6 T 56.25 6 T 62.5 6 T 68.75 6 T 75 6 T 81.25 6 T 87.5 6 T 93.75 6 T 100 6" fill="none" stroke="var(--pri)" stroke-width="3" vector-effect="non-scaling-stroke"/></svg>`;
        return `<div class="m3e-lprog"><div class="trk" style="background:none;overflow:hidden;height:12px;">${indet
          ? `<span class="fil" style="width:40%;">${wave}</span>`
          : `<span style="display:block;width:${pct(it.value)}%;">${wave}</span>`}</div></div>`;
      }
      const fil = indet ? `<span class="fil"></span>` : `<span class="fil" style="width:${pct(it.value)}%;"></span>`;
      return `<div class="m3e-lprog${indet ? " indet" : ""}"><div class="trk">${fil}</div></div>`;
    },
    desc: it => `${it.wavy ? "波浪线" : "直线"}${it.value == null || it.value < 0 ? "不确定进度条（动画）" : `进度条，进度 ${pct(it.value)}%`}`,
  });

  REG.add({
    kind: "circularProgress", name: "圆形进度条", cat: "progress", icon: "progress_activity",
    sig: "showPct",
    spec: { w: 48, h: 48, value: 70, showPct: false },
    props: ["value"],
    propDefs: [{ k: "showPct", label: "中心显示百分比", type: "chk" }],
    render(it) {
      const indet = it.value == null || it.value < 0;
      if (indet) return `<div class="m3e-cprog indet"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="var(--pri)" stroke-width="4" stroke-linecap="round" stroke-dasharray="56 58"/></svg></div>`;
      const c = 2 * Math.PI * 18;
      const off = c * (1 - pct(it.value) / 100);
      const p = `<span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--on-sur);">${Math.round(pct(it.value))}%</span>`;
      return `<div class="m3e-cprog" style="position:relative;"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="var(--pri-c)" stroke-width="4"/><circle cx="24" cy="24" r="18" stroke="var(--pri)" stroke-width="4" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${off}" transform="rotate(-90 24 24)"/></svg>${it.showPct ? p : ""}</div>`;
    },
    desc: it => it.value == null || it.value < 0 ? `一个圆形进度指示器（旋转动画）` : `一个带轨道的圆形进度条，进度 ${pct(it.value)}%${it.showPct ? "，中心显示百分比数字" : ""}`,
  });

  /* ============ 扩展组件（表格 / 媒体 / 导航扩展 / 自定义） ============ */

  REG.add({
    kind: "customHtml", name: "HTML 组件", cat: "content", icon: "code",
    sig: "html",
    spec: { w: 200, h: 80, html: '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#E8DEF8;border-radius:12px;color:#21005D;font-size:14px;">自定义 HTML</div>' },
    props: ["html", "css", "vueScript"],
    render(it) {
      /* sclass = 样式作用域类（导入/社区组件自动生成，防止选择器污染全局） */
      const inner = it.sclass
        ? `<div class="${it.sclass}" style="display:contents">${it.html || ""}</div>`
        : (it.html || "");
      const css = [];
      if (it.css) css.push(it.css);
      if (it.vueStyle) css.push(it.vueStyle);
      return `<div class="m3e-html${it.sclass ? " gxbox" : ""}">${inner}${css.length ? `<style>${css.join("\n")}</style>` : ""}</div>`;
    },
    desc(it) {
      if (it.gx) return `Uiverse.io 社区组件「${it.name || "未命名"}」（作者 ${it.gx.a || "community"}，MIT 许可；HTML/CSS 已内嵌到代码中）`;
      return `一块自定义代码区域（内容以代码为准${it.vueScript ? "，含 Vue 脚本" : ""}${it.css ? "，含独立 CSS（已作用域隔离）" : ""}）`;
    },
  });

  REG.add({
    kind: "avatar", name: "头像", cat: "content", icon: "account_circle",
    sig: "shape",
    spec: { w: 48, h: 48, icon: "person", label: "", fill: "secondaryContainer", shape: "circle" },
    props: ["label", "icon", "fill"], fillList: FILL_TOKENS,
    propDefs: [{ k: "shape", label: "形状", type: "sel", opts: [["circle", "圆形"], ["rounded", "圆角方形"], ["square", "方形"]] }],
    render(it) {
      const r = it.shape === "square" ? "0" : it.shape === "rounded" ? "12px" : "50%";
      const bg = `background:var(--${tokVar(it.fill || "secondaryContainer")});color:var(--${tokVar(it.fill || "secondaryContainer") === "pri" ? "on-pri" : "on-sec-c"});border-radius:${r};`;
      const inner = it.label
        ? esc(it.label.slice(0, 2))
        : ic(it.icon || "person", Math.round(Math.min(it.w, it.h) * 0.55));
      return `<div class="m3e-avatar" style="${bg}${it.src ? "padding:0;" : ""}">${it.src ? `<img src="${it.src}" alt="" style="border-radius:${r};"/>` : inner}</div>`;
    },
    desc: it => `一个${{ circle: "圆形", rounded: "圆角方形", square: "方形" }[it.shape || "circle"]}头像（${it.label ? "文字「" + it.label + "」" : (it.icon || "person") + " 图标"}）`,
  });

  /* ============ 扩展组件第二批（信息录入 / 内容结构） ============ */

  REG.add({
    kind: "calendar", name: "日历", cat: "content", icon: "event",
    sig: "selDay",
    spec: { w: 340, h: 340, label: "2026年9月", selDay: 12 },
    props: ["label"],
    propDefs: [{ k: "selDay", label: "选中日期", type: "num", min: 1, max: 30 }],
    render(it) {
      const wk = ["一", "二", "三", "四", "五", "六", "日"].map(d => `<span>${d}</span>`).join("");
      const sel = Math.min(30, Math.max(1, it.selDay || 12));
      let days = "";
      for (let i = 1; i <= 30; i++) days += `<span class="d${i === sel ? " sel" : ""}"><i>${i}</i></span>`;
      for (let i = 0; i < 5; i++) days += `<span class="d mute"><i></i></span>`;
      return `<div class="m3e-cal"><div class="hd">${ic("chevron_left", 20)}<span class="mt">${esc(it.label)}</span>${ic("chevron_right", 20)}</div><div class="wk">${wk}</div><div class="grid">${days}</div></div>`;
    },
    desc: it => `一个月历组件「${it.label}」，其中 ${it.selDay || 12} 日为选中态`,
  });

  REG.add({
    kind: "pagination", name: "分页", cat: "navigation", icon: "more_horiz",
    sig: "bound",
    spec: { w: 280, h: 40, value: 2, size: 5, bound: false },
    props: ["value", "size"], propLabels: { value: "当前页", size: "总页数" },
    propDefs: [{ k: "bound", label: "边界省略（1 … 4 5 6 … 20）", type: "chk" }],
    render(it) {
      const n = Math.max(1, Math.min(99, it.size || 5));
      const cur = Math.min(Math.max(1, it.value || 1), n);
      let seq = [];
      if (it.bound && n > 7) {
        const keep = new Set([1, n, cur - 1, cur, cur + 1]);
        for (let i = 1; i <= n; i++) {
          if (keep.has(i)) seq.push(i);
          else if (seq[seq.length - 1] !== "…") seq.push("…");
        }
      } else {
        for (let i = 1; i <= n; i++) seq.push(i);
      }
      const pgs = seq.map(x => x === "…"
        ? `<span class="pg" style="border:none;background:none;">…</span>`
        : `<span class="pg${x === cur ? " sel" : ""}">${x}</span>`).join("");
      return `<div class="m3e-pagi">${ic("chevron_left", 22)}${pgs}${ic("chevron_right", 22)}</div>`;
    },
    desc: it => `一个分页控件（共 ${it.size || 5} 页，当前第 ${it.value || 1} 页${it.bound ? "，长列表边界省略样式" : ""}）`,
  });

  REG.add({
    kind: "breadcrumb", name: "面包屑", cat: "navigation", icon: "double_arrow",
    inter: "tabs",
    tabsMeta: it => ({ wrap: "m3e-bc", child: "bc", pre: it.bcHome ? ic("home", 16) : "" }),
    sig: "bcHome",
    spec: {
      w: 280, h: 40, selected: 2, bcHome: true,
      tabs: [{ icon: "", label: "首页" }, { icon: "", label: "分类" }, { icon: "", label: "详情" }],
    },
    props: ["tabs", "selected"], tabsName: "层级", tabsHideIcon: true, propLabels: { selected: "当前页" },
    propDefs: [{ k: "bcHome", label: "首位小房子图标", type: "chk" }],
    render(it) {
      const home = it.bcHome ? `<span class="bh">${ic("home", 16)}</span>` : "";
      const ds = tabsOf(it).map((t, i) =>
        `<span class="bc${i === it.selected ? " sel" : ""}">${esc(t.label)}</span>`).join("");
      return `<div class="m3e-bc">${home}${ds}</div>`;
    },
    desc: it => `一条面包屑导航：${tabsOf(it).map(t => t.label).join(" / ")}，当前页「${(tabsOf(it)[it.selected] || {}).label || ""}」${it.bcHome ? "，首位带小房子图标" : ""}`,
  });

  REG.add({
    kind: "stepper", name: "步骤条", cat: "navigation", icon: "linear_scale",
    inter: "tabs",
    tabsMeta: null, /* 步骤条结构含连接线，不参与页签交互重建（HTML/Vue 均静态渲染） */
    sig: "doneIcon",
    spec: { w: 320, h: 56, selected: 1, doneIcon: "check", tabs: [{ icon: "", label: "第一步" }, { icon: "", label: "第二步" }, { icon: "", label: "第三步" }] },
    props: ["tabs", "selected"], tabsName: "步骤", tabsHideIcon: true,
    propDefs: [{ k: "doneIcon", label: "已完成步骤显示", type: "sel", opts: [["check", "对勾"], ["num", "步骤号"]] }],
    render(it) {
      const steps = tabsOf(it);
      const cur = it.selected || 0;
      const parts = steps.map((t, i) => {
        const cls = i < cur ? "done" : i === cur ? "cur" : "";
        const dot = i < cur && it.doneIcon !== "num" ? svgTag("check", 16) : String(i + 1);
        return `<div class="st ${cls}"><span class="dot">${dot}</span><span class="sl">${esc(t.label)}</span></div>`;
      });
      let html = parts[0] || "";
      for (let i = 1; i < parts.length; i++) html += `<span class="ln${i <= cur ? " done" : ""}"></span>` + parts[i];
      return `<div class="m3e-stepper">${html}</div>`;
    },
    desc: it => `一个步骤条，共 ${tabsOf(it).length} 步：${tabsOf(it).map(t => t.label).join(" → ")}，当前第 ${(it.selected || 0) + 1} 步（已完成显示${it.doneIcon === "num" ? "步骤号" : "对勾"}）`,
  });

  REG.add({
    kind: "carousel", name: "轮播", cat: "content", icon: "view_carousel",
    sig: "dots",
    spec: { w: T.CONTENT_W, h: 200, icon: "image", dots: 3 },
    props: ["src"],
    propDefs: [{ k: "dots", label: "指示点数量", type: "num", min: 2, max: 6 }],
    render(it) {
      const n = Math.max(2, Math.min(6, it.dots || 3));
      let dots = "";
      for (let i = 0; i < n; i++) dots += `<i${i === 0 ? " on" : ""}></i>`;
      const inner = it.src ? `<img src="${it.src}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"/>` : ic(it.icon || "image", 48);
      return `<div class="m3e-carousel">${inner}<span class="cv l">${svgTag("chevron_left", 20)}</span><span class="cv r">${svgTag("chevron_right", 20)}</span><span class="dots">${dots}</span></div>`;
    },
    desc: it => `一个图片轮播区域（左右切换箭头 + ${it.dots || 3} 个指示点）`,
  });

  REG.add({
    kind: "video", name: "视频占位", cat: "content", icon: "play_circle",
    sig: "dur",
    spec: { w: T.CONTENT_W, h: 220, dur: "" },
    props: [],
    propDefs: [{ k: "dur", label: "时长文字（如 03:24）", type: "txt" }],
    render(it) {
      return `<div class="m3e-video">${ic("play_circle", 56)}<span class="bar"><i></i>${it.dur ? `<b style="position:absolute;right:0;bottom:8px;font-weight:400;font-size:10px;color:rgba(255,255,255,.85);">${esc(it.dur)}</b>` : ""}</span></div>`;
    },
    desc: it => `一个视频播放占位区（播放按钮 + 进度条${it.dur ? `，时长 ${it.dur}` : ""}）`,
  });

  REG.add({
    kind: "tooltip", name: "提示气泡", cat: "content", icon: "info",
    sig: "arrowPos",
    spec: { w: 140, h: 32, label: "这是一条提示", arrowPos: "center" },
    props: ["label"],
    propDefs: [{ k: "arrowPos", label: "小箭头位置", type: "sel", opts: [["left", "偏左"], ["center", "居中"], ["right", "偏右"]] }],
    render(it) {
      return `<div class="m3e-tip"><span class="bub arr-${it.arrowPos || "center"}">${esc(it.label)}</span></div>`;
    },
    desc: it => `一个深色提示气泡「${it.label}」，底部小箭头${{ left: "偏左", center: "居中", right: "偏右" }[it.arrowPos || "center"]}`,
  });

  REG.add({
    kind: "navDrawer", name: "导航抽屉", cat: "navigation", icon: "menu_open",
    inter: "tabs",
    sig: "footer",
    spec: {
      w: 280, h: T.PHONE_H, selected: 0, label: "标题", footer: "",
      tabs: [{ icon: "home", label: "首页" }, { icon: "favorite", label: "收藏" }, { icon: "settings", label: "设置" }, { icon: "info", label: "关于" }],
    },
    props: ["label", "tabs", "selected"],
    propDefs: [{ k: "footer", label: "底部条目文字", type: "txt" }],
    render(it) {
      const head = `<div class="dh">${ic("menu", 24)}<span class="dt">${esc(it.label)}</span></div>`;
      const rows = tabsOf(it).map((t, i) =>
        `<div class="di${i === it.selected ? " sel" : ""}">${ic(t.icon, 22, i === it.selected)}<span>${esc(t.label)}</span></div>`).join("");
      const foot = it.footer ? `<div style="margin-top:auto;padding:14px 16px;border-top:1px solid var(--out-var);display:flex;align-items:center;gap:10px;color:var(--on-sur-var);font-size:13px;">${ic("logout", 20)}${esc(it.footer)}</div>` : "";
      return `<div class="m3e-drawer">${head}${rows}${foot}</div>`;
    },
    desc: it => `一个导航抽屉（宽 280）：标题「${it.label}」，项目：${tabsOf(it).map(t => t.label).join("、")}，当前选中「${(tabsOf(it)[it.selected] || {}).label || ""}」${it.footer ? `，底部「${it.footer}」` : ""}`,
  });

  REG.add({
    kind: "heroHeader", name: "大图头部", cat: "content", icon: "image",
    sig: "scrim",
    spec: { w: T.PHONE_W, h: 220, label: "山野徒步", supporting: "发现身边的路线", scrim: 40 },
    props: ["label", "supporting", "src"],
    propDefs: [{ k: "scrim", label: "底部遮罩浓度（%）", type: "num", min: 0, max: 80 }],
    render(it) {
      const op = ((it.scrim == null ? 40 : it.scrim) / 100).toFixed(2);
      return `<div class="m3e-hero">${it.src ? `<img src="${it.src}" alt=""/>` : ""}<span class="ov" style="opacity:${op};"></span><div class="tx"><div class="h">${esc(it.label)}</div><div class="s">${esc(it.supporting)}</div></div></div>`;
    },
    desc: it => `一个大图页面头部：标题「${it.label}」，副题「${it.supporting}」${it.src ? "" : "（深色渐变底图，可放图片）"}，底部遮罩浓度 ${it.scrim == null ? 40 : it.scrim}%`,
  });

  REG.add({
    kind: "sectionHeader", name: "分区标题", cat: "content", icon: "title",
    sig: "hideMore",
    spec: { w: T.CONTENT_W, h: 40, label: "推荐内容", supporting: "查看全部", hideMore: false },
    props: ["label", "supporting"],
    propDefs: [{ k: "hideMore", label: "隐藏右侧入口", type: "chk" }],
    render(it) {
      const more = it.hideMore ? "" : `<span class="more">${esc(it.supporting)}${svgTag("chevron_right", 18)}</span>`;
      return `<div class="m3e-sechead"><span class="t">${esc(it.label)}</span>${more}</div>`;
    },
    desc: it => `一个分区标题行：左侧「${it.label}」${it.hideMore ? "" : `，右侧「${it.supporting}」入口`}`,
  });

  REG.add({
    kind: "emptyState", name: "空状态", cat: "content", icon: "inbox",
    sig: "cta",
    spec: { w: T.CONTENT_W, h: 260, icon: "inbox", label: "暂无内容", supporting: "这里还没有任何数据", cta: "" },
    props: ["icon", "label", "supporting"],
    propDefs: [{ k: "cta", label: "行动按钮文字", type: "txt" }],
    render(it) {
      const btn = it.cta ? `<button style="margin-top:10px;border:none;background:var(--pri);color:var(--on-pri);border-radius:999px;padding:9px 24px;font-size:14px;font-weight:600;flex:none;">${esc(it.cta)}</button>` : "";
      return `<div class="m3e-empty">${ic(it.icon, 56)}<span class="t">${esc(it.label)}</span><span class="s">${esc(it.supporting)}</span>${btn}</div>`;
    },
    desc: it => `一个空状态占位：${it.icon} 图标，标题「${it.label}」，副文「${it.supporting}」${it.cta ? `，行动按钮「${it.cta}」` : ""}`,
  });

  REG.add({
    kind: "timeline", name: "时间线", cat: "content", icon: "timeline",
    sig: "tlLine",
    spec: {
      w: T.CONTENT_W, h: 220, selected: 1, tlLine: "solid",
      tabs: [{ icon: "", label: "下单成功" }, { icon: "", label: "支付完成" }, { icon: "", label: "商家发货" }, { icon: "", label: "确认收货" }],
    },
    props: ["tabs", "selected"], tabsName: "节点", tabsHideIcon: true, propLabels: { selected: "当前进行到" },
    propDefs: [{ k: "tlLine", label: "连线样式", type: "sel", opts: [["solid", "实线"], ["dashed", "虚线"], ["none", "无连线"]] }],
    render(it) {
      const cur = it.selected == null ? 1 : it.selected;
      const line = it.tlLine === "none" ? " noline" : it.tlLine === "dashed" ? " dashed" : "";
      const rows = tabsOf(it).map((t, i) => {
        const st = i < cur ? "done" : i === cur ? "cur" : "wait";
        return `<div class="tli ${st}"><span class="rail"><i class="dot"></i><i class="ln2"></i></span><span class="tx">${esc(t.label)}</span></div>`;
      }).join("");
      return `<div class="m3e-tline${line}">${rows}</div>`;
    },
    desc: it => `一条时间线：${tabsOf(it).map(t => t.label).join(" → ")}，当前进行到「${(tabsOf(it)[it.selected == null ? 1 : it.selected] || {}).label || ""}」${it.tlLine === "dashed" ? "（虚线连接）" : it.tlLine === "none" ? "（无连线）" : ""}`,
  });

  REG.add({
    kind: "quote", name: "引用块", cat: "content", icon: "format_quote",
    sig: "cite",
    spec: { w: T.CONTENT_W, h: 120, label: "设计不只是看起来如何，设计是它如何运作。", cite: "Steve Jobs" },
    props: ["label"],
    propDefs: [{ k: "cite", label: "来源署名", type: "txt" }],
    render(it) {
      return `<div class="m3e-quote"><span class="qmark">${svgTag("format_quote", 24, true)}</span><div class="qt">${esc(it.label)}</div>${it.cite ? `<span class="ct">—— ${esc(it.cite)}</span>` : ""}</div>`;
    },
    desc: it => `一个引用块：「${it.label}」${it.cite ? `，署名「${it.cite}」` : ""}`,
  });

  REG.add({
    kind: "codeBlock", name: "代码块", cat: "content", icon: "integration_instructions",
    sig: "lang",
    spec: { w: T.CONTENT_W, h: 140, label: "npm install @m3e/designer", lang: "bash" },
    props: ["label"],
    propDefs: [{ k: "lang", label: "语言角标", type: "txt" }],
    render(it) {
      return `<div class="m3e-codeblk">${it.lang ? `<span class="lang">${esc(it.lang)}</span>` : ""}<pre>${esc(it.label)}</pre></div>`;
    },
    desc: it => `一个${it.lang ? it.lang + " " : ""}代码块，内容「${String(it.label).slice(0, 40)}${String(it.label).length > 40 ? "…" : ""}」`,
  });

  /* fill token → CSS 变量名 */
  function tokVar(k) {
    return { surfaceContainerLow: "sur-cl", surfaceContainer: "sur-c", surfaceContainerHigh: "sur-ch", surfaceContainerHighest: "sur-chh", primaryContainer: "pri-c", secondaryContainer: "sec-c", tertiaryContainer: "ter-c", inverseSurface: "inv-sur", surface: "sur", primary: "pri" }[k] || "sur-c";
  }
  REG.tokVar = tokVar;
  REG.variantNames = VN; REG.fillNames = FV;

  /** 由 spec 生成新条目 */
  REG.create = function (kind, x, y, theme) {
    const d = REG.defs[kind];
    const it = Object.assign({ id: T.uid(), kind, x: Math.round(x), y: Math.round(y) }, JSON.parse(JSON.stringify(d.spec)));
    it._theme = theme;
    return it;
  };
  REG.def = kind => REG.defs[kind];

  window.M3E_REG = REG;
})();
