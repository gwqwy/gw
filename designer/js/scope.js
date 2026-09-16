/* gw Designer — CSS/HTML 作用域隔离（浏览器运行时与 Node 生成器共用，UMD）
 * 把任意第三方组件（uiverse/galaxy、用户粘贴代码）隔离进一个 class 命名空间：
 *  - 每条选择器加 ".cls " 前缀；html/body/:root 收敛为 .cls 本身
 *  - @keyframes 重命名（cls-原名），并同步改写 animation / animation-name 引用
 *  - id 重映射：HTML 的 id/for/href="#"/xlink:href/url(#)/aria-* 与 CSS 的 #id、url(#)
 *  - position:fixed → absolute；100vh/100vw → 100%（画布与卡片预览中不可靠）
 * 用法：M3E_SCOPE.scope({ html, css, cls }) → { html, css }（html 原样返回，仅重映射 id） */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.M3E_SCOPE = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* ---------- 字符串遮罩：解析期间把 "..." / '...' 换成占位符，防 content/url 里的花括号干扰 ---------- */
  function maskStrings(css) {
    const strs = [];
    const out = css.replace(/"([^"\\]|\\.)*"|'([^'\\]|\\.)*'/g, m => {
      strs.push(m);
      return "\x00" + (strs.length - 1) + "\x00";
    });
    return { out, strs };
  }
  function unmask(s, strs) {
    return s.replace(/\x00(\d+)\x00/g, (m, i) => strs[+i]);
  }

  /* ---------- 顶层逗号切分（忽略括号/函数内逗号） ---------- */
  function splitTop(s, sep) {
    const out = [];
    let d = 0, cur = "";
    for (const ch of s) {
      if (ch === "(" || ch === "[" || ch === "{") d++;
      else if (ch === ")" || ch === "]" || ch === "}") d--;
      if (ch === sep && d <= 0) { out.push(cur); cur = ""; }
      else cur += ch;
    }
    if (cur.trim()) out.push(cur);
    return out;
  }

  /* ---------- 收集 HTML 中的 id（定义 + 引用），给出 old → prefix+old 映射 ---------- */
  function collectIds(html, prefix) {
    const ids = new Set();
    let m;
    const attrRe = /(?:\s|^)(id|for|aria-labelledby|aria-describedby|headers)\s*=\s*("([^"]*)"|'([^']*)')/gi;
    while ((m = attrRe.exec(html))) {
      const v = m[3] != null ? m[3] : m[4];
      v.split(/\s+/).forEach(x => { if (x) ids.add(x); });
    }
    const hrefRe = /href\s*=\s*(["'])#([^"']+)\1/gi;
    while ((m = hrefRe.exec(html))) ids.add(m[2]);
    const urlRe = /url\(#([^)\s"']+)\)/gi;
    while ((m = urlRe.exec(html))) ids.add(m[1]);
    const map = {};
    for (const id of ids) map[id] = prefix + String(id).replace(/[^\w-]/g, "_");
    return map;
  }

  /* ---------- 选择器作用域化 ---------- */
  function scopeSelector(sel, cls, idMap) {
    sel = sel.trim();
    if (!sel) return "";
    let s = sel;
    /* id 重映射 */
    s = s.replace(/#([\w-]+)/g, (m, id) => (idMap[id] ? "#" + idMap[id] : m));
    /* :root → 作用域类本身 */
    s = s.replace(/:root\b/gi, "." + cls);
    /* 开头的 html / body（含 "html body .x" 组合）收敛为作用域类 */
    s = s.trim();
    while (/^(html|body)\b/i.test(s)) {
      s = s.replace(/^(html|body)\b\s*/i, "").replace(/^[\s>+~]+/, "").trim();
    }
    if (!s) return "." + cls;
    if (s.indexOf("." + cls) === 0) return s; // :root/body 已换成作用域类
    return "." + cls + " " + s;
  }

  /* ---------- 递归解析规则块 ---------- */
  function parseBlocks(css, from, to, cls, idMap, kfMap) {
    let out = "";
    let i = from;
    while (i < to) {
      const brace = css.indexOf("{", i);
      if (brace === -1 || brace >= to) { out += css.slice(i, to); break; }
      const semi = css.indexOf(";", i);
      if (semi !== -1 && semi < brace) {
        /* 无块语句（@import/@charset 等）原样保留 */
        out += css.slice(i, semi + 1);
        i = semi + 1;
        continue;
      }
      const head = css.slice(i, brace).trim();
      let d = 1, j = brace + 1;
      while (j < to && d > 0) {
        const c = css[j];
        if (c === "{") d++;
        else if (c === "}") d--;
        j++;
      }
      const bodyEnd = Math.max(brace + 1, j - 1);
      const body = css.slice(brace + 1, bodyEnd);
      if (/^@(?:-webkit-)?keyframes/i.test(head)) {
        const name = head.replace(/@(?:-webkit-)?keyframes\s+/i, "").trim();
        const nn = kfMap[name] || name;
        out += (head.toLowerCase().indexOf("-webkit-keyframes") === 0 ? "@-webkit-keyframes " : "@keyframes ") + nn + "{" + body + "}";
      } else if (/^@(media|supports|layer|container|scope)\b/i.test(head)) {
        out += head + "{" + parseBlocks(css, brace + 1, bodyEnd, cls, idMap, kfMap) + "}";
      } else if (head.charAt(0) === "@") {
        /* @font-face / @property 等不作用域 */
        out += head + "{" + body + "}";
      } else {
        const sels = splitTop(head, ",").map(x => scopeSelector(x, cls, idMap)).filter(Boolean).join(",");
        out += (sels ? sels : "") + "{" + body + "}";
      }
      i = j;
    }
    return out;
  }

  /* ---------- CSS 主流程 ---------- */
  function scopeCss(css, cls, idMap) {
    css = String(css || "");
    if (!css.trim()) return "";
    const { out: masked, strs } = maskStrings(css);
    let c = masked
      .replace(/\/\*[\s\S]*?\*\//g, "")                 /* 注释剔除（含作者署名行） */
      .replace(/position\s*:\s*fixed/gi, "position:absolute")
      .replace(/\b100vw\b/gi, "100%")
      .replace(/\b100vh\b/gi, "100%");

    /* keyframes 改名映射 */
    const kfMap = {};
    c.replace(/@(?:-webkit-)?keyframes\s+([\w-]+)/gi, (s, n) => { kfMap[n] = cls + "-" + n; return s; });

    let res = parseBlocks(c, 0, c.length, cls, idMap, kfMap);
    res = unmask(res, strs);
    /* animation 引用同步改名（词边界含 - 防止 spin 命中 spin-around） */
    res = res.replace(/(animation(?:-name)?\s*:\s*)([^;}]+)/gi, (s, p, v) =>
      p + v.replace(/(?<![\w-])([\w-]+)(?![\w-])/g, tok => kfMap[tok] || tok));
    /* svg 渐变等 url(#id) 引用 */
    res = res.replace(/url\(#([^)\s"']+)\)/gi, (s, id) => (idMap[id] ? "url(#" + idMap[id] + ")" : s));
    return res;
  }

  /* ---------- HTML 主流程 ---------- */
  function scopeHtml(html, idMap) {
    return String(html || "")
      .replace(/(\s(?:id|for|aria-labelledby|aria-describedby|headers)\s*=\s*)(["'])([\s\S]*?)\2/gi,
        (s, a, q, v) => a + q + v.split(/\s+/).map(x => idMap[x] || x).join(" ") + q)
      .replace(/(href\s*=\s*)(["'])#([^"']+)\2/gi,
        (s, a, q, id) => a + q + "#" + (idMap[id] || id) + q)
      .replace(/url\(#([^)\s"']+)\)/gi,
        (s, id) => (idMap[id] ? "url(#" + idMap[id] + ")" : s));
  }

  /** 主入口：{ html, css, cls } → { html, css }（cls 即命名空间类，须全局唯一） */
  function scope(opts) {
    const cls = opts.cls;
    if (!cls) throw new Error("scope: 缺少 cls");
    const html = opts.html || "";
    const idMap = collectIds(html, cls + "-");
    return {
      html: scopeHtml(html, idMap),
      css: scopeCss(opts.css, cls, idMap),
    };
  }

  return { scope, scopeCss, scopeHtml, scopeSelector, splitTop, collectIds };
});
