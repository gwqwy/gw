// 校验 gx 数据隔离质量：
//  硬性失败：html 中存在未重映射的 id 定义；position:fixed / 100vh / 100vw 残留
//  信息项：css 引用了 html 未定义的 #id（上游死规则，作用域后永不命中，无害）
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const DIR = path.join(__dirname, "..", "designer", "js", "gx");
const bad = [];
let info = 0;
for (const f of fs.readdirSync(DIR)) {
  if (f === "manifest.js") continue;
  const sb = { window: {} };
  vm.createContext(sb);
  vm.runInContext(fs.readFileSync(path.join(DIR, f), "utf8"), sb);
  const key = Object.keys(sb.window.M3E_GX_DATA)[0];
  for (const e of sb.window.M3E_GX_DATA[key]) {
    /* html 中所有 id 定义必须带 gx 前缀 */
    const defs = e[4].match(/\sid="([^"]+)"/g) || [];
    for (const s of defs) {
      const v = s.match(/"([^"]+)"/)[1];
      if (!/^gx[0-9a-z]{8}-/.test(v)) bad.push([key, e[1], '未重映射 id="' + v + '"']);
    }
    if (/position\s*:\s*fixed/i.test(e[5])) bad.push([key, e[1], "position:fixed"]);
    if (/\b100vh\b|\b100vw\b/i.test(e[5])) bad.push([key, e[1], "vh/vw"]);
    /* css 中 #token：颜色允许；gx 前缀 id 允许；裸 id 若 html 有同名定义才算错 */
    const defined = new Set([...e[4].matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
    for (const t of e[5].match(/#[\w-]+/g) || []) {
      if (/^#[0-9a-fA-F]{3,8}$/.test(t)) continue;
      if (/^#gx[0-9a-z]{8}-/.test(t)) continue;
      if (defined.has(t.slice(1))) bad.push([key, e[1], "css引用未重映射定义 " + t]);
      else info++;
    }
  }
}
console.log("硬性失败:", bad.length, bad.slice(0, 10));
console.log("无害悬空引用:", info);
process.exit(bad.length ? 1 : 0);
