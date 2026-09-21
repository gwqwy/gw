// Node 侧自测：加载设计器 JS 模块，生成全部输出并做健全性检查
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const D = path.join(__dirname, "..", "designer", "js");
const sandbox = { console, window: {}, JSON, Math, Date, setTimeout, clearTimeout, RegExp, Object, Array };
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
for (const f of ["tokens.js", "icons.js", "m3estyle.js", "registry.js", "uiverse.js", "codegen.js"]) {
  vm.runInContext(fs.readFileSync(path.join(D, f), "utf8"), sandbox, { filename: f });
}

const W = sandbox.window;
const T = W.M3E_TOKENS, REG = W.M3E_REG, GEN = W.M3E_GEN;

let fails = 0;
const ok = (cond, name) => { console.log((cond ? "  ✓ " : "  ✗ ") + name); if (!cond) fails++; };

/* 注册表完整性 */
console.log("== 注册表 ==");
ok(REG.order.length === 67, `67 种组件（实际 ${REG.order.length}）`);
ok(Object.keys(REG.defs).length === 67, `defs 全部定义（实际 ${Object.keys(REG.defs).length}）`);
for (const k of REG.order) {
  const d = REG.defs[k];
  if (!d || !d.spec || !d.render || !d.desc || !d.cat) { ok(false, `${k} 定义不完整`); }
}
console.log("  ✓ 所有组件含 spec/render/desc/cat");

/* 签名属性：每个组件都有专属属性（sig 全局唯一），用于区分功能相近的组件 */
console.log("== 签名属性 ==");
const uiverseKinds = new Set(Object.values(REG.defs).filter(d => d.cat === "uiverse").map(d => d.kind));
const sigCount = {};
for (const k of REG.order) {
  const d = REG.defs[k];
  if (uiverseKinds.has(k)) continue; // 社区精选组件免检（其差异即组件本身）
  if (!d.sig) ok(false, `${k} 缺少签名属性 sig`);
  else sigCount[d.sig] = (sigCount[d.sig] || 0) + 1;
}
const dupSigs = Object.entries(sigCount).filter(([, n]) => n > 1);
ok(!dupSigs.length, `签名属性全局唯一${dupSigs.length ? "（重复：" + dupSigs.map(([s]) => s).join(",") + "）" : ""}`);
const PDTYPES = new Set(["sel", "num", "chk", "txt", "icon"]);
let pdBad = [];
for (const k of REG.order) {
  for (const pd of REG.defs[k].propDefs || []) {
    if (!PDTYPES.has(pd.type) || !pd.k || !pd.label) pdBad.push(k + "." + pd.k);
    if (pd.type === "sel" && !Array.isArray(pd.opts)) pdBad.push(k + "." + pd.k + "(opts)");
  }
}
ok(pdBad.length === 0, `propDefs 结构合法${pdBad.length ? "（" + pdBad.join(",") + "）" : ""}`);
/* propDefs 键不得与组件自身 spec 冲突遗漏：新条目应携带全部 propDefs 默认值 */
let specMiss = [];
for (const k of REG.order) {
  const d = REG.defs[k];
  for (const pd of d.propDefs || []) {
    if (!(pd.k in d.spec) && d.type !== "icon") specMiss.push(k + "." + pd.k);
  }
}
ok(specMiss.length === 0, `propDefaults 均写入 spec${specMiss.length ? "（" + specMiss.join(",") + "）" : ""}`);



/* 构造全组件设计 */
const design = { name: "测试设计", theme: { palette: "purple", dark: false, shape: "rounded" }, pages: [] };
const p = T.defaultPage("首页", "phone");
design.pages.push(p);
for (const k of REG.order) p.items.push(REG.create(k, 8, 8, design.theme));
const q = T.defaultPage("设置", "desktop");
q.x = 600;
design.pages.push(q);
q.items.push(REG.create("switch", 16, 16, design.theme));
p.items[0].action = q.id; p.items[0].note = "点击跳转到设置";
p.items[p.items.length - 1].action = q.id;

