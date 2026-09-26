<!--
  gw Designer 导出 — 页面「设置」(1280×800)
  使用：Vue 3 <script setup>。交互（开关/页签/滑块）已内置。
-->
<template>
  <div class="m3e-page page-root" :style="pageStyle">
    <div class="m3e-item" style="left:16px;top:16px;width:160px;height:48px;border-radius:16px;overflow:hidden;"><div @click="uxnza1xcz=!uxnza1xcz" :class="{on:uxnza1xcz}" class="m3e-sw"><span class="lb">通知</span><span class="track"><span class="knob"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="14" height="14" aria-hidden="true"><path d="m378-332 363-363q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L399-267q-9 9-21 9t-21-9L175-449q-9-9-8.5-21.5T176-492q9-9 21.5-9t21.5 9l159 160Z"/></svg></span></span></span></div></div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const uxnza1xcz = ref(false);

const pageStyle = {
  width: '1280px',
  height: '800px',
  borderRadius: '28px',
   '--pri': '#6750A4',
  '--on-pri': '#FFFFFF',
  '--pri-c': '#EADDFF',
  '--on-pri-c': '#21005D',
  '--inv-pri': '#D0BCFF',
  '--sec-c': '#E8DEF8',
  '--on-sec-c': '#1D192B',
  '--ter-c': '#FFD8E4',
  '--on-ter-c': '#31111D',
  '--sur': '#FEF7FF',
  '--sur-cl': '#F7F2FA',
  '--sur-c': '#F3EDF7',
  '--sur-ch': '#ECE6F0',
  '--sur-chh': '#E6E0E9',
  '--on-sur': '#1D1B20',
  '--on-sur-var': '#49454F',
  '--out': '#79747E',
  '--out-var': '#CAC4D0',
  '--inv-sur': '#322F35',
  '--inv-on-sur': '#F5EFF7',
  '--err': '#B3261E',
  '--on-err': '#FFFFFF',
  '--err-c': '#F9DEDC',
  '--on-err-c': '#410E0B',
  
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

})
</script>

<style>
/* ===== 基础 ===== */
.m3e-page{position:relative;overflow:hidden;font-family:Roboto,"HarmonyOS Sans SC","Microsoft YaHei UI","Microsoft YaHei",system-ui,sans-serif;color:var(--on-sur);box-sizing:border-box;}
.m3e-page *,.m3e-page *::before,.m3e-page *::after{box-sizing:border-box;}
.m3e-item{position:absolute;}
.m3e-ic{display:inline-flex;flex:none;}
.m3e-ic svg{display:block;fill:currentColor;}

/* ===== 按钮 ===== */
.m3e-btn{width:100%;height:100%;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 24px;font-size:16px;font-weight:600;border:none;cursor:pointer;user-select:none;white-space:nowrap;overflow:hidden;}
.m3e-btn .m3e-ic svg{width:20px;height:20px;}
.m3e-btn .lb{overflow:hidden;text-overflow:ellipsis;}
.m3e-btn.v-filled{background:var(--pri);color:var(--on-pri);}
.m3e-btn.v-tonal{background:var(--sec-c);color:var(--on-sec-c);}
.m3e-btn.v-elevated{background:var(--sur-cl);color:var(--pri);box-shadow:0 1px 2px rgba(0,0,0,.3),0 1px 3px 1px rgba(0,0,0,.15);}
.m3e-btn.v-outlined{background:transparent;color:var(--pri);border:1px solid var(--out);}
.m3e-btn.v-text{background:transparent;color:var(--pri);padding:0 16px;}
.m3e-btn.icon-only{padding:0 20px;}

/* ===== 图标按钮 ===== */
.m3e-iconbtn{width:100%;height:100%;display:inline-flex;align-items:center;justify-content:center;border:none;cursor:pointer;background:transparent;color:var(--on-sur-var);}
.m3e-iconbtn svg{width:24px;height:24px;}
.m3e-iconbtn.v-filled{background:var(--pri);color:var(--on-pri);}
.m3e-iconbtn.v-tonal{background:var(--sec-c);color:var(--on-sec-c);}
.m3e-iconbtn.v-outlined{border:1px solid var(--out);color:var(--on-sur-var);}

/* ===== FAB / 扩展 FAB ===== */
.m3e-fab{width:100%;height:100%;display:inline-flex;align-items:center;justify-content:center;border:none;cursor:pointer;}
.m3e-fab svg{width:24px;height:24px;}
.m3e-fab.v-primary{background:var(--pri);color:var(--on-pri);}
.m3e-fab.v-tonal{background:var(--pri-c);color:var(--on-pri-c);}
.m3e-fab.v-surface{background:var(--sur-ch);color:var(--pri);box-shadow:0 1px 3px rgba(0,0,0,.3);}
.m3e-extfab{width:100%;height:100%;display:inline-flex;align-items:center;justify-content:center;gap:12px;padding:0 20px;border:none;cursor:pointer;font-size:16px;font-weight:600;}
.m3e-extfab svg{width:24px;height:24px;}
.m3e-extfab.v-primary{background:var(--pri);color:var(--on-pri);}
.m3e-extfab.v-tonal{background:var(--pri-c);color:var(--on-pri-c);}
.m3e-extfab.v-surface{background:var(--sur-ch);color:var(--pri);box-shadow:0 1px 3px rgba(0,0,0,.3);}

