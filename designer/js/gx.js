/* gw Designer — uiverse.io/galaxy 社区组件运行时
 * 数据由 tools/gengalaxy.mjs 预生成：manifest.js（清单，随页面加载）+ <分类>.js（懒加载）。
 * 职责：按需加载分类数据 → 建立 id 索引 → 搜索；为面板实时预览注入样式（画布/导出
 * 的样式随组件条目自带，不走这里）。 */
(function () {
  "use strict";
  const M = window.M3E_GX_MANIFEST || { cats: [], total: 0 };
  const DATA = (window.M3E_GX_DATA = window.M3E_GX_DATA || {});

  const index = {};          // id → { id, n, a, t, cat, h, c }
  const byCat = {};          // cat → [{...}]
  let loaded = false, loading = false;
  let waiters = [];
  const cssInjected = {};    // 预览样式去重
  let prevStyleEl = null;

  function absorb(catKey) {
    const list = DATA[catKey] || [];
    const out = [];
    for (const e of list) {
      const c = { id: e[0], n: e[1], a: e[2], t: e[3], cat: catKey, h: e[4], c: e[5] };
      index[c.id] = c;
      out.push(c);
    }
    byCat[catKey] = out;
  }

  /** 确保全部分类数据就绪（本地脚本，串行注入，秒级内完成） */
  function ensure(cb) {
    if (loaded) { if (cb) cb(); return; }
    if (cb) waiters.push(cb);
    if (loading) return;
    loading = true;
    const keys = (M.cats || []).map(c => c.key);
    let i = 0;
    (function next() {
      if (i >= keys.length) {
        loaded = true; loading = false;
        const ws = waiters; waiters = [];
        ws.forEach(f => { try { f(); } catch (e) { /* 回调异常不阻塞 */ } });
        return;
      }
      const key = keys[i++];
      if (byCat[key]) { next(); return; }
      const s = document.createElement("script");
      s.src = "js/gx/" + key + ".js";
      s.onload = () => { absorb(key); next(); };
      s.onerror = () => { console.error("社区组件分类加载失败：" + key); next(); };
      document.head.appendChild(s);
    })();
  }

  function get(id) { return index[id] || null; }
  function catList(key) { return byCat[key] || []; }
  function all() { return Object.keys(byCat).flatMap(k => byCat[k]); }

  /** 搜索：名称 / 作者 / 标签 / 分类名 */
  function search(q, limit) {
    q = (q || "").trim().toLowerCase();
    if (!q) return [];
    const cap = limit || 240;
    const out = [];
    for (const c of all()) {
      if (c.n.toLowerCase().includes(q) || (c.a && c.a.toLowerCase().includes(q)) ||
          (c.t && c.t.includes(q)) || c.cat.includes(q)) {
        out.push(c);
        if (out.length >= cap) break;
      }
    }
    return out;
  }

  /** 把组件样式注入面板预览样式表（画布/导出不经过这里，样式随条目自带） */
  function injectPreviewCss(comp) {
    if (cssInjected[comp.id]) return;
    cssInjected[comp.id] = true;
    if (!prevStyleEl || !prevStyleEl.isConnected) {
      prevStyleEl = document.getElementById("gxPrevCss");
      if (!prevStyleEl) {
        prevStyleEl = document.createElement("style");
        prevStyleEl.id = "gxPrevCss";
        document.head.appendChild(prevStyleEl);
      }
    }
    prevStyleEl.appendChild(document.createTextNode(comp.c + "\n"));
  }

  /** 面板预览：容器内渲染自然尺寸并整体缩放适配；返回 { w, h } 自然尺寸
   *  comp.cls 为样式作用域类（gx 组件 = 其 id；代码组件为保存时的类名） */
  function renderPreview(box, comp) {
    const cls = comp.cls || comp.id;
    box.innerHTML = `<div class="gx-pv"><div class="${cls}" style="display:block">${comp.h}</div></div>`;
    injectPreviewCss(comp);
    const fit = () => {
      const inner = box.querySelector("." + cls);
      if (!inner) return;
      let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9;
      for (const el of [inner, ...inner.querySelectorAll("*")]) {
        const r = el.getBoundingClientRect();
        if (r.width || r.height) {
          x1 = Math.min(x1, r.left); y1 = Math.min(y1, r.top);
          x2 = Math.max(x2, r.right); y2 = Math.max(y2, r.bottom);
        }
      }
      if (x2 <= x1 || y2 <= y1) return;
      const w = Math.round(Math.min(520, Math.max(32, x2 - x1)));
      const h = Math.round(Math.min(640, Math.max(24, y2 - y1)));
      const bw = box.clientWidth - 10, bh = box.clientHeight - 10;
      const s = Math.min(1, bw / w, bh / h);
      const pv = box.querySelector(".gx-pv");
      if (pv) pv.style.transform = "scale(" + s.toFixed(3) + ")";
      box.dataset.w = w; box.dataset.h = h;
    };
    /* 样式刚注入，等一帧让浏览器完成布局再测量 */
    requestAnimationFrame(fit);
  }

  window.M3E_GX = {
    manifest: M, ensure, get, catList, all, search, renderPreview,
    get loaded() { return loaded; },
    get loading() { return loading; },
  };
})();
