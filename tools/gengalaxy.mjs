/* gengalaxy.mjs — 把 uiverse-io/galaxy 仓库全量组件生成设计器数据文件
 *
 * 输入：tools/galaxy/（浅克隆 https://github.com/uiverse-io/galaxy ，MIT License）
 * 输出：designer/js/gx/manifest.js + designer/js/gx/<cat>.js（按分类懒加载）
 * 处理：提取 <style> → 剥离注释并解析作者/标签 → M3E_SCOPE 作用域隔离
 *       （类名前缀 / @keyframes 改名 / id 重映射 / fixed→absolute）
 *       纯 Tailwind（无 <style> 且无内联样式）的组件剔除。
 * 运行：node tools/gengalaxy.mjs  */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCOPE = require("../designer/js/scope.js");

const SRC = process.argv[2] || path.join(__dirname, "galaxy");
const OUT = path.join(__dirname, "..", "designer", "js", "gx");

/* 仓库顶层目录 → 设计器分类（key 同时是输出文件名） */
const CATS = [
  { dir: "Buttons", key: "buttons", name: "按钮", icon: "touch_app" },
  { dir: "Cards", key: "cards", name: "卡片", icon: "web_asset" },
  { dir: "Checkboxes", key: "checkboxes", name: "复选框", icon: "check_box" },
  { dir: "Forms", key: "forms", name: "表单", icon: "notes" },
  { dir: "Inputs", key: "inputs", name: "输入框", icon: "text_fields" },
  { dir: "Notifications", key: "notifications", name: "通知", icon: "notifications" },
  { dir: "Patterns", key: "patterns", name: "装饰", icon: "grid_view" },
  { dir: "Radio-buttons", key: "radios", name: "单选", icon: "radio_button_checked" },
  { dir: "Toggle-switches", key: "toggles", name: "开关", icon: "toggle_on" },
  { dir: "Tooltips", key: "tooltips", name: "提示框", icon: "label" },
  { dir: "loaders", key: "loaders", name: "加载动画", icon: "motion_blur" },
];

function hash36(s, len) {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36).padStart(len || 6, "0").slice(-(len || 6));
}
function titleize(slug) {
  return slug.split("-").filter(Boolean).map(w =>
    /^[0-9]/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}
/* 文件内署名注释：From Uiverse.io by AUTHOR - Tags: a, b */
function parseAttribution(text) {
  let author = "", tags = [];
  const cms = text.match(/<!--([\s\S]*?)-->/g) || [];
  for (const c of cms) {
    const m = c.match(/From\s+Uiverse\.io\s+by\s+([^-*]+?)(?:\s*-\s*Tags:\s*([^*]*?))?\s*(?:-->|\*\/)/i);
    if (m) {
      author = m[1].trim().replace(/^@/, "");
      if (m[2]) tags = m[2].split(/[,，]/).map(t => t.trim().toLowerCase()).filter(Boolean).slice(0, 8);
      break;
    }
  }
  /* <style> 里也可能还有一处署名注释 */
  if (!author) {
    const m2 = text.match(/\/\*\s*From\s+Uiverse\.io\s+by\s+([^-*]+?)(?:\s*-\s*Tags:\s*([^*]*?))?\s*\*\//i);
    if (m2) {
      author = m2[1].trim().replace(/^@/, "");
      if (m2[2]) tags = m2[2].split(/[,，]/).map(t => t.trim().toLowerCase()).filter(Boolean).slice(0, 8);
    }
  }
  return { author, tags };
}

const stats = { total: 0, kept: 0, tailwind: 0, failed: 0, dup: 0 };
const failDetail = [];
const seen = new Map();          // 去重：内容哈希 → 已收录
const perCat = new Map();

function convertFile(file, catKey, rel) {
  stats.total++;
  let raw;
  try { raw = fs.readFileSync(file, "utf8"); } catch { stats.failed++; return; }
  const base = path.basename(file, ".html");
  const us = base.indexOf("_");
  const authorGuess = us > 0 ? base.slice(0, us) : "community";
  const slug = us > 0 ? base.slice(us + 1) : base;
  const name = titleize(slug) || "Component";
  const attr = parseAttribution(raw);
  const author = attr.author || authorGuess;
  const tags = attr.tags;

  const hasStyle = /<style[\s>]/i.test(raw);
  const hasInline = /\sstyle\s*=\s*["'][^"']+["']/i.test(raw);
  if (!hasStyle && !hasInline) { stats.tailwind++; return; }   // 纯 Tailwind，离线无法渲染

  /* 提取 <style> 并从标记中移除；剥离 HTML 注释 */
  let css = "";
  let html = raw;
  if (hasStyle) {
    const blocks = [];
    html = html
      .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (s, inner) => { blocks.push(inner); return ""; })
      .replace(/<!--[\s\S]*?-->/g, "");
    css = blocks.join("\n").trim();
  } else {
    html = html.replace(/<!--[\s\S]*?-->/g, "");
  }
  html = html.trim().replace(/\s+/g, " ");
  css = css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").trim();
  if (!html && !css) { stats.failed++; return; }
  if (/<script/i.test(html)) { stats.failed++; failDetail.push(rel + "（含 script）"); return; }

  const id = "gx" + hash36(catKey + "/" + base, 8);
  const cls = id; // 作用域类 = 组件 id，css 里所有选择器都以它为前缀
  let scoped;
  try {
    scoped = SCOPE.scope({ html, css, cls });
  } catch (e) {
    stats.failed++;
    failDetail.push(rel + "（作用域化失败：" + e.message + "）");
    return;
  }
  if (!scoped.html.trim()) { stats.failed++; return; }

  /* 跨分类去重（同内容组件只保留一份） */
  const key = scoped.css + "|" + scoped.html;
  if (seen.has(key)) { stats.dup++; return; }
  seen.set(key, id);

  const entry = [id, name, author, tags.join(","), scoped.html, scoped.css];
  if (!perCat.has(catKey)) perCat.set(catKey, []);
  perCat.get(catKey).push(entry);
  stats.kept++;
}

/* ---------- 主流程 ---------- */
if (!fs.existsSync(SRC)) {
  console.error("找不到 galaxy 仓库目录：" + SRC);
  console.error("请先：git clone --depth 1 https://github.com/uiverse-io/galaxy " + SRC);
  process.exit(1);
}
let commit = "";
try { commit = fs.readFileSync(path.join(SRC, ".git"), "utf8").match(/ref: (.+)/)?.[1] || ""; } catch { /* 浅克隆 */ }

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

for (const cat of CATS) {
  const dir = path.join(SRC, cat.dir);
  if (!fs.existsSync(dir)) { console.warn("缺少分类目录：" + cat.dir); continue; }
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".html")).sort();
  for (const f of files) convertFile(path.join(dir, f), cat.key, cat.dir + "/" + f);
}

