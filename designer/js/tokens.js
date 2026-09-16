/* gw Designer — 几何常量 / 色板 / 主题
 * 数值与 m3e-canvas 对齐：手机 412×892、桌面 1280×800、边距 16 等。 */
(function () {
  "use strict";

  const PHONE_W = 412, PHONE_H = 892, PHONE_R = 40;
  const DESKTOP_W = 1280, DESKTOP_H = 800, DESKTOP_R = 28;
  const MARGIN = 16;                       // M3 布局边距
  const CONTENT_W = PHONE_W - MARGIN * 2;  // 380
  const HALF_W = (CONTENT_W - MARGIN) / 2; // 182
  const BEZEL = 10, FRAME_LABEL_H = 40;    // 画布上屏幕的边框与标签高度
  const STATUS_BAR_H = 24, NAV_BAR_H = 24;
  const APPBAR_H = 64 + STATUS_BAR_H;      // 顶部应用栏总高
  const BOTTOMNAV_H = 80 + NAV_BAR_H;      // 底部导航栏总高
  const BTN_H = 56;

  /* 组件分类（uiverse = uiverse.io/galaxy 社区组件全量库 + 精选，MIT） */
  const CATEGORIES = [
    { key: "actions", name: "操作", icon: "touch_app" },
    { key: "navigation", name: "导航", icon: "explore" },
    { key: "containment", name: "容器", icon: "web_asset" },
    { key: "inputs", name: "输入", icon: "toggle_on" },
    { key: "content", name: "内容", icon: "notes" },
    { key: "progress", name: "进度", icon: "progress_activity" },
    { key: "uiverse", name: "社区", icon: "bolt" },
  ];

  /* 组件顺序（与 m3e-canvas KIND_ORDER 一致，共 33 种） */
  const KIND_ORDER = [
    "button", "iconButton", "fab", "extendedFab", "splitButton", "fabMenu", "chip",
    "topAppBar", "bottomNav", "navRail", "toolbar", "tabs", "searchBar",
    "card", "listItem", "box", "dialog", "snackbar",
    "textField", "select", "switch", "checkbox", "radio", "slider",
    "text", "image", "camera", "map", "badge", "divider",
    "loadingIndicator", "linearProgress", "circularProgress",
  ];

  /* 7 套 M3 色板（值取自 m3e-canvas lib/tokens.ts PRESETS） */
  const PALETTES = [
    { key:"purple", name:"紫罗兰",
      primary:"#6750A4", onPrimary:"#FFFFFF", primaryContainer:"#EADDFF", onPrimaryContainer:"#21005D", inversePrimary:"#D0BCFF", secondaryContainer:"#E8DEF8", onSecondaryContainer:"#1D192B", tertiaryContainer:"#FFD8E4", onTertiaryContainer:"#31111D", surface:"#FEF7FF", surfaceContainerLow:"#F7F2FA", surfaceContainer:"#F3EDF7", surfaceContainerHigh:"#ECE6F0", surfaceContainerHighest:"#E6E0E9", onSurface:"#1D1B20", onSurfaceVariant:"#49454F", outline:"#79747E", outlineVariant:"#CAC4D0", inverseSurface:"#322F35", inverseOnSurface:"#F5EFF7", error:"#B3261E", onError:"#FFFFFF", errorContainer:"#F9DEDC", onErrorContainer:"#410E0B" },
    { key:"blue", name:"蓝",
      primary:"#0B57D0", onPrimary:"#FFFFFF", primaryContainer:"#D3E3FD", onPrimaryContainer:"#041E49", inversePrimary:"#A8C7FA", secondaryContainer:"#DCE2F9", onSecondaryContainer:"#131C2B", tertiaryContainer:"#FFD8EE", onTertiaryContainer:"#2E1125", surface:"#FAF9FD", surfaceContainerLow:"#F3F3FA", surfaceContainer:"#EEEDF3", surfaceContainerHigh:"#E9E8EF", surfaceContainerHighest:"#E3E2E6", onSurface:"#1B1B1F", onSurfaceVariant:"#44474E", outline:"#74777F", outlineVariant:"#C4C6D0", inverseSurface:"#303034", inverseOnSurface:"#F2F0F4", error:"#B3261E", onError:"#FFFFFF", errorContainer:"#F9DEDC", onErrorContainer:"#410E0B" },
    { key:"green", name:"绿",
      primary:"#2E6A45", onPrimary:"#FFFFFF", primaryContainer:"#B0F1C2", onPrimaryContainer:"#00210F", inversePrimary:"#95D5A7", secondaryContainer:"#D3E8D8", onSecondaryContainer:"#102016", tertiaryContainer:"#C2E8FF", onTertiaryContainer:"#001E2C", surface:"#F6FBF4", surfaceContainerLow:"#F0F5EE", surfaceContainer:"#EAF0E8", surfaceContainerHigh:"#E4EAE2", surfaceContainerHighest:"#DEE4DC", onSurface:"#181D18", onSurfaceVariant:"#414941", outline:"#707972", outlineVariant:"#BFC9C0", inverseSurface:"#2D322D", inverseOnSurface:"#EEF2EB", error:"#B3261E", onError:"#FFFFFF", errorContainer:"#F9DEDC", onErrorContainer:"#410E0B" },
    { key:"coral", name:"珊瑚",
      primary:"#984061", onPrimary:"#FFFFFF", primaryContainer:"#FFD9E2", onPrimaryContainer:"#3E001D", inversePrimary:"#FFB0C8", secondaryContainer:"#F6DDE4", onSecondaryContainer:"#31101D", tertiaryContainer:"#FFDBCA", onTertiaryContainer:"#2C1600", surface:"#FFF8F8", surfaceContainerLow:"#FCF0F2", surfaceContainer:"#F6EBED", surfaceContainerHigh:"#F3E5E9", surfaceContainerHighest:"#EEE0E3", onSurface:"#201A1B", onSurfaceVariant:"#524346", outline:"#847377", outlineVariant:"#D5C2C6", inverseSurface:"#352F30", inverseOnSurface:"#FAEEEF", error:"#B3261E", onError:"#FFFFFF", errorContainer:"#F9DEDC", onErrorContainer:"#410E0B" },
    { key:"amber", name:"琥珀",
      primary:"#8B5000", onPrimary:"#FFFFFF", primaryContainer:"#FFDCC2", onPrimaryContainer:"#2C1600", inversePrimary:"#FFB77C", secondaryContainer:"#F6DFC8", onSecondaryContainer:"#271905", tertiaryContainer:"#D5EDC0", onTertiaryContainer:"#0E2004", surface:"#FFF8F5", surfaceContainerLow:"#FCF1EA", surfaceContainer:"#F7ECE4", surfaceContainerHigh:"#F3E6DE", surfaceContainerHighest:"#EDE0D8", onSurface:"#211A14", onSurfaceVariant:"#51443B", outline:"#83746A", outlineVariant:"#D6C3B6", inverseSurface:"#362F28", inverseOnSurface:"#FBEEE5", error:"#B3261E", onError:"#FFFFFF", errorContainer:"#F9DEDC", onErrorContainer:"#410E0B" },
    { key:"teal", name:"青",
      primary:"#00696E", onPrimary:"#FFFFFF", primaryContainer:"#9CF1F6", onPrimaryContainer:"#002022", inversePrimary:"#80D5DA", secondaryContainer:"#CCE8E9", onSecondaryContainer:"#051F20", tertiaryContainer:"#D2E4FF", onTertiaryContainer:"#001C3B", surface:"#F4FBFB", surfaceContainerLow:"#EEF5F5", surfaceContainer:"#E8EFEF", surfaceContainerHigh:"#E2EAEA", surfaceContainerHighest:"#DDE4E4", onSurface:"#161D1D", onSurfaceVariant:"#3F4948", outline:"#6F7979", outlineVariant:"#BEC8C8", inverseSurface:"#2B3232", inverseOnSurface:"#ECF2F2", error:"#B3261E", onError:"#FFFFFF", errorContainer:"#F9DEDC", onErrorContainer:"#410E0B" },
    { key:"mono", name:"单色",
      primary:"#4A4459", onPrimary:"#FFFFFF", primaryContainer:"#E6E0F0", onPrimaryContainer:"#1A1626", inversePrimary:"#CFC3E0", secondaryContainer:"#E6E1E6", onSecondaryContainer:"#1B1B1F", tertiaryContainer:"#E9E0EA", onTertiaryContainer:"#1E1A22", surface:"#FCF8FD", surfaceContainerLow:"#F5F1F6", surfaceContainer:"#EFEBF0", surfaceContainerHigh:"#E9E5EA", surfaceContainerHighest:"#E4E0E5", onSurface:"#1C1B1F", onSurfaceVariant:"#48454E", outline:"#79747E", outlineVariant:"#CAC4D0", inverseSurface:"#313033", inverseOnSurface:"#F4EFF4", error:"#B3261E", onError:"#FFFFFF", errorContainer:"#F9DEDC", onErrorContainer:"#410E0B" },
  ];

  /* ---------- 简化 HCT：hex↔HSL 色调映射，用于深色方案推导 ---------- */
  function hexToHsl(hex) {
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
    const l = (mx + mn) / 2;
    const s = d ? d / (1 - Math.abs(2 * l - 1)) : 0;
    return [h, s * 100, l * 100];
  }
  function hslHex(h, s, l) {
    s /= 100; l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const to = v => Math.round(255 * v).toString(16).padStart(2, "0");
    return "#" + to(f(0)) + to(f(8)) + to(f(4));
  }
  /** 按 Material 色调(lightness)映射到深色方案：hue/sat 保留 */
  function darkScheme(p) {
    const T = (hex, tone, satMul) => { const [h, s] = hexToHsl(hex); return hslHex(h, Math.min(100, s * (satMul == null ? 1 : satMul)), tone); };
    const neutral = hexToHsl(p.surface)[0], ns = Math.max(4, Math.min(14, hexToHsl(p.surface)[1] * 0.6));
    const N = tone => hslHex(neutral, ns, tone);
    return {
      primary: T(p.primary, 80), onPrimary: T(p.primary, 20), primaryContainer: T(p.primary, 30), onPrimaryContainer: T(p.primary, 90),
      inversePrimary: T(p.primary, 40), secondaryContainer: T(p.secondaryContainer, 30), onSecondaryContainer: T(p.secondaryContainer, 90),
      tertiaryContainer: T(p.tertiaryContainer, 30), onTertiaryContainer: T(p.tertiaryContainer, 90),
      surface: N(6), surfaceContainerLow: N(12), surfaceContainer: N(17), surfaceContainerHigh: N(22), surfaceContainerHighest: N(27),
      onSurface: N(90), onSurfaceVariant: N(80), outline: N(60), outlineVariant: N(30),
      inverseSurface: N(90), inverseOnSurface: N(20),
      error: "#F2B8B5", onError: "#601410", errorContainer: "#8C1D18", onErrorContainer: "#F9DEDC",
    };
  }
  function activeScheme(theme) {
    const base = PALETTES.find(x => x.key === theme.palette) || PALETTES[0];
    return theme.dark ? darkScheme(base) : base;
  }

  /* 色板 → CSS 变量（画布预览与导出共用同一组变量名） */
  const VAR_MAP = {
    primary: "--pri", onPrimary: "--on-pri", primaryContainer: "--pri-c", onPrimaryContainer: "--on-pri-c",
    inversePrimary: "--inv-pri", secondaryContainer: "--sec-c", onSecondaryContainer: "--on-sec-c",
    tertiaryContainer: "--ter-c", onTertiaryContainer: "--on-ter-c",
    surface: "--sur", surfaceContainerLow: "--sur-cl", surfaceContainer: "--sur-c",
    surfaceContainerHigh: "--sur-ch", surfaceContainerHighest: "--sur-chh",
    onSurface: "--on-sur", onSurfaceVariant: "--on-sur-var", outline: "--out", outlineVariant: "--out-var",
    inverseSurface: "--inv-sur", inverseOnSurface: "--inv-on-sur",
    error: "--err", onError: "--on-err", errorContainer: "--err-c", onErrorContainer: "--on-err-c",
  };
  function schemeVars(scheme) {
    const o = {};
    for (const k in VAR_MAP) if (scheme[k]) o[VAR_MAP[k]] = scheme[k];
    return o;
  }

  function uid() { return Math.random().toString(36).slice(2, 10); }

  function defaultPage(name, kind) {
    const phone = kind !== "desktop";
    return {
      id: uid(), name: name || "屏幕 1", kind: phone ? "phone" : "desktop",
      x: 0, y: 0, bg: "", items: [], groups: [],
    };
  }
  /** 页面尺寸：优先使用自定义 w/h，否则按类型 */
  function pageSize(p) {
    if (p.w > 0 && p.h > 0) return { w: p.w, h: p.h };
    return p.kind === "desktop" ? { w: DESKTOP_W, h: DESKTOP_H } : { w: PHONE_W, h: PHONE_H };
  }

  /* 深浅色默认背景（页面未自定义背景时） */
  function pageBg(theme) { return theme.dark ? "#141218" : "#FEF7FF"; }

  window.M3E_TOKENS = {
    PHONE_W, PHONE_H, PHONE_R, DESKTOP_W, DESKTOP_H, DESKTOP_R, MARGIN, CONTENT_W, HALF_W,
    BEZEL, FRAME_LABEL_H, STATUS_BAR_H, NAV_BAR_H, APPBAR_H, BOTTOMNAV_H, BTN_H,
    CATEGORIES, KIND_ORDER, PALETTES,
    hexToHsl, hslHex, darkScheme, activeScheme, schemeVars, uid, defaultPage, pageSize, pageBg,
  };
})();
