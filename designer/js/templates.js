/* gw Designer — 页面模板库
 * 每个模板在「从模板新建页面」时按当前主题生成一整页组件。
 * 新增模板：向 window.M3E_TPL 追加 { id, name, kind, desc, make(theme) } 即可，
 * make 返回一个完整 page（make 内部只做布局，不碰应用状态）。 */
(function () {
  "use strict";
  const T = () => window.M3E_TOKENS;
  const R = () => window.M3E_REG;

  function build(theme, name, kind, fn) {
    const Tok = T(), REG = R();
    const p = Tok.defaultPage(name, kind);
    const A = (kind2, x, y, extra) => {
      const it = REG.create(kind2, x, y, theme);
      if (extra) Object.assign(it, extra);
      p.items.push(it);
      return it;
    };
    fn(A, p, Tok);
    return p;
  }

  window.M3E_TPL = [
    {
      id: "login", name: "登录页", kind: "phone", desc: "标题 + 账号密码 + 登录按钮 + 第三方登录",
      make(theme) {
        return build(theme, "登录", "phone", (A, p, Tok) => {
          const M = Tok.MARGIN;
          A("text", 126, 148, { label: "欢迎回来", size: 28, bold: true, w: 160, align: "center" });
          A("text", 116, 194, { label: "登录以继续使用", size: 14, w: 180, align: "center" });
          A("textField", M, 258, { label: "账号", hint: "手机号 / 邮箱", icon: "person" });
          A("textField", M, 334, { label: "密码", hint: "请输入密码", icon: "lock" });
          A("button", M, 428, { label: "登录", variant: "filled", w: Tok.CONTENT_W, iconPos: "none" });
          A("button", M, 500, { label: "忘记密码？", variant: "text", w: Tok.CONTENT_W, iconPos: "none" });
          A("divider", M, 576, { w: Tok.CONTENT_W });
          A("text", 116, 602, { label: "其他方式登录", size: 12, w: 180, align: "center" });
          A("iconButton", 116, 634, { icon: "person", variant: "tonal" });
          A("iconButton", 182, 634, { icon: "mail", variant: "tonal" });
          A("iconButton", 248, 634, { icon: "mobile", variant: "tonal" });
        });
      },
    },
    {
      id: "list", name: "列表页", kind: "phone", desc: "搜索 + 推荐卡片 + 列表 + FAB + 导航栏",
      make(theme) {
        return build(theme, "首页", "phone", (A, p, Tok) => {
          const M = Tok.MARGIN, AB = Tok.APPBAR_H, H = Tok.PHONE_H;
          A("topAppBar", 0, 0, { label: "首页", icon: "menu", icon2: "more_vert" });
          A("searchBar", M, AB + 16);
          A("card", M, AB + 88, { label: "今日推荐食谱", supporting: "20 分钟 · 简单 · 2 人份" });
          A("listItem", M, AB + 327, { label: "收藏", icon: "favorite", supporting: "12 个内容", meta: "今天" });
          A("listItem", M, AB + 399, { label: "消息", icon: "notifications", supporting: "3 条未读", meta: "09:41" });
          A("listItem", M, AB + 471, { label: "设置", icon: "settings", supporting: "通用偏好", meta: "" });
          A("bottomNav", 0, H - Tok.BOTTOMNAV_H);
          A("fab", Tok.PHONE_W - M - 56, H - Tok.BOTTOMNAV_H - M - 56, { icon: "add" });
        });
      },
    },
    {
      id: "detail", name: "详情页", kind: "phone", desc: "大图头部 + 介绍 + 信息行 + 报名按钮",
      make(theme) {
        return build(theme, "详情", "phone", (A, p, Tok) => {
          const M = Tok.MARGIN, H = Tok.PHONE_H;
          A("heroHeader", 0, 0, { label: "山野徒步", supporting: "发现身边的路线" });
          A("sectionHeader", M, 236, { label: "路线亮点" });
          A("text", M, 282, { label: "全程约 8 公里，途经溪谷与观景平台，适合轻装徒步。", size: 14, w: Tok.CONTENT_W });
          A("listItem", M, 360, { label: "起点集合", icon: "map", supporting: "08:30 东门游客中心" });
          A("listItem", M, 432, { label: "难度中等", icon: "star", supporting: "建议穿登山鞋" });
          A("button", M, 524, { label: "立即报名", variant: "filled", w: Tok.CONTENT_W, iconPos: "none" });
          A("bottomNav", 0, H - Tok.BOTTOMNAV_H);
        });
      },
    },
    {
      id: "settings", name: "设置页", kind: "phone", desc: "两组圆角分组列表",
      make(theme) {
        return build(theme, "设置", "phone", (A, p, Tok) => {
          const M = Tok.MARGIN, AB = Tok.APPBAR_H, H = Tok.PHONE_H;
          A("topAppBar", 0, 0, { label: "设置", icon: "arrow_back" });
          A("listGroup", M, AB + 16, {
            h: 168,
            tabs: [{ icon: "person", label: "个人资料" }, { icon: "notifications", label: "消息通知" }, { icon: "lock", label: "隐私与安全" }],
          });
          A("listGroup", M, AB + 200, {
            h: 128,
            tabs: [{ icon: "palette", label: "外观" }, { icon: "book", label: "内容偏好" }, { icon: "info", label: "关于" }],
          });
          A("bottomNav", 0, H - Tok.BOTTOMNAV_H);
        });
      },
    },
    {
      id: "dashboard", name: "仪表盘", kind: "desktop", desc: "侧边导航 + 折线/柱状/环形图 + 数据表",
      make(theme) {
        return build(theme, "数据概览", "desktop", (A, p, Tok) => {
          const AB = Tok.APPBAR_H, H = Tok.DESKTOP_H;
          A("topAppBar", 0, 0, { w: Tok.DESKTOP_W, label: "数据概览", icon: "menu", icon2: "more_vert" });
          A("navRail", 0, AB, { h: H - AB, tabs: [{ icon: "home", label: "总览" }, { icon: "show_chart", label: "趋势" }, { icon: "bar_chart", label: "报表" }, { icon: "settings", label: "配置" }] });
          A("sectionHeader", 144, 100, { label: "本周数据", supporting: "查看报表" });
          A("chartLine", 144, 148, { w: 460, h: 230 });
          A("chartBar", 632, 148, { w: 340, h: 230 });
          A("chartDonut", 1004, 152, { w: 170, h: 170, chPct: 68, chLabel: "68%" });
          A("table", 144, 412, { w: 640, h: 300, rows: 5, tabs: [{ icon: "", label: "渠道" }, { icon: "", label: "访问" }, { icon: "", label: "转化" }] });
          A("listItem", 812, 412, { w: 360, label: "最新动态", icon: "notifications", supporting: "上周转化率提升 4.2%" });
          A("listItem", 812, 484, { w: 360, label: "周报已生成", icon: "mail", supporting: "点击查收邮件" });
          A("linearProgress", 144, 740, { w: 640, value: 62 });
        });
      },
    },
    {
      id: "empty", name: "空状态页", kind: "phone", desc: "应用栏 + 空状态占位 + 行动按钮",
      make(theme) {
        return build(theme, "收藏", "phone", (A, p, Tok) => {
          const M = Tok.MARGIN, H = Tok.PHONE_H;
          A("topAppBar", 0, 0, { label: "收藏" });
          A("emptyState", M, Tok.APPBAR_H + 140, { h: 320, icon: "favorite", label: "还没有收藏", supporting: "看到喜欢的内容，点小心心收进来", cta: "去逛逛" });
          A("bottomNav", 0, H - Tok.BOTTOMNAV_H);
        });
      },
    },
    {
      id: "chat", name: "聊天页", kind: "phone", desc: "应用栏 + 左右气泡对话 + 底部输入",
      make(theme) {
        return build(theme, "客服", "phone", (A, p, Tok) => {
          const M = Tok.MARGIN, AB = Tok.APPBAR_H, H = Tok.PHONE_H;
          A("topAppBar", 0, 0, { label: "客服小助手", icon: "arrow_back", icon2: "more_vert" });
          A("chatBubble", M, AB + 16, { label: "你好，请问有什么可以帮你？", chatSide: "left", chatTime: "10:24" });
          A("chatBubble", M, AB + 96, { label: "我想查询订单的物流状态", chatSide: "right", chatTime: "10:25" });
          A("chatBubble", M, AB + 176, { label: "请提供订单号，我帮您查询", chatSide: "left", chatTime: "10:25" });
          A("chatBubble", M, AB + 256, { label: "订单号 20260930001", chatSide: "right", chatTime: "10:26" });
          A("searchBar", M, H - 72, { label: "输入消息…", icon: "mic", icon2: "send" });
        });
      },
    },
  ];
})();
