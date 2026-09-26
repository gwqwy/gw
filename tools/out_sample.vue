<!--
  gw Designer 导出 — 页面「首页」(412×892)
  使用：Vue 3 <script setup>。交互（开关/页签/滑块）已内置。
-->
<template>
  <div class="m3e-page page-root" :style="pageStyle">
    <div class="m3e-item" style="left:8px;top:8px;width:128px;height:56px;border-radius:28px;overflow:hidden;" data-link="lpzpsr7g"><button class="m3e-btn v-filled"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="20" height="20" aria-hidden="true"><path d="M450-450H230q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h220v-220q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v220h220q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H510v220q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37v-220Z"/></svg></span><span class="lb">按钮</span></button></div>
    <div class="m3e-item" style="left:8px;top:8px;width:48px;height:48px;border-radius:24px;overflow:hidden;"><button class="m3e-iconbtn v-tonal" style="position:relative;"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M458.19-144Q447-148 439-156l-53-49Q262-320 171-424.5T80-643q0-90.15 60.5-150.58Q201-854 290-854q51 0 101 24.5t89 80.5q44-56 91-80.5t99-24.5q89 0 149.5 60.42Q880-733.15 880-643q0 114-91 218.5T574-205l-53 49q-8.25 8.38-19.12 12.19Q491-140 480.19-140q-10.8 0-22-4ZM454-683q-27-49-71-80t-93-31q-66 0-108 42.5t-42 108.93q0 57.57 38.88 121.22 38.88 63.66 93 123.5Q326-338 384-286.5q58 51.5 96 86.5 38-34 96-86t112-112.5q54-60.5 93-124.19T820-643q0-66-42.5-108.5T670-794q-50 0-93.5 30.5T504-683q-5 8-11 11.5t-14 3.5q-8 0-14.5-3.5T454-683Zm26 186Z"/></svg></span></button></div>
    <div class="m3e-item" style="left:8px;top:8px;width:56px;height:56px;border-radius:16px;overflow:hidden;"><button class="m3e-fab v-tonal" style="position:relative;"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M180-180h44l472-471-44-44-472 471v44Zm-30 60q-13 0-21.5-8.5T120-150v-73q0-12 5-23.5t13-19.5l557-556q8-8 19-12.5t23-4.5q11 0 22 4.5t20 12.5l44 44q9 9 13 20t4 22q0 11-4.5 22.5T823-694L266-138q-8 8-19.5 13t-23.5 5h-73Zm629-617-41-41 41 41Zm-105 64-22-22 44 44-22-22Z"/></svg></span></button></div>
    <div class="m3e-item" style="left:8px;top:8px;width:160px;height:56px;border-radius:16px;overflow:hidden;"><button class="m3e-extfab v-tonal"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M180-180h44l472-471-44-44-472 471v44Zm-30 60q-13 0-21.5-8.5T120-150v-73q0-12 5-23.5t13-19.5l557-556q8-8 19-12.5t23-4.5q11 0 22 4.5t20 12.5l44 44q9 9 13 20t4 22q0 11-4.5 22.5T823-694L266-138q-8 8-19.5 13t-23.5 5h-73Zm629-617-41-41 41 41Zm-105 64-22-22 44 44-22-22Z"/></svg></span><span class="lb">新建</span></button></div>
    <div class="m3e-item" style="left:8px;top:8px;width:200px;height:56px;border-radius:28px;overflow:hidden;"><div class="m3e-split v-filled"><button class="main" style="flex:none;width:62%;"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="20" height="20" aria-hidden="true"><path d="M814-452 162-178q-15 6-28.5-2.5T120-205v-550q0-16 13.5-24.5T162-782l652 274q18 8 18 28t-18 28ZM180-253l544-227-544-230v168l242 62-242 60v167Zm0 0v-457 457Z"/></svg></span><span class="lb">发送</span></button><button class="act"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="20" height="20" aria-hidden="true"><path d="M464-376 306-533q-2-2-3.5-4.76-1.5-2.77-1.5-5.92 0-6.32 4.13-10.82 4.12-4.5 10.87-4.5h328q6.75 0 10.88 4.64 4.12 4.63 4.12 10.81 0 1.55-5 10.55L496-376q-3 3-7.06 5t-8.94 2q-4.87 0-8.94-2-4.06-2-7.06-5Z"/></svg></span></button></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:220px;height:72px;border-radius:16px;overflow:hidden;"><div class="m3e-fabmenu v-tonal"><div class="mi" :class="{sel: sel_urzu0bnrb===0}" @click="sel_urzu0bnrb=0"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true"><path d="M180-180h44l472-471-44-44-472 471v44Zm-30 60q-13 0-21.5-8.5T120-150v-73q0-12 5-23.5t13-19.5l557-556q8-8 19-12.5t23-4.5q11 0 22 4.5t20 12.5l44 44q9 9 13 20t4 22q0 11-4.5 22.5T823-694L266-138q-8 8-19.5 13t-23.5 5h-73Zm629-617-41-41 41 41Zm-105 64-22-22 44 44-22-22Z"/></svg></span><span>笔记</span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:108px;height:32px;border-radius:8px;overflow:hidden;"><button @click="upz1basmk=!upz1basmk" :class="{on:upz1basmk}" class="m3e-chip v-outlined"><span class="ld"></span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true"><path d="m378-332 363-363q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L399-267q-9 9-21 9t-21-9L175-449q-9-9-8.5-21.5T176-492q9-9 21.5-9t21.5 9l159 160Z"/></svg></span><span class="lb">标签</span></button></div>
    <div class="m3e-item" style="left:8px;top:8px;width:412px;height:88px;border-radius:0px;overflow:hidden;"><div class="m3e-appbar"><div style="height:24px;flex:none;"></div><div class="bar"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M150-240q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Zm0-210q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Zm0-210q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Z"/></svg></span><span class="ttl">标题</span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M479.86-160Q460-160 446-174.14t-14-34Q432-228 446.14-242t34-14Q500-256 514-241.86t14 34Q528-188 513.86-174t-34 14Zm0-272Q460-432 446-446.14t-14-34Q432-500 446.14-514t34-14Q500-528 514-513.86t14 34Q528-460 513.86-446t-34 14Zm0-272Q460-704 446-718.14t-14-34Q432-772 446.14-786t34-14Q500-800 514-785.86t14 34Q528-732 513.86-718t-34 14Z"/></svg></span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:412px;height:104px;border-radius:0px;overflow:hidden;"><div class="m3e-bnav"><div class="dest" :class="{sel: sel_urct98lif===0}" @click="sel_urct98lif=0"><div class="ind"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M160-180v-390q0-14.25 6.38-27 6.37-12.75 17.62-21l260-195q15.68-12 35.84-12Q500-825 516-813l260 195q11.25 8.25 17.63 21 6.37 12.75 6.37 27v390q0 24.75-17.62 42.37Q764.75-120 740-120H590q-12.75 0-21.37-8.63Q560-137.25 560-150v-220q0-12.75-8.62-21.38Q542.75-400 530-400H430q-12.75 0-21.37 8.62Q400-382.75 400-370v220q0 12.75-8.62 21.37Q382.75-120 370-120H220q-24.75 0-42.37-17.63Q160-155.25 160-180Z"/></svg></span></div><span class="dl">首页</span></div><div class="dest" :class="{sel: sel_urct98lif===1}" @click="sel_urct98lif=1"><div class="ind"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l242 240q9 8.56 9 21.78T818-143q-9 9-22.22 9-13.22 0-21.78-9L533-384q-30 26-69.96 40.5Q423.08-329 378-329Zm-1-60q81.25 0 138.13-57.5Q572-504 572-585t-56.87-138.5Q458.25-781 377-781q-82.08 0-139.54 57.5Q180-666 180-585t57.46 138.5Q294.92-389 377-389Z"/></svg></span></div><span class="dl">搜索</span></div><div class="dest" :class="{sel: sel_urct98lif===2}" @click="sel_urct98lif=2"><div class="ind"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M458.19-144Q447-148 439-156l-53-49Q262-320 171-424.5T80-643q0-90.15 60.5-150.58Q201-854 290-854q51 0 101 24.5t89 80.5q44-56 91-80.5t99-24.5q89 0 149.5 60.42Q880-733.15 880-643q0 114-91 218.5T574-205l-53 49q-8.25 8.38-19.12 12.19Q491-140 480.19-140q-10.8 0-22-4ZM454-683q-27-49-71-80t-93-31q-66 0-108 42.5t-42 108.93q0 57.57 38.88 121.22 38.88 63.66 93 123.5Q326-338 384-286.5q58 51.5 96 86.5 38-34 96-86t112-112.5q54-60.5 93-124.19T820-643q0-66-42.5-108.5T670-794q-50 0-93.5 30.5T504-683q-5 8-11 11.5t-14 3.5q-8 0-14.5-3.5T454-683Zm26 186Z"/></svg></span></div><span class="dl">收藏</span></div><div class="dest" :class="{sel: sel_urct98lif===3}" @click="sel_urct98lif=3"><div class="ind"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M421-80q-14 0-25-9t-13-23l-15-94q-19-7-40-19t-37-25l-86 40q-14 6-28 1.5T155-226L97-330q-8-13-4.5-27t15.5-23l80-59q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521l-80-59q-12-9-15.5-23t4.5-27l58-104q8-13 22-17.5t28 1.5l86 40q16-13 37-25t40-18l15-95q2-14 13-23t25-9h118q14 0 25 9t13 23l15 94q19 7 40.5 18.5T669-710l86-40q14-6 27.5-1.5T804-734l59 104q8 13 4.5 27.5T852-580l-80 57q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l80 58q12 8 15.5 22.5T863-330l-58 104q-8 13-22 17.5t-28-1.5l-86-40q-16 13-36.5 25.5T592-206l-15 94q-2 14-13 23t-25 9H421Zm15-60h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Zm44-210q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-130Z"/></svg></span></div><span class="dl">设置</span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:80px;height:892px;border-radius:0px;overflow:hidden;"><div class="m3e-rail"><div class="hd"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M150-240q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Zm0-210q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Zm0-210q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Z"/></svg></span></div><div class="dest" :class="{sel: sel_uskonmwbz===0}" @click="sel_uskonmwbz=0"><div class="ind"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M160-180v-390q0-14.25 6.38-27 6.37-12.75 17.62-21l260-195q15.68-12 35.84-12Q500-825 516-813l260 195q11.25 8.25 17.63 21 6.37 12.75 6.37 27v390q0 24.75-17.62 42.37Q764.75-120 740-120H590q-12.75 0-21.37-8.63Q560-137.25 560-150v-220q0-12.75-8.62-21.38Q542.75-400 530-400H430q-12.75 0-21.37 8.62Q400-382.75 400-370v220q0 12.75-8.62 21.37Q382.75-120 370-120H220q-24.75 0-42.37-17.63Q160-155.25 160-180Z"/></svg></span></div><span class="dl">首页</span></div><div class="dest" :class="{sel: sel_uskonmwbz===1}" @click="sel_uskonmwbz=1"><div class="ind"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l242 240q9 8.56 9 21.78T818-143q-9 9-22.22 9-13.22 0-21.78-9L533-384q-30 26-69.96 40.5Q423.08-329 378-329Zm-1-60q81.25 0 138.13-57.5Q572-504 572-585t-56.87-138.5Q458.25-781 377-781q-82.08 0-139.54 57.5Q180-666 180-585t57.46 138.5Q294.92-389 377-389Z"/></svg></span></div><span class="dl">搜索</span></div><div class="dest" :class="{sel: sel_uskonmwbz===2}" @click="sel_uskonmwbz=2"><div class="ind"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M458.19-144Q447-148 439-156l-53-49Q262-320 171-424.5T80-643q0-90.15 60.5-150.58Q201-854 290-854q51 0 101 24.5t89 80.5q44-56 91-80.5t99-24.5q89 0 149.5 60.42Q880-733.15 880-643q0 114-91 218.5T574-205l-53 49q-8.25 8.38-19.12 12.19Q491-140 480.19-140q-10.8 0-22-4ZM454-683q-27-49-71-80t-93-31q-66 0-108 42.5t-42 108.93q0 57.57 38.88 121.22 38.88 63.66 93 123.5Q326-338 384-286.5q58 51.5 96 86.5 38-34 96-86t112-112.5q54-60.5 93-124.19T820-643q0-66-42.5-108.5T670-794q-50 0-93.5 30.5T504-683q-5 8-11 11.5t-14 3.5q-8 0-14.5-3.5T454-683Zm26 186Z"/></svg></span></div><span class="dl">收藏</span></div><div class="dest" :class="{sel: sel_uskonmwbz===3}" @click="sel_uskonmwbz=3"><div class="ind"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M421-80q-14 0-25-9t-13-23l-15-94q-19-7-40-19t-37-25l-86 40q-14 6-28 1.5T155-226L97-330q-8-13-4.5-27t15.5-23l80-59q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521l-80-59q-12-9-15.5-23t4.5-27l58-104q8-13 22-17.5t28 1.5l86 40q16-13 37-25t40-18l15-95q2-14 13-23t25-9h118q14 0 25 9t13 23l15 94q19 7 40.5 18.5T669-710l86-40q14-6 27.5-1.5T804-734l59 104q8 13 4.5 27.5T852-580l-80 57q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l80 58q12 8 15.5 22.5T863-330l-58 104q-8 13-22 17.5t-28-1.5l-86-40q-16 13-36.5 25.5T592-206l-15 94q-2 14-13 23t-25 9H421Zm15-60h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Zm44-210q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-130Z"/></svg></span></div><span class="dl">设置</span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:280px;height:64px;border-radius:32px;overflow:hidden;"><div class="m3e-tb v-tonal"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M150-240q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Zm0-210q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Zm0-210q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h660q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H150Z"/></svg></span><span class="sp"></span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M180-180h44l472-471-44-44-472 471v44Zm-30 60q-13 0-21.5-8.5T120-150v-73q0-12 5-23.5t13-19.5l557-556q8-8 19-12.5t23-4.5q11 0 22 4.5t20 12.5l44 44q9 9 13 20t4 22q0 11-4.5 22.5T823-694L266-138q-8 8-19.5 13t-23.5 5h-73Zm629-617-41-41 41 41Zm-105 64-22-22 44 44-22-22Z"/></svg></span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M408-453.92q-29-30.91-29-75.08v-251q0-41.67 29.44-70.83Q437.88-880 479.94-880t71.56 29.17Q581-821.67 581-780v251q0 44.17-29 75.08Q523-423 480-423t-72-30.92ZM480-651Zm-30 501v-106q-96-11-166.5-77.5T202-498q-2-12.85 6.59-21.93 8.6-9.07 21.5-9.07 12.91 0 21.41 9t10.5 22q12 81 74.71 132.5Q399.42-314 479.65-314q81.35 0 143.85-51.5T698-498q2-13 10.68-22 8.67-9 21.5-9 12.82 0 21.32 9.07 8.5 9.08 6.5 21.93-11 97-81 164t-167 78v106q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37Zm59.5-346.5Q521-510 521-529v-251q0-17-11.79-28.5T480-820q-17.42 0-29.21 11.5T439-780v251q0 19 11.5 32.5T480-483q18 0 29.5-13.5Z"/></svg></span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M479.5-267q72.5 0 121.5-49t49-121.5q0-72.5-49-121T479.5-607q-72.5 0-121 48.5t-48.5 121q0 72.5 48.5 121.5t121 49Zm0-60q-47.5 0-78.5-31.5t-31-79q0-47.5 31-78.5t78.5-31q47.5 0 79 31t31.5 78.5q0 47.5-31.5 79t-79 31.5ZM140-120q-24 0-42-18t-18-42v-513q0-23 18-41.5t42-18.5h147l55-66q8-11 20-16t26-5h184q14 0 26 5t20 16l55 66h147q23 0 41.5 18.5T880-693v513q0 24-18.5 42T820-120H140Zm0-60h680v-513H645l-73-87H388l-73 87H140v513Zm340-257Z"/></svg></span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M728-326q0 103-72.18 174.5-72.17 71.5-175 71.5Q378-80 305.5-151.5T233-326v-380q0-72.5 51.5-123.25T408-880q72 0 123.5 50.75T583-706v360q0 42-30 72t-72.5 30q-42.5 0-72.5-29.67-30-29.68-30-72.33v-340q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v340q0 17 12.5 29.5t30.64 12.5q18.14 0 30-12.5T523-346v-360q0-48-33.5-81t-81.71-33q-48.21 0-81.5 33.06T293-706v380q0 78 54.97 132T481-140q77.92 0 132.46-54Q668-248 668-326v-360q0-12.75 8.68-21.38 8.67-8.62 21.5-8.62 12.82 0 21.32 8.62 8.5 8.63 8.5 21.38v360Z"/></svg></span><span class="sp"></span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M479.86-160Q460-160 446-174.14t-14-34Q432-228 446.14-242t34-14Q500-256 514-241.86t14 34Q528-188 513.86-174t-34 14Zm0-272Q460-432 446-446.14t-14-34Q432-500 446.14-514t34-14Q500-528 514-513.86t14 34Q528-460 513.86-446t-34 14Zm0-272Q460-704 446-718.14t-14-34Q432-772 446.14-786t34-14Q500-800 514-785.86t14 34Q528-732 513.86-718t-34 14Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:412px;height:48px;border-radius:0px;overflow:hidden;"><div class="m3e-tabs"><div class="tab" :class="{sel: sel_ulkk4blfa===0}" @click="sel_ulkk4blfa=0"><span>推荐</span></div><div class="tab" :class="{sel: sel_ulkk4blfa===1}" @click="sel_ulkk4blfa=1"><span>关注</span></div><div class="tab" :class="{sel: sel_ulkk4blfa===2}" @click="sel_ulkk4blfa=2"><span>热门</span></div><div class="tab" :class="{sel: sel_ulkk4blfa===3}" @click="sel_ulkk4blfa=3"><span>最新</span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:56px;border-radius:28px;overflow:hidden;"><div class="m3e-search" style="position:relative;"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l242 240q9 8.56 9 21.78T818-143q-9 9-22.22 9-13.22 0-21.78-9L533-384q-30 26-69.96 40.5Q423.08-329 378-329Zm-1-60q81.25 0 138.13-57.5Q572-504 572-585t-56.87-138.5Q458.25-781 377-781q-82.08 0-139.54 57.5Q180-666 180-585t57.46 138.5Q294.92-389 377-389Z"/></svg></span><span class="hint">搜索</span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M408-453.92q-29-30.91-29-75.08v-251q0-41.67 29.44-70.83Q437.88-880 479.94-880t71.56 29.17Q581-821.67 581-780v251q0 44.17-29 75.08Q523-423 480-423t-72-30.92ZM480-651Zm-30 501v-106q-96-11-166.5-77.5T202-498q-2-12.85 6.59-21.93 8.6-9.07 21.5-9.07 12.91 0 21.41 9t10.5 22q12 81 74.71 132.5Q399.42-314 479.65-314q81.35 0 143.85-51.5T698-498q2-13 10.68-22 8.67-9 21.5-9 12.82 0 21.32 9.07 8.5 9.08 6.5 21.93-11 97-81 164t-167 78v106q0 12.75-8.68 21.37-8.67 8.63-21.5 8.63-12.82 0-21.32-8.63-8.5-8.62-8.5-21.37Zm59.5-346.5Q521-510 521-529v-251q0-17-11.79-28.5T480-820q-17.42 0-29.21 11.5T439-780v251q0 19 11.5 32.5T480-483q18 0 29.5-13.5Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:223px;border-radius:20px;overflow:hidden;"><div class="m3e-card v-tonal"><div class="img" style="height:128px;flex:none;"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="32" height="32" aria-hidden="true"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0 0v-600 600Zm86-97h429q8.5 0 12.75-8t-.75-16L590-457q-5-6-12-6t-12 6L446-302l-81-111q-5-6-12-6t-12 6l-86 112q-6 8-1.75 16t12.75 8Z"/></svg></span></div><div class="bd"><div class="hl">卡片标题</div><div class="sp">这里是辅助说明文字。</div></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:72px;border-radius:28px;overflow:hidden;"><div class="m3e-li"><div class="lead" style="background:var(--sur-cl);border-radius:50%;"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M372-523q-42-42-42-108t42-108q42-42 108-42t108 42q42 42 42 108t-42 108q-42 42-108 42t-108-42ZM160-220v-34q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5T731-360q31 14 50 41t19 65v34q0 25-17.5 42.5T740-160H220q-25 0-42.5-17.5T160-220Zm60 0h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm324.5-346.5Q570-592 570-631t-25.5-64.5Q519-721 480-721t-64.5 25.5Q390-670 390-631t25.5 64.5Q441-541 480-541t64.5-25.5ZM480-631Zm0 411Z"/></svg></span></div><div class="txs"><div class="hl">列表项</div><div class="sub">辅助文本</div></div><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M530-481 353-658q-9-9-8.5-21t9.5-21q9-9 21.5-9t21.5 9l198 198q5 5 7 10t2 11q0 6-2 11t-7 10L396-261q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l176-176Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:412px;height:220px;border-radius:28px;overflow:hidden;"><div class="m3e-box" style=""></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:312px;height:220px;border-radius:28px;overflow:hidden;"><div class="m3e-dialog"><div class="hd"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M504.5-288.63q8.5-8.62 8.5-21.37v-180q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v180q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63 12.82 0 21.32-8.63Zm-1-314.57q9.5-9.2 9.5-22.8 0-14.45-9.48-24.22-9.48-9.78-23.5-9.78t-23.52 9.78Q447-640.45 447-626q0 13.6 9.48 22.8 9.48 9.2 23.5 9.2t23.52-9.2ZM480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg></span><span class="ttl">确认</span></div><div class="bd">要执行此操作吗？</div><div class="acts"><button class="abtn">取消</button><button class="abtn">确认</button></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:344px;height:48px;border-radius:8px;overflow:hidden;"><div class="m3e-snack"><span class="lb">已保存</span><span class="act">撤销</span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:56px;border-radius:16px;overflow:hidden;"><div class="m3e-tf v-outlined has-ic"><span class="cap">标签</span><span class="val"></span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M378-329q-108.16 0-183.08-75Q120-479 120-585t75-181q75-75 181.5-75t181 75Q632-691 632-584.85 632-542 618-502q-14 40-42 75l242 240q9 8.56 9 21.78T818-143q-9 9-22.22 9-13.22 0-21.78-9L533-384q-30 26-69.96 40.5Q423.08-329 378-329Zm-1-60q81.25 0 138.13-57.5Q572-504 572-585t-56.87-138.5Q458.25-781 377-781q-82.08 0-139.54 57.5Q180-666 180-585t57.46 138.5Q294.92-389 377-389Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:56px;border-radius:16px;overflow:hidden;"><div style="width:100%;height:100%;display:flex;flex-direction:column;gap:4px;"><div class="m3e-select v-outlined" style="flex:1;min-height:0;"><span class="cap">标签</span><span class="val">选项 1</span><span class="arr"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M464-376 306-533q-2-2-3.5-4.76-1.5-2.77-1.5-5.92 0-6.32 4.13-10.82 4.12-4.5 10.87-4.5h328q6.75 0 10.88 4.64 4.12 4.63 4.12 10.81 0 1.55-5 10.55L496-376q-3 3-7.06 5t-8.94 2q-4.87 0-8.94-2-4.06-2-7.06-5Z"/></svg></span></span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:160px;height:48px;border-radius:16px;overflow:hidden;"><div @click="uverli4b1=!uverli4b1" :class="{on:uverli4b1}" class="m3e-sw"><span class="lb">通知</span><span class="track"><span class="knob"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="14" height="14" aria-hidden="true"><path d="m378-332 363-363q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L399-267q-9 9-21 9t-21-9L175-449q-9-9-8.5-21.5T176-492q9-9 21.5-9t21.5 9l159 160Z"/></svg></span></span></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:140px;height:40px;border-radius:4px;overflow:hidden;"><div @click="u9b20u6ph=!u9b20u6ph" :class="{on:u9b20u6ph}" class="m3e-cb"><span class="box"></span><span class="lb">我同意</span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:120px;height:40px;border-radius:4px;overflow:hidden;"><div @click="uqq0pitl6=true" :class="{on:uqq0pitl6}" class="m3e-rd"><span class="cir"></span><span class="lb">选项</span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:44px;border-radius:0px;overflow:hidden;"><div data-act="slider" data-sid="utcshu2vx" class="m3e-slider"><span class="dot"></span><span class="trk"></span><span class="fil" style="width:calc(50% - 2px);"></span><span class="hnd" style="left:50%;"></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:160px;height:40px;border-radius:0px;overflow:hidden;"><div class="m3e-text" style="font-size:28px;text-align:left;">标题</div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:200px;height:200px;border-radius:20px;overflow:hidden;"><div class="m3e-image"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="48" height="48" aria-hidden="true"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0 0v-600 600Zm86-97h429q8.5 0 12.75-8t-.75-16L590-457q-5-6-12-6t-12 6L446-302l-81-111q-5-6-12-6t-12 6l-86 112q-6 8-1.75 16t12.75 8Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:507px;border-radius:20px;overflow:hidden;"><div class="m3e-camera"><span class="rec">REC</span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="48" height="48" aria-hidden="true"><path d="M479.5-267q72.5 0 121.5-49t49-121.5q0-72.5-49-121T479.5-607q-72.5 0-121 48.5t-48.5 121q0 72.5 48.5 121.5t121 49Zm0-60q-47.5 0-78.5-31.5t-31-79q0-47.5 31-78.5t78.5-31q47.5 0 79 31t31.5 78.5q0 47.5-31.5 79t-79 31.5ZM140-120q-24 0-42-18t-18-42v-513q0-23 18-41.5t42-18.5h147l55-66q8-11 20-16t26-5h184q14 0 26 5t20 16l55 66h147q23 0 41.5 18.5T880-693v513q0 24-18.5 42T820-120H140Zm0-60h680v-513H645l-73-87H388l-73 87H140v513Zm340-257Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:285px;border-radius:20px;overflow:hidden;"><div class="m3e-map" style="position:relative;"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="48" height="48" aria-hidden="true"><path d="m592-127-243-86-188 75q-8 3-15 1.5t-13-5.5q-6-4-9.5-10t-3.5-14v-565q0-13 7.5-23t19.5-15l182-64q5-2 10-2.5t10-.5q5 0 10 .5t10 2.5l243 85 187-75q8-3 15-2t13 5q6 4 9.5 10.5T840-795v572q0 11-7.5 19T814-192l-182 65q-5 2-10 2.5t-10 .5q-5 0-10-.5t-10-2.5Zm-14-68v-505l-196-66v505l196 66Zm60 0 142-47v-512l-142 54v505Zm-458-12 142-54v-505l-142 47v512Zm458-493v505-505Zm-316-66v505-505Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:24px;height:16px;border-radius:8px;overflow:hidden;"><span class="m3e-badge">3</span></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:16px;border-radius:0px;overflow:hidden;"><div class="m3e-divider"><span class="ln"></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:48px;height:48px;border-radius:24px;overflow:hidden;"><div class="m3e-loading"><svg viewBox="0 0 48 48" fill="none" style="animation-duration:1.40s;"><circle cx="24" cy="24" r="18" stroke="var(--pri)" stroke-width="5" stroke-linecap="round" stroke-dasharray="20 93" transform="rotate(0 24 24)" opacity="1"/><circle cx="24" cy="24" r="18" stroke="var(--pri)" stroke-width="5" stroke-linecap="round" stroke-dasharray="20 93" transform="rotate(90 24 24)" opacity="0.72"/><circle cx="24" cy="24" r="18" stroke="var(--pri)" stroke-width="5" stroke-linecap="round" stroke-dasharray="20 93" transform="rotate(180 24 24)" opacity="0.45"/><circle cx="24" cy="24" r="18" stroke="var(--pri)" stroke-width="5" stroke-linecap="round" stroke-dasharray="20 93" transform="rotate(270 24 24)" opacity="0.2"/></svg></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:24px;border-radius:0px;overflow:hidden;"><div class="m3e-lprog"><div class="trk"><span class="fil" style="width:60%;"></span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:48px;height:48px;border-radius:24px;overflow:hidden;"><div class="m3e-cprog" style="position:relative;"><svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="var(--pri-c)" stroke-width="4"/><circle cx="24" cy="24" r="18" stroke="var(--pri)" stroke-width="4" stroke-linecap="round" stroke-dasharray="113.09733552923255" stroke-dashoffset="33.92920065876977" transform="rotate(-90 24 24)"/></svg></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:240px;height:40px;border-radius:0px;overflow:hidden;"><div class="m3e-seg"><div class="sg" :class="{sel: sel_uddou7jqx===0}" @click="sel_uddou7jqx=0"><span>日</span></div><div class="sg" :class="{sel: sel_uddou7jqx===1}" @click="sel_uddou7jqx=1"><span>周</span></div><div class="sg" :class="{sel: sel_uddou7jqx===2}" @click="sel_uddou7jqx=2"><span>月</span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:240px;border-radius:0px;overflow:hidden;"><div class="m3e-table"><div class="tr"><div class="th">列 A</div><div class="th">列 B</div><div class="th">列 C</div></div><div class="tr"><div class="td">数据</div><div class="td">数据</div><div class="td">数据</div></div><div class="tr"><div class="td">数据</div><div class="td">数据</div><div class="td">数据</div></div><div class="tr"><div class="td">数据</div><div class="td">数据</div><div class="td">数据</div></div><div class="tr"><div class="td">数据</div><div class="td">数据</div><div class="td">数据</div></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:128px;border-radius:0px;overflow:hidden;"><div class="m3e-acc"><div class="ai open">第一组<span class="m3e-ic"><svg viewBox="0 -960 960 960" width="22" height="22" aria-hidden="true"><path d="M469-358q-5-2-10-7L261-563q-9-9-8.5-21.5T262-606q9-9 21.5-9t21.5 9l175 176 176-176q9-9 21-8.5t21 9.5q9 9 9 21.5t-9 21.5L501-365q-5 5-10 7t-11 2q-6 0-11-2Z"/></svg></span></div><div class="ai">第二组<span class="m3e-ic"><svg viewBox="0 -960 960 960" width="22" height="22" aria-hidden="true"><path d="M530-481 353-658q-9-9-8.5-21t9.5-21q9-9 21.5-9t21.5 9l198 198q5 5 7 10t2 11q0 6-2 11t-7 10L396-261q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l176-176Z"/></svg></span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:412px;height:280px;border-radius:0px;overflow:hidden;"><div class="m3e-sheet"><span class="grip"></span><span class="ttl">选择操作</span><span class="sub">选择一项以继续</span><div class="acts"><button class="abtn">取消</button><button class="abtn">确认</button></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:88px;border-radius:0px;overflow:hidden;"><div class="m3e-banner tone-info"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M504.5-288.63q8.5-8.62 8.5-21.37v-180q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v180q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63 12.82 0 21.32-8.63Zm-1-314.57q9.5-9.2 9.5-22.8 0-14.45-9.48-24.22-9.48-9.78-23.5-9.78t-23.52 9.78Q447-640.45 447-626q0 13.6 9.48 22.8 9.48 9.2 23.5 9.2t23.52-9.2ZM480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg></span><div class="tx"><div class="l1">新版本已发布</div><div class="l2">立即更新以体验新功能</div></div><div class="act"><button class="abtn">忽略</button><button class="abtn">查看</button></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:232px;border-radius:0px;overflow:hidden;"><div class="m3e-lgroup"><div class="li"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="22" height="22" aria-hidden="true"><path d="M372-523q-42-42-42-108t42-108q42-42 108-42t108 42q42 42 42 108t-42 108q-42 42-108 42t-108-42ZM160-220v-34q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5T731-360q31 14 50 41t19 65v34q0 25-17.5 42.5T740-160H220q-25 0-42.5-17.5T160-220Zm60 0h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm324.5-346.5Q570-592 570-631t-25.5-64.5Q519-721 480-721t-64.5 25.5Q390-670 390-631t25.5 64.5Q441-541 480-541t64.5-25.5ZM480-631Zm0 411Z"/></svg></span><span class="lb">个人信息</span><span class="tr"><svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true"><path d="M530-481 353-658q-9-9-8.5-21t9.5-21q9-9 21.5-9t21.5 9l198 198q5 5 7 10t2 11q0 6-2 11t-7 10L396-261q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l176-176Z"/></svg></span></div><div class="li"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="22" height="22" aria-hidden="true"><path d="M190-200q-12.75 0-21.37-8.68-8.63-8.67-8.63-21.5 0-12.82 8.63-21.32 8.62-8.5 21.37-8.5h50v-304q0-84 49.5-150.5T420-798v-22q0-25 17.5-42.5T480-880q25 0 42.5 17.5T540-820v22q81 17 130.5 83.5T720-564v304h50q12.75 0 21.38 8.68 8.62 8.67 8.62 21.5 0 12.82-8.62 21.32-8.63 8.5-21.38 8.5H190Zm290-302Zm0 422q-33 0-56.5-23.5T400-160h160q0 33-23.5 56.5T480-80ZM300-260h360v-304q0-75-52.5-127.5T480-744q-75 0-127.5 52.5T300-564v304Z"/></svg></span><span class="lb">消息通知</span><span class="tr"><svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true"><path d="M530-481 353-658q-9-9-8.5-21t9.5-21q9-9 21.5-9t21.5 9l198 198q5 5 7 10t2 11q0 6-2 11t-7 10L396-261q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l176-176Z"/></svg></span></div><div class="li"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="22" height="22" aria-hidden="true"><path d="M421-80q-14 0-25-9t-13-23l-15-94q-19-7-40-19t-37-25l-86 40q-14 6-28 1.5T155-226L97-330q-8-13-4.5-27t15.5-23l80-59q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521l-80-59q-12-9-15.5-23t4.5-27l58-104q8-13 22-17.5t28 1.5l86 40q16-13 37-25t40-18l15-95q2-14 13-23t25-9h118q14 0 25 9t13 23l15 94q19 7 40.5 18.5T669-710l86-40q14-6 27.5-1.5T804-734l59 104q8 13 4.5 27.5T852-580l-80 57q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l80 58q12 8 15.5 22.5T863-330l-58 104q-8 13-22 17.5t-28-1.5l-86-40q-16 13-36.5 25.5T592-206l-15 94q-2 14-13 23t-25 9H421Zm15-60h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Zm44-210q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-130Z"/></svg></span><span class="lb">通用设置</span><span class="tr"><svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true"><path d="M530-481 353-658q-9-9-8.5-21t9.5-21q9-9 21.5-9t21.5 9l198 198q5 5 7 10t2 11q0 6-2 11t-7 10L396-261q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l176-176Z"/></svg></span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:160px;height:40px;border-radius:0px;overflow:hidden;"><div class="m3e-rating"><span class="m3e-ic on"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M480-269 294-157q-8 5-17 4.5t-16-5.5q-7-5-10.5-13t-1.5-18l49-212-164-143q-8-7-9.5-15.5t.5-16.5q2-8 9-13.5t17-6.5l217-19 84-200q4-9 12-13.5t16-4.5q8 0 16 4.5t12 13.5l84 200 217 19q10 1 17 6.5t9 13.5q2 8 .5 16.5T826-544L662-401l49 212q2 10-1.5 18T699-158q-7 5-16 5.5t-17-4.5L480-269Z"/></svg></span><span class="m3e-ic on"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M480-269 294-157q-8 5-17 4.5t-16-5.5q-7-5-10.5-13t-1.5-18l49-212-164-143q-8-7-9.5-15.5t.5-16.5q2-8 9-13.5t17-6.5l217-19 84-200q4-9 12-13.5t16-4.5q8 0 16 4.5t12 13.5l84 200 217 19q10 1 17 6.5t9 13.5q2 8 .5 16.5T826-544L662-401l49 212q2 10-1.5 18T699-158q-7 5-16 5.5t-17-4.5L480-269Z"/></svg></span><span class="m3e-ic on"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M480-269 294-157q-8 5-17 4.5t-16-5.5q-7-5-10.5-13t-1.5-18l49-212-164-143q-8-7-9.5-15.5t.5-16.5q2-8 9-13.5t17-6.5l217-19 84-200q4-9 12-13.5t16-4.5q8 0 16 4.5t12 13.5l84 200 217 19q10 1 17 6.5t9 13.5q2 8 .5 16.5T826-544L662-401l49 212q2 10-1.5 18T699-158q-7 5-16 5.5t-17-4.5L480-269Z"/></svg></span><span class="m3e-ic on"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M480-269 294-157q-8 5-17 4.5t-16-5.5q-7-5-10.5-13t-1.5-18l49-212-164-143q-8-7-9.5-15.5t.5-16.5q2-8 9-13.5t17-6.5l217-19 84-200q4-9 12-13.5t16-4.5q8 0 16 4.5t12 13.5l84 200 217 19q10 1 17 6.5t9 13.5q2 8 .5 16.5T826-544L662-401l49 212q2 10-1.5 18T699-158q-7 5-16 5.5t-17-4.5L480-269Z"/></svg></span><span class="m3e-ic off"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="m323-245 157-94 157 95-42-178 138-120-182-16-71-168-71 167-182 16 138 120-42 178Zm157-24L294-157q-8 5-17 4.5t-16-5.5q-7-5-10.5-13t-1.5-18l49-212-164-143q-8-7-9.5-15.5t.5-16.5q2-8 9-13.5t17-6.5l217-19 84-200q4-9 12-13.5t16-4.5q8 0 16 4.5t12 13.5l84 200 217 19q10 1 17 6.5t9 13.5q2 8 .5 16.5T826-544L662-401l49 212q2 10-1.5 18T699-158q-7 5-16 5.5t-17-4.5L480-269Zm0-206Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:200px;height:56px;border-radius:0px;overflow:hidden;"><div class="m3e-tf v-outlined"><span class="cap">日期</span><span class="val">2026-09-10</span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M528-248.18q-28-28.19-28-69Q500-358 528.18-386q28.19-28 69-28Q638-414 666-385.82q28 28.19 28 69Q694-276 665.82-248q-28.19 28-69 28Q556-220 528-248.18ZM180-80q-24 0-42-18t-18-42v-620q0-24 18-42t42-18h65v-28q0-13.6 9-22.8 9-9.2 23.02-9.2t23.5 9.2Q310-861.6 310-848v28h340v-28q0-13.6 9-22.8 9-9.2 23.02-9.2t23.5 9.2Q715-861.6 715-848v28h65q24 0 42 18t18 42v620q0 24-18 42t-42 18H180Zm0-60h600v-430H180v430Zm0-490h600v-130H180v130Zm0 0v-130 130Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:160px;height:56px;border-radius:0px;overflow:hidden;"><div class="m3e-tf v-outlined"><span class="cap">时间</span><span class="val">10:30</span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="M513-492v-171q0-13-8.5-21.5T483-693q-13 0-21.5 8.5T453-663v183q0 6 2 11t6 10l144 149q9 10 22.5 9.5T650-310q9-9 9-22t-9-22L513-492ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-82 31.5-155t86-127.5Q252-817 325-848.5T480-880q82 0 155 31.5t127.5 86Q817-708 848.5-635T880-480q0 82-31.5 155t-86 127.5Q708-143 635-111.5T480-80Zm0-400Zm0 340q140 0 240-100t100-240q0-140-100-240T480-820q-140 0-240 100T140-480q0 140 100 240t240 100Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:120px;border-radius:0px;overflow:hidden;"><div class="m3e-ta v-filled"><span class="cap">备注</span><span class="val"><span style="opacity:.45;">请输入内容…</span></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:200px;height:80px;border-radius:0px;overflow:hidden;"><div class="m3e-html"><div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#E8DEF8;border-radius:12px;color:#21005D;font-size:14px;">自定义 HTML</div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:48px;height:48px;border-radius:0px;overflow:hidden;"><div class="m3e-avatar" style="background:var(--sec-c);color:var(--on-sec-c);border-radius:50%;"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="26" height="26" aria-hidden="true"><path d="M372-523q-42-42-42-108t42-108q42-42 108-42t108 42q42 42 42 108t-42 108q-42 42-108 42t-108-42ZM160-220v-34q0-38 19-65t49-41q67-30 128.5-45T480-420q62 0 123 15.5T731-360q31 14 50 41t19 65v34q0 25-17.5 42.5T740-160H220q-25 0-42.5-17.5T160-220Zm60 0h520v-34q0-16-9.5-30.5T707-306q-64-31-117-42.5T480-360q-57 0-111 11.5T252-306q-14 7-23 21.5t-9 30.5v34Zm324.5-346.5Q570-592 570-631t-25.5-64.5Q519-721 480-721t-64.5 25.5Q390-670 390-631t25.5 64.5Q441-541 480-541t64.5-25.5ZM480-631Zm0 411Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:340px;height:340px;border-radius:0px;overflow:hidden;"><div class="m3e-cal"><div class="hd"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="20" height="20" aria-hidden="true"><path d="m406-481 177 177q9 9 8.5 21t-9.5 21q-9 9-21.5 9t-21.5-9L341-460q-5-5-7-10t-2-11q0-6 2-11t7-10l199-199q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L406-481Z"/></svg></span><span class="mt">2026年9月</span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="20" height="20" aria-hidden="true"><path d="M530-481 353-658q-9-9-8.5-21t9.5-21q9-9 21.5-9t21.5 9l198 198q5 5 7 10t2 11q0 6-2 11t-7 10L396-261q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l176-176Z"/></svg></span></div><div class="wk"><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span><span>日</span></div><div class="grid"><span class="d"><i>1</i></span><span class="d"><i>2</i></span><span class="d"><i>3</i></span><span class="d"><i>4</i></span><span class="d"><i>5</i></span><span class="d"><i>6</i></span><span class="d"><i>7</i></span><span class="d"><i>8</i></span><span class="d"><i>9</i></span><span class="d"><i>10</i></span><span class="d"><i>11</i></span><span class="d sel"><i>12</i></span><span class="d"><i>13</i></span><span class="d"><i>14</i></span><span class="d"><i>15</i></span><span class="d"><i>16</i></span><span class="d"><i>17</i></span><span class="d"><i>18</i></span><span class="d"><i>19</i></span><span class="d"><i>20</i></span><span class="d"><i>21</i></span><span class="d"><i>22</i></span><span class="d"><i>23</i></span><span class="d"><i>24</i></span><span class="d"><i>25</i></span><span class="d"><i>26</i></span><span class="d"><i>27</i></span><span class="d"><i>28</i></span><span class="d"><i>29</i></span><span class="d"><i>30</i></span><span class="d mute"><i></i></span><span class="d mute"><i></i></span><span class="d mute"><i></i></span><span class="d mute"><i></i></span><span class="d mute"><i></i></span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:280px;height:40px;border-radius:0px;overflow:hidden;"><div class="m3e-pagi"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="22" height="22" aria-hidden="true"><path d="m406-481 177 177q9 9 8.5 21t-9.5 21q-9 9-21.5 9t-21.5-9L341-460q-5-5-7-10t-2-11q0-6 2-11t7-10l199-199q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L406-481Z"/></svg></span><span class="pg">1</span><span class="pg sel">2</span><span class="pg">3</span><span class="pg">4</span><span class="pg">5</span><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="22" height="22" aria-hidden="true"><path d="M530-481 353-658q-9-9-8.5-21t9.5-21q9-9 21.5-9t21.5 9l198 198q5 5 7 10t2 11q0 6-2 11t-7 10L396-261q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l176-176Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:280px;height:40px;border-radius:0px;overflow:hidden;"><div class="m3e-bc"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="16" height="16" aria-hidden="true"><path d="M220-180h150v-220q0-12.75 8.63-21.38Q387.25-430 400-430h160q12.75 0 21.38 8.62Q590-412.75 590-400v220h150v-390L480-765 220-570v390Zm-60 0v-390q0-14.25 6.38-27 6.37-12.75 17.62-21l260-195q15.68-12 35.84-12Q500-825 516-813l260 195q11.25 8.25 17.63 21 6.37 12.75 6.37 27v390q0 24.75-17.62 42.37Q764.75-120 740-120H560q-12.75 0-21.37-8.63Q530-137.25 530-150v-220H430v220q0 12.75-8.62 21.37Q412.75-120 400-120H220q-24.75 0-42.37-17.63Q160-155.25 160-180Zm320-293Z"/></svg></span><div class="bc" :class="{sel: sel_u7reavzhu===0}" @click="sel_u7reavzhu=0"><span>首页</span></div><div class="bc" :class="{sel: sel_u7reavzhu===1}" @click="sel_u7reavzhu=1"><span>分类</span></div><div class="bc" :class="{sel: sel_u7reavzhu===2}" @click="sel_u7reavzhu=2"><span>详情</span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:320px;height:56px;border-radius:0px;overflow:hidden;"><div class="m3e-stepper"><div class="st done"><span class="dot"><svg viewBox="0 -960 960 960" width="16" height="16" aria-hidden="true"><path d="m378-332 363-363q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L399-267q-9 9-21 9t-21-9L175-449q-9-9-8.5-21.5T176-492q9-9 21.5-9t21.5 9l159 160Z"/></svg></span><span class="sl">第一步</span></div><span class="ln done"></span><div class="st cur"><span class="dot">2</span><span class="sl">第二步</span></div><span class="ln"></span><div class="st "><span class="dot">3</span><span class="sl">第三步</span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:200px;border-radius:0px;overflow:hidden;"><div class="m3e-carousel"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="48" height="48" aria-hidden="true"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-600H180v600Zm0 0v-600 600Zm86-97h429q8.5 0 12.75-8t-.75-16L590-457q-5-6-12-6t-12 6L446-302l-81-111q-5-6-12-6t-12 6l-86 112q-6 8-1.75 16t12.75 8Z"/></svg></span><span class="cv l"><svg viewBox="0 -960 960 960" width="20" height="20" aria-hidden="true"><path d="m406-481 177 177q9 9 8.5 21t-9.5 21q-9 9-21.5 9t-21.5-9L341-460q-5-5-7-10t-2-11q0-6 2-11t7-10l199-199q9-9 21.5-9t21.5 9q9 9 9 21.5t-9 21.5L406-481Z"/></svg></span><span class="cv r"><svg viewBox="0 -960 960 960" width="20" height="20" aria-hidden="true"><path d="M530-481 353-658q-9-9-8.5-21t9.5-21q9-9 21.5-9t21.5 9l198 198q5 5 7 10t2 11q0 6-2 11t-7 10L396-261q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l176-176Z"/></svg></span><span class="dots"><i on></i><i></i><i></i></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:220px;border-radius:0px;overflow:hidden;"><div class="m3e-video"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="56" height="56" aria-hidden="true"><path d="m418-332 202-129q11-7 11-19t-11-19L418-628q-11-8-23-1.5T383-609v258q0 14 12 20.5t23-1.5Zm62 252q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z"/></svg></span><span class="bar"><i></i></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:140px;height:32px;border-radius:0px;"><div class="m3e-tip"><span class="bub arr-center">这是一条提示</span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:280px;height:892px;border-radius:0px;overflow:hidden;"><div class="m3e-tabs"><div class="tab" :class="{sel: sel_usv02xlhs===0}" @click="sel_usv02xlhs=0"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true"><path d="M220-180h150v-220q0-12.75 8.63-21.38Q387.25-430 400-430h160q12.75 0 21.38 8.62Q590-412.75 590-400v220h150v-390L480-765 220-570v390Zm-60 0v-390q0-14.25 6.38-27 6.37-12.75 17.62-21l260-195q15.68-12 35.84-12Q500-825 516-813l260 195q11.25 8.25 17.63 21 6.37 12.75 6.37 27v390q0 24.75-17.62 42.37Q764.75-120 740-120H560q-12.75 0-21.37-8.63Q530-137.25 530-150v-220H430v220q0 12.75-8.62 21.37Q412.75-120 400-120H220q-24.75 0-42.37-17.63Q160-155.25 160-180Zm320-293Z"/></svg></span><span>首页</span></div><div class="tab" :class="{sel: sel_usv02xlhs===1}" @click="sel_usv02xlhs=1"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true"><path d="M458.19-144Q447-148 439-156l-53-49Q262-320 171-424.5T80-643q0-90.15 60.5-150.58Q201-854 290-854q51 0 101 24.5t89 80.5q44-56 91-80.5t99-24.5q89 0 149.5 60.42Q880-733.15 880-643q0 114-91 218.5T574-205l-53 49q-8.25 8.38-19.12 12.19Q491-140 480.19-140q-10.8 0-22-4ZM454-683q-27-49-71-80t-93-31q-66 0-108 42.5t-42 108.93q0 57.57 38.88 121.22 38.88 63.66 93 123.5Q326-338 384-286.5q58 51.5 96 86.5 38-34 96-86t112-112.5q54-60.5 93-124.19T820-643q0-66-42.5-108.5T670-794q-50 0-93.5 30.5T504-683q-5 8-11 11.5t-14 3.5q-8 0-14.5-3.5T454-683Zm26 186Z"/></svg></span><span>收藏</span></div><div class="tab" :class="{sel: sel_usv02xlhs===2}" @click="sel_usv02xlhs=2"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true"><path d="M421-80q-14 0-25-9t-13-23l-15-94q-19-7-40-19t-37-25l-86 40q-14 6-28 1.5T155-226L97-330q-8-13-4.5-27t15.5-23l80-59q-2-9-2.5-20.5T185-480q0-9 .5-20.5T188-521l-80-59q-12-9-15.5-23t4.5-27l58-104q8-13 22-17.5t28 1.5l86 40q16-13 37-25t40-18l15-95q2-14 13-23t25-9h118q14 0 25 9t13 23l15 94q19 7 40.5 18.5T669-710l86-40q14-6 27.5-1.5T804-734l59 104q8 13 4.5 27.5T852-580l-80 57q2 10 2.5 21.5t.5 21.5q0 10-.5 21t-2.5 21l80 58q12 8 15.5 22.5T863-330l-58 104q-8 13-22 17.5t-28-1.5l-86-40q-16 13-36.5 25.5T592-206l-15 94q-2 14-13 23t-25 9H421Zm15-60h88l14-112q33-8 62.5-25t53.5-41l106 46 40-72-94-69q4-17 6.5-33.5T715-480q0-17-2-33.5t-7-33.5l94-69-40-72-106 46q-23-26-52-43.5T538-708l-14-112h-88l-14 112q-34 7-63.5 24T306-642l-106-46-40 72 94 69q-4 17-6.5 33.5T245-480q0 17 2.5 33.5T254-413l-94 69 40 72 106-46q24 24 53.5 41t62.5 25l14 112Zm44-210q54 0 92-38t38-92q0-54-38-92t-92-38q-54 0-92 38t-38 92q0 54 38 92t92 38Zm0-130Z"/></svg></span><span>设置</span></div><div class="tab" :class="{sel: sel_usv02xlhs===3}" @click="sel_usv02xlhs=3"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true"><path d="M504.5-288.63q8.5-8.62 8.5-21.37v-180q0-12.75-8.68-21.38-8.67-8.62-21.5-8.62-12.82 0-21.32 8.62-8.5 8.63-8.5 21.38v180q0 12.75 8.68 21.37 8.67 8.63 21.5 8.63 12.82 0 21.32-8.63Zm-1-314.57q9.5-9.2 9.5-22.8 0-14.45-9.48-24.22-9.48-9.78-23.5-9.78t-23.52 9.78Q447-640.45 447-626q0 13.6 9.48 22.8 9.48 9.2 23.5 9.2t23.52-9.2ZM480.27-80q-82.74 0-155.5-31.5Q252-143 197.5-197.5t-86-127.34Q80-397.68 80-480.5t31.5-155.66Q143-709 197.5-763t127.34-85.5Q397.68-880 480.5-880t155.66 31.5Q709-817 763-763t85.5 127Q880-563 880-480.27q0 82.74-31.5 155.5Q817-252 763-197.68q-54 54.31-127 86Q563-80 480.27-80Zm.23-60Q622-140 721-239.5t99-241Q820-622 721.19-721T480-820q-141 0-240.5 98.81T140-480q0 141 99.5 240.5t241 99.5Zm-.5-340Z"/></svg></span><span>关于</span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:412px;height:220px;border-radius:0px;overflow:hidden;"><div class="m3e-hero"><span class="ov" style="opacity:0.40;"></span><div class="tx"><div class="h">山野徒步</div><div class="s">发现身边的路线</div></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:40px;border-radius:0px;overflow:hidden;"><div class="m3e-sechead"><span class="t">推荐内容</span><span class="more">查看全部<svg viewBox="0 -960 960 960" width="18" height="18" aria-hidden="true"><path d="M530-481 353-658q-9-9-8.5-21t9.5-21q9-9 21.5-9t21.5 9l198 198q5 5 7 10t2 11q0 6-2 11t-7 10L396-261q-9 9-21 8.5t-21-9.5q-9-9-9-21.5t9-21.5l176-176Z"/></svg></span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:260px;border-radius:0px;overflow:hidden;"><div class="m3e-empty"><span class="m3e-ic"><svg viewBox="0 -960 960 960" width="56" height="56" aria-hidden="true"><path d="M180-120q-24 0-42-18t-18-42v-600q0-24 18-42t42-18h600q24 0 42 18t18 42v600q0 24-18 42t-42 18H180Zm0-60h600v-136H634q-26 40-67.5 61.5T480-233q-45 0-86.5-21.5T326-316H180v136Zm300.02-113q34.98 0 64.48-17.5Q574-328 591-359q7-10 18.5-13.5T633-376h147v-404H180v404h147q12 0 23.5 3.5T369-359q17 31 46.52 48.5 29.51 17.5 64.5 17.5ZM180-180h600-600Z"/></svg></span><span class="t">暂无内容</span><span class="s">这里还没有任何数据</span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:220px;border-radius:0px;overflow:hidden;"><div class="m3e-tline"><div class="tli done"><span class="rail"><i class="dot"></i><i class="ln2"></i></span><span class="tx">下单成功</span></div><div class="tli cur"><span class="rail"><i class="dot"></i><i class="ln2"></i></span><span class="tx">支付完成</span></div><div class="tli wait"><span class="rail"><i class="dot"></i><i class="ln2"></i></span><span class="tx">商家发货</span></div><div class="tli wait"><span class="rail"><i class="dot"></i><i class="ln2"></i></span><span class="tx">确认收货</span></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:120px;border-radius:0px;overflow:hidden;"><div class="m3e-quote"><span class="qmark"><svg viewBox="0 -960 960 960" width="24" height="24" aria-hidden="true"><path d="m275-287 67-115q-5 1-11 1.5t-11 .5q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 21-5.5 41T458-480L329-255q-4 8-11.5 11.5T302-240q-18 0-27-15.5t0-31.5Zm360 0 67-115q-5 1-11 1.5t-11 .5q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 21-5.5 41T818-480L689-255q-4 8-11.5 11.5T662-240q-18 0-27-15.5t0-31.5Z"/></svg></span><div class="qt">设计不只是看起来如何，设计是它如何运作。</div><span class="ct">—— Steve Jobs</span></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:380px;height:140px;border-radius:0px;overflow:hidden;"><div class="m3e-codeblk"><span class="lang">bash</span><pre>npm install @m3e/designer</pre></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:170px;height:52px;border-radius:0px;overflow:hidden;"><div class="uv-btnneon"><button type="button"><span></span><span></span><span></span><span></span>NEON</button></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:170px;height:56px;border-radius:0px;overflow:hidden;"><div class="uv-btnscifi"><a href="javascript:void(0)" class="button"><span></span><span></span><span></span><span></span>Button</a></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:170px;height:52px;border-radius:0px;overflow:hidden;"><div class="uv-btncta"><button type="button" class="cta"><span>Contact Us &nbsp;</span><svg viewBox="0 0 13 10" height="10px" width="15px"><path d="M1,5 L11,5"></path><polyline points="8 1 12 5 8 9"></polyline></svg></button></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:72px;height:72px;border-radius:0px;overflow:hidden;"><div class="uv-loadgeo"><div class="loader" style="--duration:3.00s;"><svg viewBox="0 0 80 80"><circle r="32" cy="40" cx="40"></circle></svg></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:90px;height:90px;border-radius:0px;overflow:hidden;"><div class="uv-loadbounce"><style>.uv-loadbounce .loader,.uv-loadbounce .loader:before,.uv-loadbounce .loader:after{animation-duration:5.00s !important;}</style><div class="loader"></div></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:100px;height:52px;border-radius:0px;overflow:hidden;"><div class="uv-swmetal"><label class="toggleSwitch"><input type="checkbox"/></label></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:96px;height:40px;border-radius:0px;overflow:hidden;"><div class="uv-swoff"><label class="switch"><input type="checkbox"/><span class="slider"></span><span class="text on">On</span><span class="text off">Off</span></label></div></div>
    <div class="m3e-item" style="left:8px;top:8px;width:320px;height:150px;border-radius:0px;overflow:hidden;" data-link="lpzpsr7g"><div class="uv-cardblog"><div class="card"><div class="date-time-container"><time class="date-time"><span>2026</span><span class="separator"></span><span>9月10日</span></time></div><div class="content"><div class="infos"><span class="title">如何写好一篇博客？</span><p class="description">这里是卡片描述文本，介绍文章的主要内容与亮点。</p></div><span class="action">阅读全文</span></div></div></div></div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const sel_urzu0bnrb = ref(0);
const upz1basmk = ref(false);
const sel_urct98lif = ref(0);
const sel_uskonmwbz = ref(0);
const sel_ulkk4blfa = ref(0);
const uverli4b1 = ref(false);
const u9b20u6ph = ref(false);
const uqq0pitl6 = ref(false);
const sel_uddou7jqx = ref(0);
const sel_u7reavzhu = ref(2);
const sel_usv02xlhs = ref(0);

const pageStyle = {
  width: '412px',
  height: '892px',
  borderRadius: '40px',
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
  bindSlider(document.querySelector('[data-sid="utcshu2vx"]'));
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