/* 进度组件三者外观必须可区分 */
console.log("== 进度组件区分 ==");
const li = REG.create("loadingIndicator", 0, 0, design.theme);
const cp = REG.create("circularProgress", 0, 0, design.theme);
const lp = REG.create("linearProgress", 0, 0, design.theme);
const liH = REG.defs.loadingIndicator.render(li);
const cpH = REG.defs.circularProgress.render(cp);
ok(liH !== cpH, "加载指示器与圆形进度条默认渲染不同");
ok(liH.includes("stroke-dasharray=\"20 93\""), "加载指示器为四段式扇形");
ok(cpH.includes("stroke=\"var(--pri-c)\""), "圆形进度条带轨道（进度模式）");
ok(cpH.includes("rotate(-90"), "圆形进度条进度弧起始角度正确");
const cpPct = Object.assign(cp, { showPct: true });
ok(REG.defs.circularProgress.render(cpPct).includes("%</span>"), "圆形进度条可显示百分比");
const lpWavy = Object.assign(lp, { wavy: true, value: 60 });
ok(REG.defs.linearProgress.render(lpWavy).includes("<svg"), "线性进度条波浪样式可用");
/* 签名属性渲染抽查 */
const btnT = Object.assign(REG.create("button", 0, 0, design.theme), { iconPos: "right" });
const btnH = REG.defs.button.render(btnT);
ok(btnH.indexOf("class=\"lb\"") < btnH.indexOf("m3e-ic"), "按钮签名：图标可放到文字右侧");
const cbTri = Object.assign(REG.create("checkbox", 0, 0, design.theme), { tri: true });
ok(REG.defs.checkbox.render(cbTri).includes('class="m3e-cb on"'), "复选框半选态有横杠标记");
const bdDot = Object.assign(REG.create("badge", 0, 0, design.theme), { dotOnly: true });
ok(!REG.defs.badge.render(bdDot).includes(">3<"), "徽标红点模式不显示数字");

