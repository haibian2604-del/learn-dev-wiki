/* 顶部导航与页脚 —— 单一数据源，新增子页只需改这里的 NAV 数组 */
(function () {
  var ROOT = window.SITE_ROOT || "";

  var NAV = [
    { href: "index.html", label: "概览看板" },
    { href: "pages/summaries.html", label: "摘要" },
    { href: "pages/entities.html", label: "实体" },
    { href: "pages/concepts.html", label: "概念" }
  ];

  var path = decodeURIComponent(location.pathname);
  var here = path.slice(path.lastIndexOf("/") + 1) || "index.html";

  var nav = document.getElementById("site-nav");
  if (nav) {
    var links = NAV.map(function (item) {
      var file = item.href.slice(item.href.lastIndexOf("/") + 1);
      var current = file === here ? ' aria-current="page"' : "";
      return (
        '<a href="' + ROOT + item.href + '"' + current + ">" + item.label + "</a>"
      );
    }).join("");

    nav.className = "site-nav";
    nav.innerHTML =
      '<div class="site-nav__inner">' +
      '<a class="brand" href="' + ROOT + 'index.html">' +
      '<span class="brand__dot"></span>my-knowledge' +
      '<span class="brand__sub">LLM Wiki</span>' +
      "</a>" +
      '<nav class="nav-links">' + links + "</nav>" +
      "</div>";
  }

  var foot = document.getElementById("site-footer");
  if (foot) {
    foot.className = "site-footer";
    foot.innerHTML =
      "<span>Karpathy LLM Wiki 方法论 · <code>00-Raw</code> → <code>01-Wiki</code> → <code>02-Rules</code></span>" +
      '<span class="site-footer__spacer"></span>' +
      "<span>数据由 <code>scripts/build.py</code> 从 <code>01-Wiki/</code> 生成</span>";
  }
})();
