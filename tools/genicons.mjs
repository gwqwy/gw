// 生成 designer/js/icons.js — 从 @material-symbols/svg-400 (rounded) 提取 SVG path
// 用法: node genicons.mjs
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)));
const pkg = join(root, "node_modules", "@material-symbols", "svg-400", "rounded");

const ICONS = [
  // 组件默认图标
  "add", "favorite", "edit", "menu", "more_vert", "more_horiz", "search", "mic",
  "home", "settings", "person", "chevron_right", "chevron_left", "image", "photo_camera",
  "map", "info", "close", "send", "check", "notifications_unread", "event",
  "attach_file", "arrow_drop_down", "arrow_back", "music_note", "movie", "book",
  // 组件面板 tile 图标（与 m3e-canvas 一致）
  "buttons_alt", "radio_button_checked", "add_circle", "add_box", "label", "toolbar",
  "bottom_navigation", "side_navigation", "tab", "web_asset", "list", "chat_bubble",
  "call_to_action", "text_fields", "arrow_drop_down_circle", "toggle_on", "check_box",
  "sliders", "title", "horizontal_rule", "motion_blur", "linear_scale", "remove", "logout",
  "progress_activity", "splitscreen_right", "touch_app", "explore", "notes",
  // 分类/编辑器 UI
  "star", "undo", "redo", "zoom_in", "zoom_out", "fit_screen", "save", "folder_open",
  "code", "description", "content_copy", "content_paste", "delete", "visibility",
  "download", "data_object", "drag_indicator", "format_size", "open_in_full",
  "height", "grid_on", "desktop_windows", "devices", "layers",
  "palette", "text_snippet", "open_in_new", "refresh", "swap_horiz",
  "crop_square", "select_all", "upload", "share", "terminal", "bolt", "lightbulb", "bakery_dining", "ramen_dining", "circle", "group", "arrow_upward", "arrow_downward", "pan_tool", "pause_circle", "web", "table_chart", "check_box_outline_blank", "notifications", "play_circle", "view_carousel", "vertical_split", "keyboard_arrow_down", "account_circle", "table_rows", "grid_view", "schedule", "inbox", "menu_open", "event_available", "subdirectory_arrow_right",
  // v1.1.0 新增组件
  "view_week", "subject", "timeline", "double_arrow", "format_quote", "integration_instructions",
];

function bodyOf(file) {
  const s = readFileSync(file, "utf8");
  const m = s.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  if (!m) throw new Error("no svg body: " + file);
  return m[1].replace(/\s*xmlns="[^"]*"/g, "").replace(/\s*fill="[^"]*"/g, "").trim();
}

const out = {};
const missing = [];
for (const name of ICONS) {
  const reg = join(pkg, name + ".svg");
  const fil = join(pkg, name + "-fill.svg");
  if (!existsSync(reg)) { missing.push(name); continue; }
  out[name] = { b: bodyOf(reg) };
  if (existsSync(fil)) out[name].f = bodyOf(fil);
}

const js = `// 自动生成：tools/genicons.mjs — Material Symbols Rounded (svg-400) 内联图标
// b = 常规(outlined)，f = 实心(fill)；viewBox 统一 "0 -960 960 960"
window.M3E_ICONS = ${JSON.stringify(out, null, 0)};
`;
writeFileSync(join(root, "..", "designer", "js", "icons.js"), js);
console.log("icons:", Object.keys(out).length, "missing:", missing.length ? missing.join(",") : "(none)");