/* HTML 导出 */
console.log("== HTML 导出 ==");
const html = GEN.htmlDoc(design);
ok(html.startsWith("<!DOCTYPE html>"), "DOCTYPE 开头");
ok(html.includes("m3e-export-body"), "含导出布局");
ok((html.match(/m3e-item/g) || []).length >= 34, `条目数 ≥34（${(html.match(/m3e-item/g) || []).length}）`);
ok(!html.includes("undefined"), "无 undefined 泄漏");
ok(html.includes("data-act=\"toggle\""), "交互开关已注入");
ok(html.includes(`data-link="${q.id}"`), "页面跳转已注入");
ok(html.includes("data-act=\"tabs\"") && html.includes("data-tab"), "页签交互已注入（data-act/data-tab）");
ok(/<div class="m3e-bnav" data-act="tabs"/.test(html) || /<div data-act="tabs" class="m3e-bnav"/.test(html), "导航栏根元素带 tabs 交互标记");
ok(html.includes("--pri:#6750A4"), "配色变量已注入");
ok(!/[<>]&/.test(html.replace(/&(amp|lt|gt|quot|#39);/g, "")), "无转义错误");
fs.writeFileSync(path.join(__dirname, "out_sample.html"), html);

/* Vue 导出 */
console.log("== Vue 导出 ==");
const vue = GEN.vueSFC(p, design);
ok(vue.includes("<template>") && vue.includes("<script setup>") && vue.includes("<style>"), "SFC 三段齐全");
ok(vue.includes("ref("), "含响应式状态");
ok(vue.includes(":class=\"{on:"), "开关绑定已生成");
ok(vue.includes(":class=\"{sel: sel_"), "页签绑定已生成");
ok(vue.includes('<div class="dest" :class="{sel: sel_'), "导航栏子项带 .dest class（样式可挂载）");
ok(!vue.includes("undefined"), "无 undefined 泄漏");
fs.writeFileSync(path.join(__dirname, "out_sample.vue"), vue);
const vueQ = GEN.vueSFC(q, design);
ok(vueQ.includes("1280"), "桌面页尺寸正确");
fs.writeFileSync(path.join(__dirname, "out_sample_desktop.vue"), vueQ);

/* 弹窗图层 + Vue：回归（此前弹窗成员全量重渲染导致 ref 重复声明、跨弹窗串组） */
console.log("== 弹窗图层（Vue 回归） ==");
const pp = T.defaultPage("弹窗页", "phone");
const g1 = { id: "g1id", name: "弹窗一", popup: true }, g2 = { id: "g2id", name: "弹窗二", popup: true };
pp.groups = [g1, g2];
const mkItem = kind => REG.create(kind, 8, 8, design.theme);
const plain = mkItem("switch");                 // 页面级开关
const m1 = mkItem("switch"); m1.gid = "g1id";   // 弹窗一成员
const m2 = mkItem("checkbox"); m2.gid = "g2id"; // 弹窗二成员
pp.items.push(plain, m1, m2);
const vueP = GEN.vueSFC(pp, design);
const itemRefs = (vueP.match(/const u\w+ = ref\(/g) || []).length;
ok(itemRefs === 3, `交互组件 ref 声明无重复（${itemRefs}/3）`);
ok((vueP.match(/const pop_\w+ = ref\(/g) || []).length === 2, "两个弹窗各一个开关 ref");
const swCount = (vueP.match(/class="m3e-sw/g) || []).length;
const cbCount = (vueP.match(/class="m3e-cb/g) || []).length;
ok(swCount === 2 && cbCount === 1, `弹窗成员不串组（switch ${swCount}/2，checkbox ${cbCount}/1）`);
ok(vueP.indexOf("m3e-popup") < vueP.indexOf("pop_g1id") || vueP.includes("popupRefs"), "弹窗 ref 已接线");

/* 步骤条 / 新组件的 Vue 结构 */
const sp = T.defaultPage("结构页", "phone");
const stIt = mkItem("stepper");
const tlIt = mkItem("timeline");
const segIt = mkItem("segmented");
const bcIt = mkItem("breadcrumb");
const taIt = mkItem("textarea"); taIt.variant = "outlined";
const qtIt = mkItem("quote");
const cbIt = mkItem("codeBlock");
sp.items.push(stIt, tlIt, segIt, bcIt, taIt, qtIt, cbIt);
const vueS = GEN.vueSFC(sp, design);
ok(vueS.includes("m3e-stepper"), "步骤条保持自身结构（不被重建成普通页签）");
ok(vueS.includes('class="m3e-seg"') && vueS.includes("{sel: sel_u"), "分段按钮按页签交互生成");
ok(vueS.includes('class="m3e-bc"'), "面包屑按页签交互生成");
ok(vueS.includes("m3e-tline") && vueS.includes("m3e-ta v-outlined") && vueS.includes("m3e-quote") && vueS.includes("m3e-codeblk"), "时间线/多行输入/引用块/代码块静态渲染正常");
/* 新组件渲染抽查 */
const segH = REG.defs.segmented.render(Object.assign(mkItem("segmented"), { segTight: true }));
ok(segH.includes('class="m3e-seg outline"'), "分段按钮描边样式可切换");
const bcH = REG.defs.breadcrumb.render(mkItem("breadcrumb"));
ok(bcH.includes('class="bh"') && bcH.includes('class="bc sel"'), "面包屑含首页图标与选中态");
const cbH2 = REG.defs.codeBlock.render(mkItem("codeBlock"));
ok(cbH2.includes('class="lang"') && cbH2.includes("<pre>"), "代码块带语言角标");
const tlH = REG.defs.timeline.render(Object.assign(mkItem("timeline"), { tlLine: "dashed" }));
ok(tlH.includes("dashed") && tlH.includes('class="dot"'), "时间线虚线连线可切换");

/* 提示词 */
console.log("== 提示词 ==");
const prompt = GEN.prompt(design, { target: "vue" });
ok(prompt.includes("Material 3 Expressive"), "含风格说明");
ok(prompt.includes("## 屏幕「首页」"), "含屏幕章节");
ok(prompt.includes("Vue 3"), "含目标平台");
ok(prompt.includes("点击后跳转到屏幕「设置」"), "含跳转描述");
ok(prompt.includes("点击跳转到设置"), "含行为说明");
ok(prompt.includes("#6750A4"), "含色值");
fs.writeFileSync(path.join(__dirname, "out_prompt.md"), prompt);

/* 组件块 */
console.log("== 组件代码块 ==");
const sw = p.items.find(i => i.kind === "switch");
const snipHtml = GEN.itemSnippet(sw, design, "html");
const snipVue = GEN.itemSnippet(sw, design, "vue");
const snipJson = GEN.itemSnippet(sw, design, "json");
ok(snipHtml.startsWith("<!DOCTYPE html>"), "HTML 片段为独立文档");
ok(snipVue.includes("data-act=\"toggle\"") === false && snipVue.includes("@click"), "Vue 片段含点击绑定");
const j = JSON.parse(snipJson);
ok(j.__m3eBlock === 1 && j.item.kind === "switch", "JSON 块可回贴");
ok(!("_theme" in j.item), "JSON 块无运行时字段");
const snipTabsVue = GEN.itemSnippet(p.items.find(i => i.kind === "tabs"), design, "vue");
ok(snipTabsVue.includes("@click") && snipTabsVue.includes(':class="{sel: sel_'), "页签组件 Vue 片段带交互绑定");
ok(!GEN.itemSnippet(p.items.find(i => i.kind === "stepper"), design, "vue").includes("@click"), "步骤条 Vue 片段保持静态");

/* 深色方案 */
console.log("== 深色模式 ==");
design.theme.dark = true;
const htmlDark = GEN.htmlDoc(design, { pages: [p] });
ok(htmlDark.includes("--sur:#"), "深色变量已注入");
ok(!htmlDark.includes("--sur:#FEF7FF"), "深色下表面色已变");
design.theme.dark = false;

/* 形状缩放 */
design.theme.shape = "square";
const sq = GEN.itemHTML(p.items.find(i => i.kind === "button"), { theme: design.theme });
ok(sq.includes("border-radius:0px"), "方形模式圆角为 0");
design.theme.shape = "full";
const fu = GEN.itemHTML(p.items.find(i => i.kind === "card"), { theme: design.theme });
ok(fu.includes("border-radius:111px"), "全圆模式卡片半径=高/2");
design.theme.shape = "rounded";

/* 代码组件（作用域隔离 + 代码随条目导出 + 提示词附代码） */
console.log("== 代码组件 / 作用域隔离 ==");
const SCOPE = require("../designer/js/scope.js");
const scoped = SCOPE.scope({
  html: '<input id="a"/><label for="a">x</label>',
  css: ':root{--x:1}#a{display:none}label{color:red}body .b{top:0}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(1turn)}}.s{animation:spin 2s linear infinite}',
  cls: "gtest",
});
ok(scoped.css.includes(".gtest #gtest-a"), "id 选择器已重映射");
ok(scoped.html.includes('id="gtest-a"') && scoped.html.includes('for="gtest-a"'), "HTML id/for 已重映射");
ok(scoped.css.includes(".gtest label{color:red}"), "元素选择器已加前缀");
ok(scoped.css.includes(".gtest{--x:1}"), ":root 已收敛为作用域类");
ok(/@keyframes gtest-spin/.test(scoped.css) && scoped.css.includes("animation:gtest-spin"), "keyframes 改名且引用同步");
const gxItem = Object.assign(REG.create("customHtml", 0, 0, design.theme), {
  name: "社区组件", html: scoped.html, css: scoped.css, sclass: "gtest",
  gx: { id: "gxtest1234", a: "someone" }, w: 200, h: 80,
});
const gxInner = GEN.itemInner(gxItem, { theme: design.theme });
ok(gxInner.includes('class="m3e-html gxbox"') && gxInner.includes('class="gtest"'), "代码组件带作用域类渲染");
ok(gxInner.includes("<style>" ), "代码组件样式内嵌（画布/导出自动生效）");
const htmlGx = GEN.htmlDoc(design, { pages: [p] });
p.items.push(gxItem);
const htmlGx2 = GEN.htmlDoc(design, { pages: [p] });
ok(htmlGx2.length > htmlGx.length && htmlGx2.includes(".gtest "), "HTML 导出包含组件样式");
const vueGx = GEN.vueSFC(p, design);
ok(vueGx.includes(".gtest "), "Vue 导出包含组件样式");
const promptGx = GEN.prompt(design, { pages: [p] });
ok(promptGx.includes("Uiverse.io 社区组件") && promptGx.includes("```html"), "提示词附社区组件代码");
p.items.pop();

console.log(fails === 0 ? "\n全部通过 ✅" : `\n${fails} 项失败 ❌`);
process.exit(fails === 0 ? 0 : 1);
