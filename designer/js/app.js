/* gw Designer — 应用主体：状态 / 画布编辑 / 面板 / 代码导出 / 桥接 */
(function () {
  "use strict";
  const T = window.M3E_TOKENS, REG = window.M3E_REG, GEN = window.M3E_GEN;

  /* ================= 桥接（.NET WebView2 注入 bridge；浏览器环境自动降级） ================= */
  const Bridge = {
    ok() { return !!(window.chrome && window.chrome.webview && window.chrome.webview.hostObjects && window.chrome.webview.hostObjects.sync && window.chrome.webview.hostObjects.sync.bridge); },
    b() { return window.chrome.webview.hostObjects.sync.bridge; },
    copy(text) {
      try {
        if (this.ok()) { this.b().CopyText(text); return true; }
      } catch (e) { /* 降级 */ }
      if (navigator.clipboard) { navigator.clipboard.writeText(text).catch(() => {}); return true; }
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
      return true;
    },
    readText() {
      try { if (this.ok()) return this.b().GetClipboardText() || ""; } catch (e) { /* 降级 */ }
      return "";
    },
    saveText(defaultName, filter, content) {
      try { if (this.ok()) return !!this.b().SaveTextFile(defaultName, filter, content); } catch (e) { /* 降级 */ }
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
      a.download = defaultName; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 3000);
      return true;
    },
    openText(filter) {
      try { if (this.ok()) return this.b().OpenTextFile(filter) || null; } catch (e) { /* 降级 */ }
      return null;
    },
    pickFolder() {
      try { if (this.ok()) return this.b().PickFolder("选择导出文件夹") || ""; } catch (e) { /* 降级 */ }
      return "";
    },
    writeFiles(folder, files) {
      try { if (this.ok()) return this.b().WriteFiles(folder, JSON.stringify(files)); } catch (e) { /* 降级 */ }
      return -1;
    },
    preview(html) {
      try { if (this.ok()) { this.b().PreviewInBrowser(html); return; } } catch (e) { /* 降级 */ }
      const w = window.open();
      if (w) { w.document.write(html); w.document.close(); }
    },
    setTitle(t) { try { if (this.ok()) this.b().SetTitle(t); } catch (e) { /* 忽略 */ } document.title = t; },
    /* 组件库持久化：桌面版落在 %LOCALAPPDATA%\M3EDesigner\library.json，浏览器降级 localStorage */
    libRead() {
      try { if (this.ok()) return this.b().ReadLib() || ""; } catch (e) { /* 降级 */ }
      return "";
    },
    libWrite(json) {
      let file = false;
      try { if (this.ok()) file = !!this.b().WriteLib(json); } catch (e) { /* 降级 */ }
      try { localStorage.setItem("m3e_designer_widgets", json); } catch (e) { /* 忽略 */ }
      return file;
    },
  };

  /* ================= 状态 ================= */
  let design = null;          // { name, theme:{palette,dark,shape}, pages:[] }
  let curPageId = null;       // 当前编辑页
  let sel = new Set();        // 选中条目 id
  let zoom = 0.6, panX = 40, panY = 20;
  let undoStack = [], redoStack = [];
  let dirty = false;
  let clipboardItem = null;   // 内部复制
  let customWidgets = [];     // 自定义组件库（localStorage 持久化）
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  /* ---------- 自定义组件库（type: items=画布编组 / code=代码组件；桥接文件 + localStorage 双持久化） ---------- */
  function loadWidgets() {
    let raw = Bridge.libRead();
    if (!raw) {
      try { raw = localStorage.getItem("m3e_designer_widgets") || "[]"; } catch (e) { raw = "[]"; }
    }
    try { customWidgets = JSON.parse(raw); } catch (e) { customWidgets = []; }
    if (!Array.isArray(customWidgets)) customWidgets = [];
    customWidgets.forEach(w => { if (!w.type) w.type = "items"; });
  }
  function saveWidgets() {
    Bridge.libWrite(JSON.stringify(customWidgets));
  }
  function widgetBBox(w) {
    let mw = 40, mh = 40;
    for (const it of w.items) { mw = Math.max(mw, it.x + it.w); mh = Math.max(mh, it.y + it.h); }
    return { w: mw, h: mh };
  }
  /** 代码型组件条目字段（html/css/作用域类/Vue 脚本与样式/默认尺寸） */
  function codeFromItem(it) {
    return {
      html: it.html || "", css: it.css || "", cls: it.sclass || "",
      vs: it.vueScript || "", vst: it.vueStyle || "",
      w: it.w || 200, h: it.h || 80,
    };
  }
  function saveSelectionAsWidget() {
    const arr = selItems();
    if (!arr.length) return toast("请先选中要保存的组件");
    const singleCode = arr.length === 1 && arr[0].kind === "customHtml";
    showModal({
      title: "保存为自定义组件",
      message: singleCode
        ? `将把代码组件「${arr[0].name || "HTML 组件"}」保存到左侧「自定义」分类，可反复拖入画布。`
        : `将把选中的 ${arr.length} 个组件保存到「自定义」分类，可反复拖入画布。`,
      input: true, value: singleCode ? (arr[0].name || "我的代码组件") : "我的组件", placeholder: "组件名称", okText: "保存",
      onOk: v => {
        if (!v) return toast("名称不能为空");
        if (singleCode) {
          customWidgets.push({ id: T.uid(), name: v, icon: "code", type: "code", code: codeFromItem(arr[0]) });
        } else {
          const minX = Math.min(...arr.map(i => i.x)), minY = Math.min(...arr.map(i => i.y));
          const items = arr.map(i => {
            const c = JSON.parse(JSON.stringify(i));
            delete c._theme;
            c.x -= minX; c.y -= minY;
            return c;
          });
          const def0 = REG.def(arr[0].kind);
          customWidgets.push({ id: T.uid(), name: v, icon: def0 ? def0.icon : "group", type: "items", items });
        }
        saveWidgets();
        renderPalette();
        toast("已保存到左侧面板「自定义」分类");
      },
    });
  }
  function deleteWidget(id) {
    const w = customWidgets.find(x => x.id === id);
    if (!w) return;
    showModal({
      title: "删除自定义组件",
      message: `确定删除「${w.name}」？已放置到画布中的副本不受影响。`,
      danger: true, okText: "删除",
      onOk: () => {
        customWidgets = customWidgets.filter(x => x.id !== id);
        saveWidgets();
        renderPalette();
        toast("已删除自定义组件");
      },
    });
  }
  function renameWidget(id) {
    const w = customWidgets.find(x => x.id === id);
    if (!w) return;
    showModal({
      title: "重命名自定义组件", input: true, value: w.name, okText: "重命名",
      onOk: v => {
        if (!v) return;
        w.name = v;
        saveWidgets();
        renderPalette();
        toast("已重命名为「" + v + "」");
      },
    });
  }
  /** 把旧作用域类的组件代码换成新的唯一类（同组件多次放置互不干扰） */
  function rebadge(code) {
    if (!code.cls) return { html: code.html || "", css: code.css || "", cls: "" };
    const cls = code.cls.charAt(0) + T.uid();
    return {
      html: String(code.html || "").split(code.cls + "-").join(cls + "-"),
      css: String(code.css || "").split(code.cls).join(cls),
      cls,
    };
  }
  function placeWidget(w, page, x, y, size) {
    if (w.type === "code") {
      const c = w.code || {};
      const rb = rebadge(c);
      addComponent("customHtml", page, x, y, {
        name: w.name,
        html: rb.html, css: rb.css, sclass: rb.cls,
        vueScript: c.vs || "", vueStyle: c.vst || "",
        w: (size && size.w) || c.w || 200, h: (size && size.h) || c.h || 80,
      });
      toast(`已放置「${w.name}」`);
      return;
    }
    pushHistory();
    sel.clear();
    const ag = activeGidFor(page);
    for (const src of w.items) {
      const it = JSON.parse(JSON.stringify(src));
      it.id = T.uid();
      it.x = Math.round(Math.max(0, Math.min(T.pageSize(page).w - it.w, x + src.x)) / 4) * 4;
      it.y = Math.round(Math.max(0, Math.min(T.pageSize(page).h - it.h, y + src.y)) / 4) * 4;
      if (ag) it.gid = ag;
      page.items.push(it);
      sel.add(it.id);
    }
    curPageId = page.id;
    renderAll(); autosave();
    toast(`已放置「${w.name}」（${w.items.length} 个元素）`);
  }

  function curPage() { return design.pages.find(p => p.id === curPageId) || design.pages[0]; }
  function curItems() { return curPage().items; }

  /** 兼容旧项目文件：补齐 groups 字段，并把拖出页面的组件拉回页面内 */
  function normalizeDesign(d) {
    if (d && d.pages) d.pages.forEach(p => {
      if (!Array.isArray(p.groups)) p.groups = [];
      const size = T.pageSize(p);
      for (const it of p.items) {
        it.x = Math.max(0, Math.min(size.w - it.w, it.x));
        it.y = Math.max(0, Math.min(size.h - it.h, it.y));
      }
    });
    return d;
  }

  /* ---------- 编组（图层） ---------- */
  function groupOf(gid) { return (curPage().groups || []).find(g => g.id === gid) || null; }
  function expandGroupsSel() {
    const page = curPage();
    const groups = page.groups || [];
    let added = false;
    for (const g of groups) {
      const members = page.items.filter(i => i.gid === g.id).map(i => i.id);
      const hit = members.some(id => sel.has(id));
      const all = members.every(id => sel.has(id));
      if (hit && !all) { members.forEach(id => sel.add(id)); added = true; }
    }
    return added;
  }
  function groupSelection() {
    const arr = selItems();
    if (arr.length < 2) return toast("请选中至少两个组件再编组");
    pushHistory();
    const page = curPage();
    if (!page.groups) page.groups = [];
    const g = { id: T.uid(), name: `编组 ${page.groups.length + 1}`, popup: false };
    page.groups.push(g);
    arr.forEach(i => { i.gid = g.id; });
    renderAll(); autosave();
    toast(`已编组「${g.name}」（${arr.length} 个组件）`);
  }
  function ungroupSelection() {
    const arr = selItems();
    const gids = [...new Set(arr.map(i => i.gid).filter(Boolean))];
    if (!gids.length) return toast("所选组件不在编组中");
    pushHistory();
    const page = curPage();
    for (const gid of gids) {
      arr.forEach(i => { if (i.gid === gid) delete i.gid; });
      page.groups = (page.groups || []).filter(g => g.id !== gid);
    }
    renderAll(); autosave();
    toast("已取消编组");
  }

  function newDesign() {
    const p = T.defaultPage("屏幕 1", "phone");
    return { name: "未命名设计", theme: { palette: "purple", dark: false, shape: "rounded" }, pages: [p] };
  }

  /* ---------- 撤销 / 重做 ---------- */
  function snapshot() {
    return JSON.stringify({ name: design.name, theme: design.theme, pages: design.pages, curPageId });
  }
  function pushHistory() {
    if (softTimer) { clearTimeout(softTimer); softTimer = null; } /* 硬入栈后终止文本合并窗口，防止下一次编辑丢历史 */
    undoStack.push(snapshot());
    if (undoStack.length > 60) undoStack.shift();
    redoStack.length = 0;
    markDirty();
    updateEditButtons();
  }
  function restore(json) {
    const d = normalizeDesign(JSON.parse(json));
    design.name = d.name; design.theme = d.theme; design.pages = d.pages;
    curPageId = design.pages.some(p => p.id === d.curPageId) ? d.curPageId : design.pages[0].id;
    sel.clear();
    renderAll();
    autosave();
  }
  function undo() { if (!undoStack.length) return toast("没有可撤销的操作"); redoStack.push(snapshot()); restore(undoStack.pop()); markDirty(); updateEditButtons(); }
  function redo() { if (!redoStack.length) return toast("没有可重做的操作"); undoStack.push(snapshot()); restore(redoStack.pop()); markDirty(); updateEditButtons(); }
  /** 撤销/重做按钮的可用状态（无步可退/进时置灰） */
  function updateEditButtons() {
    const u = $("#btnUndo"), r = $("#btnRedo");
    if (u) u.disabled = !undoStack.length;
    if (r) r.disabled = !redoStack.length;
  }

  function markDirty() {
    dirty = true;
    Bridge.setTitle((design.name || "未命名设计") + " — gw Designer");
    clearTimeout(markDirty._t);
    markDirty._t = setTimeout(autosave, 400);
  }
  function autosave() {
    try { localStorage.setItem("m3e_designer_autosave", JSON.stringify(design)); } catch (e) { /* 忽略 */ }
  }

  /* ================= 通用 UI ================= */
  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 1800);
  }

  /** 顶栏设计名：双击就地改名 */
  function bindProjName() {
    const el = $("#projName");
    el.title = "双击修改设计名称";
    el.addEventListener("dblclick", () => {
      if (el.querySelector("input")) return;
      el.innerHTML = `<input type="text" value="${REG.esc(design.name)}"/>`;
      const input = el.querySelector("input");
      input.focus(); input.select();
      let done = false;
      const commit = ok => {
        if (done) return;
        done = true;
        const v = input.value.trim();
        if (ok && v && v !== design.name) {
          design.name = v;
          markDirty();
          toast("设计名称已改为「" + v + "」");
        }
        el.textContent = design.name;
      };
      input.addEventListener("click", ev => ev.stopPropagation());
      input.addEventListener("pointerdown", ev => ev.stopPropagation());
      input.addEventListener("keydown", ev => {
        ev.stopPropagation();
        if (ev.key === "Enter") commit(true);
        else if (ev.key === "Escape") commit(false);
      });
      input.addEventListener("blur", () => commit(true));
    });
  }

  /* ================= 应用内模态弹窗（替代原生 prompt/confirm） ================= */
  function showModal(opts) {
    let ov = $("#modal");
    if (!ov) {
      ov = document.createElement("div");
      ov.id = "modal";
      document.body.appendChild(ov);
    }
    ov.innerHTML = `<div class="modal-card">
      <div class="modal-t">${REG.esc(opts.title || "提示")}</div>
      ${opts.message ? `<div class="modal-m">${REG.esc(opts.message)}</div>` : ""}
      ${opts.body || ""}
      ${opts.input ? `<input class="modal-i" value="${REG.esc(opts.value || "")}" placeholder="${REG.esc(opts.placeholder || "")}"/>` : ""}
      <div class="modal-b"><button class="mini" data-m="c">取消</button><button class="mini ${opts.danger ? "danger" : "primary"}" data-m="ok">${REG.esc(opts.okText || "确定")}</button></div>
    </div>`;
    ov.classList.add("open");
    const input = ov.querySelector(".modal-i");
    const close = () => { ov.classList.remove("open"); ov.innerHTML = ""; };
    const finish = ok => {
      const v = input ? input.value.trim() : "";
      const card = ov.querySelector(".modal-card");
      close();
      if (ok && opts.onOk) opts.onOk(v, card);
    };
    ov.querySelector('[data-m="c"]').addEventListener("click", () => finish(false));
    ov.querySelector('[data-m="ok"]').addEventListener("click", () => finish(true));
    ov.addEventListener("keydown", ev => {
      if (ev.key === "Escape") finish(false);
      else if (ev.key === "Enter") finish(true);
    });
    if (input) { input.focus(); input.select(); }
    else ov.querySelector('[data-m="ok"]').focus();
    return { close };
  }

  /* ================= 拖动取色器 ================= */
  function hexToHsv(hex) {
    const n = hex.replace("#", "");
    const r = parseInt(n.slice(0, 2), 16) / 255, g = parseInt(n.slice(2, 4), 16) / 255, b = parseInt(n.slice(4, 6), 16) / 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
    let h = 0;
    if (d) {
      if (mx === r) h = ((g - b) / d) % 6;
      else if (mx === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h *= 60; if (h < 0) h += 360;
    }
    return [h, mx ? d / mx * 100 : 0, mx * 100];
  }
  function hsvToHex(h, s, v) {
    s /= 100; v /= 100;
    const f = n => {
      const k = (n + h / 60) % 6;
      return Math.round(255 * (v - v * s * Math.max(0, Math.min(k, 4 - k, 1))));
    };
    const to = x => x.toString(16).padStart(2, "0");
    return "#" + to(f(0)) + to(f(2)) + to(f(4));
  }
  function openColorPicker(page) {
    $$(".cp-pop").forEach(x => x.remove());
    const initial = page.bg || T.pageBg(design.theme);
    let [h, s, v] = hexToHsv(initial);
    const pop = document.createElement("div");
    pop.className = "cp-pop";
    pop.innerHTML = `
      <div class="cp-t">背景颜色（在色域中拖动选取，选完即生效）</div>
      <div class="cp-sv"><i class="hue"></i><i class="w"></i><i class="b"></i><i class="cur"></i></div>
      <div class="cp-hue"><i class="cur"></i></div>
      <div class="cp-row"><span class="cp-prev"></span><input class="cp-hex" value="${initial}"/></div>`;
    document.body.appendChild(pop);
    const ir = $("#insp").getBoundingClientRect();
    pop.style.left = Math.max(10, Math.min(innerWidth - 260, ir.left + 40)) + "px";
    pop.style.top = Math.min(innerHeight - 330, ir.top + 60) + "px";

    const sv = pop.querySelector(".cp-sv"), hue = pop.querySelector(".cp-hue");
    const svCur = pop.querySelector(".cp-sv .cur"), hueCur = pop.querySelector(".cp-hue .cur");
    const prev = pop.querySelector(".cp-prev"), hexI = pop.querySelector(".cp-hex");
    let pushed = false, lastHex = initial;
    function apply() {
      const hex = hsvToHex(h, s, v);
      sv.querySelector(".hue").style.background = `hsl(${h},100%,50%)`;
      svCur.style.left = s + "%";
      svCur.style.top = (100 - v) + "%";
      hueCur.style.left = (h / 360 * 100) + "%";
      prev.style.background = hex;
      hexI.value = hex;
      if (hex === lastHex) return hex; /* 打开取色器本身不算一次编辑 */
      if (!pushed) { pushHistory(); pushed = true; }
      page.bg = hex;
      lastHex = hex;
      renderCanvas();
      return hex;
    }
    apply();
    function svPoint(e) {
      const r = sv.getBoundingClientRect();
      s = Math.max(0, Math.min(100, (e.clientX - r.left) / r.width * 100));
      v = Math.max(0, Math.min(100, (1 - (e.clientY - r.top) / r.height) * 100));
      apply();
    }
    sv.addEventListener("pointerdown", e => {
      try { sv.setPointerCapture(e.pointerId); } catch (err) { /* 合成事件无真实指针 */ }
      svPoint(e);
      const mv = ev => svPoint(ev);
      const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
      window.addEventListener("pointermove", mv);
      window.addEventListener("pointerup", up);
    });
    function huePoint(e) {
      const r = hue.getBoundingClientRect();
      h = Math.max(0, Math.min(359, (e.clientX - r.left) / r.width * 360));
      apply();
    }
    hue.addEventListener("pointerdown", e => {
      try { hue.setPointerCapture(e.pointerId); } catch (err) { /* 忽略 */ }
      huePoint(e);
      const mv = ev => huePoint(ev);
      const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
      window.addEventListener("pointermove", mv);
      window.addEventListener("pointerup", up);
    });
    hexI.addEventListener("change", () => {
      const val = hexI.value.trim();
      if (/^#[0-9a-fA-F]{6}$/.test(val)) { [h, s, v] = hexToHsv(val); apply(); }
      else hexI.value = hsvToHex(h, s, v);
    });
    /* 选完即生效：点击取色器以外的区域自动收起 */
    setTimeout(() => {
      const outside = ev => {
        if (pop.contains(ev.target)) return;
        document.removeEventListener("pointerdown", outside, true);
        pop.remove(); renderInspector(); autosave();
      };
      document.addEventListener("pointerdown", outside, true);
    }, 0);
  }

  function iconBtn(icon, title, onclick, cls) {
    const b = document.createElement("button");
    b.className = "ibtn " + (cls || "");
    b.title = title;
    b.innerHTML = `<span class="m3e-ic">${svg(icon, 20)}</span>`;
    b.addEventListener("click", onclick);
    return b;
  }
  function svg(name, size, fill) {
    const set = window.M3E_ICONS || {};
    const e = set[name] || set.check_box_outline_blank || { b: '<circle cx="480" cy="-480" r="280"/>' };
    const body = fill && e.f ? e.f : e.b;
    return `<svg viewBox="0 -960 960 960" width="${size}" height="${size}">${body}</svg>`;
  }

  /* ================= 画布渲染 ================= */
  const world = () => $("#world");

  function renderCanvas() {
    const w = world();
    w.innerHTML = "";
    /* 单页画布：只渲染当前页面（点击右侧页面树切换） */
    w.appendChild(frameEl(curPage()));
    applyTransform();
    renderSelection();
    $("#statPages").textContent = design.pages.length + " 页";
  }

  function frameEl(page) {
    const size = T.pageSize(page);
    const f = document.createElement("div");
    f.className = "frame" + (page.id === curPageId ? " active" : "");
    f.style.left = "0px";
    f.style.top = "0px";
    f.style.width = size.w + "px";
    f.dataset.page = page.id;

    const label = document.createElement("div");
    label.className = "frame-label";
    label.innerHTML = `<span class="fname">${REG.esc(page.name)}</span><span class="fsize">${size.w}×${size.h}</span>`;
    label.addEventListener("pointerdown", e => { e.stopPropagation(); setPage(page.id); });
    label.addEventListener("dblclick", e => { e.stopPropagation(); renamePage(page.id); });
    f.appendChild(label);

    const scheme = T.schemeVars(T.activeScheme(design.theme));
    let vs = "";
    for (const k in scheme) vs += k + ":" + scheme[k] + ";";

    const body = document.createElement("div");
    body.className = "frame-body";
    body.style.cssText = `width:${size.w}px;height:${size.h}px;border-radius:${page.kind === "desktop" ? T.DESKTOP_R : T.PHONE_R}px;background:${page.bg || T.pageBg(design.theme)};${vs}`;
    body.dataset.page = page.id;

    const groups = page.groups || [];
    const popupDone = new Set();
    if (!page.items.length) {
      const hint = document.createElement("div");
      hint.className = "frame-empty-hint";
      hint.textContent = "从左侧拖入组件，或双击组件图块放到画布中央";
      body.appendChild(hint);
    }
    for (const it of page.items) {
      /* 弹窗图层：在其首个成员之前画遮罩 */
      if (it.gid && !popupDone.has(it.gid)) {
        const g = groups.find(x => x.id === it.gid);
        if (g && g.popup) {
          popupDone.add(it.gid);
          const scrim = document.createElement("div");
          scrim.className = "m3e-scrim";
          scrim.innerHTML = `<span class="tag">${REG.esc(g.name)}（弹窗）</span>`;
          body.appendChild(scrim);
        }
      }
      const el = document.createElement("div");
      el.className = "citem" + (sel.has(it.id) ? " csel" : "");
      el.dataset.item = it.id;
      el.style.cssText = REG.shellStyle(it);
      el.innerHTML = GEN.itemInner(it, { theme: design.theme });
      body.appendChild(el);
    }
    /* 编组边界：让图层分层在画布上可见（弹窗组已有遮罩标识，不再画） */
    for (const g of groups) {
      if (g.popup) continue;
      const members = page.items.filter(i => i.gid === g.id);
      if (!members.length) continue;
      const x1 = Math.min(...members.map(m => m.x)), y1 = Math.min(...members.map(m => m.y));
      const x2 = Math.max(...members.map(m => m.x + m.w)), y2 = Math.max(...members.map(m => m.y + m.h));
      const b = document.createElement("div");
      b.className = "group-bounds";
      b.style.cssText = `left:${x1 - 4}px;top:${y1 - 4}px;width:${x2 - x1 + 8}px;height:${y2 - y1 + 8}px;`;
      b.innerHTML = `<span class="gt">${REG.esc(g.name)}${g.popup ? "（弹窗）" : ""}</span>`;
      body.appendChild(b);
    }
    f.appendChild(body);
    return f;
  }

  /** 直接重绘单个条目（拖动/改属性时高效路径） */
  function redrawItem(it) {
    const el = world().querySelector(`.citem[data-item="${it.id}"]`);
    if (!el) return;
    el.style.cssText = REG.shellStyle(it);
    el.innerHTML = GEN.itemInner(it, { theme: design.theme });
  }

  function applyTransform() {
    world().style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;
    $("#zoomPct").textContent = Math.round(zoom * 100) + "%";
    if (sel.size) renderSelectionLight();
  }

  function worldFromEvent(e) {
    const r = $("#viewport").getBoundingClientRect();
    return { x: (e.clientX - r.left - panX) / zoom, y: (e.clientY - r.top - panY) / zoom };
  }

  /* ---------- 选中框 + 手柄（世界坐标 → 视口坐标，保持手柄恒定大小） ---------- */
  function w2s(x, y) { return { x: panX + x * zoom, y: panY + y * zoom }; }
  function renderSelection() {
    $$(".csel").forEach(el => el.classList.remove("csel"));
    const ov = $("#selbox");
    ov.innerHTML = "";
    for (const id of sel) {
      const el = world().querySelector(`.citem[data-item="${id}"]`);
      if (el) el.classList.add("csel");
    }
    if (sel.size === 1) {
      const it = curItems().find(i => i.id === [...sel][0]);
      const page = curPage();
      if (it) {
        const f = world().querySelector(`.frame[data-page="${page.id}"]`);
        if (f) {
          const o = w2s(it.x, it.y);
          const box = document.createElement("div");
          box.className = "selbox";
          box.style.left = o.x + "px";
          box.style.top = o.y + "px";
          box.style.width = it.w * zoom + "px";
          box.style.height = it.h * zoom + "px";
          for (const h of ["nw", "n", "ne", "e", "se", "s", "sw", "w"]) {
            const d = document.createElement("div");
            d.className = "hnd hnd-" + h;
            d.dataset.h = h;
            box.appendChild(d);
          }
          ov.appendChild(box);
        }
      }
    }
    renderLayers();
    renderInspector();
    $("#statSel").textContent = sel.size ? "已选 " + sel.size + " 个组件" : "未选中";
  }

  /* ================= 画布交互 ================= */
  function initCanvas() {
    const vp = $("#viewport");

    /* 平移 / 缩放（Shift+滚轮 = 横向平移，Ctrl+滚轮 = 缩放） */
    vp.addEventListener("wheel", e => {
      e.preventDefault();
      if (e.ctrlKey) {
        const r = vp.getBoundingClientRect();
        const mx = e.clientX - r.left, my = e.clientY - r.top;
        const wx = (mx - panX) / zoom, wy = (my - panY) / zoom;
        zoom = Math.min(3, Math.max(0.1, zoom * (e.deltaY < 0 ? 1.1 : 0.9)));
        panX = mx - wx * zoom; panY = my - wy * zoom;
      } else if (e.shiftKey) {
        panX -= (e.deltaX || e.deltaY);
      } else {
        panX -= e.deltaX; panY -= e.deltaY;
      }
      applyTransform();
    }, { passive: false });

    vp.addEventListener("pointerdown", e => {
      if (e.button === 1 || spaceDown || $("#toolHand").classList.contains("on")) {
        startPan(e); return;
      }
      const citem = e.target.closest(".citem");
      const hnd = e.target.closest(".hnd");
      if (hnd) { startResize(e, hnd.dataset.h); return; }
      if (citem) { startMove(e, citem.dataset.item); return; }
      startMarquee(e);
    });

    /* 双击编组成员 → 只选中该组件（深选），便于单独编辑 */
    vp.addEventListener("dblclick", e => {
      const citem = e.target.closest(".citem");
      if (!citem) return;
      const it = curItems().find(i => i.id === citem.dataset.item);
      if (it && it.gid) { sel.clear(); sel.add(it.id); renderSelection(); toast("已单独选中组件（编组内）"); }
    });

    /* 右键菜单 */
    vp.addEventListener("contextmenu", e => {
      e.preventDefault();
      const citem = e.target.closest(".citem");
      if (citem) {
        if (!sel.has(citem.dataset.item)) { sel.clear(); sel.add(citem.dataset.item); renderSelection(); }
        showCtxMenu(e.clientX, e.clientY);
      } else {
        sel.clear(); renderSelection();
        hideCtxMenu();
      }
    });

    /* 组件面板拖入 */
    initPaletteDrag();
  }

  function capture(e) {
    const move = ev => document.dispatchEvent(new CustomEvent("gd-move", { detail: ev }));
    const up = ev => { document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); document.dispatchEvent(new CustomEvent("gd-up", { detail: ev })); };
    document.addEventListener("pointermove", move);
    document.addEventListener("pointerup", up);
    return e;
  }

  let panState = null, panHandler = null;
  function startPan(e) {
    e.preventDefault();
    panState = { x: e.clientX, y: e.clientY, px: panX, py: panY };
    capture(e);
    panHandler = ev => {
      if (!panState) return;
      panX = panState.px + (ev.detail.clientX - panState.x);
      panY = panState.py + (ev.detail.clientY - panState.y);
      applyTransform();
    };
    document.addEventListener("gd-move", panHandler);
    document.addEventListener("gd-up", () => {
      if (panHandler) document.removeEventListener("gd-move", panHandler);
      panState = null; panHandler = null;
    }, { once: true });
  }

  /* ---------- 拖动 / 多选移动 ---------- */
  let moveState = null;
  function startMove(e, itemId) {
    e.stopPropagation();
    let page = curPage();
    if (!page.items.some(i => i.id === itemId)) {
      /* 点击了非当前页面的组件 → 自动切换到其所在页面 */
      page = design.pages.find(p => p.items.some(i => i.id === itemId)) || page;
      curPageId = page.id;
      renderPages();
    }
    if (e.shiftKey) { sel.has(itemId) ? sel.delete(itemId) : sel.add(itemId); expandGroupsSel(); renderSelection(); return; }
    if (!sel.has(itemId)) { sel.clear(); sel.add(itemId); expandGroupsSel(); renderSelection(); }
    setPage(page.id);
    const w0 = worldFromEvent(e);
    moveState = {
      start: w0,
      items: [...sel].map(id => curItems().find(i => i.id === id)).filter(Boolean)
        .map(i => ({ it: i, x: i.x, y: i.y })),
      moved: false,
    };
    pushHistory();
    capture(e);
    document.addEventListener("gd-move", onMoveMove);
    document.addEventListener("gd-up", onMoveUp, { once: true });
  }
  function onMoveMove(ev) {
    if (!moveState) return;
    const page = curPage();
    const w = worldFromEvent(ev.detail);
    let dx = w.x - moveState.start.x, dy = w.y - moveState.start.y;
    if (Math.abs(dx) + Math.abs(dy) > 1) moveState.moved = true;
    const snap = !ev.detail.ctrlKey;
    let sx = 0, sy = 0, guides = [];
    if (snap && moveState.items.length === 1) {
      const r = snapTarget(moveState.items[0], dx, dy, page);
      dx = r.dx; dy = r.dy; guides = r.guides;
    } else {
      dx = Math.round(dx / 4) * 4; dy = Math.round(dy / 4) * 4;
    }
    /* 组件不允许拖出页面边界（防止拖到画布空白处后不可见） */
    const pw = T.pageSize(page).w, ph = T.pageSize(page).h;
    for (const m of moveState.items) {
      m.it.x = Math.max(0, Math.min(Math.max(0, pw - m.it.w), m.x + dx));
      m.it.y = Math.max(0, Math.min(Math.max(0, ph - m.it.h), m.y + dy));
      redrawItem(m.it);
    }
    /* 拖动时在状态栏实时回显位置尺寸 */
    const m0 = moveState.items[0];
    $("#statSel").textContent = moveState.items.length === 1
      ? `X ${Math.round(m0.it.x)} · Y ${Math.round(m0.it.y)} · ${m0.it.w}×${m0.it.h}`
      : `已选 ${moveState.items.length} 个组件`;
    drawGuides(guides, page);
    renderSelectionLight();
  }
  function onMoveUp() {
    if (moveState && !moveState.moved) undoStack.pop(); // 未移动则不记历史
    moveState = null;
    drawGuides([], null);
    renderSelection();
    autosave();
  }

  /** 吸附：网格 4 + 其他条目/页面参考线 */
  function snapTarget(m, dx, dy, page) {
    const size = T.pageSize(page);
    const it = m.it;
    const nx = m.x + dx, ny = m.y + dy;
    const THR = 6 / zoom;
    const xs = [], ys = [];
    xs.push([0, 0], [T.MARGIN, T.MARGIN], [(size.w - it.w) / 2, size.w / 2], [size.w - it.w - T.MARGIN, size.w - T.MARGIN], [size.w - it.w, size.w]);
    ys.push([0, 0], [T.MARGIN, T.MARGIN], [size.h - it.h - T.MARGIN, size.h - T.MARGIN], [size.h - it.h, size.h]);
    for (const o of page.items) {
      if (o.id === it.id) continue;
      xs.push([o.x, o.x], [o.x + o.w, o.x + o.w], [o.x + o.w / 2 - it.w / 2, o.x + o.w / 2]);
      ys.push([o.y, o.y], [o.y + o.h, o.y + o.h], [o.y + o.h / 2 - it.h / 2, o.y + o.h / 2]);
    }
    let rx = nx, ry = ny, gx = null, gy = null, bestX = THR, bestY = THR;
    for (const [c, axis] of xs) { const d = Math.abs(nx - c); if (d < bestX) { bestX = d; rx = c; gx = axis; } }
    for (const [c, axis] of ys) { const d = Math.abs(ny - c); if (d < bestY) { bestY = d; ry = c; gy = axis; } }
    const guides = [];
    if (gx != null) guides.push({ v: gx });
    if (gy != null) guides.push({ h: gy });
    return { dx: rx - m.x, dy: ry - m.y, guides };
  }

  function drawGuides(guides, page) {
    const g = $("#guides");
    g.innerHTML = "";
    if (!page) return;
    const size = T.pageSize(page);
    for (const gd of guides) {
      const l = document.createElement("div");
      l.className = "guide";
      if (gd.v != null) {
        const o = w2s(gd.v, 0);
        l.style.left = o.x + "px"; l.style.top = o.y + "px";
        l.style.width = "1px"; l.style.height = size.h * zoom + "px";
      } else {
        const o = w2s(0, gd.h);
        l.style.left = o.x + "px"; l.style.top = o.y + "px";
        l.style.width = size.w * zoom + "px"; l.style.height = "1px";
      }
      g.appendChild(l);
    }
  }

  function renderSelectionLight() {
    const box = $("#selbox .selbox");
    if (!box || sel.size !== 1) { renderSelection(); return; }
    const it = curItems().find(i => i.id === [...sel][0]);
    if (!it) { renderSelection(); return; } /* 选中项可能已被切换页面等操作清掉 */
    const o = w2s(it.x, it.y);
    box.style.left = o.x + "px";
    box.style.top = o.y + "px";
    box.style.width = it.w * zoom + "px";
    box.style.height = it.h * zoom + "px";
  }

  /* ---------- 缩放手柄 ---------- */
  let rsState = null;
  function startResize(e, h) {
    e.stopPropagation(); e.preventDefault();
    const it = curItems().find(i => i.id === [...sel][0]);
    if (!it) return;
    const w0 = worldFromEvent(e);
    rsState = { it, h, x0: w0.x, y0: w0.y, ox: it.x, oy: it.y, ow: it.w, oh: it.h };
    pushHistory();
    capture(e);
    document.addEventListener("gd-move", onRsMove);
    document.addEventListener("gd-up", onRsUp, { once: true });
  }
  function onRsMove(ev) {
    if (!rsState) return;
    const w = worldFromEvent(ev.detail);
    const dx = w.x - rsState.x0, dy = w.y - rsState.y0;
    const it = rsState.it;
    let { ox: x, oy: y, ow: wd, oh: ht } = rsState;
    if (rsState.h.includes("e")) wd = rsState.ow + dx;
    if (rsState.h.includes("s")) ht = rsState.oh + dy;
    if (rsState.h.includes("w")) { wd = rsState.ow - dx; x = rsState.ox + dx; }
    if (rsState.h.includes("n")) { ht = rsState.oh - dy; y = rsState.oy + dy; }
    if (!ev.detail.ctrlKey) { wd = Math.round(wd / 4) * 4; ht = Math.round(ht / 4) * 4; x = Math.round(x / 4) * 4; y = Math.round(y / 4) * 4; }
    it.w = Math.max(12, wd); it.h = Math.max(12, ht); it.x = x; it.y = y;
    redrawItem(it);
    $("#statSel").textContent = `X ${Math.round(it.x)} · Y ${Math.round(it.y)} · ${Math.round(it.w)}×${Math.round(it.h)}`;
    renderSelectionLight();
  }
  function onRsUp() { rsState = null; renderSelection(); autosave(); }

  /* ---------- 框选 ---------- */
  let mqState = null;
  function startMarquee(e) {
    if (e.button !== 0) return;
      const w0 = worldFromEvent(e);
      /* Shift 从当前选区追加框选；普通框选为替换 */
      mqState = { x0: w0.x, y0: w0.y, prior: e.shiftKey ? [...sel] : null };
    const mq = $("#marquee");
    mq.style.display = "block";
    capture(e);
    const onMv = ev => {
      const w = worldFromEvent(ev.detail);
      const wx = Math.min(w0.x, w.x), wy = Math.min(w0.y, w.y);
      const wd = Math.abs(w.x - w0.x), ht = Math.abs(w.y - w0.y);
      const o = w2s(wx, wy);
      Object.assign(mq.style, { left: o.x + "px", top: o.y + "px", width: wd * zoom + "px", height: ht * zoom + "px" });
      mqState.box = { x: wx, y: wy, w: wd, h: ht };
    };
    document.addEventListener("gd-move", onMv);
    document.addEventListener("gd-up", () => {
      document.removeEventListener("gd-move", onMv);
      mq.style.display = "none";
      if (mqState && mqState.box && (mqState.box.w > 4 || mqState.box.h > 4)) {
        const page = curPage();
        const b = mqState.box;
        const matched = page.items
          .filter(it => it.x < b.x + b.w && it.x + it.w > b.x && it.y < b.y + b.h && it.y + it.h > b.y)
          .map(it => it.id);
        sel.clear();
        if (mqState.prior) mqState.prior.forEach(id => sel.add(id));
        matched.forEach(id => sel.add(id));
        expandGroupsSel();
      } else if (!mqState.prior) { sel.clear(); }
      mqState = null;
      renderSelection();
      autosave();
    }, { once: true });
  }

  /* ---------- 组件面板 → 画布拖放 ---------- */
  let ghost = null, ghostKind = null, ghostWidget = null, ghostSpec = null, ghostGx = null;
  /** 代码组件的拖拽跟随件（临时元素，样式直接内联，删除后不留全局影响） */
  function ghostCodeContent(code) {
    const cls = code.cls || "gx" + T.uid();
    return `<style>${code.css || ""}</style><div class="${cls}" style="display:block">${code.html || ""}</div>`;
  }
  function initPaletteDrag() {
    document.addEventListener("pointerdown", e => {
      const tile = e.target.closest(".tile");
      if (!tile || e.button !== 0) return;
      /* 删除自定义组件角标 */
      const wx = e.target.closest(".wx");
      if (wx) { e.stopPropagation(); deleteWidget(wx.dataset.wx); return; }
      ghostKind = tile.dataset.kind;
      ghostGx = null; ghostWidget = null;
      if (ghostKind.startsWith("gx:")) {
        /* 社区组件：预览已测量自然尺寸（.gxv 的 data-w/h），缺失时兜底 */
        ghostGx = GX().get(ghostKind.slice(3));
        if (!ghostGx) return;
        const pv = tile.querySelector(".gxv");
        ghostSpec = { w: +pv?.dataset.w || 200, h: +pv?.dataset.h || 80 };
        ghost = document.createElement("div");
        ghost.className = "ghost";
        ghost.style.width = ghostSpec.w * zoom + "px";
        ghost.style.height = ghostSpec.h * zoom + "px";
        const holder = document.createElement("div");
        holder.style.cssText = `width:${ghostSpec.w}px;height:${ghostSpec.h}px;transform:scale(${zoom});transform-origin:0 0;opacity:.92;background:#fff;`;
        holder.innerHTML = `<style>${ghostGx.c}</style><div class="${ghostGx.id}" style="display:block">${ghostGx.h}</div>`;
        ghost.appendChild(holder);
      } else {
        ghostWidget = ghostKind.startsWith("widget:") ? customWidgets.find(x => x.id === ghostKind.slice(7)) : null;
        if (ghostKind.startsWith("widget:") && !ghostWidget) return;
        if (ghostWidget && ghostWidget.type === "code") {
          const c = ghostWidget.code || {};
          const pv = tile.querySelector(".gxv");
          ghostSpec = { w: +pv?.dataset.w || c.w || 200, h: +pv?.dataset.h || c.h || 80 };
          ghost = document.createElement("div");
          ghost.className = "ghost";
          ghost.style.width = ghostSpec.w * zoom + "px";
          ghost.style.height = ghostSpec.h * zoom + "px";
          const holder = document.createElement("div");
          holder.style.cssText = `width:${ghostSpec.w}px;height:${ghostSpec.h}px;transform:scale(${zoom});transform-origin:0 0;opacity:.92;background:#fff;`;
          holder.innerHTML = ghostCodeContent(c);
          ghost.appendChild(holder);
        } else {
          ghostSpec = ghostWidget ? widgetBBox(ghostWidget) : REG.def(ghostKind).spec;
          /* 幽灵跟随件 = 真实组件预览，按当前缩放显示，大小与落点完全一致 */
          ghost = document.createElement("div");
          ghost.className = "ghost";
          ghost.style.width = ghostSpec.w * zoom + "px";
          ghost.style.height = ghostSpec.h * zoom + "px";
          if (!ghostWidget) {
            const holder = document.createElement("div");
            holder.style.cssText = `width:${ghostSpec.w}px;height:${ghostSpec.h}px;transform:scale(${zoom});transform-origin:0 0;opacity:.9;`;
            holder.innerHTML = GEN.itemInner(REG.create(ghostKind, 0, 0, design.theme), { theme: design.theme });
            ghost.appendChild(holder);
          }
        }
      }
      document.body.appendChild(ghost);
      moveGhost(e);
      let movedPx = 0, cancelled = false;
      capture(e);
      const onMv = ev => { movedPx += Math.abs(ev.detail.movementX || 1) + Math.abs(ev.detail.movementY || 0); moveGhost(ev.detail); };
      /* 拖拽途中按 Esc 取消放置 */
      const onKey = ev => {
        if (ev.key !== "Escape") return;
        cancelled = true;
        if (ghost) { ghost.remove(); ghost = null; }
      };
      document.addEventListener("keydown", onKey);
      document.addEventListener("gd-move", onMv);
      document.addEventListener("gd-up", ev => {
        document.removeEventListener("gd-move", onMv);
        document.removeEventListener("keydown", onKey);
        if (ghost) { ghost.remove(); ghost = null; }
        if (cancelled) { ghostWidget = null; ghostGx = null; return; }
        const d = ev.detail;
        const bodyEl = document.elementFromPoint(d.clientX, d.clientY);
        const fb = bodyEl && bodyEl.closest(".frame-body");
        if (fb) {
          const pageId = fb.dataset.page;
          const page = design.pages.find(p => p.id === pageId);
          const r = fb.getBoundingClientRect();
          /* 左上角对齐光标落点：组件出现在鼠标右下方 */
          let x = (d.clientX - r.left) / zoom;
          let y = (d.clientY - r.top) / zoom;
          x = Math.round(Math.max(0, Math.min(T.pageSize(page).w - ghostSpec.w, x)) / 4) * 4;
          y = Math.round(Math.max(0, Math.min(T.pageSize(page).h - ghostSpec.h, y)) / 4) * 4;
          if (ghostGx) placeGx(ghostGx, page, x, y, ghostSpec.w, ghostSpec.h);
          else if (ghostWidget) placeWidget(ghostWidget, page, x, y, ghostSpec);
          else addComponent(ghostKind, page, x, y);
        }
        ghostWidget = null; ghostGx = null;
      }, { once: true });
    });
  }
  function moveGhost(e) {
    /* 幽灵左上角始终对齐光标（组件出现在鼠标右下方）；页面上按 4dp 网格吸附 */
    const bodyEl = document.elementFromPoint(e.clientX, e.clientY);
    const fb = bodyEl && bodyEl.closest(".frame-body");
    if (fb && !ghostWidget) {
      const page = design.pages.find(p => p.id === fb.dataset.page);
      if (page) {
        const w = worldFromEvent(e);
        const x = Math.round(Math.max(0, Math.min(T.pageSize(page).w - ghostSpec.w, w.x)) / 4) * 4;
        const y = Math.round(Math.max(0, Math.min(T.pageSize(page).h - ghostSpec.h, w.y)) / 4) * 4;
        const r = fb.getBoundingClientRect();
        ghost.style.left = r.left + x * zoom + "px";
        ghost.style.top = r.top + y * zoom + "px";
        ghost.style.opacity = ".9";
        return;
      }
    }
    ghost.style.left = e.clientX + "px";
    ghost.style.top = e.clientY + "px";
    ghost.style.opacity = "1";
  }

  function addComponent(kind, page, x, y, extra) {
    pushHistory();
    const it = REG.create(kind, x, y, design.theme);
    if (extra) Object.assign(it, extra);
    const ag = activeGidFor(page);
    if (ag) it.gid = ag;
    page.items.push(it);
    curPageId = page.id;
    sel.clear(); sel.add(it.id);
    renderAll();
    autosave();
    toast("已添加「" + REG.def(kind).name + "」" + (ag ? "（" + (groupOf(ag) || {}).name + "）" : ""));
  }

  /* ================= uiverse.io/galaxy 社区组件（数据见 js/gx/，运行时见 gx.js） ================= */
  const GX = () => window.M3E_GX;
  let gxSub = "all";          // 社区分类内的子分类
  let gxIO = null;            // 面板实时预览观察器

  function gxPreviewObserver() {
    if (gxIO) return gxIO;
    gxIO = new IntersectionObserver(entries => {
      for (const en of entries) {
        if (!en.isIntersecting) continue;
        gxIO.unobserve(en.target);
        const box = en.target;
        if (box.dataset.gx) {
          const comp = GX().get(box.dataset.gx);
          if (comp) GX().renderPreview(box, comp);
        } else if (box.dataset.gxw) {
          const w = customWidgets.find(x => x.id === box.dataset.gxw);
          if (w && w.type === "code" && w.code) {
            GX().renderPreview(box, { id: "w_" + w.id, cls: w.code.cls, h: w.code.html, c: w.code.css });
          }
        }
      }
    }, { rootMargin: "120px" });
    return gxIO;
  }
  /** 社区组件 → 画布（每次放置使用独立作用域类，互不干扰） */
  function placeGx(comp, page, x, y, w, h) {
    const cls = "g" + T.uid();
    const html = String(comp.h).split(comp.id + "-").join(cls + "-");
    const css = String(comp.c).split(comp.id).join(cls);
    addComponent("customHtml", page, x, y, {
      name: comp.n, w, h,
      html, css, sclass: cls,
      gx: { id: comp.id, a: comp.a || "" },
    });
    toast(`已添加社区组件「${comp.n}」`);
  }
  /** 社区组件图块：懒渲染实时预览 */
  function gxTileEl(comp) {
    const t = document.createElement("div");
    t.className = "tile gxt";
    t.dataset.kind = "gx:" + comp.id;
    t.title = `${comp.n} — ${comp.a || "community"}（拖入画布或双击放置）`;
    t.innerHTML = `<span class="gxv" data-gx="${comp.id}"></span>` +
      `<span class="tl">${REG.esc(comp.n)}</span><span class="ga">${REG.esc(comp.a || "")}</span>`;
    gxPreviewObserver().observe(t.querySelector(".gxv"));
    t.addEventListener("dblclick", () => {
      const c = GX().get(comp.id);
      if (!c) return;
      const pv = t.querySelector(".gxv");
      const w = +pv?.dataset.w || 200, h = +pv?.dataset.h || 80;
      const page = curPage();
      const size = T.pageSize(page);
      const x = Math.round(Math.max(0, (size.w - w) / 2) / 4) * 4;
      const y = Math.round(Math.max(0, (size.h - h) / 2) / 4) * 4;
      placeGx(c, page, x, y, w, h);
    });
    return t;
  }
  /** 分块渲染大列表（3800+ 组件不能一次性建 DOM） */
  function renderGxGrid(host, list, subtitle) {
    const sec = document.createElement("div");
    sec.className = "pal-sec";
    sec.innerHTML = `<div class="pal-title"><span class="m3e-ic">${svg("bolt", 16)}</span>${REG.esc(subtitle)}<i class="cnt">${list.length}</i></div>`;
    const grid = document.createElement("div");
    grid.className = "pal-grid gxgrid";
    sec.appendChild(grid);
    host.appendChild(sec);
    let i = 0;
    const CH = 96;
    (function chunk() {
      if (!grid.isConnected) return; // 分类已切换，放弃续建
      const frag = document.createDocumentFragment();
      const end = Math.min(i + CH, list.length);
      for (; i < end; i++) frag.appendChild(gxTileEl(list[i]));
      grid.appendChild(frag);
      if (i < list.length) requestAnimationFrame(chunk);
    })();
  }
  /** 「社区」分类：子分类筛选 + 精选 + 全量组件 */
  function renderUiversePalette(host, q) {
    const GXr = GX();
    const man = GXr.manifest;
    /* 子分类条 */
    const chips = document.createElement("div");
    chips.className = "subchips";
    const mkChip = (key, label, n) => {
      const b = document.createElement("button");
      b.className = "subchip" + (gxSub === key ? " on" : "");
      b.innerHTML = `${REG.esc(label)}<i>${n}</i>`;
      b.addEventListener("click", () => { gxSub = key; renderPalette(); });
      chips.appendChild(b);
    };
    mkChip("curated", "精选", REG.order.filter(k => REG.defs[k] && REG.defs[k].cat === "uiverse").length);
    mkChip("all", "全部", man.total || 0);
    for (const c of man.cats || []) mkChip(c.key, c.name, c.n);
    host.appendChild(chips);

    if (!GXr.loaded) {
      host.appendChild(Object.assign(document.createElement("div"), {
        className: "empty", textContent: "社区组件库加载中…（首次约 8MB，本地读取很快）",
      }));
      GXr.ensure(() => { if (curCat === "uiverse") renderPalette(); });
      return;
    }
    if (gxSub === "curated") {
      const grid = document.createElement("div");
      grid.className = "pal-grid";
      const note = document.createElement("div");
      note.className = "empty";
      note.style.padding = "4px 8px";
      note.textContent = "精选组件已接入主题与属性编辑（如开关选中态）；下方「全部」为社区原始组件。";
      for (const k of REG.order) {
        const d = REG.defs[k];
        if (d && d.cat === "uiverse") grid.appendChild(tileEl(k, d.icon, d.name));
      }
      host.appendChild(note);
      host.appendChild(grid);
      return;
    }
    let list;
    if (q) list = GXr.search(q, 400);
    else if (gxSub === "all") list = GXr.all();
    else list = GXr.catList(gxSub);
    if (!list.length) { host.appendChild(Object.assign(document.createElement("div"), { className: "empty", textContent: "没有匹配的社区组件" })); return; }
    renderGxGrid(host, list, (q ? `搜索「${q}」` : (man.cats.find(c => c.key === gxSub) || { name: "全部组件" }).name) + " — Uiverse.io 社区（MIT）");
  }

  /* ================= 组件面板（左侧分类图标栏 + 横向图块网格，m3e-canvas 原生排布） ================= */
  let curCat = "actions";
  function renderCatRail() {
    const rail = $("#catRail");
    if (!rail) return;
    rail.innerHTML = "";
    const mk = (key, icon, name) => {
      const b = document.createElement("button");
      b.className = "cat-btn" + (curCat === key ? " on" : "");
      b.title = name;
      b.innerHTML = `<span class="ic">${svg(icon, 20)}</span><span class="ct">${name.length > 4 ? name.slice(0, 4) : name}</span>`;
      b.addEventListener("click", () => { curCat = key; $("#palSearch").value = ""; renderPalette(); renderCatRail(); });
      rail.appendChild(b);
    };
    for (const cat of T.CATEGORIES) mk(cat.key, cat.icon, cat.name);
    mk("__custom", "group", "自定义");
  }
  function tileEl(kind, icon, name, extraCls, title) {
    const tile = document.createElement("div");
    tile.className = "tile" + (extraCls ? " " + extraCls : "");
    tile.dataset.kind = kind;
    tile.title = title || name;
    tile.innerHTML = `<span class="ic">${svg(icon, 22)}</span><span class="tl">${REG.esc(name)}</span>`;
    /* 双击 = 放到画布中央（自定义组件图块的双击留给孩子节点做重命名，不在此绑定） */
    if (!kind.startsWith("widget:")) tile.addEventListener("dblclick", () => placeAtCenter(kind));
    return tile;
  }
  /** 把组件（或组件默认尺寸）放到当前页面中央，4dp 对齐 */
  function placeAtCenter(kind, spec) {
    const page = curPage();
    const size = T.pageSize(page);
    const sp = spec || (REG.def(kind) && REG.def(kind).spec) || { w: 160, h: 56 };
    const x = Math.round(Math.max(0, (size.w - sp.w) / 2) / 4) * 4;
    const y = Math.round(Math.max(0, (size.h - sp.h) / 2) / 4) * 4;
    addComponent(kind, page, x, y);
  }
  /** 自定义组件图块：items=图标块；code=实时预览块（双击重命名，悬停 × 删除） */
  function widgetTileEl(w) {
    if (w.type === "code") {
      const t = document.createElement("div");
      t.className = "tile gxt cw";
      t.dataset.kind = "widget:" + w.id;
      t.title = `${w.name}（拖入画布放置；双击重命名；悬停右上角 × 删除）`;
      t.innerHTML = `<button class="wx" data-wx="${w.id}" title="删除此自定义组件">×</button>` +
        `<span class="gxv" data-gxw="${w.id}"></span><span class="tl">${REG.esc(w.name)}</span>`;
      gxPreviewObserver().observe(t.querySelector(".gxv"));
      t.addEventListener("dblclick", ev => {
        if (ev.target.closest(".wx")) return;
        renameWidget(w.id);
      });
      return t;
    }
    const t = tileEl("widget:" + w.id, w.icon || "group", w.name, "cw", w.name + "（拖入画布展开；双击重命名；悬停右上角 × 可删除）");
    t.innerHTML = `<span class="ic">${svg(w.icon || "group", 22)}</span><span class="tl">${REG.esc(w.name)}</span><button class="wx" data-wx="${w.id}" title="删除此自定义组件">×</button>`;
    t.addEventListener("dblclick", ev => {
      if (ev.target.closest(".wx")) return;
      renameWidget(w.id);
    });
    return t;
  }
  function renderPalette() {
    const q = ($("#palSearch").value || "").trim().toLowerCase();
    const host = $("#palette");
    host.innerHTML = "";
    const match = k => {
      const d = REG.defs[k];
      return !q || d.name.toLowerCase().includes(q) || k.toLowerCase().includes(q);
    };
    const widgets = customWidgets.filter(w => !q || w.name.toLowerCase().includes(q));

    /* 搜索模式：内置 + 自定义 + 社区一起搜 */
    if (q) {
      const grid = document.createElement("div");
      grid.className = "pal-grid";
      for (const k of REG.order) {
        if (!REG.defs[k] || !match(k)) continue;
        grid.appendChild(tileEl(k, REG.defs[k].icon, REG.defs[k].name));
      }
      for (const w of widgets) grid.appendChild(widgetTileEl(w));
      if (!grid.children.length) host.innerHTML = `<div class="empty">没有匹配「${REG.esc(q)}」的组件</div>`;
      else {
        const sec = document.createElement("div");
        sec.className = "pal-sec";
        sec.innerHTML = `<div class="pal-title"><span class="m3e-ic">${svg("grid_view", 16)}</span>内置与自定义</div>`;
        sec.appendChild(grid);
        host.appendChild(sec);
      }
      /* 社区组件（懒加载完成后刷新） */
      const GXr = GX();
      if (!GXr.loaded && !GXr.loading) {
        GXr.ensure(() => { if (($("#palSearch").value || "").trim()) renderPalette(); });
      }
      if (GXr.loaded) renderGxGrid(host, GXr.search(q, 400), `社区搜索「${q}」— Uiverse.io（MIT）`);
      else host.appendChild(Object.assign(document.createElement("div"), { className: "empty", textContent: "社区组件库加载中…" }));
      appendImportButton(host);
      return;
    }

    /* 自定义分类：代码组件 + 编组组件 */
    if (curCat === "__custom") {
      const sec = document.createElement("div");
      sec.className = "pal-sec";
      sec.innerHTML = `<div class="pal-title"><span class="m3e-ic">${svg("group", 16)}</span>我的自定义组件</div>`;
      const grid = document.createElement("div");
      grid.className = "pal-grid";
      for (const w of widgets) grid.appendChild(widgetTileEl(w));
      if (!widgets.length) sec.innerHTML += `<div class="empty">暂无自定义组件<br/>选中画布组件后右键「保存为自定义组件」，或用下方按钮导入代码组件</div>`;
      sec.appendChild(grid);
      appendImportButton(sec);
      host.appendChild(sec);
      return;
    }

    /* 社区分类（uiverse.io/galaxy 全量 + 精选） */
    if (curCat === "uiverse") {
      renderUiversePalette(host, q);
      appendImportButton(host);
      return;
    }

    /* 普通分类：当前类别的图块横向平铺 */
    const cat = T.CATEGORIES.find(c => c.key === curCat) || T.CATEGORIES[0];
    const kinds = REG.order.filter(k => REG.defs[k] && REG.defs[k].cat === cat.key && match(k));
    const grid = document.createElement("div");
    grid.className = "pal-grid";
    for (const k of kinds) {
      const d = REG.defs[k];
      grid.appendChild(tileEl(k, d.icon, d.name));
    }
    if (!kinds.length) grid.innerHTML = `<div class="empty">该分类暂无组件</div>`;
    host.appendChild(grid);
  }
  function appendImportButton(host) {
    const imp = document.createElement("button");
    imp.className = "mini imp-code";
    imp.innerHTML = `<span class="ic">${svg("code", 14)}</span>导入代码组件`;
    imp.title = "粘贴 HTML / Vue 代码块，生成一个组件放到画布";
    imp.addEventListener("click", () => openImportCodeModal());
    host.appendChild(imp);
  }

  /** 解析粘贴的代码：HTML 提取 <style>；Vue SFC 提取 template/script/style；统一做作用域隔离 */
  function parseImportCode(code) {
    code = (code || "").trim();
    if (!code) return null;
    let html, css = "", vs = "", vst = "";
    const isVue = /<template[\s>]/i.test(code) || /<script[\s>]/i.test(code);
    if (isVue) {
      const tpl = (code.match(/<template[^>]*>([\s\S]*?)<\/template>/i) || [])[1];
      const scr = (code.match(/<script[^>]*>([\s\S]*?)<\/script>/i) || [])[1];
      const sty = code.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);
      html = (tpl ? tpl : code.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<\/?style[^>]*>/gi, "")).trim();
      if (scr) vs = scr.trim();
      if (sty) vst = sty.map(x => x.replace(/<\/?style[^>]*>/gi, "")).join("\n").trim();
    } else {
      html = code;
      const blocks = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
      if (blocks.length) {
        css = blocks.map(x => x.replace(/<\/?style[^>]*>/gi, "")).join("\n").trim();
        html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "").trim();
      }
    }
    /* 作用域隔离：选择器/动画/id 全部收进唯一命名空间，防止污染设计器与其它组件 */
    const cls = "u" + T.uid();
    const SC = window.M3E_SCOPE;
    const main = SC ? SC.scope({ html, css, cls }) : { html, css };
    let vstScoped = vst;
    if (SC && vst) vstScoped = SC.scope({ html, css: vst, cls }).css;
    return { html: main.html, css: main.css, cls, vueScript: vs, vueStyle: vstScoped, isVue };
  }

  /** 导入代码块 → 保存到自定义组件库（可反复拖入）+ 放一枚到画布中央 */
  function openImportCodeModal() {
    showModal({
      title: "导入代码组件",
      message: "粘贴 HTML/CSS 代码块，或直接粘贴 Vue SFC（自动识别 <template>/<script>/<style>）。uiverse.io 的任意组件代码都可以直接粘贴。样式会自动做作用域隔离，保存后长期留在左侧「自定义」组件库中。",
      body: `<div class="frow"><label>名称</label><input type="text" class="imp-name" value="导入组件"/></div>
        <textarea class="imp-html" rows="10" spellcheck="false" placeholder='HTML：&lt;div class="my-btn"&gt;按钮&lt;/div&gt;&lt;style&gt;...&lt;/style&gt;&#10;Vue SFC：&lt;template&gt;...&lt;/template&gt;&lt;script setup&gt;...&lt;/script&gt;&lt;style&gt;...&lt;/style&gt;'></textarea>
        <label class="ckb imp-save"><input type="checkbox" checked/><span></span><i style="font-style:normal;font-size:12px;color:#49454F;">保存到自定义组件库（可反复拖入画布）</i></label>`,
      okText: "导入",
      onOk: (v, card) => {
        const code = card.querySelector(".imp-html").value.trim();
        if (!code) return toast("请先粘贴组件代码");
        const name = card.querySelector(".imp-name").value.trim() || "导入组件";
        const toLib = card.querySelector(".imp-save input").checked;
        const p2 = parseImportCode(code);
        if (!p2) return toast("请先粘贴组件代码");
        const extra = {
          name, w: 320, h: 220,
          html: p2.html, css: p2.css, sclass: p2.cls,
          vueScript: p2.vueScript, vueStyle: p2.vueStyle,
        };
        if (toLib) {
          customWidgets.push({
            id: T.uid(), name, icon: "code", type: "code",
            code: { html: p2.html, css: p2.css, cls: p2.cls, vs: p2.vueScript, vst: p2.vueStyle, w: extra.w, h: extra.h },
          });
          saveWidgets();
          renderPalette();
        }
        const size = T.pageSize(curPage());
        addComponent("customHtml", curPage(),
          Math.round(Math.max(0, (size.w - extra.w) / 2) / 4) * 4,
          Math.round(Math.max(0, (size.h - extra.h) / 2) / 4) * 4,
          extra);
        toast((p2.isVue ? "已导入 Vue 组件（脚本将在 Vue 导出中生效）" : "已导入代码组件") +
          (toLib ? "，已保存到「自定义」组件库" : ""));
      },
    });
  }

  /* ================= 页面列表（树形：显式父子 + 跳转关系） ================= */
  function pageTargets(p) {
    const ids = [];
    for (const it of p.items) {
      const a = it.action;
      if (a && a.indexOf(":") < 0 && a !== "closepop" && design.pages.some(x => x.id === a) && !ids.includes(a)) ids.push(a);
    }
    return ids;
  }
  function pageDescendants(id) {
    const out = new Set(), stack = [id];
    while (stack.length) {
      const cur = stack.pop();
      for (const p of design.pages) if (p.parent === cur && !out.has(p.id)) { out.add(p.id); stack.push(p.id); }
    }
    return out;
  }
  function pageChildrenIds(p) {
    const out = [], seen = new Set();
    const push = id => { if (!seen.has(id) && design.pages.some(x => x.id === id)) { seen.add(id); out.push(id); } };
    for (const c of design.pages) if (c.parent === p.id) push(c.id);          // 显式子页面（拖拽设置）
    for (const t of pageTargets(p)) if (!design.pages.some(x => x.parent === t)) push(t); // 跳转指向的页面
    return out;
  }
  let dragPage = null;
  function renderPages() {
    const host = $("#pageList");
    host.innerHTML = "";
    const pages = design.pages;
    if (!pages.length) return;

    const incoming = new Set();
    pages.forEach(p => pageTargets(p).forEach(t => incoming.add(t)));
    /* 注意：显式父子不参与根页面排除——父页面必须显示在顶层，否则树会整棵塌掉 */
    let roots = pages.filter(p => !p.parent && !incoming.has(p.id));
    if (!roots.length) roots = [pages[0]];

    const rendered = new Set();
    const row = (p, depth, isRef) => {
      const el = document.createElement("div");
      el.className = "page-row" + (p.id === curPageId ? " on" : "") + (depth > 0 || isRef ? " child" : "");
      el.style.paddingLeft = 8 + depth * 16 + "px";
      el.draggable = true;
      const size = T.pageSize(p);
      const arrow = depth > 0 ? `<span class="m3e-ic parr">${svg("subdirectory_arrow_right", 14)}</span>` : (isRef ? `<span class="m3e-ic parr">${svg("swap_horiz", 14)}</span>` : "");
      el.innerHTML = `${arrow}<span class="m3e-ic">${svg(p.kind === "desktop" ? "desktop_windows" : "devices", 16)}</span>` +
        `<span class="pn" title="点击改名">${REG.esc(p.name)}</span><span class="ps">${size.w}×${size.h}</span>`;
      el.title = isRef ? "该页面有多个入口（已在上方列出）" : "点击切换 · 双击改名 · 拖到其他页面下移动层级";
      el.addEventListener("click", ev => {
        if (ev.target.closest(".page-ops")) return;
        setPage(p.id);
      });
      el.addEventListener("dblclick", ev => {
        if (ev.target.closest(".page-ops")) return;
        startPageRename(p, el.querySelector(".pn"));
      });
      const ops = document.createElement("div");
      ops.className = "page-ops";
      ops.appendChild(iconBtn("add", "在此页面下新建子页面", ev => { ev.stopPropagation(); addChildPage(p); }));
      ops.appendChild(iconBtn("add_box", "复制页面", ev => { ev.stopPropagation(); dupPage(p.id); }));
      ops.appendChild(iconBtn("delete", "删除页面", ev => { ev.stopPropagation(); delPage(p.id); }));
      el.appendChild(ops);

      /* 拖拽移动层级：放到某页下 = 成为它的子页面；拖到空白处 = 回到顶层 */
      el.addEventListener("dragstart", ev => {
        dragPage = p.id;
        el.classList.add("dragging");
        ev.dataTransfer.setData("text/plain", p.id);
        ev.dataTransfer.effectAllowed = "move";
      });
      el.addEventListener("dragend", () => {
        dragPage = null;
        el.classList.remove("dragging");
        $$("#pageList .droptarget").forEach(x => x.classList.remove("droptarget"));
        host.classList.remove("rootdrop");
      });
      el.addEventListener("dragover", ev => {
        if (!dragPage || dragPage === p.id) return;
        if (pageDescendants(dragPage).has(p.id)) return; // 不能拖到自己的子孙下
        ev.preventDefault(); ev.stopPropagation();
        ev.dataTransfer.dropEffect = "move";
        el.classList.add("droptarget");
      });
      el.addEventListener("dragleave", ev => { if (!el.contains(ev.relatedTarget)) el.classList.remove("droptarget"); });
      el.addEventListener("drop", ev => {
        ev.preventDefault(); ev.stopPropagation();
        el.classList.remove("droptarget");
        const id = dragPage || ev.dataTransfer.getData("text/plain");
        dragPage = null;
        const dragged = design.pages.find(x => x.id === id);
        if (!dragged || id === p.id) return;
        pushHistory();
        if (pageDescendants(id).has(p.id)) {
          /* 拖到自己的子页面行 = 两级互换：子页面上移为顶层，本页降为其子级 */
          delete p.parent;
          dragged.parent = p.id;
          renderPages(); autosave();
          toast(`已互换层级：「${p.name}」上移，「${dragged.name}」移到其下`);
          return;
        }
        if (dragged.parent === p.id) {
          /* 拖回当前父行 = 回到顶层 */
          delete dragged.parent;
          renderPages(); autosave();
          toast(`已把「${dragged.name}」移到顶层`);
        } else {
          dragged.parent = p.id;
          renderPages(); autosave();
          toast(`已把「${dragged.name}」移到「${p.name}」之下`);
        }
      });
      host.appendChild(el);
    };
    const emit = (p, depth, path) => {
      row(p, depth, false);
      rendered.add(p.id);
      if (path.has(p.id)) return;
      path.add(p.id);
      for (const t of pageChildrenIds(p)) {
        const tp = pages.find(x => x.id === t);
        if (!tp) continue;
        if (rendered.has(t)) row(tp, depth + 1, true);   // 多入口页面以引用形式再列一次
        else emit(tp, depth + 1, path);
      }
      path.delete(p.id);
    };
    roots.forEach(p => { if (!rendered.has(p.id)) emit(p, 0, new Set()); });

    /* 根区域放置：拖到列表空白处 = 回到顶层 */
    host.addEventListener("dragover", ev => {
      if (!dragPage) return;
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
      host.classList.add("rootdrop");
    });
    host.addEventListener("dragleave", ev => { if (ev.target === host) host.classList.remove("rootdrop"); });
    host.addEventListener("drop", ev => {
      if (!dragPage) return;
      ev.preventDefault();
      host.classList.remove("rootdrop");
      const id = dragPage || ev.dataTransfer.getData("text/plain");
      dragPage = null;
      const dragged = design.pages.find(x => x.id === id);
      if (dragged && dragged.parent) {
        pushHistory();
        delete dragged.parent;
        renderPages(); autosave();
        toast(`已把「${dragged.name}」移到顶层`);
      }
    });

    /* 「顶层」放置行：拖页面到这里 = 回到顶层 */
    const rootRowEl = document.createElement("div");
    rootRowEl.className = "page-rootrow";
    rootRowEl.innerHTML = `<span class="m3e-ic">${svg("home", 12)}</span>顶层（把页面拖到这里回到顶层）`;
    rootRowEl.addEventListener("dragover", ev => {
      if (!dragPage) return;
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
      rootRowEl.classList.add("droptarget");
    });
    rootRowEl.addEventListener("dragleave", () => rootRowEl.classList.remove("droptarget"));
    rootRowEl.addEventListener("drop", ev => {
      ev.preventDefault(); ev.stopPropagation();
      rootRowEl.classList.remove("droptarget");
      const id = dragPage || ev.dataTransfer.getData("text/plain");
      dragPage = null;
      const dragged = design.pages.find(x => x.id === id);
      if (dragged && dragged.parent) {
        pushHistory();
        delete dragged.parent;
        renderPages(); autosave();
        toast(`已把「${dragged.name}」移到顶层`);
      }
    });
    host.appendChild(rootRowEl);
  }
  function startPageRename(p, pnEl) {
    if (pnEl.querySelector("input")) return;
    pnEl.innerHTML = `<input type="text" value="${REG.esc(p.name)}"/>`;
    const input = pnEl.querySelector("input");
    input.focus(); input.select();
    let done = false;
    const commit = ok => {
      if (done) return;
      done = true;
      const v = input.value.trim();
      if (ok && v && v !== p.name) { pushHistory(); p.name = v; autosave(); }
      renderPages();
      if (p.id === curPageId) { const f = world().querySelector(".frame-label .fname"); if (f) f.textContent = p.name; }
    };
    input.addEventListener("click", ev => ev.stopPropagation());
    input.addEventListener("pointerdown", ev => ev.stopPropagation());
    input.addEventListener("keydown", ev => {
      ev.stopPropagation();
      if (ev.key === "Enter") commit(true);
      else if (ev.key === "Escape") commit(false);
    });
    input.addEventListener("blur", () => commit(true));
  }
  function setPage(id) {
    if (curPageId === id) return;
    curPageId = id;
    sel.clear();
    activeLayerGid = null; // 切换页面后图层上下文重置
    renderAll();
    fitView();
  }
  function addChildPage(p) {
    openNewPageModal("phone", p);
  }
  /** 新建页面（可选自定义尺寸、父页面） */
  function openNewPageModal(preset, parent) {
    showModal({
      title: parent ? `在「${parent.name}」下新建页面` : "新建页面",
      body: `
        <div class="frow"><label>名称</label><input type="text" class="np-name" value="页面 ${design.pages.length + 1}"/></div>
        <div class="frow"><label>尺寸</label><select class="np-preset">
          <option value="phone"${preset !== "desktop" ? " selected" : ""}>手机 412×892</option>
          <option value="desktop"${preset === "desktop" ? " selected" : ""}>桌面 1280×800</option>
          <option value="custom">自定义…</option>
        </select></div>
        <div class="grid2 np-dims" style="display:none;">${field("宽", `<input type="number" class="np-w" value="412" min="120" max="4000"/>`)}${field("高", `<input type="number" class="np-h" value="892" min="120" max="4000"/>`)}</div>`,
      okText: "创建",
      onOk: (v, card) => {
        const name = card.querySelector(".np-name").value.trim() || `页面 ${design.pages.length + 1}`;
        const pv = card.querySelector(".np-preset").value;
        let w, h, kind;
        if (pv === "custom") {
          w = Math.max(120, Math.min(4000, +card.querySelector(".np-w").value || 412));
          h = Math.max(120, Math.min(4000, +card.querySelector(".np-h").value || 892));
          kind = w >= h ? "desktop" : "phone";
        } else kind = pv;
        pushHistory();
        const np = T.defaultPage(name, kind);
        if (pv === "custom") { np.w = w; np.h = h; }
        if (parent) np.parent = parent.id;
        design.pages.push(np);
        curPageId = np.id;
        renderAll(); fitView(); autosave();
        toast(`已新建页面「${np.name}」${parent ? `（位于「${parent.name}」之下）` : ""}${pv === "custom" ? ` ${w}×${h}` : ""}`);
      },
    });
    /* 预设切换：自定义时放开宽高输入 */
    requestAnimationFrame(() => {
      const card = $("#modal .modal-card");
      if (!card) return;
      const psel = card.querySelector(".np-preset"), dims = card.querySelector(".np-dims");
      const wI = card.querySelector(".np-w"), hI = card.querySelector(".np-h");
      const upd = () => {
        dims.style.display = psel.value === "custom" ? "" : "none";
        if (psel.value === "phone") { wI.value = 412; hI.value = 892; }
        if (psel.value === "desktop") { wI.value = 1280; hI.value = 800; }
      };
      psel.addEventListener("change", upd);
    });
  }
  function dupPage(id) {
    pushHistory();
    const src = design.pages.find(p => p.id === id);
    const p = JSON.parse(JSON.stringify(src));
    p.id = T.uid();
    p.name = src.name + " 副本";
    p.items.forEach(i => { i.id = T.uid(); });
    design.pages.push(p);
    curPageId = p.id;
    renderAll();
    fitView();
    autosave();
  }
  function delPage(id) {
    if (design.pages.length <= 1) return toast("至少保留一个页面");
    pushHistory();
    const i = design.pages.findIndex(p => p.id === id);
    design.pages.splice(i, 1);
    design.pages.forEach(p => {
      if (p.parent === id) delete p.parent; // 子页面回到顶层
      /* 清理指向已删除页面的跳转 */
      for (const it of p.items) { if (it.action === id) delete it.action; }
    });
    if (curPageId === id) curPageId = design.pages[Math.max(0, i - 1)].id;
    sel.clear();
    renderAll();
    fitView();
    autosave();
  }
  function renamePage(id) {
    const p = design.pages.find(x => x.id === id);
    showModal({
      title: "重命名页面", input: true, value: p.name, okText: "重命名",
      onOk: v => {
        if (!v) return;
        pushHistory();
        p.name = v;
        renderPages();
        if (p.id === curPageId) { const f = world().querySelector(".frame-label .fname"); if (f) f.textContent = p.name; }
        autosave();
      },
    });
  }

  /* ================= 图层（编组树） ================= */
  const layersExpanded = new Set();
  let dragLayerItem = null;   // 正在拖动的组件 id（图层面板内拖拽换层）
  let activeLayerGid = null;  // 当前图层：新拖入画布的组件会自动加入

  function activeGidFor(page) {
    return activeLayerGid && (page.groups || []).some(g => g.id === activeLayerGid) ? activeLayerGid : null;
  }

  function moveItemToGroup(itemId, gid) {
    const page = curPage();
    const it = page.items.find(i => i.id === itemId);
    if (!it) return;
    if ((it.gid || null) === gid) return;
    pushHistory();
    if (gid) { it.gid = gid; layersExpanded.add(gid); }
    else delete it.gid;
    renderAll(); autosave();
    const g = gid ? groupOf(gid) : null;
    toast(g ? `已把「${it.label || REG.def(it.kind).name}」移入「${g.name}」` : `已移出图层`);
  }
  function clearDropHighlight() {
    $$("#layers .droptarget").forEach(el => el.classList.remove("droptarget"));
  }

  function renderLayers() {
    const host = $("#layers");
    if (!host) return;
    host.innerHTML = "";
    const page = curPage();
    const groups = page.groups || [];
    if (!page.items.length && !groups.length) { host.innerHTML = `<div class="empty">此屏幕暂无组件<br/>从左侧面板拖入，或点上方 + 新建图层</div>`; return; }

    /* 组件行：可拖动，拖到图层行=加入该图层，拖到「未分组」分隔行=移出；双击改名 */
    const itemRow = (it, sub) => {
      const d = REG.def(it.kind);
      const row = document.createElement("div");
      row.className = "layer-row" + (sub ? " sub" : "") + (sel.has(it.id) ? " on" : "");
      row.draggable = true;
      row.title = "拖动到图层行可移动图层；单击设为当前图层；双击改组件名称";
      row.innerHTML = `<span class="m3e-ic">${svg(d.icon, 16)}</span><span class="ln">${REG.esc(it.name || it.label || d.name)}</span><span class="lk">${d.name}</span>`;
      const startRename = lnEl => {
        if (lnEl.querySelector("input")) return;
        lnEl.innerHTML = `<input type="text" value="${REG.esc(it.name || it.label || d.name)}"/>`;
        const input = lnEl.querySelector("input");
        input.focus(); input.select();
        let done = false;
        const commit = ok => {
          if (done) return;
          done = true;
          const v = input.value.trim();
          if (ok && v && v !== (it.name || it.label || d.name)) { pushHistory(); it.name = v; autosave(); }
          renderLayers();
          if (sel.has(it.id)) renderInspector();
        };
        input.addEventListener("click", ev => ev.stopPropagation());
        input.addEventListener("pointerdown", ev => ev.stopPropagation());
        input.addEventListener("keydown", ev => {
          ev.stopPropagation();
          if (ev.key === "Enter") commit(true);
          else if (ev.key === "Escape") commit(false);
        });
        input.addEventListener("blur", () => commit(true));
      };
      row.addEventListener("dragstart", ev => {
        dragLayerItem = it.id;
        row.classList.add("dragging");
        ev.dataTransfer.setData("text/plain", it.id);
        ev.dataTransfer.effectAllowed = "move";
      });
      row.addEventListener("dragend", () => { dragLayerItem = null; row.classList.remove("dragging"); clearDropHighlight(); });
      row.addEventListener("click", () => {
        activeLayerGid = it.gid || null;
        sel.clear(); sel.add(it.id);
        renderSelection(); renderLayers();
      });
      row.addEventListener("dblclick", ev => {
        if (ev.target.closest(".ln") || !ev.target.closest(".lk")) {
          startRename(row.querySelector(".ln"));
          return;
        }
        sel.clear(); sel.add(it.id); renderSelection(); const f = $("#insp [data-k=label]"); if (f) { f.focus(); f.select(); }
      });
      return row;
    };

    /* 图层行：放置目标；单击设为当前图层；双击改名 */
    const groupRow = (g, members) => {
      const expanded = layersExpanded.has(g.id);
      const row = document.createElement("div");
      row.className = "layer-row group" + (members.length && members.every(m => sel.has(m.id)) ? " on" : "");
      row.innerHTML = `<button class="caret" title="展开/收起">${svg(expanded ? "keyboard_arrow_down" : "chevron_right", 14)}</button>` +
        `<span class="m3e-ic">${svg("group", 16)}</span><span class="ln" title="双击改名">${REG.esc(g.name)}${g.popup ? ' <b class="pp">弹窗</b>' : ""}${activeLayerGid === g.id ? ' <b class="pc">当前</b>' : ""}</span>` +
        `<span class="lk">${members.length} 项</span><button class="mini x gdel" title="解散编组（保留组件）">×</button>`;
      row.addEventListener("dragover", ev => {
        if (!dragLayerItem) return;
        ev.preventDefault();
        ev.dataTransfer.dropEffect = "move";
        row.classList.add("droptarget");
      });
      row.addEventListener("dragleave", ev => { if (!row.contains(ev.relatedTarget)) row.classList.remove("droptarget"); });
      row.addEventListener("drop", ev => {
        ev.preventDefault(); ev.stopPropagation();
        row.classList.remove("droptarget");
        const id = dragLayerItem || ev.dataTransfer.getData("text/plain");
        if (id) moveItemToGroup(id, g.id);
        dragLayerItem = null;
      });
      /* 双击名称 → 内联改名 */
      const startRename = lnEl => {
        if (lnEl.querySelector("input")) return;
        lnEl.innerHTML = `<input type="text" value="${REG.esc(g.name)}"/>`;
        const input = lnEl.querySelector("input");
        input.focus(); input.select();
        let done = false;
        const commit = ok => {
          if (done) return;
          done = true;
          const v = input.value.trim();
          if (ok && v && v !== g.name) { pushHistory(); g.name = v; autosave(); }
          renderLayers();
        };
        input.addEventListener("click", ev => ev.stopPropagation());
        input.addEventListener("pointerdown", ev => ev.stopPropagation());
        input.addEventListener("keydown", ev => {
          ev.stopPropagation();
          if (ev.key === "Enter") commit(true);
          else if (ev.key === "Escape") commit(false);
        });
        input.addEventListener("blur", () => commit(true));
      };
      row.addEventListener("click", ev => {
        if (ev.target.closest(".gdel")) {
          pushHistory();
          page.groups = groups.filter(x => x.id !== g.id);
          members.forEach(m => { delete m.gid; });
          if (activeLayerGid === g.id) activeLayerGid = null;
          renderAll(); autosave();
          toast(`已解散编组「${g.name}」（组件保留）`);
          return;
        }
        if (ev.target.closest(".caret")) {
          expanded ? layersExpanded.delete(g.id) : layersExpanded.add(g.id);
          renderLayers();
          return;
        }
        /* 单击 = 设为当前图层 + 整组选中；改名在上方「属性」面板的「编组名」输入框 */
        if (activeLayerGid !== g.id) {
          activeLayerGid = g.id;
          toast(`当前图层：「${g.name}」——新拖入画布的组件将自动加入；名称在上方「属性」中修改`);
        }
        sel.clear();
        members.forEach(m => sel.add(m.id));
        renderSelection(); renderLayers();
      });
      return row;
    };

    /* 「未分组」分隔行：拖到这里 = 移出图层；单击 = 当前图层设为无 */
    const hasGroups = groups.length > 0;
    const divider = document.createElement("div");
    divider.className = "layer-divider";
    divider.innerHTML = `<span class="m3e-ic">${svg("layers", 12)}</span>未分组（把组件拖到图层行可加入；单击设为当前）`;
    divider.addEventListener("click", () => {
      if (activeLayerGid !== null) {
        activeLayerGid = null;
        renderLayers();
        toast("当前图层：无——新拖入的组件不归入图层");
      }
    });
    divider.addEventListener("dragover", ev => {
      if (!dragLayerItem) return;
      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
      divider.classList.add("droptarget");
    });
    divider.addEventListener("dragleave", () => divider.classList.remove("droptarget"));
    divider.addEventListener("drop", ev => {
      ev.preventDefault();
      divider.classList.remove("droptarget");
      const id = dragLayerItem || ev.dataTransfer.getData("text/plain");
      if (id) moveItemToGroup(id, null);
      dragLayerItem = null;
    });
    if (hasGroups) host.appendChild(divider);

    /* 按画布真实堆叠顺序（从顶到底）交错输出 */
    const emitted = new Set();
    for (const it of page.items.slice().reverse()) {
      if (it.gid) {
        const g = groups.find(x => x.id === it.gid);
        if (g) {
          if (!emitted.has(g.id)) {
            emitted.add(g.id);
            const members = page.items.filter(i => i.gid === g.id);
            host.appendChild(groupRow(g, members));
            if (layersExpanded.has(g.id)) for (const m of members.slice().reverse()) host.appendChild(itemRow(m, true));
          }
          continue;
        }
      }
      host.appendChild(itemRow(it, false));
    }
    /* 空图层排在最后 */
    for (const g of groups) if (!emitted.has(g.id)) host.appendChild(groupRow(g, []));
  }
  function reorder(dir) { // dir: top up down bottom
    if (sel.size !== 1) return toast("请先选中一个组件");
    const items = curItems();
    const i = items.findIndex(x => x.id === [...sel][0]);
    const j = dir === "top" ? items.length - 1 : dir === "bottom" ? 0 : i + (dir === "up" ? 1 : -1);
    if (j < 0 || j >= items.length || j === i) return; /* 已在顶/底或无处可移：不入历史 */
    pushHistory();
    const [it] = items.splice(i, 1);
    items.splice(j, 0, it);
    renderCanvas(); autosave();
  }

  /* ================= 属性检查器 ================= */
  function field(label, inner, wide) {
    return `<div class="frow${wide ? " wide" : ""}"><label>${label}</label>${inner}</div>`;
  }
  const num = (k, v, step) => `<input type="number" step="${step || 1}" data-k="${k}" value="${v == null ? 0 : v}"/>`;
  const txt = (k, v) => `<input type="text" data-k="${k}" value="${REG.esc(v == null ? "" : v)}"/>`;
  const chk = (k, v) => `<label class="ckb"><input type="checkbox" data-k="${k}"${v ? " checked" : ""}/><span></span></label>`;

  function renderInspector() {
    const host = $("#insp");
    host.scrollLeft = 0; // 防止上次横向滚动导致标题被"挤出"视野
    const page = curPage();
    const selArr = [...sel].map(id => page.items.find(i => i.id === id)).filter(Boolean);
    if (!selArr.length) {
      /* 页面属性模式 */
      const size = T.pageSize(page);
      host.innerHTML = `
        <div class="sec-t">页面属性</div>
        ${field("名称", txt("__pname", page.name))}
        ${field("类型", `<select data-k="__pkind"><option value="phone"${page.kind !== "desktop" ? " selected" : ""}>手机 412×892</option><option value="desktop"${page.kind === "desktop" ? " selected" : ""}>桌面 1280×800</option></select>`)}
        <div class="grid2">${field("宽", num("__pw", size.w, 1))}${field("高", num("__ph", size.h, 1))}</div>
        ${field("背景", `<button class="mini" data-op="pickbg"><span style="display:inline-block;width:14px;height:14px;border-radius:4px;border:1px solid #CAC4D0;background:${page.bg || T.pageBg(design.theme)};vertical-align:-2px;"></span>拖动选取颜色</button><button class="mini" data-k="__pbgclear">默认</button>`)}
        <div class="hint">未选中组件。点击画布中的组件进行编辑，或从左侧拖入新组件。</div>`;
      bindInspector(host, null, page);
      return;
    }
    const it = selArr[0];
    const def = REG.def(it.kind);
    const pl = (k, fallback) => (def.propLabels && def.propLabels[k]) || fallback;
    const multi = selArr.length > 1;

    /* 整组选中 → 编组信息 + 组件属性（单成员时也能看到组件属性） */
    const gids = [...new Set(selArr.map(i => i.gid).filter(Boolean))];
    const grp = gids.length === 1 ? groupOf(gids[0]) : null;
    const isWholeGrp = !!(grp && curItems().filter(i => i.gid === grp.id).length === selArr.length);
    const groupSection = isWholeGrp ? `<div class="sec-t">编组</div>
        ${field("编组名", txt("__gname", grp.name))}
        ${selArr.length > 1 ? field("成员数", `<b style="font-size:13px;">${selArr.length}</b>`) : ""}
        ${field("弹窗样式", chk("__gpopup", !!grp.popup))}
        <div class="btnrow"><button class="mini" data-op="ungroup">取消编组</button><button class="mini" data-op="delgroup">删除成员</button></div>` : "";

    if (isWholeGrp && multi) {
      host.innerHTML = groupSection + `
        <div class="hint">勾选「弹窗样式」后导出的页面默认隐藏此编组（遮罩+弹层），可在其他组件的「点击跳转」中选择打开它，点遮罩或成员内「关闭所在弹窗」关闭。</div>
        <div class="btnrow">
        <button class="mini" data-op="alL">左对齐</button><button class="mini" data-op="alR">右对齐</button>
        <button class="mini" data-op="alT">上对齐</button><button class="mini" data-op="alB">下对齐</button>
        <button class="mini" data-op="distH">横向等距</button><button class="mini" data-op="distV">纵向等距</button>
        </div>`;
      bindInspector(host, it, page);
      return;
    }

    let h = "";
    if (isWholeGrp) {
      /* 单成员编组：编组信息 + 组件属性同时显示 */
      h += groupSection + `<div class="sec-t" style="margin-top:10px;">组件属性</div>`;
    } else {
      h += `<div class="sec-t">${multi ? `已选 ${selArr.length} 个组件` : def.name}</div>`;
    }
    h += `<div class="grid2">${field("X", num("x", Math.round(it.x)))}${field("Y", num("y", Math.round(it.y)))}${field("宽", num("w", Math.round(it.w)))}${field("高", num("h", Math.round(it.h)))}</div>`;
    /* 组件圆角：所有组件均可调整（覆盖默认值） */
    const radiusDef = REG.shellRadius(Object.assign({}, it, { radius: null }));
    const radiusEff = it.radius != null ? it.radius : radiusDef;
    h += field("圆角", `${num("radius", radiusEff)}<button class="mini" data-op="radiusreset" title="恢复默认圆角">默认</button>`);
    /* 组件名称：显示在图层面板，可在面板双击修改 */
    h += field("组件名称", txt("__itemname", it.name || def.name));
    /* 所属图层：把组件加入/移出图层 */
    const gAll = page.groups || [];
    const myGid = it.gid && gAll.some(g => g.id === it.gid) ? it.gid : "";
    const layerField = field("所属图层", `<select data-k="__layer"><option value="">（无）</option>${gAll.map(g => `<option value="${g.id}"${myGid === g.id ? " selected" : ""}>${REG.esc(g.name)}${g.popup ? "（弹窗）" : ""}</option>`).join("")}</select>`);
    h += layerField;
    if (multi) {
      host.innerHTML = h + `<div class="hint">多选状态：支持整体移动、对齐与删除。</div>
        <div class="btnrow">
        <button class="mini" data-op="alL">左对齐</button><button class="mini" data-op="alR">右对齐</button>
        <button class="mini" data-op="alT">上对齐</button><button class="mini" data-op="alB">下对齐</button>
        <button class="mini" data-op="distH">横向等距</button><button class="mini" data-op="distV">纵向等距</button>
        </div>`;
      bindInspector(host, it, page);
      return;
    }
    for (const k of def.props || []) {
      if (k === "label") h += field(it.kind === "text" ? "文本内容" : pl("label", "主文字"), txt("label", it.label));
      else if (k === "supporting") h += field(it.kind === "snackbar" ? "操作文字" : pl("supporting", "辅助文字"), txt("supporting", it.supporting));
      else if (k === "icon") h += field("图标", iconField("icon", it.icon));
      else if (k === "icon2") h += field("右侧图标", iconField("icon2", it.icon2));
      else if (k === "variant") {
        const list = def.variantList || [];
        h += field("样式", `<select data-k="variant">${list.map(v => `<option value="${v}"${it.variant === v ? " selected" : ""}>${REG.variantNames[v] || v}</option>`).join("")}</select>`);
      } else if (k === "checked") h += field(it.kind === "chip" ? "选中态" : it.kind === "switch" ? "开启" : "勾选", chk("checked", !!it.checked));
      else if (k === "noCheck") h += field("手柄不带勾", chk("noCheck", !!it.noCheck));
      else if (k === "value") {
        if (it.kind === "slider" || it.kind === "rating") h += field(pl("value", "当前值"), `<input type="range" min="0" max="100" data-k="value" value="${it.value == null ? 50 : it.value}"/>`);
        else if (it.kind === "pagination") h += field(pl("value", "当前页"), num("value", it.value == null ? 1 : it.value));
        else h += field("进度", `<label class="ckb"><input type="checkbox" data-k="__indet"${it.value == null || it.value < 0 ? " checked" : ""}/><span></span></label><input type="range" min="0" max="100" data-k="value" value="${it.value == null || it.value < 0 ? 60 : it.value}"${it.value == null || it.value < 0 ? " disabled" : ""}/>`);
      } else if (k === "size") h += field(pl("size", "字号"), num("size", it.size || 28));
      else if (k === "rows") h += field(pl("rows", "行数"), num("rows", it.rows == null ? 3 : it.rows));
      else if (k === "bold") h += field("加粗", chk("bold", !!it.bold));
      else if (k === "html") h += field("HTML / 模板", `<textarea data-k="html" rows="6" spellcheck="false">${REG.esc(it.html || "")}</textarea>`, true);
      else if (k === "css") h += field("组件 CSS", `<textarea data-k="css" rows="5" spellcheck="false" placeholder="组件独立样式（已作用域隔离）">${REG.esc(it.css || "")}</textarea>`, true);
      else if (k === "vueScript") h += field("Vue 脚本", `<textarea data-k="vueScript" rows="5" spellcheck="false" placeholder="仅 Vue 导出时生效">${REG.esc(it.vueScript || "")}</textarea>`, true);
      else if (k === "fill") {
        const list = def.fillList || [];
        h += field("填充色", `<select data-k="fill">${list.map(v => `<option value="${v}"${it.fill === v ? " selected" : ""}>${REG.fillNames[v] || v}</option>`).join("")}</select>`);
      } else if (k === "src") h += field("图片", `<button class="mini" data-op="pickimg">${it.src ? "更换图片" : "选择图片"}</button>${it.src ? `<button class="mini" data-op="clearimg">清除</button>` : ""}`);
      else if (k === "tabs") h += tabsEditor(it, def);
      else if (k === "selected") {
        const tabs = it.tabs || [];
        h += field(pl("selected", "当前选中"), `<select data-k="selected">${tabs.map((t, i) => `<option value="${i}"${it.selected === i ? " selected" : ""}>${REG.esc(t.label || ("#" + (i + 1)))}</option>`).join("")}</select>`);
      }
    }
    /* 签名/通用属性（propDefs 数据驱动：sel/num/chk/txt/icon） */
    const SPECIAL = new Set(["label", "supporting", "icon", "icon2", "variant", "checked", "noCheck", "value", "size", "rows", "bold", "radius", "html", "css", "vueScript", "fill", "src", "tabs", "selected"]);
    for (const pd of def.propDefs || []) {
      if (SPECIAL.has(pd.k)) continue;
      const v = it[pd.k];
      if (pd.type === "sel") {
        h += field(pd.label, `<select data-k="${pd.k}">${(pd.opts || []).map(([val, lb2]) => `<option value="${REG.esc(val)}"${(v == null || v === "" ? (pd.def != null ? pd.def : val) : v) == val ? " selected" : ""}>${REG.esc(lb2)}</option>`).join("")}</select>`);
      } else if (pd.type === "num") {
        const shown = v == null ? (pd.def != null ? pd.def : 0) : v;
        h += field(pd.label, `<input type="number" data-k="${pd.k}" value="${shown}"${pd.min != null ? ` min="${pd.min}"` : ""}${pd.max != null ? ` max="${pd.max}"` : ""}${pd.step ? ` step="${pd.step}"` : ""}/>`);
      } else if (pd.type === "chk") {
        h += field(pd.label, chk(pd.k, !!v));
      } else if (pd.type === "icon") {
        h += field(pd.label, iconField(pd.k, v || ""));
      } else {
        h += field(pd.label, `<input type="text" data-k="${pd.k}" value="${REG.esc(v == null ? "" : v)}"/>`);
      }
    }
    /* 行为说明 + 跳转 */
    h += field("行为说明", `<textarea data-k="note" rows="2" placeholder="这个组件是做什么的（会写进提示词）">${REG.esc(it.note || "")}</textarea>`, true);
    const pageGroups = page.groups || [];
    const popupOpts = pageGroups.filter(g => g.popup && it.gid !== g.id)
      .map(g => `<option value="popup:${g.id}"${it.action === "popup:" + g.id ? " selected" : ""}>▸ 打开弹窗「${REG.esc(g.name)}」</option>`).join("");
    const closeOpt = it.gid && groupOf(it.gid) && groupOf(it.gid).popup
      ? `<option value="closepop"${it.action === "closepop" ? " selected" : ""}>▸ 关闭所在弹窗</option>` : "";
    h += field("点击跳转", `<select data-k="action"><option value="">（无）</option>${design.pages.map(p => `<option value="${p.id}"${it.action === p.id ? " selected" : ""}>▸ 屏幕：${REG.esc(p.name)}</option>`).join("")}${popupOpts}${closeOpt}</select>`);
    host.innerHTML = h;
    bindInspector(host, it, page);
  }

  function iconField(k, v) {
    return `<div class="iconfield"><input type="text" data-k="${k}" value="${REG.esc(v || "")}" placeholder="图标名"/><span class="ipv">${v ? svg(v, 18) : ""}</span></div>`;
  }

  function tabsEditor(it, def) {
    const tabs = it.tabs || [];
    const hideIcon = def && def.tabsHideIcon;
    const name = (def && def.tabsName) || (it.kind === "select" ? "选项" : "项目");
    let h = `<div class="frow wide"><label>${name}</label><div class="tabs-ed">`;
    tabs.forEach((t, i) => {
      h += `<div class="trow" data-i="${i}">${!hideIcon && t.icon ? `<span class="m3e-ic">${svg(t.icon, 16)}</span>` : ""}<input type="text" data-tk="label" value="${REG.esc(t.label || "")}" placeholder="文字"/>${hideIcon ? "" : `<input type="text" data-tk="icon" value="${REG.esc(t.icon || "")}" placeholder="图标"/>`}<button class="mini x" data-top="${i}">×</button></div>`;
    });
    h += `</div></div><div class="btnrow"><button class="mini" data-op="tabadd">+ 添加${name}</button></div>`;
    return h;
  }

  function bindInspector(host, it, page) {
    host.oninput = ev => {
      const k = ev.target.dataset.k;
      if (!k) return;
      /* 页面名等"标题类"字段改为失焦/回车时提交，避免中文输入法逐字母生效 */
      if (k === "__pname") return;
      pushHistorySoft();
      applyField(it, page, k, ev.target, ev);
      afterEdit(it, k);
    };
    host.onchange = ev => {
      const k = ev.target.dataset.k;
      if (!k || ev.target.type === "range") return;
      pushHistorySoft();
      applyField(it, page, k, ev.target, ev);
      afterEdit(it, k);
      if (k === "__pname") { renderPages(); toast("页面名称已更新"); }
    };
    host.onclick = ev => {
      const op = ev.target.closest("[data-op]");
      if (op) doInspectorOp(op.dataset.op, it, page);
      const clr = ev.target.closest("[data-k=__pbgclear]");
      if (clr) { pushHistory(); page.bg = ""; renderAll(); autosave(); }
      const rm = ev.target.closest("[data-top]");
      if (rm) {
        pushHistory();
        const i = +rm.dataset.top;
        it.tabs.splice(i, 1);
        if ((it.selected || 0) >= it.tabs.length) it.selected = Math.max(0, it.tabs.length - 1);
        const size = it.kind === "fabMenu" ? Math.max(72, 16 + it.tabs.length * 56 + 8) : it.h;
        if (it.kind === "fabMenu") it.h = size;
        renderAll(); autosave();
      }
    };
  }

  let softTimer = null;
  function pushHistorySoft() {
    /* 文本连续输入时合并历史：仅在空闲 400ms 后视为一次编辑结束 */
    if (!softTimer) pushHistory();
    else clearTimeout(softTimer);
    softTimer = setTimeout(() => { softTimer = null; }, 400);
  }

  function applyField(it, page, k, el, ev) {
    if (k === "__layer") {
      /* 把当前选中的所有组件加入/移出图层 */
      const gid = el.value || null;
      for (const i of selItems()) { if (gid) i.gid = gid; else delete i.gid; }
      renderCanvas(); renderLayers(); renderInspector();
      return;
    }
    if (k === "__itemname") {
      /* 组件自定义名称：显示在图层面板；留空恢复默认 */
      const v = el.value.trim();
      if (v) it.name = v; else delete it.name;
      return;
    }
    if (k === "__gname") { const g = it && groupOf(it.gid); if (g) { g.name = el.value; renderLayers(); } return; }
    if (k === "__gpopup") { const g = it && groupOf(it.gid); if (g) { g.popup = el.checked; renderCanvas(); renderLayers(); } return; }
    if (k.startsWith("__p")) {
      if (k === "__pname") page.name = el.value;
      else if (k === "__pkind") {
        page.kind = el.value;
        const size = T.pageSize(page);
        for (const t of page.items) { t.x = Math.min(t.x, size.w - t.w); t.y = Math.min(t.y, size.h - t.h); }
      } else if (k === "__pw" || k === "__ph") {
        page[k === "__pw" ? "w" : "h"] = Math.max(120, Math.min(4000, +el.value || 0));
        for (const t of page.items) { t.x = Math.min(t.x, page.w - t.w); t.y = Math.min(t.y, page.h - t.h); }
      } else if (k === "__pbg") page.bg = el.value;
      renderCanvas(); renderPages();
      return;
    }
    if (!it) return;
    if (["x", "y", "w", "h", "size", "radius", "rows"].includes(k)) {
      it[k] = +el.value || 0;
    } else if (["label", "supporting", "note", "icon", "icon2", "html", "css", "vueScript"].includes(k)) {
      it[k] = el.value;
      if (k === "icon" || k === "icon2") {
        const pv = el.parentElement.querySelector(".ipv");
        if (pv) pv.innerHTML = el.value ? svg(el.value, 18) : "";
      }
    } else if (k === "variant" || k === "fill" || k === "action") {
      it[k] = el.value || (k === "action" ? "" : it[k]);
    } else if (k === "checked" || k === "bold" || k === "noCheck") {
      it[k] = el.checked;
    } else if (k === "value") {
      it[k] = +el.value;
    } else if (k === "__indet") {
      it.value = el.checked ? -1 : 60;
    } else if (k === "selected") {
      it[k] = +el.value;
    } else if (k === "wavy") {
      it[k] = el.checked;
    }
    /* 签名/通用属性（propDefs 数据驱动） */
    const pd = (REG.def(it.kind).propDefs || []).find(p => p.k === k);
    if (pd) {
      if (pd.type === "num") {
        let n = +el.value || 0;
        if (pd.min != null) n = Math.max(pd.min, n);
        if (pd.max != null) n = Math.min(pd.max, n);
        it[k] = n;
      } else if (pd.type === "chk") {
        it[k] = el.checked;
      } else {
        it[k] = el.value; // sel / txt / icon
      }
    }
    /* 页签编辑 */
    if (k === "label" && el.dataset.tk != null) { /* 不会走到 */ }
    if (el.dataset.tk) {
      const i = +el.closest(".trow").dataset.i;
      it.tabs[i][el.dataset.tk] = el.value;
    }
  }

  function afterEdit(it, k) {
    if (it) redrawItem(it);
    if (["x", "y", "w", "h"].includes(k)) renderSelectionLight();
    if (k === "action") renderPages();
    if (["selected", "tabs", "variant", "checked", "fill", "icon", "icon2", "value", "size", "bold", "radius", "note", "action", "supporting", "noCheck", "__itemname", "rows", "html", "css"].includes(k)) {
      renderLayers();
    }
    autosave();
  }

  function doInspectorOp(op, it, page) {
    const selArr = [...sel].map(id => page.items.find(i => i.id === id)).filter(Boolean);
    pushHistory();
    if (op === "radiusreset") { delete it.radius; }
    if (op === "pickbg") { openColorPicker(page, it); }
    if (op === "ungroup") { ungroupSelection(); return; }
    if (op === "delgroup") { doDelete(); return; }
    if (op === "tabadd") {
      const def = REG.def(it.kind);
      const name = (def && def.tabsName) ? `${def.tabsName} ${it.tabs.length + 1}`
        : it.kind === "select" ? `选项 ${it.tabs.length + 1}`
        : "新项目";
      const icon = it.kind === "bottomNav" || it.kind === "navRail" ? "circle" : "";
      it.tabs.push({ icon, label: name });
      if (it.kind === "fabMenu") it.h = 16 + it.tabs.length * 56 + 8;
      if (it.kind === "accordion") it.h = Math.max(64, it.tabs.length * 56 + 16);
    } else if (op === "pickimg") {
      const url = prompt("输入图片 URL 或 data: 地址：", it.src || "");
      if (url != null) it.src = url;
    } else if (op === "clearimg") { it.src = ""; }
    else if (op === "alL" || op === "alR" || op === "alT" || op === "alB") {
      if (selArr.length < 2) return;
      const xs = selArr.map(i => i.x), ys = selArr.map(i => i.y);
      if (op === "alL") { const v = Math.min(...xs); selArr.forEach(i => i.x = v); }
      if (op === "alR") { const v = Math.max(...selArr.map(i => i.x + i.w)); selArr.forEach(i => i.x = v - i.w); }
      if (op === "alT") { const v = Math.min(...ys); selArr.forEach(i => i.y = v); }
      if (op === "alB") { const v = Math.max(...selArr.map(i => i.y + i.h)); selArr.forEach(i => i.y = v - i.h); }
    } else if (op === "distH" || op === "distV") {
      if (selArr.length < 3) return toast("等距需要 3 个以上组件");
      const hor = op === "distH";
      selArr.sort((a, b) => hor ? a.x - b.x : a.y - b.y);
      const first = selArr[0], last = selArr[selArr.length - 1];
      const total = (hor ? (last.x - first.x) : (last.y - first.y));
      const slot = selArr.reduce((s, i) => s + (hor ? i.w : i.h), 0);
      const gap = (total - slot) / (selArr.length - 1);
      let cur = hor ? first.x + first.w : first.y + first.h;
      for (const i of selArr.slice(1, -1)) {
        if (hor) { i.x = Math.round(cur); cur += i.w + gap; }
        else { i.y = Math.round(cur); cur += i.h + gap; }
      }
    }
    renderAll(); autosave();
  }

  /* ================= 右键菜单 ================= */
  function showCtxMenu(x, y) {
    const m = $("#ctxmenu");
    const one = sel.size === 1;
    m.innerHTML = "";
    const add = (label, fn, ic) => {
      const b = document.createElement("button");
      b.innerHTML = `<span class="m3e-ic">${svg(ic || "chevron_right", 16)}</span>${label}`;
      b.addEventListener("click", () => { hideCtxMenu(); fn(); });
      m.appendChild(b);
    };
    add("复制组件 (Ctrl+C)", doCopy, "content_copy");
    add("粘贴 (Ctrl+V)", doPaste, "content_paste");
    add("生成副本 (Ctrl+D)", doDuplicate, "add_box");
    add("编组 (Ctrl+G)", groupSelection, "group");
    add("取消编组 (Ctrl+Shift+G)", ungroupSelection, "layers");
    add("保存为自定义组件…", saveSelectionAsWidget, "star");
    m.appendChild(document.createElement("hr"));
    add("复制组件代码 HTML", () => copyItemCode("html"), "code");
    add("复制组件代码 Vue", () => copyItemCode("vue"), "code");
    add("复制组件 JSON", () => copyItemCode("json"), "data_object");
    m.appendChild(document.createElement("hr"));
    add("置顶", () => reorder("top"), "upload");
    add("上移一层", () => reorder("up"), "chevron_right");
    add("下移一层", () => reorder("down"), "chevron_left");
    add("置底", () => reorder("bottom"), "download");
    m.appendChild(document.createElement("hr"));
    add("删除 (Delete)", doDelete, "delete");
    m.style.display = "block";
    m.style.left = Math.min(x, innerWidth - 230) + "px";
    m.style.top = Math.min(y, innerHeight - m.offsetHeight - 10) + "px";
  }
  function hideCtxMenu() { $("#ctxmenu").style.display = "none"; }
  document.addEventListener("pointerdown", e => { if (!e.target.closest("#ctxmenu")) hideCtxMenu(); });

  /* ================= 编辑操作 ================= */
  function selItems() {
    const page = curPage();
    return [...sel].map(id => page.items.find(i => i.id === id)).filter(Boolean);
  }
  function doCopy() {
    const arr = selItems();
    if (!arr.length) return toast("未选中组件");
    if (arr.length === 1) clipboardItem = JSON.parse(JSON.stringify(arr[0]));
    else clipboardItem = { __multi: arr.map(i => JSON.parse(JSON.stringify(i))) };
    Bridge.copy(JSON.stringify({ __m3eBlock: 1, item: clipboardItem }));
    toast("已复制 " + arr.length + " 个组件（可 Ctrl+V 粘贴）");
  }
  function doPaste() {
    let raw = Bridge.readText();
    let data = null;
    if (clipboardItem) data = JSON.parse(JSON.stringify(clipboardItem));
    if (raw.includes("__m3eBlock")) {
      try {
        const j = JSON.parse(raw);
        if (j.__m3eBlock) data = j.item;
      } catch (e) { /* 忽略 */ }
    }
    if (!data) {
      /* 粘贴纯文本 → 文本组件 */
      if (raw && raw.length < 500) {
        addComponent("text", curPage(), 24, 24, { label: raw, w: Math.max(80, raw.length * 16), h: 40 });
        return;
      }
      return toast("剪贴板没有可粘贴的组件");
    }
    pushHistory();
    const page = curPage();
    const size = T.pageSize(page);
    const paste = item => {
      const c = JSON.parse(JSON.stringify(item));
      c.id = T.uid();
      c.x += 16; c.y += 16;
      /* 钳制在页面内，防止粘贴/副本落在画布外不可见 */
      c.x = Math.max(0, Math.min(size.w - c.w, c.x));
      c.y = Math.max(0, Math.min(size.h - c.h, c.y));
      page.items.push(c);
      sel.add(c.id);
      return c;
    };
    sel.clear();
    const pasted = [];
    if (data.__multi) data.__multi.forEach(m => pasted.push(paste(m)));
    else pasted.push(paste(data));
    remapGids(pasted, page);
    renderAll(); autosave();
    toast("已粘贴");
  }
  /** 为克隆的条目重新映射编组 id（可选带源编组定义以保留名称） */
  function remapGids(items, page, srcGroups) {
    const gmap = {};
    if (!page.groups) page.groups = [];
    for (const c of items) {
      if (!c.gid) continue;
      if (!gmap[c.gid]) {
        const src = (srcGroups || []).find(g => g.id === c.gid) || groupOf(c.gid);
        const ng = { id: T.uid(), name: src ? src.name : "编组", popup: src ? !!src.popup : false };
        page.groups.push(ng);
        gmap[c.gid] = ng.id;
      }
      c.gid = gmap[c.gid];
    }
  }
  function doDuplicate() {
    if (!sel.size) return;
    pushHistory();
    const page = curPage();
    const size = T.pageSize(page);
    const arr = selItems();
    const clones = arr.map(it => {
      const c = JSON.parse(JSON.stringify(it));
      c.id = T.uid(); c.x += 16; c.y += 16;
      c.x = Math.max(0, Math.min(size.w - c.w, c.x));
      c.y = Math.max(0, Math.min(size.h - c.h, c.y));
      return c;
    });
    remapGids(clones, page);
    clones.forEach(c => page.items.push(c));
    sel.clear();
    clones.forEach(c => sel.add(c.id));
    renderAll(); autosave();
  }
  function doDelete() {
    if (!sel.size) return;
    pushHistory();
    const page = curPage();
    page.items = page.items.filter(i => !sel.has(i.id));
    sel.clear();
    renderAll(); autosave();
    toast("已删除");
  }
  function copyItemCode(format) {
    const arr = selItems();
    if (arr.length !== 1) return toast("请先选中一个组件");
    const code = GEN.itemSnippet(arr[0], design, format);
    Bridge.copy(code);
    toast(format === "json" ? "已复制组件 JSON" : "已复制组件 " + format.toUpperCase() + " 代码");
  }

  /* ================= 代码面板（右栏「代码」模式） ================= */
  let codeTab = "html", codeScope = "page";
  function setRightMode(code) {
    const r = $("#right");
    r.classList.toggle("mode-code", code);
    $("#rtDesign").classList.toggle("on", !code);
    $("#rtCode").classList.toggle("on", code);
    if (code) renderCode();
  }
  function genCode() {
    const page = curPage();
    if (codeScope === "sel") {
      const arr = selItems();
      if (!arr.length) return "// 请先在画布中选中组件";
      if (arr.length > 1) return "// 多选状态请单选一个组件，或切换范围为「当前页面」";
      if (codeTab === "json") return GEN.itemSnippet(arr[0], design, "json");
      if (codeTab === "prompt") return GEN.prompt(design, { pages: [page], target: $("#promptTarget").value });
      return GEN.itemSnippet(arr[0], design, codeTab === "html" ? "html" : "vue");
    }
    if (codeScope === "page") {
      if (codeTab === "json") return JSON.stringify(design, null, 2);
      if (codeTab === "prompt") return GEN.prompt(design, { pages: [page], target: $("#promptTarget").value });
      if (codeTab === "vue") return GEN.vueSFC(page, design);
      return GEN.htmlDoc(design, { pages: [page] });
    }
    /* all */
    if (codeTab === "json") return JSON.stringify(design, null, 2);
    if (codeTab === "prompt") return GEN.prompt(design, { target: $("#promptTarget").value });
    if (codeTab === "vue") return design.pages.map(p => `<!-- ======== ${p.name} ======== -->\n` + GEN.vueSFC(p, design)).join("\n\n");
    return GEN.htmlDoc(design);
  }
  function renderCode() {
    $("#codeArea").value = genCode();
    $("#codeInfo").textContent = `${{ html: "HTML", vue: "Vue 3", json: "项目 JSON", prompt: "AI 提示词" }[codeTab]} · ${{ sel: "选中组件", page: "当前页面", all: "全部设计" }[codeScope]} · ${$("#codeArea").value.length} 字符`;
  }
  function initCodePanel() {
    $("#rtDesign").addEventListener("click", () => setRightMode(false));
    $("#rtCode").addEventListener("click", () => setRightMode(true));
    $$("#codeTabs button").forEach(b => b.addEventListener("click", () => {
      $$("#codeTabs button").forEach(x => x.classList.remove("on"));
      b.classList.add("on");
      codeTab = b.dataset.tab;
      renderCode();
    }));
    $("#codeScope").addEventListener("change", e => { codeScope = e.target.value; renderCode(); });
    $("#promptTarget").addEventListener("change", renderCode);
    $("#codeCopy").addEventListener("click", () => { Bridge.copy($("#codeArea").value); toast("已复制到剪贴板"); });
    $("#codeSave").addEventListener("click", () => {
      const page = curPage();
      const nm = safeFileName(design.name);
      const map = {
        html: [`${nm}-${safeFileName(page.name)}.html`, "HTML 文件|*.html"],
        vue: [`${nm}-${safeFileName(page.name)}.vue`, "Vue 文件|*.vue"],
        json: [`${nm}.m3ed`, "M3E 设计|*.m3ed"],
        prompt: [`${nm}-提示词.md`, "Markdown|*.md"],
      }[codeTab];
      const okSave = Bridge.saveText(map[0], map[1], $("#codeArea").value);
      toast(okSave ? "已保存文件" : "已取消保存");
    });
  }

  /* ================= 导出 / 预览 / 项目 ================= */
  function initExportPanel() {
    const panel = $("#exportpanel");
    /* 恢复上次的勾选 */
    try {
      const saved = JSON.parse(localStorage.getItem("m3e_designer_export") || "null");
      if (saved) $$("#exportpanel [data-x]").forEach(c => { c.checked = !!saved[c.dataset.x]; });
    } catch (e) { /* 忽略 */ }
    $("#btnExport").addEventListener("click", e => {
      e.stopPropagation();
      $("#themepanel").classList.remove("open");
      panel.classList.toggle("open");
    });
    document.addEventListener("pointerdown", e => {
      if (!e.target.closest("#exportpanel") && !e.target.closest("#btnExport")) panel.classList.remove("open");
    });
    $("#doExport").addEventListener("click", () => {
      const want = {};
      let any = false;
      $$("#exportpanel [data-x]").forEach(c => { want[c.dataset.x] = c.checked; if (c.checked) any = true; });
      if (!any) return toast("请至少勾选一种格式");
      try { localStorage.setItem("m3e_designer_export", JSON.stringify(want)); } catch (e) { /* 忽略 */ }
      const folder = Bridge.pickFolder();
      if (!folder) { toast("已取消导出"); return; }
      const files = [];
      if (want.html) {
        for (const p of design.pages) files.push({ name: safeFileName(p.name) + ".html", content: GEN.htmlDoc(design, { pages: [p] }) });
        files.push({ name: "index.html", content: GEN.htmlDoc(design) });
      }
      if (want.vue) for (const p of design.pages) files.push({ name: safeFileName(p.name) + ".vue", content: GEN.vueSFC(p, design) });
      if (want.prompt) files.push({ name: "提示词.md", content: GEN.prompt(design, { target: $("#promptTarget").value }) });
      if (want.project) files.push({ name: (safeFileName(design.name) || "design") + ".m3ed", content: JSON.stringify(design, null, 2) });
      if (!files.length) return toast("请至少勾选一种格式");
      const n = Bridge.writeFiles(folder, files);
      panel.classList.remove("open");
      toast(n >= 0 ? `已导出 ${n} 个文件到所选文件夹` : "导出失败");
    });
  }

  /* ---------- 程序内预览 ---------- */
  function renderPreviewFrame() {
    const id = $("#pvPageSel").value;
    const p = design.pages.find(x => x.id === id) || curPage();
    $("#pvFrame").srcdoc = GEN.htmlDoc(design, { pages: [p] });
  }
  function previewPage() {
    const selEl = $("#pvPageSel");
    selEl.innerHTML = design.pages.map(p => `<option value="${p.id}"${p.id === curPageId ? " selected" : ""}>${REG.esc(p.name)}（${p.kind === "desktop" ? "桌面" : "手机"}）</option>`).join("");
    renderPreviewFrame();
    $("#previewOverlay").classList.add("open");
  }
  function initPreview() {
    $("#pvPageSel").addEventListener("change", renderPreviewFrame);
    $("#pvClose").addEventListener("click", () => $("#previewOverlay").classList.remove("open"));
    $("#pvOpenBrowser").addEventListener("click", () => {
      const id = $("#pvPageSel").value;
      const p = design.pages.find(x => x.id === id) || curPage();
      Bridge.preview(GEN.htmlDoc(design, { pages: [p] }));
    });
  }
  function safeFileName(s) { return (s || "page").replace(/[\\/:*?"<>|]/g, "_"); }

  function saveProject() {
    const okSave = Bridge.saveText((design.name || "未命名设计") + ".m3ed", "M3E 设计|*.m3ed", JSON.stringify(design, null, 2));
    if (!okSave) { toast("已取消保存"); return; }
    dirty = false;
    Bridge.setTitle(design.name + " — gw Designer");
    toast("项目已保存");
  }
  function openProject() {
    const raw = Bridge.openText("M3E 设计|*.m3ed|JSON|*.json");
    if (!raw) return;
    try {
      const d = normalizeDesign(JSON.parse(raw));
      if (!d.pages || !d.theme) throw new Error("格式不对");
      pushHistory();
      design = d;
      curPageId = design.pages[0].id;
      sel.clear();
      renderAll(); autosave();
      $("#projName").textContent = design.name;
      toast("已打开 " + design.name);
    } catch (e) {
      toast("打开失败：" + e.message);
    }
  }

  /* ================= 主题面板 ================= */
  function initThemePanel() {
    const panel = $("#themepanel");
    /* btnTheme 的打开动作在 initToolbar 中统一处理（互斥关闭导出面板） */
    document.addEventListener("pointerdown", e => {
      if (!e.target.closest("#themepanel") && !e.target.closest("#btnTheme")) panel.classList.remove("open");
    });
  }
  function renderThemePanel() {
    const panel = $("#themepanel");
    const th = design.theme;
    panel.innerHTML = `
      <div class="sec-t">主题</div>
      <div class="frow wide"><label>项目名</label><input type="text" id="thName" value="${REG.esc(design.name)}"/></div>
      <div class="pal-grid7">${T.PALETTES.map(p =>
        `<button class="swatch${th.palette === p.key ? " on" : ""}" data-pal="${p.key}" title="${p.name}"><span style="background:${p.primary}"></span><span style="background:${p.primaryContainer}"></span><span style="background:${p.secondaryContainer}"></span><span style="background:${p.surfaceContainerHighest}"></span><i>${p.name}</i></button>`).join("")}
      </div>
      <div class="frow"><label>深色模式</label><label class="ckb"><input type="checkbox" id="thDark"${th.dark ? " checked" : ""}/><span></span></label></div>
      <div class="frow"><label>形状</label><div class="seg">
        ${[["square", "方形"], ["rounded", "圆角"], ["full", "全圆"]].map(([v, n]) => `<button data-shape="${v}" class="${th.shape === v ? "on" : ""}">${n}</button>`).join("")}
      </div></div>
      <div class="hint" style="margin-top:8px;">提示词目标平台在底部「代码」面板中选择。</div>`;
    panel.querySelector("#thName").addEventListener("input", e => {
      design.name = e.target.value;
      $("#projName").textContent = design.name;
      markDirty();
    });
    panel.querySelector("#thDark").addEventListener("change", e => {
      pushHistory(); design.theme.dark = e.target.checked; renderAll(); autosave();
    });
    $$("#themepanel [data-pal]").forEach(b => b.addEventListener("click", () => {
      pushHistory(); design.theme.palette = b.dataset.pal; renderThemePanel(); renderAll(); autosave();
    }));
    $$("#themepanel [data-shape]").forEach(b => b.addEventListener("click", () => {
      pushHistory(); design.theme.shape = b.dataset.shape; renderThemePanel(); renderAll(); autosave();
    }));
  }

  /* ================= 顶层工具栏 ================= */
  function initToolbar() {
    $("#btnNew").addEventListener("click", () => {
      showModal({
        title: "新建设计",
        message: "将创建一个只含一个手机屏幕的新设计。当前未保存的内容将丢失（可用撤销恢复）。",
        okText: "新建", danger: true,
        onOk: () => {
          pushHistory();
          design = newDesign();
          curPageId = design.pages[0].id;
          sel.clear();
          renderAll(); autosave();
          const pn = $("#projName");
          if (!pn.querySelector("input")) pn.textContent = design.name;
          toast("已新建设计");
        },
      });
    });
    $("#btnOpen").addEventListener("click", openProject);
    $("#btnSave").addEventListener("click", saveProject);
    $("#btnUndo").addEventListener("click", undo);
    $("#btnRedo").addEventListener("click", redo);
    $("#btnZoomOut").addEventListener("click", () => { zoom = Math.max(0.1, zoom - 0.1); applyTransform(); });
    $("#btnZoomIn").addEventListener("click", () => { zoom = Math.min(3, zoom + 0.1); applyTransform(); });
    $("#btnFit").addEventListener("click", fitView);
    /* 点击缩放百分比 = 恢复 100%（保持当前视口中心不动） */
    $("#zoomPct").addEventListener("click", () => {
      const vp = $("#viewport").getBoundingClientRect();
      const cx = vp.width / 2, cy = vp.height / 2;
      const wx = (cx - panX) / zoom, wy = (cy - panY) / zoom;
      zoom = 1; panX = cx - wx; panY = cy - wy;
      applyTransform();
    });
    $("#btnTheme").addEventListener("click", e => {
      e.stopPropagation();
      $("#exportpanel").classList.remove("open");
      renderThemePanel();
      $("#themepanel").classList.toggle("open");
    });
    $("#btnPreview").addEventListener("click", previewPage);
    $("#btnAddPhone").addEventListener("click", () => openNewPageModal("phone"));
    $("#btnAddDesktop").addEventListener("click", () => openNewPageModal("desktop"));
    $("#toolSelect").addEventListener("click", () => setTool("select"));
    $("#toolHand").addEventListener("click", () => setTool("hand"));
    $("#palSearch").addEventListener("input", renderPalette);
  }
  function setTool(t) {
    $("#toolSelect").classList.toggle("on", t === "select");
    $("#toolHand").classList.toggle("on", t === "hand");
    $("#viewport").style.cursor = t === "hand" ? "grab" : "default";
  }
  function fitView() {
    const vp = $("#viewport").getBoundingClientRect();
    const s = T.pageSize(curPage());
    zoom = Math.min((vp.width - 80) / s.w, (vp.height - 80) / s.h, 1.5);
    panX = (vp.width - s.w * zoom) / 2;
    panY = (vp.height - s.h * zoom) / 2;
    applyTransform();
  }

  /* ================= 快捷键 ================= */
  let spaceDown = false;
  function initKeys() {
    document.addEventListener("keydown", e => {
      const modal = $("#modal");
      if (modal && modal.classList.contains("open")) {
        /* 模态弹窗打开时，快捷键交给弹窗处理 */
        if (e.key === "Escape" || e.key === "Enter") { /* showModal 自己监听 */ }
        return;
      }
      if (e.code === "Space" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) {
        spaceDown = true;
        $("#viewport").style.cursor = "grab";
      }
      const inField = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
      if (e.ctrlKey || e.metaKey) {
        const k = e.key.toLowerCase();
        if (k === "z") { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
        if (k === "y") { e.preventDefault(); redo(); return; }
        if (k === "c") { if (!inField) { e.preventDefault(); doCopy(); } return; }
        if (k === "v") { if (!inField) { e.preventDefault(); doPaste(); } return; }
        if (k === "d") { if (!inField) { e.preventDefault(); doDuplicate(); } return; }
        if (k === "g") { if (!inField) { e.preventDefault(); e.shiftKey ? ungroupSelection() : groupSelection(); } return; }
        if (k === "s") { e.preventDefault(); saveProject(); return; }
        if (k === "o") { e.preventDefault(); openProject(); return; }
        return;
      }
      if (inField) return;
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); doDelete(); return; }
      if (e.key === "Escape") {
        if ($("#previewOverlay").classList.contains("open")) { $("#previewOverlay").classList.remove("open"); return; }
        sel.clear(); renderSelection(); hideCtxMenu(); return;
      }
      if (e.key.startsWith("Arrow") && sel.size) {
        e.preventDefault();
        const d = e.shiftKey ? 8 : 1;
        const dx = e.key === "ArrowLeft" ? -d : e.key === "ArrowRight" ? d : 0;
        const dy = e.key === "ArrowUp" ? -d : e.key === "ArrowDown" ? d : 0;
        pushHistory();
        for (const it of selItems()) { it.x += dx; it.y += dy; redrawItem(it); }
        renderSelectionLight(); autosave();
        return;
      }
      if (e.key === "p" || e.key === "P") { previewPage(); }
      if (e.key === "0") { fitView(); }
      if (e.key === "+" || e.key === "=") { zoom = Math.min(3, zoom + 0.1); applyTransform(); }
      if (e.key === "-") { zoom = Math.max(0.1, zoom - 0.1); applyTransform(); }
    });
    document.addEventListener("keyup", e => {
      if (e.code === "Space") { spaceDown = false; setTool($("#toolHand").classList.contains("on") ? "hand" : "select"); }
    });
  }

  /* ================= 渲染总入口 ================= */
  function renderAll() {
    renderCanvas();
    renderPages();
    renderSelection();
    const pn = $("#projName");
    if (!pn.querySelector("input")) pn.textContent = design.name;
    if ($("#right").classList.contains("mode-code")) renderCode();
  }

  /* ================= 启动 ================= */
  function injectBase() {
    /* M3 Expressive 组件样式（画布预览与导出同源） */
    const st = document.createElement("style");
    st.id = "m3estyle";
    st.textContent = window.M3E_STYLE.CSS;
    document.head.appendChild(st);
    /* 顶部/侧栏的 data-ic 图标 */
    $$("[data-ic]").forEach(el => { el.innerHTML = svg(el.dataset.ic, 18); });
    /* 页面/图层操作按钮 */
    $("#pgNew").addEventListener("click", () => openNewPageModal("phone"));
    /* 图层排序按钮 + 新建图层 */
    $("#lyNew").addEventListener("click", () => {
      pushHistory();
      const page = curPage();
      if (!page.groups) page.groups = [];
      const g = { id: T.uid(), name: `图层 ${page.groups.length + 1}`, popup: false };
      page.groups.push(g);
      layersExpanded.add(g.id);
      renderLayers(); autosave();
      toast(`已创建「${g.name}」：选中组件后在属性面板「所属图层」中加入`);
    });
    $("#lyTop").addEventListener("click", () => reorder("top"));
    $("#lyUp").addEventListener("click", () => reorder("up"));
    $("#lyDown").addEventListener("click", () => reorder("down"));
    $("#lyBottom").addEventListener("click", () => reorder("bottom"));
  }

  function boot() {
    injectBase();
    bindProjName();
    loadWidgets();
    /* 恢复自动保存 */
    let restored = false;
    try {
      const raw = localStorage.getItem("m3e_designer_autosave");
      if (raw) { const d = JSON.parse(raw); if (d && d.pages && d.pages.length) { design = normalizeDesign(d); restored = true; } }
    } catch (e) { /* 忽略 */ }
    if (!design) design = newDesign();
    curPageId = design.pages[0].id;

    /* 示例内容（仅全新时） */
    if (!restored && !design.pages[0].items.length) sampleContent();

    renderPalette();
    renderCatRail();
    initCanvas();
    initToolbar();
    initThemePanel();
    initExportPanel();
    initPreview();
    initCodePanel();
    initKeys();
    renderAll();
    fitView();
    updateEditButtons();
    Bridge.setTitle(design.name + " — gw Designer");
  }

  /* 示例屏幕：手机 + 桌面各一 */
  function sampleContent() {
    const p = design.pages[0];
    p.name = "首页";
    const A = (kind, x, y, extra) => {
      const it = REG.create(kind, x, y, design.theme);
      if (extra) Object.assign(it, extra);
      p.items.push(it);
      return it;
    };
    A("topAppBar", 0, 0);
    A("searchBar", T.MARGIN, T.APPBAR_H + 16);
    A("card", T.MARGIN, T.APPBAR_H + 88, { label: "今日推荐食谱", supporting: "20 分钟 · 简单 · 2 人份" });
    A("listItem", T.MARGIN, T.APPBAR_H + 327, { label: "早餐", icon: "bakery_dining" });
    A("listItem", T.MARGIN, T.APPBAR_H + 401, { label: "午餐", icon: "ramen_dining" });
    A("bottomNav", 0, T.PHONE_H - T.BOTTOMNAV_H);
    A("fab", T.PHONE_W - 16 - 56, T.PHONE_H - T.BOTTOMNAV_H - 16 - 56, { icon: "add" });
  }

  document.addEventListener("DOMContentLoaded", boot);
})();