/* manifest（index.html 立即加载，声明分类与署名） */
const manifest = {
  gen: new Date().toISOString().slice(0, 10),
  src: "https://github.com/uiverse-io/galaxy",
  license: "MIT",
  cats: CATS.filter(c => perCat.has(c.key))
    .map(c => ({ key: c.key, name: c.name, icon: c.icon, n: perCat.get(c.key).length })),
  total: stats.kept,
};
const mf = [
  "/* 自动生成：tools/gengalaxy.mjs — uiverse.io/galaxy 社区组件清单（MIT License）",
  " * 组件数据按分类放在同目录 <key>.js，由 gx.js 在打开「社区」分类时懒加载。 */",
  "window.M3E_GX_MANIFEST = " + JSON.stringify(manifest) + ";",
].join("\n");
fs.writeFileSync(path.join(OUT, "manifest.js"), mf);

/* 每分类一个数据文件：M3E_GX_DATA.<key> = [[id,name,author,tags,html,css],...] */
for (const cat of CATS) {
  const list = perCat.get(cat.key);
  if (!list) continue;
  const body = list.map(e => JSON.stringify(e)).join(",\n");
  const js = `/* 自动生成：gengalaxy.mjs — ${cat.name}（uiverse.io/galaxy，MIT；样式已作用域隔离） */\nwindow.M3E_GX_DATA = window.M3E_GX_DATA || {};\nwindow.M3E_GX_DATA.${cat.key} = [\n${body}\n];\n`;
  fs.writeFileSync(path.join(OUT, cat.key + ".js"), js);
}

/* 报告 */
const rep = [
  `galaxy 生成报告 ${manifest.gen}`,
  `来源：${manifest.src}${commit ? " @ " + commit.trim() : ""}`,
  `扫描 ${stats.total} · 收录 ${stats.kept} · 纯Tailwind剔除 ${stats.tailwind} · 失败 ${stats.failed} · 去重 ${stats.dup}`,
  "",
  ...CATS.filter(c => perCat.has(c.key)).map(c => `${c.name.padEnd(6)} ${c.key.padEnd(13)} ${perCat.get(c.key).length}`),
  "",
  `数据体积：${(fs.readdirSync(OUT).reduce((s, f) => s + fs.statSync(path.join(OUT, f)).size, 0) / 1048576).toFixed(1)} MB`,
];
if (failDetail.length) rep.push("", "失败明细：", ...failDetail.slice(0, 30));
fs.writeFileSync(path.join(__dirname, "galaxy_report.txt"), rep.join("\n") + "\n");
console.log(rep.join("\n"));