/* ===== 拆分按钮 ===== */
.m3e-split{width:100%;height:100%;display:inline-flex;align-items:stretch;}
.m3e-split .main{flex:1;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 20px;font-size:16px;font-weight:600;border:none;cursor:pointer;min-width:0;}
.m3e-split .main .lb{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.m3e-split .act{width:56px;flex:none;display:inline-flex;align-items:center;justify-content:center;border:none;cursor:pointer;border-left:1px solid rgba(255,255,255,.35);}
.m3e-split svg{width:20px;height:20px;}
.m3e-split{overflow:hidden;}
.m3e-split.v-filled .main,.m3e-split.v-filled .act{background:var(--pri);color:var(--on-pri);}
.m3e-split.v-tonal .main,.m3e-split.v-tonal .act{background:var(--sec-c);color:var(--on-sec-c);}
.m3e-split.v-tonal .act{border-left-color:rgba(0,0,0,.12);}

/* ===== FAB 菜单 ===== */
.m3e-fabmenu{width:100%;height:100%;display:flex;flex-direction:column;background:var(--sec-c);color:var(--on-sec-c);padding:8px;gap:2px;overflow:hidden;}
.m3e-fabmenu .mi{flex:1;display:flex;align-items:center;gap:16px;padding:0 20px;font-size:16px;min-height:40px;}
.m3e-fabmenu .mi svg{width:24px;height:24px;}
.m3e-fabmenu.v-primary{background:var(--pri-c);color:var(--on-pri-c);}
.m3e-fabmenu.v-filled{background:var(--pri);color:var(--on-pri);}

/* ===== 标签片 Chip ===== */
.m3e-chip{width:100%;height:100%;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:0 16px;font-size:14px;cursor:pointer;white-space:nowrap;overflow:hidden;}
.m3e-chip svg{width:18px;height:18px;}
.m3e-chip.v-outlined{border:1px solid var(--out-var);color:var(--on-sur);background:transparent;}
.m3e-chip.v-elevated{background:var(--sur-cl);color:var(--on-sur);box-shadow:0 1px 2px rgba(0,0,0,.2);}
.m3e-chip .ck{display:none;}
.m3e-chip.on{background:var(--sec-c);color:var(--on-sec-c);border-color:transparent;}
.m3e-chip.on .ck{display:inline-flex;}
.m3e-chip.on .ld{display:none;}

/* ===== 顶部应用栏 ===== */
.m3e-appbar{width:100%;height:100%;display:flex;flex-direction:column;background:var(--sur);}
.m3e-appbar .bar{flex:1;display:flex;align-items:center;gap:4px;padding:0 8px 0 8px;}
.m3e-appbar .ttl{flex:1;font-size:22px;font-weight:500;padding-left:8px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.m3e-appbar .m3e-ic{width:48px;height:48px;align-items:center;justify-content:center;color:var(--on-sur-var);}

/* ===== 底部导航栏 ===== */
.m3e-bnav{width:100%;height:100%;display:flex;background:var(--sur-c);align-items:stretch;}
.m3e-bnav .dest{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;}
.m3e-bnav .ind{width:64px;height:32px;border-radius:16px;display:flex;align-items:center;justify-content:center;color:var(--on-sur-var);}
.m3e-bnav .dest.sel .ind{background:var(--sec-c);color:var(--on-sec-c);}
.m3e-bnav .dest svg{width:24px;height:24px;}
.m3e-bnav .dl{font-size:12px;color:var(--on-sur);letter-spacing:.3px;}

/* ===== 侧边导航栏 ===== */
.m3e-rail{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;background:var(--sur);padding-top:44px;gap:12px;}
.m3e-rail .hd{width:48px;height:48px;display:flex;align-items:center;justify-content:center;color:var(--on-sur-var);margin-bottom:12px;}
.m3e-rail .hd svg{width:24px;height:24px;}
.m3e-rail .dest{display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;}
.m3e-rail .ind{width:56px;height:32px;border-radius:16px;display:flex;align-items:center;justify-content:center;color:var(--on-sur-var);}
.m3e-rail .dest.sel .ind{background:var(--sec-c);color:var(--on-sec-c);}
.m3e-rail .dest svg{width:24px;height:24px;}
.m3e-rail .dl{font-size:12px;color:var(--on-sur);}

/* ===== 悬浮工具栏 ===== */
.m3e-tb{width:100%;height:100%;display:flex;align-items:center;padding:0 12px;gap:4px;overflow:hidden;}
.m3e-tb.v-tonal{background:var(--pri-c);color:var(--on-pri-c);}
.m3e-tb.v-surface{background:var(--sur-ch);color:var(--on-sur-var);box-shadow:0 1px 3px rgba(0,0,0,.25);}
.m3e-tb .m3e-ic{width:48px;height:48px;flex:none;align-items:center;justify-content:center;}
.m3e-tb .m3e-ic svg{width:24px;height:24px;}
.m3e-tb .sp{flex:1;}

/* ===== 标签页 Tabs ===== */
.m3e-tabs{width:100%;height:100%;display:flex;align-items:center;gap:8px;padding:0 8px;}
.m3e-tabs .tab{flex:1;height:32px;display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;color:var(--on-sur-var);border-radius:16px;cursor:pointer;white-space:nowrap;overflow:hidden;min-width:0;}
.m3e-tabs .tab svg{width:18px;height:18px;}
.m3e-tabs .tab.sel{background:var(--sec-c);color:var(--on-sec-c);font-weight:600;}

/* ===== 搜索栏 ===== */
.m3e-search{width:100%;height:100%;display:flex;align-items:center;gap:12px;padding:0 16px;background:var(--sur-ch);color:var(--on-sur-var);font-size:16px;overflow:hidden;}
.m3e-search svg{width:24px;height:24px;flex:none;}
.m3e-search .hint{flex:1;overflow:hidden;white-space:nowrap;}

/* ===== 卡片 ===== */
.m3e-card{width:100%;height:100%;display:flex;flex-direction:column;border-radius:20px;overflow:hidden;}
.m3e-card.v-elevated{background:var(--sur-cl);box-shadow:0 1px 2px rgba(0,0,0,.3),0 1px 3px 1px rgba(0,0,0,.15);}
.m3e-card.v-tonal{background:var(--sur-ch);}
.m3e-card.v-filled{background:var(--sur-chh);}
.m3e-card.v-outlined{background:var(--sur);border:1px solid var(--out-var);}
.m3e-card .img{background:var(--sur-chh);display:flex;align-items:center;justify-content:center;color:var(--on-sur-var);flex:none;}
.m3e-card.v-tonal .img{background:var(--sur-chh);}
.m3e-card .img svg{width:32px;height:32px;opacity:.7;}
.m3e-card .img img,.m3e-card .bgimg{width:100%;height:100%;object-fit:cover;display:block;}
.m3e-card .bd{flex:1;padding:16px;min-height:0;}
.m3e-card .hl{font-size:16px;font-weight:600;color:var(--on-sur);}
.m3e-card .sp{font-size:14px;color:var(--on-sur-var);margin-top:4px;}

/* ===== 列表项 ===== */
.m3e-li{width:100%;height:100%;display:flex;align-items:center;gap:16px;padding:0 16px;overflow:hidden;}
.m3e-li .lead{width:40px;height:40px;flex:none;display:flex;align-items:center;justify-content:center;color:var(--on-sur-var);}
.m3e-li .lead svg{width:24px;height:24px;}
.m3e-li .txs{flex:1;min-width:0;}
.m3e-li .hl{font-size:16px;color:var(--on-sur);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.m3e-li .sub{font-size:14px;color:var(--on-sur-var);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.m3e-li .m3e-ic.trail{color:var(--on-sur-var);}
.m3e-li .m3e-ic.trail svg{width:24px;height:24px;}

/* ===== 容器框 ===== */
.m3e-box{width:100%;height:100%;background:var(--sur-cl);}

/* ===== 对话框 ===== */
.m3e-dialog{width:100%;height:100%;display:flex;flex-direction:column;background:var(--sur-chh);border-radius:28px;padding:24px;overflow:hidden;}
.m3e-dialog .hd{display:flex;align-items:center;gap:16px;color:var(--sec-c,var(--pri));}
.m3e-dialog .hd svg{width:24px;height:24px;flex:none;}
.m3e-dialog .ttl{font-size:24px;color:var(--on-sur);}
.m3e-dialog .bd{flex:1;font-size:14px;color:var(--on-sur-var);margin-top:16px;overflow:hidden;}
.m3e-dialog .acts{display:flex;justify-content:flex-end;gap:8px;padding-top:16px;}
.m3e-dialog .abtn{height:40px;padding:0 12px;display:inline-flex;align-items:center;font-size:14px;font-weight:600;color:var(--pri);border:none;background:none;cursor:pointer;}

/* ===== 消息条 Snackbar ===== */
.m3e-snack{width:100%;height:100%;display:flex;align-items:center;gap:8px;padding:0 16px;background:var(--inv-sur);color:var(--inv-on-sur);border-radius:8px;font-size:14px;overflow:hidden;}
.m3e-snack .lb{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.m3e-snack .act{color:var(--inv-pri);font-weight:600;cursor:pointer;flex:none;}

/* ===== 文本输入框 ===== */
.m3e-tf{width:100%;height:100%;position:relative;display:flex;flex-direction:column;justify-content:flex-end;padding:6px 16px 8px;overflow:hidden;}
.m3e-tf.v-outlined{border:1px solid var(--out);background:transparent;}
.m3e-tf.v-filled{background:var(--sur-chh);}
.m3e-tf .cap{font-size:12px;color:var(--pri);line-height:1.2;}
.m3e-tf .val{font-size:16px;color:var(--on-sur);line-height:1.35;}
.m3e-tf .m3e-ic{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--on-sur-var);}
.m3e-tf .m3e-ic svg{width:24px;height:24px;}
.m3e-tf.has-ic{padding-right:44px;}

/* ===== 下拉菜单 ===== */
.m3e-select{width:100%;height:100%;position:relative;display:flex;flex-direction:column;justify-content:flex-end;padding:6px 16px 8px;overflow:hidden;}
.m3e-select.v-outlined{border:1px solid var(--out);}
.m3e-select.v-filled{background:var(--sur-chh);}
.m3e-select .cap{font-size:12px;color:var(--pri);line-height:1.2;}
.m3e-select .val{font-size:16px;color:var(--on-sur);line-height:1.35;}
.m3e-select .arr{position:absolute;right:12px;top:50%;transform:translateY(-50%);color:var(--on-sur-var);}
.m3e-select .arr svg{width:24px;height:24px;}

/* ===== 开关 ===== */
.m3e-sw{width:100%;height:100%;display:flex;align-items:center;justify-content:space-between;padding:0 4px 0 12px;overflow:hidden;}
.m3e-sw .lb{font-size:16px;color:var(--on-sur);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.m3e-sw .track{position:relative;width:52px;height:32px;border-radius:16px;flex:none;background:var(--sur-chh);border:2px solid var(--out);transition:background .2s,border-color .2s;}
.m3e-sw.on .track{background:var(--pri);border-color:var(--pri);}
.m3e-sw .knob{position:absolute;top:50%;left:6px;transform:translateY(-50%);width:16px;height:16px;border-radius:50%;background:var(--out);display:flex;align-items:center;justify-content:center;transition:left .2s,width .2s,height .2s;}
.m3e-sw.on .knob{left:24px;width:24px;height:24px;background:var(--on-pri);}
.m3e-sw .knob svg{width:14px;height:14px;fill:var(--pri);opacity:0;}
.m3e-sw.on .knob svg{opacity:1;}

/* ===== 复选框 ===== */
.m3e-cb{width:100%;height:100%;display:flex;align-items:center;gap:16px;overflow:hidden;}
.m3e-cb .box{width:18px;height:18px;flex:none;border-radius:2px;border:2px solid var(--on-sur-var);display:flex;align-items:center;justify-content:center;background:transparent;}
.m3e-cb.on .box{background:var(--pri);border-color:var(--pri);}
.m3e-cb .box svg{width:14px;height:14px;fill:var(--on-pri);opacity:0;}
.m3e-cb.on .box svg{opacity:1;}
.m3e-cb .lb{font-size:16px;color:var(--on-sur);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

/* ===== 单选按钮 ===== */
.m3e-rd{width:100%;height:100%;display:flex;align-items:center;gap:16px;overflow:hidden;}
.m3e-rd .cir{width:20px;height:20px;flex:none;border-radius:50%;border:2px solid var(--on-sur-var);display:flex;align-items:center;justify-content:center;}
.m3e-rd.on .cir{border-color:var(--pri);}
.m3e-rd .cir::after{content:"";width:10px;height:10px;border-radius:50%;background:var(--pri);transform:scale(0);}
.m3e-rd.on .cir::after{transform:scale(1);}
.m3e-rd .lb{font-size:16px;color:var(--on-sur);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

/* ===== 滑块 ===== */
.m3e-slider{width:100%;height:100%;position:relative;}
.m3e-slider .trk{position:absolute;left:0;right:0;top:50%;height:4px;transform:translateY(-50%);border-radius:2px;background:var(--sur-chh);}
.m3e-slider .fil{position:absolute;left:0;top:50%;height:4px;transform:translateY(-50%);border-radius:2px;background:var(--pri);}
.m3e-slider .hnd{position:absolute;top:50%;width:4px;height:44px;transform:translate(-50%,-50%);border-radius:2px;background:var(--pri);}
.m3e-slider .dot{position:absolute;top:50%;left:0;width:4px;height:4px;transform:translateY(-50%);border-radius:50%;background:var(--pri);}

/* ===== 文本 ===== */
.m3e-text{width:100%;height:100%;color:var(--on-sur);white-space:pre-wrap;word-break:break-word;overflow:hidden;font-weight:400;}

/* ===== 图片 / 相机 / 地图 ===== */
.m3e-image{width:100%;height:100%;background:var(--sur-ch);display:flex;align-items:center;justify-content:center;color:var(--on-sur-var);overflow:hidden;border-radius:20px;}
.m3e-image svg{width:48px;height:48px;opacity:.65;}
.m3e-image img{width:100%;height:100%;object-fit:cover;display:block;}
.m3e-camera{width:100%;height:100%;background:#1C1B1F;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.75);position:relative;overflow:hidden;border-radius:20px;}
.m3e-camera svg{width:48px;height:48px;}
.m3e-camera .rec{position:absolute;top:12px;right:16px;display:flex;align-items:center;gap:6px;font-size:12px;letter-spacing:1px;}
.m3e-camera .rec::before{content:"";width:8px;height:8px;border-radius:50%;background:#B3261E;}
.m3e-map{width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:var(--on-sur-var);overflow:hidden;border-radius:20px;background:repeating-linear-gradient(0deg,var(--sur-cl) 0 34px,var(--sur-ch) 34px 36px),repeating-linear-gradient(90deg,transparent 0 46px,rgba(103,80,164,.08) 46px 48px),var(--sur-cl);}
.m3e-map svg{width:48px;height:48px;opacity:.6;}

/* ===== 徽标 ===== */
.m3e-badge{width:100%;height:100%;display:inline-flex;align-items:center;justify-content:center;min-width:16px;padding:0 5px;background:var(--err);color:var(--on-err);border-radius:8px;font-size:11px;font-weight:600;}

/* ===== 分割线 ===== */
.m3e-divider{width:100%;height:100%;display:flex;align-items:center;}
.m3e-divider .ln{width:100%;height:1px;background:var(--out-var);}

/* ===== 进度 ===== */
.m3e-loading{width:100%;height:100%;display:flex;align-items:center;justify-content:center;}
.m3e-loading svg{width:100%;height:100%;animation:m3e-rot 1.4s linear infinite;}
.m3e-lprog{width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;}
.m3e-lprog .trk{position:relative;width:100%;height:8px;border-radius:4px;background:var(--pri-c);overflow:hidden;}
.m3e-lprog .fil{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:var(--pri);}
.m3e-lprog.indet .fil{width:40%;animation:m3e-slide 1.6s ease-in-out infinite;}
.m3e-cprog{width:100%;height:100%;display:flex;align-items:center;justify-content:center;}
.m3e-cprog svg{width:100%;height:100%;}
.m3e-cprog.indet svg{animation:m3e-rot 1.4s linear infinite;}
@keyframes m3e-rot{to{transform:rotate(360deg);}}
@keyframes m3e-slide{0%{left:-40%;}100%{left:100%;}}

/* ===== 数据表格 ===== */
.m3e-table{width:100%;height:100%;display:flex;flex-direction:column;background:var(--sur);border:1px solid var(--out-var);border-radius:16px;overflow:hidden;}
.m3e-table .tr{display:flex;min-height:0;flex:1;}
.m3e-table .tr + .tr{border-top:1px solid var(--out-var);}
.m3e-table .th{background:var(--sur-cl);}
.m3e-table .th,.m3e-table .td{flex:1;min-width:0;display:flex;align-items:center;padding:0 16px;font-size:14px;color:var(--on-sur);overflow:hidden;white-space:nowrap;}
.m3e-table .th{font-weight:600;color:var(--on-sur-var);}

/* ===== 头像 ===== */
.m3e-avatar{width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:16px;font-weight:600;overflow:hidden;}
.m3e-avatar svg{width:55%;height:55%;}
.m3e-avatar img{width:100%;height:100%;object-fit:cover;border-radius:50%;}

/* ===== 评分 ===== */
.m3e-rating{width:100%;height:100%;display:flex;align-items:center;gap:2px;overflow:hidden;}
.m3e-rating .m3e-ic svg{width:24px;height:24px;}
.m3e-rating .on{color:var(--pri);}
.m3e-rating .off{color:var(--out-var);}

/* ===== 分页 ===== */
.m3e-pagi{width:100%;height:100%;display:flex;align-items:center;justify-content:center;gap:4px;color:var(--on-sur-var);}
.m3e-pagi .pg{min-width:32px;height:32px;padding:0 6px;display:flex;align-items:center;justify-content:center;font-size:14px;border-radius:16px;}
.m3e-pagi .pg.sel{background:var(--sec-c);color:var(--on-sec-c);font-weight:600;}
.m3e-pagi .m3e-ic svg{width:22px;height:22px;}

/* ===== 步骤条 ===== */
.m3e-stepper{width:100%;height:100%;display:flex;align-items:flex-start;padding:4px 8px;gap:0;overflow:hidden;}
.m3e-stepper .st{display:flex;flex-direction:column;align-items:center;gap:4px;flex:none;max-width:96px;}
.m3e-stepper .dot{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;background:var(--sur-chh);color:var(--on-sur-var);}
.m3e-stepper .st.done .dot{background:var(--pri-c);color:var(--on-pri-c);}
.m3e-stepper .st.cur .dot{background:var(--pri);color:var(--on-pri);}
.m3e-stepper .dot svg{width:16px;height:16px;}
.m3e-stepper .sl{font-size:12px;color:var(--on-sur-var);max-width:88px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.m3e-stepper .st.cur .sl{color:var(--on-sur);font-weight:600;}
.m3e-stepper .ln{flex:1;height:2px;background:var(--out-var);margin-top:13px;min-width:8px;}
.m3e-stepper .ln.done{background:var(--pri);}

/* ===== 折叠面板 ===== */
.m3e-acc{width:100%;height:100%;display:flex;flex-direction:column;background:var(--sur);border-radius:16px;overflow:hidden;}
.m3e-acc .ai{flex:1;min-height:0;display:flex;align-items:center;gap:12px;padding:0 16px;font-size:15px;color:var(--on-sur);}
.m3e-acc .ai + .ai{border-top:1px solid var(--out-var);}
.m3e-acc .ai.open{background:var(--sur-cl);}
.m3e-acc .ai .m3e-ic{margin-left:auto;color:var(--on-sur-var);}
.m3e-acc .ai .m3e-ic svg{width:22px;height:22px;}

/* ===== 轮播 ===== */
.m3e-carousel{width:100%;height:100%;position:relative;background:var(--sur-ch);border-radius:20px;overflow:hidden;display:flex;align-items:center;justify-content:center;color:var(--on-sur-var);}
.m3e-carousel > svg{width:48px;height:48px;opacity:.6;}
.m3e-carousel .cv{position:absolute;top:50%;transform:translateY(-50%);width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.85);color:#49454F;display:flex;align-items:center;justify-content:center;}
.m3e-carousel .cv.l{left:12px;} .m3e-carousel .cv.r{right:12px;}
.m3e-carousel .cv svg{width:20px;height:20px;}
.m3e-carousel .dots{position:absolute;bottom:10px;left:0;right:0;display:flex;justify-content:center;gap:6px;}
.m3e-carousel .dots i{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.7);}
.m3e-carousel .dots i.on{background:var(--pri);width:16px;border-radius:4px;}

/* ===== 视频占位 ===== */
.m3e-video{width:100%;height:100%;background:#1C1B1F;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.85);position:relative;overflow:hidden;border-radius:16px;}
.m3e-video > svg{width:56px;height:56px;}
.m3e-video .bar{position:absolute;left:0;right:0;bottom:0;height:4px;background:rgba(255,255,255,.25);}
.m3e-video .bar i{position:absolute;left:0;top:0;bottom:0;width:35%;background:var(--pri);}

/* ===== 自定义 HTML ===== */
.m3e-html{width:100%;height:100%;overflow:hidden;}
.m3e-html.gxbox{display:flex;align-items:center;justify-content:center;}

/* ===== 日历 ===== */
.m3e-cal{width:100%;height:100%;display:flex;flex-direction:column;background:var(--sur-cl);border-radius:20px;padding:16px;overflow:hidden;}
.m3e-cal .hd{display:flex;align-items:center;justify-content:space-between;color:var(--on-sur-var);flex:none;margin-bottom:8px;}
.m3e-cal .hd .m3e-ic svg{width:20px;height:20px;}
.m3e-cal .mt{font-size:15px;font-weight:600;color:var(--on-sur);}
.m3e-cal .wk,.m3e-cal .grid{display:grid;grid-template-columns:repeat(7,1fr);}
.m3e-cal .wk span{text-align:center;font-size:11px;color:var(--on-sur-var);padding:4px 0;}
.m3e-cal .grid{flex:1;grid-auto-rows:1fr;}
.m3e-cal .d{display:flex;align-items:center;justify-content:center;font-size:12px;color:var(--on-sur);}
.m3e-cal .d i{font-style:normal;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;}
.m3e-cal .d.sel i{background:var(--pri);color:var(--on-pri);font-weight:600;}
.m3e-cal .d.mute{color:var(--out);}

/* ===== 日期 / 时间输入（复用文本框样式） ===== */

/* ===== 提示气泡 ===== */
.m3e-tip{width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:relative;}
.m3e-tip .bub{background:var(--inv-sur);color:var(--inv-on-sur);font-size:12px;padding:6px 12px;border-radius:8px;position:relative;white-space:nowrap;max-width:100%;overflow:hidden;text-overflow:ellipsis;}
.m3e-tip .bub::after{content:"";position:absolute;left:50%;bottom:-4px;width:8px;height:8px;background:var(--inv-sur);transform:translateX(-50%) rotate(45deg);}

/* ===== 底部弹层 ===== */
.m3e-sheet{width:100%;height:100%;background:var(--sur-cl);border-radius:24px 24px 0 0;display:flex;flex-direction:column;padding:8px 24px 20px;overflow:hidden;}
.m3e-sheet .grip{width:32px;height:4px;border-radius:2px;background:var(--out-var);margin:4px auto 12px;flex:none;}
.m3e-sheet .ttl{font-size:22px;color:var(--on-sur);}
.m3e-sheet .sub{font-size:14px;color:var(--on-sur-var);margin-top:4px;}
.m3e-sheet .acts{margin-top:auto;display:flex;justify-content:flex-end;gap:8px;}
.m3e-sheet .abtn{height:40px;padding:0 12px;display:inline-flex;align-items:center;font-size:14px;font-weight:600;color:var(--pri);border:none;background:none;cursor:pointer;}

/* ===== 导航抽屉 ===== */
.m3e-drawer{width:100%;height:100%;background:var(--sur);display:flex;flex-direction:column;padding:16px 12px;overflow:hidden;border-radius:16px;}
.m3e-drawer .dh{display:flex;align-items:center;gap:12px;padding:8px 12px 20px;color:var(--on-sur-var);}
.m3e-drawer .dh svg{width:24px;height:24px;}
.m3e-drawer .dt{font-size:20px;font-weight:500;color:var(--on-sur);}
.m3e-drawer .di{display:flex;align-items:center;gap:12px;height:52px;padding:0 16px;border-radius:26px;font-size:14px;color:var(--on-sur-var);margin:2px 0;}
.m3e-drawer .di svg{width:22px;height:22px;flex:none;}
.m3e-drawer .di.sel{background:var(--sec-c);color:var(--on-sec-c);font-weight:600;}

/* ===== 横幅通知 ===== */
.m3e-banner{width:100%;height:100%;display:flex;align-items:flex-start;gap:16px;background:var(--sur-chh);padding:16px;overflow:hidden;border-radius:16px;}
.m3e-banner svg{width:24px;height:24px;flex:none;color:var(--on-sur-var);}
.m3e-banner .tx{flex:1;min-width:0;}
.m3e-banner .l1{font-size:14px;color:var(--on-sur);}
.m3e-banner .l2{font-size:12px;color:var(--on-sur-var);margin-top:2px;}
.m3e-banner .act{flex:none;display:flex;gap:8px;}
.m3e-banner .abtn{height:32px;padding:0 8px;display:inline-flex;align-items:center;font-size:13px;font-weight:600;color:var(--pri);border:none;background:none;cursor:pointer;}

/* ===== 大图头部 ===== */
.m3e-hero{width:100%;height:100%;position:relative;overflow:hidden;border-radius:20px;background:linear-gradient(160deg,#4A4459,#1D1B20);display:flex;align-items:flex-end;}
.m3e-hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;}
.m3e-hero .ov{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(0,0,0,.65));}
.m3e-hero .tx{position:relative;padding:16px;width:100%;}
.m3e-hero .h{font-size:26px;font-weight:600;color:#fff;}
.m3e-hero .s{font-size:14px;color:rgba(255,255,255,.85);margin-top:2px;}

/* ===== 列表组 ===== */
.m3e-lgroup{width:100%;height:100%;background:var(--sur-cl);border-radius:16px;padding:6px 0;display:flex;flex-direction:column;overflow:hidden;}
.m3e-lgroup .li{flex:1;min-height:0;display:flex;align-items:center;gap:16px;padding:0 18px;}
.m3e-lgroup .li svg{width:22px;height:22px;color:var(--on-sur-var);flex:none;}
.m3e-lgroup .lb{flex:1;font-size:14px;color:var(--on-sur);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.m3e-lgroup .li .tr{width:18px;height:18px;color:var(--on-sur-var);}

/* ===== 分区标题 ===== */
.m3e-sechead{width:100%;height:100%;display:flex;align-items:center;justify-content:space-between;overflow:hidden;}
.m3e-sechead .t{font-size:18px;font-weight:600;color:var(--on-sur);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.m3e-sechead .more{display:flex;align-items:center;gap:2px;font-size:13px;color:var(--pri);flex:none;cursor:pointer;}
.m3e-sechead .more svg{width:18px;height:18px;}

/* ===== 空状态 ===== */
.m3e-empty{width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:16px;overflow:hidden;}
.m3e-empty svg{width:56px;height:56px;color:var(--out);opacity:.7;}
.m3e-empty .t{font-size:16px;font-weight:600;color:var(--on-sur);}
.m3e-empty .s{font-size:13px;color:var(--on-sur-var);}

/* ===== 弹窗图层（遮罩 + 弹层成员） ===== */
.m3e-popup{position:absolute;inset:0;display:none;background:rgba(0,0,0,.42);z-index:60;}
.m3e-popup.open{display:block;}
.m3e-scrim{position:absolute;inset:0;background:rgba(0,0,0,.35);pointer-events:none;}
.m3e-scrim .tag{position:absolute;top:8px;left:8px;background:#322F35;color:#F5EFF7;font-size:11px;padding:3px 10px;border-radius:99px;}

/* 组件圆角跟随外壳（属性面板可调圆角） */
.m3e-item > *{border-radius:inherit;}

/* ===== Uiverse 精选组件（来源 uiverse.io/galaxy，MIT） ===== */
.uv-wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;}
.uv-btnneon{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#111;}
.uv-btnneon button{position:relative;padding:1em 1.8em;outline:none;border:1px solid #303030;background:#212121;color:#ae00ff;text-transform:uppercase;letter-spacing:2px;font-size:14px;overflow:hidden;transition:.2s;border-radius:20px;cursor:pointer;font-weight:bold;}
.uv-btnneon button:hover{box-shadow:0 0 10px #ae00ff,0 0 25px #001eff,0 0 50px #ae00ff;transition-delay:.6s;}
.uv-btnneon button span{position:absolute;}
.uv-btnneon button span:nth-child(1){top:0;left:-100%;width:100%;height:2px;background:linear-gradient(90deg,transparent,#ae00ff);}
.uv-btnneon button:hover span:nth-child(1){left:100%;transition:.7s;}
.uv-btnneon button span:nth-child(3){bottom:0;right:-100%;width:100%;height:2px;background:linear-gradient(90deg,transparent,#001eff);}
.uv-btnneon button:hover span:nth-child(3){right:100%;transition:.7s;transition-delay:.35s;}
.uv-btnneon button span:nth-child(2){top:-100%;right:0;width:2px;height:100%;background:linear-gradient(180deg,transparent,#ae00ff);}
.uv-btnneon button:hover span:nth-child(2){top:100%;transition:.7s;transition-delay:.17s;}
.uv-btnneon button span:nth-child(4){bottom:-100%;left:0;width:2px;height:100%;background:linear-gradient(360deg,transparent,#001eff);}
.uv-btnneon button:hover span:nth-child(4){bottom:100%;transition:.7s;transition-delay:.52s;}
.uv-btnneon button:active{background:linear-gradient(to top right,#ae00af,#5a00ff);}
.uv-btnscifi{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#0c0c16;}
.uv-btnscifi .button{position:relative;padding:12px 25px;font-size:15px;color:#1e9bff;border:2px solid rgba(0,0,0,.5);border-radius:4px;text-shadow:0 0 15px #1e9bff;text-decoration:none;text-transform:uppercase;letter-spacing:.1rem;transition:.5s;z-index:1;display:inline-block;}
.uv-btnscifi .button:hover{color:#fff;border:2px solid rgba(0,0,0,0);}
.uv-btnscifi .button::before{content:"";position:absolute;top:0;left:0;width:100%;height:100%;background:#1e9bff;z-index:-1;transform:scale(0);transition:.5s;}
.uv-btnscifi .button:hover::before{transform:scale(1);transition-delay:.5s;box-shadow:0 0 10px #1e9bff,0 0 30px #1e9bff,0 0 60px #1e9bff;}
.uv-btnscifi .button span{position:absolute;background:#1e9bff;pointer-events:none;border-radius:2px;box-shadow:0 0 10px #1e9bff,0 0 20px #1e9bff;transition:.5s ease-in-out;transition-delay:.25s;}
.uv-btnscifi .button:hover span{opacity:0;transition-delay:0s;}
.uv-btnscifi .button span:nth-child(1),.uv-btnscifi .button span:nth-child(3){width:40px;height:4px;}
.uv-btnscifi .button span:nth-child(2),.uv-btnscifi .button span:nth-child(4){width:4px;height:40px;}
.uv-btncta{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f4f0fa;}
.uv-btncta .cta{position:relative;margin:auto;padding:11.5px 18px;transition:all .2s ease;border:3px solid #552da8;border-radius:50px;background:#552da8;cursor:pointer;}
.uv-btncta .cta:before{content:"";position:absolute;top:0;right:0;display:block;border-radius:50px;background:#fff;width:45px;height:45px;transition:all .8s ease;}
.uv-btncta .cta span{position:relative;font-size:16px;color:#fff;font-weight:400;}
.uv-btncta .cta:hover{background:transparent;}
.uv-btncta .cta:hover:before{transform:scale(2.2);background:rgba(255,255,255,.15);}
.uv-btncta .cta svg{position:absolute;top:50%;transform:translateY(-50%) rotate(-90deg);margin-left:5px;right:15px;stroke:#fff;fill:none;stroke-width:2px;transition:.2s ease;}
.uv-btncta .cta:hover svg{stroke-dasharray:50;stroke-dashoffset:0;transition:.8s ease;}
.uv-loadgeo{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#fff;}
.uv-loadgeo .loader{--path:#2f3545;--dot:#5628ee;--duration:3s;width:60%;aspect-ratio:1;position:relative;}
.uv-loadgeo .loader:before{content:"";width:12%;aspect-ratio:1;border-radius:50%;position:absolute;display:block;background:var(--dot);top:84%;left:43%;transform:translate(-18px,-18px);animation:uv-dotRect var(--duration) cubic-bezier(.785,.135,.15,.86) infinite;}
.uv-loadgeo .loader svg{display:block;width:100%;height:100%;}
.uv-loadgeo .loader svg circle{fill:none;stroke:var(--path);stroke-width:10px;stroke-linejoin:round;stroke-linecap:round;stroke-dasharray:150 50 150 50;stroke-dashoffset:0;animation:uv-pathCircle var(--duration) cubic-bezier(.785,.135,.15,.86) infinite;}
@keyframes uv-dotRect{0%{transform:translate(-18px,-18px) rotate(0);}100%{transform:translate(-18px,-18px) rotate(360deg);}}
@keyframes uv-pathCircle{0%{stroke-dashoffset:0;}100%{stroke-dashoffset:-200;}}
.uv-loadbounce{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1c1c2a;}
.uv-loadbounce .loader{box-sizing:border-box;display:inline-block;width:34px;height:56px;border-top:5px solid #fff;border-bottom:5px solid #fff;position:relative;background:linear-gradient(#FF3D00 30px,transparent 0) no-repeat;background-size:2px 40px;background-position:50% 0;animation:uv-spinx 5s linear infinite;}
.uv-loadbounce .loader:before,.uv-loadbounce .loader:after{content:"";width:28px;left:50%;height:24px;position:absolute;transform:translateX(-50%);background:rgba(255,255,255,.4);border-radius:0 0 20px 20px;animation:uv-lqt 5s linear infinite;}
.uv-loadbounce .loader:after{top:auto;bottom:0;border-radius:20px 20px 0 0;animation:uv-lqb 5s linear infinite;}
@keyframes uv-lqt{0%,100%{background-image:linear-gradient(#FF3D00 40px,transparent 0);background-position:0 0;}50%{background-image:linear-gradient(#FF3D00 40px,transparent 0);background-position:0 40px;}50.1%{background-image:linear-gradient(#FF3D00 40px,transparent 0);background-position:0 -40px;}}
@keyframes uv-lqb{0%{background-image:linear-gradient(#FF3D00 40px,transparent 0);background-position:0 40px;}100%{background-image:linear-gradient(#FF3D00 40px,transparent 0);background-position:0 -40px;}}
@keyframes uv-spinx{0%,49%{transform:rotate(0deg);}50%,100%{transform:rotate(180deg);}}
.uv-swmetal{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#e9e5e0;}
.uv-swmetal .toggleSwitch{display:flex;align-items:center;justify-content:center;position:relative;width:80px;height:40px;background-color:#c7c7c7;border-radius:20px;cursor:pointer;transition-duration:.3s;}
.uv-swmetal .toggleSwitch::after{content:"";position:absolute;height:40px;width:40px;left:0;background:conic-gradient(#686868,#fff,#686868,#fff,#686868);border-radius:50%;transition-duration:.3s;box-shadow:5px 2px 7px rgba(8,8,8,.3);}
.uv-swmetal input:checked+.toggleSwitch::after{transform:translateX(100%);transition-duration:.3s;}
.uv-swmetal input:checked+.toggleSwitch{background-color:#99c597;transition-duration:.3s;}
.uv-swmetal input{display:none;}
.uv-swoff{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#f0f2f7;}
.uv-swoff .switch{font-size:16px;position:relative;display:inline-block;width:5.2em;height:2em;overflow:hidden;}
.uv-swoff .switch input{opacity:0;width:0;height:0;}
.uv-swoff .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#eee;transition:.4s;border-radius:30px;}
.uv-swoff .slider:before{position:absolute;content:"";height:1.4em;width:1.4em;border-radius:20px;border:1px solid #333;left:.4em;bottom:.2em;background-color:#fff;transition:.4s;}
.uv-swoff input:checked+.slider{background-color:#2196F3;}
.uv-swoff input:checked+.slider:before{transform:translateX(3em);}
.uv-swoff .text{position:absolute;top:50%;pointer-events:none;text-transform:uppercase;transform:translateY(-50%);transition:.4s;}
.uv-swoff .text.on{left:.8rem;transform:translateX(-3rem) translateY(-50%);}
.uv-swoff .text.off{color:#999;right:.8rem;}
.uv-swoff input:checked~.text.off{transform:translateX(3rem) translateY(-50%);}
.uv-swoff input:checked~.text.on{transform:translateX(0) translateY(-50%);}
.uv-cardblog{width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#eef1f6;}
.uv-cardblog .card{box-sizing:border-box;display:flex;width:100%;background-color:#fff;border-radius:6px;overflow:hidden;transition:all .15s cubic-bezier(.4,0,.2,1);}
.uv-cardblog .card:hover{box-shadow:10px 10px 30px rgba(0,0,0,.081);}
.uv-cardblog .date-time-container{background:#0F172A;color:#fff;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:8px 12px;flex:none;}
.uv-cardblog .date-time{display:flex;flex-direction:column;align-items:center;font-size:12px;}
.uv-cardblog .separator{width:1px;height:14px;background:rgba(255,255,255,.4);margin:4px 0;}
.uv-cardblog .content{padding:12px 14px;display:flex;flex-direction:column;gap:8px;min-width:0;flex:1;}
.uv-cardblog .title{font-size:14px;font-weight:700;color:#0F172A;text-decoration:none;}
.uv-cardblog .description{font-size:11px;color:#64748B;line-height:1.5;margin:4px 0 0;}
.uv-cardblog .action{font-size:12px;font-weight:600;color:#3B82F6;text-decoration:none;}
@keyframes uv-cpbounce{0%,100%{transform:translateY(0);}50%{transform:translateY(-6px);}}

/* ===== 分段按钮 ===== */
.m3e-seg{width:100%;height:100%;display:flex;align-items:stretch;background:var(--sec-c);border-radius:999px;overflow:hidden;}
.m3e-seg.outline{background:transparent;border:1px solid var(--out);}
.m3e-seg .sg{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;font-size:14px;color:var(--on-sur-var);cursor:pointer;white-space:nowrap;overflow:hidden;min-width:0;}
.m3e-seg .sg svg{width:18px;height:18px;}
.m3e-seg .sg.sel{background:var(--sur);color:var(--on-sur);font-weight:600;}
.m3e-seg:not(.outline) .sg.sel{background:var(--sur-chh);}
.m3e-seg.outline .sg.sel{background:var(--sec-c);color:var(--on-sec-c);}
.m3e-seg .sg + .sg{border-left:1px solid var(--out-var);}
.m3e-seg.outline .sg.sel + .sg,.m3e-seg.outline .sg + .sg.sel{border-left-color:transparent;}

/* ===== 多行输入框 ===== */
.m3e-ta{width:100%;height:100%;display:flex;flex-direction:column;background:var(--sur-chh);border-radius:16px;padding:12px 16px;overflow:hidden;}
.m3e-ta.v-outlined{background:transparent;border:1px solid var(--out);}
.m3e-ta .cap{font-size:12px;color:var(--pri);line-height:1.2;flex:none;}
.m3e-ta .val{flex:1;font-size:14px;color:var(--on-sur);line-height:1.5;margin-top:6px;white-space:pre-wrap;word-break:break-word;overflow:hidden;}

/* ===== 时间线 ===== */
.m3e-tline{width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;}
.m3e-tline .tli{flex:1;min-height:0;display:flex;align-items:center;gap:12px;}
.m3e-tline .rail{width:16px;align-self:stretch;flex:none;display:flex;flex-direction:column;align-items:center;}
.m3e-tline .rail .dot{width:12px;height:12px;border-radius:50%;background:var(--out-var);flex:none;margin-top:2px;}
.m3e-tline .tli.done .rail .dot{background:var(--pri);}
.m3e-tline .tli.cur .rail .dot{background:var(--pri);box-shadow:0 0 0 4px var(--pri-c);}
.m3e-tline .rail .ln2{flex:1;width:2px;background:var(--out-var);}
.m3e-tline.dashed .rail .ln2{background:none;border-left:2px dashed var(--out-var);}
.m3e-tline.noline .rail .ln2{display:none;}
.m3e-tline .tli:last-child .rail .ln2{display:none;}
.m3e-tline .tx{font-size:14px;color:var(--on-sur-var);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.m3e-tline .tli.done .tx,.m3e-tline .tli.cur .tx{color:var(--on-sur);}
.m3e-tline .tli.cur .tx{font-weight:600;}

/* ===== 面包屑 ===== */
.m3e-bc{width:100%;height:100%;display:flex;align-items:center;font-size:14px;color:var(--on-sur-var);overflow:hidden;}
.m3e-bc .bh{display:inline-flex;margin-right:8px;color:var(--on-sur-var);}
.m3e-bc .bh svg{width:16px;height:16px;}
.m3e-bc .bc{display:inline-flex;align-items:center;cursor:pointer;white-space:nowrap;min-width:0;}
.m3e-bc .bc + .bc::before{content:"/";margin:0 7px;color:var(--out);}
.m3e-bc .bc.sel{color:var(--on-sur);font-weight:600;}

/* ===== 引用块 ===== */
.m3e-quote{width:100%;height:100%;display:flex;flex-direction:column;justify-content:center;background:var(--sur-cl);border-radius:16px;padding:16px 20px;overflow:hidden;}
.m3e-quote .qmark{color:var(--pri);flex:none;margin-bottom:4px;}
.m3e-quote .qmark svg{width:24px;height:24px;}
.m3e-quote .qt{font-size:15px;color:var(--on-sur);line-height:1.6;}
.m3e-quote .ct{font-size:12px;color:var(--on-sur-var);margin-top:8px;flex:none;}

/* ===== 代码块 ===== */
.m3e-codeblk{width:100%;height:100%;position:relative;background:#1D1B20;color:#E6E0E9;border-radius:16px;padding:14px 16px;font-family:Consolas,"Cascadia Mono","Courier New",monospace;font-size:12.5px;line-height:1.55;overflow:hidden;}
.m3e-codeblk .lang{position:absolute;top:8px;right:12px;font-size:10px;letter-spacing:.5px;color:rgba(255,255,255,.45);font-family:Roboto,system-ui,sans-serif;}
.m3e-codeblk pre{margin:0;white-space:pre-wrap;word-break:break-word;font:inherit;}

/* ===== 签名属性（每个组件的专属差异化样式） ===== */
.m3e-extfab-spin{display:inline-flex;}
.m3e-extfab-spin svg{animation:m3e-rot 1.1s linear infinite;}
.m3e-appbar.center-t .bar{position:relative;}
.m3e-appbar.center-t .ttl{position:absolute;left:56px;right:56px;text-align:center;padding-left:0;pointer-events:none;}
.m3e-appbar.center-t .bar .m3e-ic:last-child{margin-left:auto;}
.m3e-bnav.nolb .dl{display:none;}
.m3e-bnav.nolb .dest{gap:0;}
.m3e-tabs.underline{gap:0;padding:0;border-bottom:1px solid var(--out-var);}
.m3e-tabs.underline .tab{height:100%;border-radius:0;background:transparent;box-shadow:none;border-bottom:2px solid transparent;}
.m3e-tabs.underline .tab.sel{background:transparent;color:var(--pri);border-bottom:2px solid var(--pri);}
.m3e-divider.vert{justify-content:center;}
.m3e-divider.vert .ln{width:1px;height:100%;}
.m3e-tip .bub.arr-left::after{left:14px;transform:rotate(45deg);}
.m3e-tip .bub.arr-right::after{left:auto;right:14px;transform:rotate(45deg);}
.m3e-banner.tone-warn{background:#FFF1D6;}
.m3e-banner.tone-warn svg{color:#8A5300;}
.m3e-banner.tone-warn .l1{color:#5D3F00;}
.m3e-banner.tone-err{background:var(--err-c);}
.m3e-banner.tone-err svg{color:var(--on-err-c);}
.m3e-banner.tone-err .l1{color:var(--on-err-c);}
.m3e-banner.tone-err .l2{color:var(--on-err-c);opacity:.8;}
.m3e-lgroup.divid .li + .li{border-top:1px solid var(--out-var);}
.m3e-cprog .pct{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:var(--on-sur);}
/* 导出的 HTML 页面里让页面居中展示（画布中由编辑器布局接管） */
.m3e-export-body{margin:0;min-height:100vh;background:#ECE6F0;display:flex;gap:24px;align-items:flex-start;justify-content:center;padding:24px;flex-wrap:wrap;}
.m3e-export-frame{flex:none;box-shadow:0 8px 28px rgba(0,0,0,.18);border-radius:32px;}
.page-root{background:var(--sur);margin:0 auto;}
body{margin:0;background:#ECE6F0;display:flex;justify-content:center;align-items:flex-start;padding:24px;min-height:100vh;}
</style>
