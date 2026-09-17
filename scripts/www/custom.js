// ============================================================
// PakePlus 注入脚本（离线版 · 记账 App 专用）
// 说明：原版 PakePlus 默认脚本里带 Google Analytics 埋点
//      （googletagmanager.com），会联网上报且在国内网络下
//      拖死 WebView 导致白屏。此处已彻底删除所有联网代码，
//      仅保留让 App 内行为正常的本地逻辑。
// 用法：在 PakePlus 的「注入脚本 / 脚本文件」里选本文件。
// ============================================================

// 1) 禁用右键菜单里的"查看源代码"等 —— 保持原生 App 手感
window.addEventListener("contextmenu", function (e) {
  // 只屏蔽非输入框区域的右键，输入框仍需长按粘贴
  var t = e.target;
  if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
  e.preventDefault();
}, false);

// 2) 拦截 window.open —— 记账 App 不需要弹新窗口，全部原地跳转
window.open = function (url) {
  if (url) location.href = url;
  return null;
};

// 3) 统一外链/about:blank 的行为，避免 WebView 里点链接后卡死
document.addEventListener("click", function (e) {
  var a = e.target && e.target.closest ? e.target.closest("a") : null;
  if (a && a.href) {
    var isHttp = /^https?:/i.test(a.href);
    if (isHttp) {
      // 避免 WebView 弹出空白窗口
      e.preventDefault();
      location.href = a.href;
    }
  }
}, true);

// 4) 处理拖动导致的异常（Tauri 默认允许拖放文件到窗口，会触发 navigate 丢数据）
window.addEventListener("dragover", function (e) { e.preventDefault(); }, false);
window.addEventListener("drop", function (e) { e.preventDefault(); }, false);
