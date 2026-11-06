/* gw Designer — 代码生成
 * 全部为纯字符串函数（可在 Node 中直接单测）：
 *   itemHTML / pageHTML / htmlDoc   → 独立 HTML 文件（含交互脚本）
 *   vueSFC                          → Vue 3 单文件组件
 *   prompt                          → 给 AI 编程工具的中文提示词
 *   itemSnippet                     → 单组件代码块（html / vue / json） */
(function () {
  "use strict";
  const T = window.M3E_TOKENS;
  const R = () => window.M3E_REG;
  const CSS = () => window.M3E_STYLE.CSS;

  const esc = s => R().esc(s);
  const safeId = s => "u" + String(s).replace(/[^a-zA-Z0-9]/g, "");

  /* ---------- 条目 ---------- */
  function itemHTML(it, opts) {
    const reg = R();
    it._theme = it._theme || (opts && opts.theme) || { shape: "rounded" };
    const shell = reg.shellStyle(it);
    const act = it.action ? ` data-link="${esc(it.action)}"` : "";
    const note = it.note ? ` data-note="${esc(it.note)}"` : "";
    return `<div class="m3e-item" style="${shell}"${act}${note}>${reg.defs[it.kind].render(it)}</div>`;
  }

  /** 仅条目内部标记（画布 DOM 用，外壳由画布自己管理） */
  function itemInner(it, opts) {
    const reg = R();
    it._theme = it._theme || (opts && opts.theme) || { shape: "rounded" };
    return reg.defs[it.kind].render(it);
  }

  function pageVarsStyle(theme, page) {
    const scheme = T.activeScheme(theme);
    const vars = T.schemeVars(scheme);
    let s = "";
    for (const k in vars) s += `${k}:${vars[k]};`;
    if (page && page.bg) s += `background:${page.bg};`;
    return s;
  }

  function pageHTML(page, design, opts) {
    const size = T.pageSize(page);
    const theme = design.theme;
    const radius = page.kind === "desktop" ? T.DESKTOP_R : T.PHONE_R;
    const items = page.items.map(it => itemHTML(it, { theme })).join("\n      ");
    return `<div class="m3e-export-frame">
    <div class="m3e-page" id="page-${esc(page.id)}" style="${pageVarsStyle(theme, page)}width:${size.w}px;height:${size.h}px;border-radius:${radius}px;">
      ${items}
    </div>
  </div>`;
  }

  /* ---------- 导出 HTML 的交互脚本 ---------- */
  function interScript(responsive) {
    return `
  // —— gw Designer 导出交互 ——
  (function () {
  function wire() {
  document.querySelectorAll('[data-act="toggle"]').forEach(function (el) {
    el.addEventListener('click', function () { el.classList.toggle('on'); });
  });
  document.querySelectorAll('[data-act="radio"]').forEach(function (el) {
    el.addEventListener('click', function () {
      el.parentElement.querySelectorAll('[data-act="radio"]').forEach(function (o) { o.classList.remove('on'); });
      el.classList.add('on');
    });
  });
  document.querySelectorAll('[data-act="tabs"]').forEach(function (root) {
    var kids = root.querySelectorAll('[data-tab]');
    kids.forEach(function (k) {
      k.addEventListener('click', function () {
        kids.forEach(function (o) { o.classList.remove('sel'); });
        k.classList.add('sel');
      });
    });
  });
  document.querySelectorAll('[data-act="slider"]').forEach(function (root) {
    var fil = root.querySelector('.fil'), hnd = root.querySelector('.hnd');
    function set(p) {
      p = Math.max(0, Math.min(100, p));
      if (fil) fil.style.width = 'calc(' + p + '% - 2px)';
      if (hnd) hnd.style.left = p + '%';
    }
    function fromEvent(e) {
      var r = root.getBoundingClientRect();
      set((e.clientX - r.left) / r.width * 100);
    }
    root.style.cursor = 'pointer';
    root.addEventListener('pointerdown', function (e) {
      fromEvent(e);
      function mv(ev) { fromEvent(ev); }
      function up() { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); }
      window.addEventListener('pointermove', mv);
      window.addEventListener('pointerup', up);
    });
  });
  document.querySelectorAll('[data-link]').forEach(function (el) {
    el.addEventListener('click', function () {
      var l = el.getAttribute('data-link');
      if (!l || l === 'closepop' || l.indexOf('popup:') === 0) return; // 弹窗链路单独处理
      var t = document.getElementById('page-' + l);
      if (t) t.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    });
  });
  // 弹窗图层：打开 / 点遮罩关闭 / 成员内「关闭弹窗」
  document.querySelectorAll('[data-link^="popup:"]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      var p = document.getElementById('popup-' + el.getAttribute('data-link').slice(6));
      if (p) p.classList.add('open');
    });
  });
  document.querySelectorAll('.m3e-popup').forEach(function (p) {
    p.addEventListener('click', function (e) { if (e.target === p) p.classList.remove('open'); });
  });
  document.querySelectorAll('[data-link="closepop"]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      var p = el.closest('.m3e-popup');
      if (p) p.classList.remove('open');
    });
  });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();
  })();${responsive ? `
  // —— 自适应：跳转目标在当前视口隐藏时，滚动到同名的可见变体 ——
  (function () {
    function visible(el) { return !!(el && el.offsetParent); }
    document.querySelectorAll('[data-link]').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = el.getAttribute('data-link');
        if (!id) return;
        var t = document.getElementById('page-' + id);
        if (t && !visible(t) && t.getAttribute('data-pname')) {
          var name = t.getAttribute('data-pname');
          var all = document.querySelectorAll('.m3e-page[data-pname]');
          for (var i = 0; i < all.length; i++) {
            if (all[i].getAttribute('data-pname') === name && visible(all[i])) {
              all[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
              break;
            }
          }
        }
      });
    });
  })();` : ""}`;
  }

  /** 条目导出时的 data-act 注入（交互类型） */
  function itemHTMLAct(it, opts) {
    const reg = R();
    const def = reg.defs[it.kind];
    it._theme = it._theme || (opts && opts.theme) || { shape: "rounded" };
    const shell = reg.shellStyle(it);
    const act = it.action ? ` data-link="${esc(it.action)}"` : "";
    let inner = def.render(it);
    if (def.inter === "toggle") inner = inner.replace(/^<(\w+)/, '<$1 data-act="toggle"');
    else if (def.inter === "radio") inner = inner.replace(/^<(\w+)/, '<$1 data-act="radio"');
    else if (def.inter === "slider") inner = inner.replace(/^<div/, '<div data-act="slider"');
    else if (def.inter === "tabs" && def.tabsMeta) {
      /* 页签类组件：根元素标 data-act，子项标 data-tab，interScript 据此接线 */
      inner = inner.replace(/^<(\w+)/, '<$1 data-act="tabs"');
      const tm = def.tabsMeta(it, reg);
      if (tm.child) inner = inner.replace(new RegExp(`class="(${tm.child}(?: [^"]*)?)"`, "g"), 'data-tab class="$1"');
    }
    return { shell, act, inner };
  }

  /** 带交互的条目 HTML（htmlDoc 内部用） */
  function itemHTMLi(it, opts) {
    const p = itemHTMLAct(it, opts);
    return `<div class="m3e-item" style="${p.shell}"${p.act}>${p.inner}</div>`;
  }

  /* ---------- 页面条目渲染：普通条目 + 弹窗图层 ---------- */
  function renderPageItems(page, theme, wrapPopups) {
    const groups = page.groups || [];
    const popupGroups = groups.filter(g => g.popup);
    const inPopup = it => it.gid && popupGroups.some(g => g.id === it.gid);
    let html = "";
    for (const it of page.items) {
      if (!inPopup(it)) html += itemHTMLi(it, { theme }) + "\n      ";
    }
    if (wrapPopups) {
      for (const g of popupGroups) {
        const members = page.items.filter(it => it.gid === g.id);
        const inner = members.map(it => itemHTMLi(it, { theme })).join("\n        ");
        html += `<div class="m3e-popup" id="popup-${esc(g.id)}">\n        ${inner}\n      </div>\n      `;
      }
    }
    return html;
  }

  /* ---------- 完整 HTML 文档 ---------- */
  function htmlDoc(design, opts) {
    opts = opts || {};
    const pages = opts.pages || design.pages;
    const responsive = !!opts.responsive;
    /* 响应式模式：同名页面（手机稿 + 桌面稿）合并为一个框架双宽并置，媒体查询按视口切换；
     * 跳转目标在当前视口隐藏时，interScript 的回退逻辑滚动到同名可见变体。 */
    const nameCount = {};
    pages.forEach(p => { const n = String(p.name); nameCount[n] = (nameCount[n] || 0) + 1; });
    const emitted = new Set();
    const frames = [];
    for (const p of pages) {
      const size = T.pageSize(p);
      const radius = p.kind === "desktop" ? T.DESKTOP_R : T.PHONE_R;
      const items = renderPageItems(p, design.theme, true);
      const merged = responsive && nameCount[String(p.name)] > 1;
      if (merged && emitted.has(String(p.name))) continue;
      if (merged) emitted.add(String(p.name));
      const devCls = merged ? ` m3e-page-dev-${p.kind === "desktop" ? "desktop" : "phone"}` : "";
      const pname = merged ? ` data-pname="${esc(p.name)}"` : "";
      frames.push(`  <div class="m3e-export-frame">
  <div class="m3e-page${devCls}" id="page-${esc(p.id)}"${pname} style="${pageVarsStyle(design.theme, p)}width:${size.w}px;height:${size.h}px;border-radius:${radius}px;">
      ${items}
    </div>
  </div>`);
    }
    const respCss = responsive ? `
/* —— 同名页面双宽自适应：≤900px 显示手机稿，>900px 显示桌面稿 —— */
@media (max-width: 900px){ .m3e-page-dev-desktop{display:none;} }
@media (min-width: 901px){ .m3e-page-dev-phone{display:none;} }` : "";

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${esc(design.name || "M3E 页面")}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
*{margin:0;padding:0;}
${CSS()}${respCss}
</style>
</head>
<body class="m3e-export-body">
${frames.join("\n")}
<script>
${interScript(responsive)}
</script>
</body>
</html>`;
  }

  /* ---------- Vue SFC（单页） ---------- */
  /** 页签类组件的 Vue 交互标记（tabsMeta 数据驱动）；返回 null 表示保持静态渲染。
   *  供 vueSFC（整页）与 itemSnippet（单组件）共用。 */
  function tabsVue(it, def, id, setupArr) {
    if (def.inter !== "tabs" || def.tabsMeta === null) return null;
    const tabs = it.tabs || [];
    setupArr.push(`const sel_${id} = ref(${it.selected || 0});`);
    const tm = def.tabsMeta
      ? def.tabsMeta(it, R())
      : { wrap: `m3e-tabs${it.indStyle === "underline" ? " underline" : ""}`, child: "tab" };
      const itemTpl = tabs.map((t, i) => {
        const ind = tm.ind ? `<div class="ind">${R().ic(t.icon, 24, i === it.selected)}</div>` : (t.icon ? R().ic(t.icon, 18) : "");
        const label = tm.label === "" ? "" : `<span${tm.label ? ` class="${tm.label}"` : ""}>${esc(t.label)}</span>`;
        /* 子项必须是带 class 的 div：此前输出 <dest> 等非标标签，.dest 样式挂不上 */
        return `<div class="${tm.child}" :class="{sel: sel_${id}===${i}}" @click="sel_${id}=${i}">${ind}${label}</div>`;
      }).join("");
    return `<div class="${tm.wrap}">${tm.pre || ""}${itemTpl}</div>`;
  }

  function vueSFC(page, design) {
    const reg = R();
    const theme = design.theme;
    const setup = [];
    const mounted = [];

    function renderV(it) {
      const def = reg.defs[it.kind];
      it._theme = theme;
      const shell = reg.shellStyle(it);
      const act = it.action ? ` data-link="${esc(it.action)}"` : "";
      let inner;
      const id = safeId(it.id);

      if (def.inter === "toggle") {
        setup.push(`const ${id} = ref(${!!it.checked});`);
        inner = def.render(it).replace(/^<(\w+)/, `<$1 @click="${id}=!${id}" :class="{on:${id}}"`)
          .replace(/ class="([^"]*?) ?on"/, ' class="$1"');
      } else if (def.inter === "radio") {
        setup.push(`const ${id} = ref(${!!it.checked});`);
        inner = def.render(it).replace(/^<(\w+)/, `<$1 @click="${id}=true" :class="{on:${id}}"`)
          .replace(/ class="([^"]*?) ?on"/, ' class="$1"');
      } else if (def.inter === "tabs") {
        /* 页签类组件：结构由各组件的 tabsMeta 钩子描述（wrap/child/ind/label/pre），
         * 生成可交互的 Vue 绑定；tabsMeta === null（如步骤条）保持静态渲染 */
        const t2 = tabsVue(it, def, id, setup);
        inner = t2 == null ? def.render(it) : t2;
      } else if (def.inter === "slider") {
        inner = def.render(it).replace(/^<div/, `<div data-act="slider" data-sid="${id}"`);
        mounted.push(`bindSlider(document.querySelector('[data-sid="${id}"]'));`);
      } else {
        inner = def.render(it);
      }
      return `<div class="m3e-item" style="${shell}"${act}>${inner}</div>`;
    }

    /* 弹窗图层：成员归入遮罩容器，普通条目在外 */
    const groups = page.groups || [];
    const popupGroups = groups.filter(g => g.popup);
    const inPopup = it => it.gid && popupGroups.some(g => g.id === it.gid);
    let items = "";
    for (const it of page.items) {
      if (!inPopup(it)) items += renderV(it) + "\n    ";
    }
    for (const g of popupGroups) {
      setup.push(`const pop_${safeId(g.id)} = ref(false)`);
      /* 只渲染属于本弹窗的成员；此前误用 map 全量渲染，
       * 会把非弹窗组件的 ref 声明重复写入（SFC 编译报错）并串组 */
      const members = page.items.filter(it => it.gid === g.id).map(renderV).join("\n      ");
      items += `<div class="m3e-popup" :class="{open: pop_${safeId(g.id)}}" @click.self="pop_${safeId(g.id)}=false">\n      ${members}\n    </div>\n    `;
    }
    if (popupGroups.length) {
      setup.push(`const popupRefs = { ${popupGroups.map(g => `'${g.id}': pop_${safeId(g.id)}`).join(", ")} }`);
    }
    /* 自定义组件携带的 Vue 脚本（样式已由组件 render 内嵌，不再重复追加） */
    const userScripts = page.items.filter(i => i.kind === "customHtml" && i.vueScript).map(i => ({ id: i.id, s: i.vueScript }));
    if (userScripts.length) setup.push(`/* —— 导入组件脚本 —— */\n` + userScripts.map(u => `/* 组件 ${u.id} */\n` + u.s).join("\n"));
    const size = T.pageSize(page);
    const radius = page.kind === "desktop" ? T.DESKTOP_R : T.PHONE_R;

    return `<!--
  gw Designer 导出 — 页面「${page.name}」(${size.w}×${size.h})
  使用：Vue 3 <script setup>。交互（开关/页签/滑块）已内置。
-->
<template>
  <div class="m3e-page page-root" :style="pageStyle">
    ${items}
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
${setup.length ? setup.join("\n") : "// 本页暂无可交互状态"}

const pageStyle = {
  width: '${size.w}px',
  height: '${size.h}px',
  borderRadius: '${radius}px',
 ${Object.entries(T.schemeVars(T.activeScheme(theme))).map(([k, v]) => `  '${k}': '${v}',`).join("\n")}
  ${page.bg ? `background: '${page.bg}',` : ""}
}

function bindSlider(root) {
  if (!root) return
  const fil = root.querySelector('.fil'), hnd = root.querySelector('.hnd')
  function set(p) {
    p = Math.max(0, Math.min(100, p))
    if (fil) fil.style.width = 'calc(' + p + '% - 2px)'
    if (hnd) hnd.style.left = p + '%'
  }
  root.style.cursor = 'pointer'
  root.addEventListener('pointerdown', function (e) {
    const move = function (ev) {
      const r = root.getBoundingClientRect()
      set((ev.clientX - r.left) / r.width * 100)
    }
    move(e)
    const up = function () {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  })
}
function wireExport(rootEl) {
  rootEl.querySelectorAll('[data-act="toggle"]').forEach(function (el) {
    el.addEventListener('click', function () { el.classList.toggle('on') })
  })
  rootEl.querySelectorAll('[data-act="radio"]').forEach(function (el) {
    el.addEventListener('click', function () {
      el.parentElement.querySelectorAll('[data-act="radio"]').forEach(function (o) { o.classList.remove('on') })
      el.classList.add('on')
    })
  })
  rootEl.querySelectorAll('[data-link]').forEach(function (el) {
    var l = el.getAttribute('data-link')
    if (l && l.indexOf('popup:') === 0) {
      el.addEventListener('click', function (e) {
        e.stopPropagation()
        var r = popupRefs[l.slice(6)]
        if (r) r.value = true
      })
    } else if (l === 'closepop') {
      el.addEventListener('click', function (e) {
        e.stopPropagation()
        var p = el.closest('.m3e-popup')
        if (p) {
          var gid = p.id.replace('popup-', '')
          var r = popupRefs[gid]
          if (r) r.value = false
        }
      })
    } else {
      el.addEventListener('click', function () { console.log('跳转到页面:', l) })
    }
  })
}

onMounted(function () {
  wireExport(document.querySelector('.page-root'))
${mounted.length ? mounted.map(m => "  " + m).join("\n") : ""}
})
</script>

<style>
${CSS()}
.page-root{background:${page.bg || "var(--sur)"};margin:0 auto;}
body{margin:0;background:#ECE6F0;display:flex;justify-content:center;align-items:flex-start;padding:24px;min-height:100vh;}
</style>
`;
  }

  /* ---------- React 导出（HTML → JSX 转换 + 函数组件） ---------- */
  const kebab2camel = k => k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());

  /** CSS 内联字符串 → JSX style 对象字面量（自定义属性 --x 保持带引号键） */
  function cssToObj(css) {
    const entries = String(css || "").split(";").map(s => s.trim()).filter(Boolean).map(s => {
      const i = s.indexOf(":");
      if (i < 0) return null;
      const k = kebab2camel(s.slice(0, i).trim());
      const v = s.slice(i + 1).trim();
      return /^[A-Za-z][A-Za-z0-9]*$/.test(k) ? k + ":" + JSON.stringify(v) : JSON.stringify(k) + ":" + JSON.stringify(v);
    }).filter(Boolean);
    return "{" + entries.join(",") + "}";
  }

  /** HTML 片段 → JSX：class→className、style 字符串→对象（SVG 连字符属性由 React 16+ 原生透传） */
  function convertJsx(html) {
    return String(html).replace(/class=/g, "className=").replace(/style="([^"]*)"/g, (m, css) => "style={" + cssToObj(css) + "}");
  }

  /** 根标签的状态类改为按 React 状态拼接，并注入 onClick（inner 需已经过 convertJsx） */
  function reactRootState(inner, id, setExpr, stateCls) {
    const m = inner.match(/^<(\w+)([^>]*)>/);
    if (!m) return inner;
    let attrs = m[2];
    const cm = attrs.match(/\sclassName="([^"]*)"/);
    let base = cm ? cm[1] : "";
    if (cm) attrs = attrs.replace(cm[0], "");
    base = base.replace(new RegExp("(^|\\s)" + stateCls + "(?=\\s|$)"), "").trim();
    const dyn = `className={${id} ? "${base} ${stateCls}" : "${base}"}`;
    return inner.replace(m[0], `<${m[1]}${attrs} ${dyn} onClick={() => ${setExpr}}>`);
  }

  /** 页签类组件的 React 结构（与 tabsVue 同一套 tabsMeta 数据）；返回 null 表示保持静态渲染 */
  function reactTabsInner(it, def, id, setup, reg) {
    if (def.inter !== "tabs" || def.tabsMeta === null) return null;
    const tabs = it.tabs || [];
    setup.push(`  const [sel_${id}, setSel_${id}] = useState(${it.selected || 0});`);
    const tm = def.tabsMeta ? def.tabsMeta(it, reg) : { wrap: `m3e-tabs${it.indStyle === "underline" ? " underline" : ""}`, child: "tab" };
    const items = tabs.map((t, i) => {
      const ind = tm.ind ? `<div className="ind">${reg.ic(t.icon, 24, i === it.selected)}</div>` : (t.icon ? reg.ic(t.icon, 18) : "");
      const label = tm.label === "" ? "" : `<span${tm.label ? ` className="${tm.label}"` : ""}>${esc(t.label)}</span>`;
      return `<div className={"${tm.child}" + (sel_${id}===${i} ? " sel" : "")} onClick={() => setSel_${id}(${i})}>${convertJsx(ind)}${label}</div>`;
    }).join("");
    return `<div className="${tm.wrap}">${tm.pre ? convertJsx(tm.pre) : ""}${items}</div>`;
  }

  const REACT_BIND_SLIDER = `function bindSlider(root) {
  if (!root) return;
  const fil = root.querySelector(".fil"), hnd = root.querySelector(".hnd");
  function set(p) {
    p = Math.max(0, Math.min(100, p));
    if (fil) fil.style.width = "calc(" + p + "% - 2px)";
    if (hnd) hnd.style.left = p + "%";
  }
  root.style.cursor = "pointer";
  root.addEventListener("pointerdown", function (e) {
    const r = root.getBoundingClientRect();
    set((e.clientX - r.left) / r.width * 100);
    const move = function (ev) {
      const r2 = root.getBoundingClientRect();
      set((ev.clientX - r2.left) / r2.width * 100);
    };
    const up = function () {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  });
}`;

  /** React 函数组件（单页）：开关/单选/页签为 React 状态；跳转/弹窗/滑块挂载后接线 */
  function reactJsx(page, design) {
    const reg = R();
    const theme = design.theme;
    const setup = [];
    const sliderLines = [];
    const popupSetters = [];

    function renderX(it) {
      const def = reg.defs[it.kind];
      it._theme = theme;
      const shell = reg.shellStyle(it);
      const act = it.action ? ` data-link="${esc(it.action)}"` : "";
      const id = safeId(it.id);
      const cap = id.charAt(0).toUpperCase() + id.slice(1);
      let inner;
      if (def.inter === "toggle") {
        setup.push(`  const [${id}, set${cap}] = useState(${!!it.checked});`);
        inner = reactRootState(convertJsx(def.render(it)), id, `set${cap}(!${id})`, "on");
      } else if (def.inter === "radio") {
        setup.push(`  const [${id}, set${cap}] = useState(${!!it.checked});`);
        inner = reactRootState(convertJsx(def.render(it)), id, `set${cap}(true)`, "on");
      } else if (def.inter === "tabs") {
        const t2 = reactTabsInner(it, def, id, setup, reg);
        inner = t2 == null ? convertJsx(def.render(it)) : t2;
      } else if (def.inter === "slider") {
        inner = convertJsx(def.render(it)).replace(/^<div/, `<div data-sid="${id}"`);
        sliderLines.push(`    bindSlider(document.querySelector('[data-sid="${id}"]'));`);
      } else {
        inner = convertJsx(def.render(it));
      }
      return `      <div className="m3e-item" style={${cssToObj(shell)}}${act}>\n        ${inner}\n      </div>`;
    }

    const groups = page.groups || [];
    const popupGroups = groups.filter(g => g.popup);
    const inPopup = it => it.gid && popupGroups.some(g => g.id === it.gid);
    const items = [];
    for (const it of page.items) {
      if (!inPopup(it)) items.push(renderX(it));
    }
    for (const g of popupGroups) {
      const pid = safeId(g.id);
      setup.push(`  const [pop_${pid}, setPop_${pid}] = useState(false);`);
      popupSetters.push(`    "${g.id}": setPop_${pid}`);
      const members = page.items.filter(it => it.gid === g.id).map(renderX);
      items.push(`      <div className={"m3e-popup" + (pop_${pid} ? " open" : "")} data-gid="${esc(g.id)}" onClick={e => { if (e.target === e.currentTarget) setPop_${pid}(false); }}>\n${members.join("\n")}\n      </div>`);
    }
    const size = T.pageSize(page);
    const radius = page.kind === "desktop" ? T.DESKTOP_R : T.PHONE_R;
    const varsEntries = Object.entries(T.schemeVars(T.activeScheme(theme))).map(([k, v]) => `  "${k}": "${v}",`).join("\n");
    const comp = "Page_" + safeId(page.id);
    const hasPopup = popupGroups.length > 0;
    const wireBody = `    root.querySelectorAll('[data-link]').forEach(function (el) {
      const l = el.getAttribute("data-link");
      if (!l) return;
      if (l.indexOf("popup:") === 0) {
        el.addEventListener("click", function (e) {
          e.stopPropagation();
          const setter = popupSetters[l.slice(6)];
          if (setter) setter(true);
        });
      } else if (l === "closepop") {
        el.addEventListener("click", function (e) {
          e.stopPropagation();
          const p = el.closest(".m3e-popup");
          if (p && p.getAttribute("data-gid")) {
            const setter = popupSetters[p.getAttribute("data-gid")];
            if (setter) setter(false);
          }
        });
      } else {
        el.addEventListener("click", function () { console.log("跳转到页面:", l); });
      }
    });`;

    return `/*
  gw Designer 导出 — 页面「${page.name}」(${size.w}×${size.h})
  React 18 函数组件：开关/单选/页签为 React 状态；跳转、弹窗遮罩、滑块在挂载后接线。
  用法：import ${comp} from "./${page.name}.jsx"; 渲染 <${comp} />（需 react / react-dom 18+）。
*/
import { useState, useEffect } from "react";

${REACT_BIND_SLIDER}

const pageStyle = {
  width: "${size.w}px",
  height: "${size.h}px",
  borderRadius: "${radius}px",
${varsEntries}
  ${page.bg ? `"background": "${page.bg}",` : ""}
};

export default function ${comp}() {
${setup.join("\n")}${hasPopup ? `\n  const popupSetters = {\n${popupSetters.join(",\n")}\n  };` : ""}

  useEffect(() => {
    const root = document.querySelector(".page-root");
    if (!root) return;
${wireBody}
${sliderLines.join("\n")}
  }, []);

  return (
    <>
      <style>{css}</style>
      <div className="m3e-page page-root" style={pageStyle}>
${items.join("\n")}
      </div>
    </>
  );
}

const css = \`
${CSS()}
\`;
`;
  }

  /* ---------- 主题令牌导出 ---------- */
  function themeTokensCss(design) {
    const vars = T.schemeVars(T.activeScheme(design.theme));
    let s = `/* gw Designer 设计令牌 — ${design.name || "未命名"}（${design.theme.dark ? "深色" : "浅色"} / ${design.theme.palette} / ${design.theme.shape}） */\n:root{\n`;
    for (const k in vars) s += `  ${k}: ${vars[k]};\n`;
    return s + "}\n";
  }
  function themeTokensJson(design) {
    return JSON.stringify({
      __m3eTokens: 1,
      name: design.name,
      theme: design.theme,
      colors: T.schemeVars(T.activeScheme(design.theme)),
      geometry: {
        phone: { w: T.PHONE_W, h: T.PHONE_H, radius: T.PHONE_R },
        desktop: { w: T.DESKTOP_W, h: T.DESKTOP_H, radius: T.DESKTOP_R },
        margin: T.MARGIN,
      },
    }, null, 2);
  }

  /* ---------- 位置描述（提示词用） ---------- */
  function posDesc(it, page) {
    const size = T.pageSize(page);
    const h = [];
    if (it.x <= 4 && it.w < size.w - 8) h.push("左侧贴边");
    else if (Math.abs(it.x + it.w - size.w) <= 4 && it.w < size.w - 8) h.push("右侧贴边");
    else if (Math.abs(it.x - (size.w - it.w) / 2) < 10 && it.w < size.w - 20) h.push("水平居中");
    if (it.y <= 2) h.push("顶部贴边");
    else if (Math.abs(it.y + it.h - size.h) <= 4) h.push("底部贴边");
    const base = `距左 ${it.x}、距上 ${it.y}，宽 ${it.w}、高 ${it.h}`;
    return h.length ? `${h.join("、")}（${base}）` : base;
  }

  /* ---------- 提示词 ---------- */
  function prompt(design, opts) {
    opts = opts || {};
    const pages = opts.pages || design.pages;
    const th = design.theme;
    const pal = T.PALETTES.find(p => p.key === th.palette) || T.PALETTES[0];
    const scheme = T.activeScheme(th);
    const targetTxt = {
      vue: "请实现为一个 **Vue 3（<script setup>）单文件组件** 的网页应用（可用 Vite 搭建，每个屏幕一个 .vue 页面组件）。",
      html: "请实现为一个**纯 HTML + CSS（可加少量原生 JS）的静态网页**，不依赖任何框架与构建工具。",
      web: "请实现为一个 Web 网页界面，技术栈不限（推荐 Vue 3 或 React），要求界面与下方描述一致。",
      compose: "请实现为一个 **Android Jetpack Compose (Kotlin)** 应用界面，使用 Material 3（androidx.compose.material3），每个屏幕一个 @Composable。",
      flutter: "请实现为一个 **Flutter (Dart)** 应用界面，Material 3（useMaterial3: true），每个屏幕一个页面 Widget。",
    }[opts.target || "vue"];
    const navNote = {
      vue: "（Vue 用 router 或组件切换）",
      compose: "（Compose 用 Navigation-Compose 在屏幕间导航）",
      flutter: "（Flutter 用 Navigator 路由）",
    }[opts.target] || "（按所选技术实现屏幕间导航）";

    const L = [];
    L.push(`请根据以下设计描述，实现一个 **Material 3 Expressive 风格** 的界面。`);
    L.push(targetTxt);
    L.push("");
    L.push(`## 设计系统`);
    L.push(`- 项目名称：${design.name || "未命名设计"}`);
    L.push(`- 风格：Material 3 Expressive，组件大而圆润（按钮高 56、胶囊圆角），动效柔和。`);
    L.push(`- 配色方案「${pal.name}」（${th.dark ? "深色" : "浅色"}模式，形状：${{ square: "方形", rounded: "圆角", full: "全圆/胶囊" }[th.shape]}），核心色值：`);
    L.push(`  - primary ${scheme.primary} / onPrimary ${scheme.onPrimary} / primaryContainer ${scheme.primaryContainer}`);
    L.push(`  - surface ${scheme.surface} / surfaceContainer ${scheme.surfaceContainer} / surfaceContainerHighest ${scheme.surfaceContainerHighest}`);
    L.push(`  - onSurface ${scheme.onSurface} / onSurfaceVariant ${scheme.onSurfaceVariant} / outline ${scheme.outline} / outlineVariant ${scheme.outlineVariant}`);
    L.push(`  - secondaryContainer ${scheme.secondaryContainer} / onSecondaryContainer ${scheme.onSecondaryContainer} / error ${scheme.error}`);
    L.push(`- 字体：Roboto（中文回退系统字体），正文 14–16px，标题 22px。间距使用 4/8/16 的倍数（dp）。`);
    L.push(`- 图标：Material Symbols（Outlined/Rounded），按名称给出。`);

    for (const p of pages) {
      const size = T.pageSize(p);
      L.push("");
      L.push(`## 屏幕「${p.name}」（${p.kind === "desktop" ? "桌面" : "手机"} ${size.w}×${size.h}${p.bg ? `，背景色 ${p.bg}` : ""}）`);
      if (!p.items.length) { L.push(`（空屏幕）`); continue; }
      const groups = p.groups || [];
      const gName = gid => (groups.find(g => g.id === gid) || {}).name || "编组";
      const isPopupGid = gid => groups.some(g => g.id === gid && g.popup);
      L.push(`组件从底到顶依次为：`);
      p.items.forEach((it, idx) => {
        const def = R().defs[it.kind];
        let line = `${idx + 1}. ${def.desc(it)}；位置：${posDesc(it, p)}`;
        if (it.gid && isPopupGid(it.gid)) line += `；属于弹窗图层「${gName(it.gid)}」（默认隐藏）`;
        else if (it.gid && groups.some(g => g.id === it.gid)) line += `；属于编组「${gName(it.gid)}」`;
        if (it.note) line += `；行为：${it.note}`;
        if (it.action) {
          if (it.action.indexOf("popup:") === 0) {
            const g = groups.find(x => x.id === it.action.slice(6));
            if (g) line += `；点击后打开弹窗图层「${g.name}」`;
          } else if (it.action === "closepop") {
            line += `；点击后关闭所在弹窗`;
          } else {
            const target = pages.find(x => x.id === it.action);
            if (target) line += `；点击后跳转到屏幕「${target.name}」`;
          }
        }
        L.push(line);
        /* 代码组件：把实际 HTML/CSS 附给 AI（社区组件/导入组件） */
        if (it.kind === "customHtml" && (it.html || it.css)) {
          L.push("   其代码为（样式已作用域隔离，还原时可直接内联）：");
          L.push("   ```html");
          L.push((it.css ? `<style>\n${it.css}\n</style>\n` : "") + (it.html || ""));
          L.push("   ```");
        }
      });
      for (const g of groups.filter(g => g.popup)) {
        const members = p.items.filter(it => it.gid === g.id);
        if (members.length) L.push(`弹窗图层「${g.name}」：由上述标注的 ${members.length} 个组件组成，默认隐藏；用户点击绑定了「打开弹窗」的控件后，以半透明黑色遮罩覆盖全屏并显示这些组件（遮罩之上），点击遮罩空白处或弹层内的「关闭」控件关闭。`);
      }
    }

    L.push("");
    L.push(`## 实现要求`);
    L.push(`- 严格按上述颜色令牌设置配色（CSS 变量或主题对象），控件圆角、高度与描述一致。`);
    L.push(`- 布局使用 Flex，按照每个组件的位置描述还原（贴边/居中/间距），保持 16dp 页面边距。`);
    L.push(`- 开关、复选框、页签、滑块等控件可交互；按钮跳转按描述实现${navNote}。`);
    L.push(`- 代码结构清晰、组件化命名，可直接运行。`);
    return L.join("\n");
  }

  /* ---------- 单组件代码块 ---------- */
  function itemSnippet(it, design, format) {
    const reg = R();
    const def = reg.defs[it.kind];
    it._theme = design.theme;
    if (format === "json") {
      const copy = JSON.parse(JSON.stringify(it));
      delete copy._theme;
      return JSON.stringify({ __m3eBlock: 1, item: copy }, null, 2);
    }
    if (format === "vue") {
      const id = safeId(it.id);
      const setup = [];
      let inner = def.render(it);
      if (def.inter === "toggle") { setup.push(`const ${id} = ref(${!!it.checked})`); inner = def.render(it).replace(/^<(\w+)/, `<$1 @click="${id}=!${id}" :class="{on:${id}}"`).replace(/ class="([^"]*?) ?on"/, ' class="$1"'); }
      else if (def.inter === "radio") { setup.push(`const ${id} = ref(${!!it.checked})`); inner = def.render(it).replace(/^<(\w+)/, `<$1 @click="${id}=true" :class="{on:${id}}"`).replace(/ class="([^"]*?) ?on"/, ' class="$1"'); }
      else if (def.inter === "tabs") { const t2 = tabsVue(it, def, id, setup); if (t2 != null) inner = t2; }
      else if (def.inter === "slider") { setup.push(`const ${id} = ref(${it.value == null ? 50 : it.value})`); }
      return `<!-- 组件：${def.name}（来自 gw Designer） -->
<template>
  ${inner}
</template>

<script setup>
import { ref } from 'vue'
${setup.join("\n") || "// 无状态"}
</script>

<style>
${CSS()}
.m3e-item{position:relative;display:inline-block;}
/* 页面需提供配色变量，例如：
:root{--pri:#6750A4;--on-pri:#FFFFFF;--pri-c:#EADDFF;...}
可在设计器「主题」面板查看完整变量。 */
</style>
`;
    }
    if (format === "react") {
      const id = safeId(it.id);
      const cap = id.charAt(0).toUpperCase() + id.slice(1);
      const setup = [];
      const isSlider = def.inter === "slider";
      let inner;
      if (def.inter === "toggle") {
        setup.push(`  const [${id}, set${cap}] = useState(${!!it.checked});`);
        inner = reactRootState(convertJsx(def.render(it)), id, `set${cap}(!${id})`, "on");
      } else if (def.inter === "radio") {
        setup.push(`  const [${id}, set${cap}] = useState(${!!it.checked});`);
        inner = reactRootState(convertJsx(def.render(it)), id, `set${cap}(true)`, "on");
      } else if (def.inter === "tabs") {
        const t2 = reactTabsInner(it, def, id, setup, reg);
        inner = t2 == null ? convertJsx(def.render(it)) : t2;
      } else if (isSlider) {
        inner = convertJsx(def.render(it)).replace(/^<div/, `<div data-sid="${id}"`);
      } else {
        inner = convertJsx(def.render(it));
      }
      return `/* 组件：${def.name}（来自 gw Designer） */
import { useState${isSlider ? ", useEffect" : ""} } from "react";
${isSlider ? "\n" + REACT_BIND_SLIDER + "\n" : ""}
export default function Comp() {
${setup.join("\n") || "  // 无状态"}${isSlider ? `\n  useEffect(() => {\n    bindSlider(document.querySelector('[data-sid="${id}"]'));\n  }, []);` : ""}

  return (
    ${inner}
  );
}
${isSlider ? "" : `
/* 需在页面引入 m3e 样式与配色变量，例如：
   <style>{\`:root{--pri:#6750A4;--on-pri:#FFFFFF;...}\`}</style>
   完整变量见设计器「导出全部 → 主题令牌」。 */`}`;
    }
    /* html：独立可运行小文档 */
    const p = itemHTMLAct(it, { theme: design.theme });
    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8"/>
<title>${esc(def.name)} — M3E 组件</title>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#ECE6F0;}
${CSS()}
</style>
</head>
<body>
<div class="m3e-page" style="${pageVarsStyle(design.theme, null)}width:640px;height:360px;background:var(--sur);border-radius:24px;">
  <div class="m3e-item" style="left:120px;top:152px;width:${it.w}px;height:${it.h}px;">${p.inner}</div>
</div>
<script>
${def.inter ? interScript() : ""}
</script>
</body>
</html>`;
  }

  window.M3E_GEN = { itemHTML, itemHTMLi, itemInner, pageHTML, htmlDoc, vueSFC, reactJsx, themeTokensCss, themeTokensJson, prompt, itemSnippet, interScript, pageVarsStyle, posDesc };
})();
