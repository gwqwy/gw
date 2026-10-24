/* gw Designer — AI 接口（页面协议 + 应用引擎）
 * 纯逻辑层（可在 Node 单测）：app.js 的「AI 助手」面板与控制台都经由这里的 applyOp 落地。
 * 设计原则：AI 的一切输出先经过白名单校验 / 边界钳制 / 页面名→id 解析，非法输入被拒绝
 * 或降级为警告，绝不污染设计；应用引擎不碰 UI（渲染与历史由 app.js 负责）。
 *
 * window.M3E_AI.schemaDoc()   协议文档（注入 LLM system，也供人与外部 AI 阅读）
 * window.M3E_AI.extractJSON   从 AI 回复中提取 JSON（```json 围栏 / 裸 JSON / 混入说明文字）
 * window.M3E_AI.applyOp       把一个协议操作应用到 design 对象（返回 {ok, applied, warns, pageId}）
 * window.M3E_AI.exportContext 当前设计的紧凑上下文（喂给 AI）
 * window.M3E_AI.findPage      页面名/ID → page */
(function () {
  "use strict";
  const T = () => window.M3E_TOKENS;
  const R = () => window.M3E_REG;
  const PROTO_VERSION = 1;

  /* ---------- 协议文档（注入 LLM 的 system 主体） ---------- */
  function schemaDoc() {
    return `gw Designer AI 页面协议 v${PROTO_VERSION} —— 你输出的 JSON 会被直接应用到设计器画布。
只输出一个 JSON 对象，不要输出解释文字或多余内容。所有坐标单位为 px，页面尺寸：手机 412×892、桌面 1280×800。

## 操作（op，五选一）

1) 新建页面（并放置组件）
{"op":"createPage","page":{"name":"登录","kind":"phone","bg":"#FFFFFF"},"items":[组件,...]}
2) 向已有页面追加组件
{"op":"addItems","page":"页面名称","items":[组件,...]}
3) 更新已有组件（match 定位，patch 为要修改的字段）
{"op":"updateItem","page":"页面名称","match":{"kind":"button","index":0},"patch":{"label":"新的文字","w":160}}
   match 可用 name(图层显示名) / label(主文字) / kind(类型)，index 为命中多个时的序号（从 0）
4) 删除组件（match 同上，删除所有匹配项）
{"op":"deleteItems","page":"页面名称","match":{"label":"旧按钮"}}
5) 修改主题
{"op":"setTheme","palette":"purple|blue|green|coral|amber|teal|mono","dark":false,"shape":"square|rounded|full"}

## 组件对象：{"kind":"类型","x":0,"y":0,"w":?,"h":?, ...类型属性}
w/h 省略时用默认尺寸。类型清单（分类 · kind(名称) · 常用属性）：
- 操作：button(按钮 label,icon,variant filled|tonal|elevated|outlined|text,iconPos left|right|none) | iconButton(图标按钮 icon,variant,dot) | fab(FAB icon,fbadge) | extendedFab(扩展FAB label,icon,loading) | splitButton(拆分按钮 label,icon,splitAt) | fabMenu(FAB菜单 tabs[{icon,label}],expand up|down) | chip(标签片 label,checked,removable) | segmented(分段按钮 tabs[{icon,label}],selected,segTight)
- 导航：topAppBar(顶部应用栏 label,icon,icon2,centerT，默认 412×88 贴顶 y=0) | bottomNav(导航栏 tabs[{icon,label}],selected,hideLb，默认 412×104 贴底) | navRail(侧边导航栏 tabs,selected，宽 80) | toolbar(悬浮工具栏 tabs) | tabs(标签页 tabs[{icon,label}],selected,indStyle pill|underline) | searchBar(搜索栏 label,icon2,suggest) | pagination(分页 value,size,bound) | stepper(步骤条 tabs,selected) | breadcrumb(面包屑 tabs,selected,bcHome) | navDrawer(导航抽屉 label,tabs,selected,footer)
- 容器：card(卡片 label,supporting,variant,noImage,src，默认 380×223) | listItem(列表项 label,supporting,icon,icon2,meta，默认 380×72) | box(容器框 fill,frame none|line|dash,radius) | dialog(对话框 label,supporting,icon) | snackbar(消息条 label,supporting,iconL) | table(表格 tabs[{label:列名}],rows) | accordion(折叠面板 tabs,selected) | bottomSheet(底部弹层 label,supporting) | banner(横幅通知 label,supporting,tone info|warn|err) | listGroup(列表组 tabs[{icon,label}],divid)
- 输入：textField(文本输入框 label,value,hint,icon，默认 380×56) | textarea(多行输入框 label,value,taRows) | searchField(搜索输入框 label,value,clearBtn) | stepperInput(数字步进器 label,value,stepBy) | otpInput(验证码输入 otpLen 4-8) | select(下拉菜单 label,tabs[{label}],selected,assist) | switch(开关 label,checked) | checkbox(复选框 label,checked,tri) | radio(单选按钮 label,checked) | slider(滑块 value 0-100,steps) | rating(评分 value,count) | dateField(日期输入 label,value,range) | timeField(时间输入 label,value,secs)
- 内容：text(文本 label,size,bold,align left|center|right) | image(图片 src,fit cover|contain|fill) | camera(相机 rec) | map(地图 pin) | badge(徽标 label,dotOnly) | divider(分割线 vertical) | avatar(头像 label,icon,shape circle|rounded|square,src) | carousel(轮播 src,dots) | video(视频占位 dur) | tooltip(提示气泡 label,arrowPos) | calendar(日历 label,selDay) | heroHeader(大图头部 label,supporting,scrim,src) | sectionHeader(分区标题 label,supporting,hideMore) | emptyState(空状态 icon,label,supporting,cta) | timeline(时间线 tabs[{label}],selected,tlLine solid|dashed|none) | quote(引用块 label,cite) | codeBlock(代码块 label,lang) | skeleton(骨架屏 skRows 1-6) | chartLine(折线图 chPts,chFill,chGrid) | chartBar(柱状图 chBars,chLine) | chartDonut(环形占比图 chPct,chLabel) | chatBubble(聊天气泡 label,chatSide left|right,chatTime) | customHtml(HTML组件 html,css)
- 进度：loadingIndicator(加载指示器 speed) | linearProgress(线性进度条 value,wavy) | circularProgress(圆形进度条 value,showPct)

## 通用字段（所有组件可用）
name(图层显示名) | note(行为说明，写进 AI 提示词) | action(点击跳转：填目标页面名称，设计器自动解析；弹窗行为暂不支持) | opacity(0-100) | rotate(0-359) | radius(圆角 px)

## 布局规则
- 边距 16，间距用 8/16 的倍数；顶部应用栏 y=0 贴顶，底部导航栏 y=页面高-104 贴底，FAB 在右下角。
- 组件不得超出页面边界（超界会被自动钳回）；纵向排布时依次累加 y 并留出间距。
- tabs 数组元素：图标类导航/工具栏用 {"icon":"home","label":"首页"}；纯文字类（表格列/下拉选项/步骤）用 {"label":"文字"}；icon 使用 Material Symbols 名称。`;
  }

  /* ---------- JSON 提取 ---------- */
  function extractJSON(text) {
    text = String(text == null ? "" : text).trim();
    if (!text) return { ok: false, error: "内容为空" };
    const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const cands = [];
    if (fence) cands.push(fence[1]);
    cands.push(text);
    const s = text.indexOf("{"), e = text.lastIndexOf("}");
    if (s >= 0 && e > s) cands.push(text.slice(s, e + 1));
    for (const c of cands) {
      try { return { ok: true, value: JSON.parse(c) }; } catch (err) { /* 试下一个 */ }
    }
    return { ok: false, error: "未找到可解析的 JSON" };
  }

  /* ---------- 基础工具 ---------- */
  function findPage(design, ref) {
    if (ref == null || ref === "") return null;
    const s = String(ref).trim().toLowerCase();
    return design.pages.find(p => p.id === ref)
      || design.pages.find(p => String(p.name).trim().toLowerCase() === s)
      || null;
  }

  /** 组件可设置的字段白名单 = 通用 + spec + props + propDefs */
  const COMMON_FIELDS = ["x", "y", "w", "h", "name", "note", "action", "src", "opacity", "rotate", "radius"];
  function fieldsOf(def) {
    const set = new Set(COMMON_FIELDS);
    Object.keys(def.spec || {}).forEach(k => set.add(k));
    (def.props || []).forEach(k => set.add(k));
    (def.propDefs || []).forEach(pd => set.add(pd.k));
    return set;
  }

  function clampItem(it, size) {
    it.w = Math.max(12, Math.min(size.w, it.w));
    it.h = Math.max(12, Math.min(size.h, it.h));
    it.x = Math.max(0, Math.min(size.w - it.w, it.x));
    it.y = Math.max(0, Math.min(size.h - it.h, it.y));
  }

  /** 规范化一个 AI 条目：类型必须存在；字段走白名单；未知字段降级为警告 */
  function normalizeItem(fields, design, warns, where) {
    const kindStr = fields && fields.kind;
    const def = R().defs[kindStr];
    if (!def) { warns.push(where + "：未知组件类型 " + JSON.stringify(kindStr) + "（已跳过）"); return null; }
    const allowed = fieldsOf(def);
    const it = R().create(kindStr, 0, 0, design.theme);
    for (const k in fields) {
      if (k === "kind") continue;
      if (!allowed.has(k)) { warns.push(where + "：" + kindStr + " 不支持字段 " + k + "（已忽略）"); continue; }
      it[k] = fields[k];
    }
    return it;
  }

  /** action 字符串若为页面名称 → 解析为页面 id；解析失败则移除并警告 */
  function resolveActions(design, items, warns) {
    for (const it of items) {
      const a = it.action;
      if (typeof a !== "string" || !a) continue;
      if (a.indexOf("popup:") === 0 || a === "closepop") continue;
      if (design.pages.some(p => p.id === a)) continue;
      const t = findPage(design, a);
      if (t) it.action = t.id;
      else { delete it.action; warns.push("action「" + a + "」未匹配到页面（已移除跳转）"); }
    }
  }

  /** match → 命中的条目下标数组 */
  function matchItems(page, m) {
    m = m || {};
    if (m.id != null) {
      const i = page.items.findIndex(x => x.id === m.id);
      return i < 0 ? [] : [i];
    }
    const cands = [];
    page.items.forEach((it, i) => {
      const hitName = m.name != null && String(it.name || "") === String(m.name);
      const hitLabel = m.label != null && String(it.label || "") === String(m.label);
      const hitKind = m.kind != null && it.kind === m.kind;
      if (hitName || hitLabel || hitKind) cands.push(i);
    });
    if (m.index != null) {
      if (!cands.length) return [];
      return [cands[Math.max(0, Math.min(cands.length - 1, Math.round(+m.index || 0)))]];
    }
    return cands;
  }

  /* ---------- 各操作 ---------- */
  function opSetTheme(design, op, warns) {
    const th = design.theme;
    const patch = op.theme || op;
    if (patch.palette != null) {
      if (!T().PALETTES.some(p => p.key === patch.palette)) return { ok: false, error: "非法色板：" + patch.palette + "（可用 " + T().PALETTES.map(p => p.key).join("/") + "）" };
      th.palette = patch.palette;
    }
    if (patch.dark != null) th.dark = !!patch.dark;
    if (patch.shape != null) {
      if (!["square", "rounded", "full"].includes(patch.shape)) return { ok: false, error: "非法形状：" + patch.shape };
      th.shape = patch.shape;
    }
    return { ok: true, applied: `主题已更新（${th.palette} / ${th.dark ? "深色" : "浅色"} / ${th.shape}）`, warns };
  }

  function normalizeList(arr, design, warns, label) {
    const out = [];
    if (!Array.isArray(arr)) return { out, bad: 0, empty: true };
    for (let i = 0; i < arr.length; i++) {
      const it = normalizeItem(arr[i], design, warns, label + "[" + i + "]");
      if (it) out.push(it);
    }
    return { out, bad: arr.length - out.length, empty: false };
  }

  function opCreatePage(design, op, warns) {
    const pgIn = op.page || {};
    const name = String(pgIn.name || op.name || "").trim() || "AI 页面";
    if (findPage(design, name)) return { ok: false, error: "已存在同名页面「" + name + "」，请换名或改用 addItems/updateItem" };
    const kindName = (pgIn.kind || op.kind) === "desktop" ? "desktop" : "phone";
    const page = T().defaultPage(name, kindName);
    if (pgIn.bg && /^#[0-9a-fA-F]{6}$/.test(pgIn.bg)) page.bg = pgIn.bg;
    const { out: items, bad, empty } = normalizeList(op.items, design, warns, "items");
    if (empty) warns.push("未提供 items，已创建空页面");
    const size = T().pageSize(page);
    items.forEach(it => clampItem(it, size));
    resolveActions(design, items, warns);
    page.items.push(...items);
    design.pages.push(page);
    return { ok: true, applied: `新建页面「${name}」（${items.length} 个组件${bad ? "，" + bad + " 项无效已跳过" : ""}）`, pageId: page.id, warns };
  }

  function opAddItems(design, op, warns) {
    const page = findPage(design, op.page);
    if (!page) return { ok: false, error: "找不到页面：" + JSON.stringify(op.page == null ? "(缺 page)" : op.page) + "；现有：" + design.pages.map(p => p.name).join("、") };
    if (!Array.isArray(op.items)) return { ok: false, error: "addItems 缺少 items 数组" };
    const { out: items, bad } = normalizeList(op.items, design, warns, "items");
    const size = T().pageSize(page);
    items.forEach(it => clampItem(it, size));
    resolveActions(design, items, warns);
    page.items.push(...items);
    return { ok: true, applied: `向「${page.name}」追加 ${items.length} 个组件${bad ? "（" + bad + " 项无效已跳过）" : ""}`, pageId: page.id, warns };
  }

  function opUpdateItem(design, op, warns) {
    const page = findPage(design, op.page);
    if (!page) return { ok: false, error: "找不到页面：" + JSON.stringify(op.page == null ? "(缺 page)" : op.page) };
    const hits = matchItems(page, op.match);
    if (!hits.length) return { ok: false, error: "未找到匹配的组件（match=" + JSON.stringify(op.match || {}) + "）" };
    const it = page.items[hits[0]];
    const patch = op.patch || {};
    if (patch.kind != null) return { ok: false, error: "不支持修改组件类型（kind），请删除后新建" };
    const allowed = fieldsOf(R().defs[it.kind]);
    for (const k in patch) {
      if (!allowed.has(k)) { warns.push("patch." + k + " 对 " + it.kind + " 无效（已忽略）"); continue; }
      it[k] = patch[k];
    }
    clampItem(it, T().pageSize(page));
    resolveActions(design, [it], warns);
    return { ok: true, applied: `更新「${page.name}」的 ${it.name || it.label || it.kind}`, pageId: page.id, warns };
  }

  function opDeleteItems(design, op, warns) {
    const page = findPage(design, op.page);
    if (!page) return { ok: false, error: "找不到页面：" + JSON.stringify(op.page == null ? "(缺 page)" : op.page) };
    const hits = matchItems(page, op.match);
    if (!hits.length) return { ok: false, error: "未找到匹配的组件（match=" + JSON.stringify(op.match || {}) + "）" };
    const names = hits.map(i => page.items[i].name || page.items[i].label || page.items[i].kind);
    const del = new Set(hits);
    page.items = page.items.filter((_, i) => !del.has(i));
    return { ok: true, applied: `从「${page.name}」删除 ${hits.length} 个组件（${names.join("、")}）`, pageId: page.id, warns };
  }

  /* ---------- 入口 ---------- */
  function applyOp(design, op) {
    const warns = [];
    if (!op || typeof op !== "object" || Array.isArray(op)) return { ok: false, error: "操作必须是 JSON 对象" };
    try {
      switch (op.op) {
        case "setTheme": return opSetTheme(design, op, warns);
        case "createPage": return opCreatePage(design, op, warns);
        case "addItems": return opAddItems(design, op, warns);
        case "updateItem": return opUpdateItem(design, op, warns);
        case "deleteItems": return opDeleteItems(design, op, warns);
        default: return { ok: false, error: "未知 op：" + JSON.stringify(op.op) + "（可用 createPage/addItems/updateItem/deleteItems/setTheme）" };
      }
    } catch (e) {
      return { ok: false, error: "应用失败：" + (e && e.message || e) };
    }
  }

  /* ---------- 上下文导出（喂给 AI） ---------- */
  function exportContext(design, curPageId) {
    const nameOf = id => { const p = design.pages.find(x => x.id === id); return p ? p.name : id; };
    return {
      designName: design.name,
      theme: { palette: design.theme.palette, dark: design.theme.dark, shape: design.theme.shape },
      currentPage: (design.pages.find(p => p.id === curPageId) || design.pages[0] || {}).name,
      pages: design.pages.slice(0, 30).map(p => ({
        name: p.name, kind: p.kind, size: T().pageSize(p),
        items: p.items.slice(0, 80).map(i => {
          const o = { kind: i.kind, name: i.name || i.label || "", x: i.x, y: i.y, w: i.w, h: i.h };
          if (i.action) o.action = i.action.indexOf("popup:") === 0 ? "(弹窗)" : nameOf(i.action);
          if (i.note) o.note = i.note;
          return o;
        }),
      })),
    };
  }

  window.M3E_AI = { PROTO_VERSION, schemaDoc, extractJSON, applyOp, exportContext, findPage };
})();
