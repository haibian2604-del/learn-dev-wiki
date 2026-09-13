/* my-knowledge 看板 · 逻辑层
   纯前端、无框架、零网络请求。数据由 scripts/build.py 生成到 data/wiki-data.js，
   以 `window.KB_DATA = {...}` 的形式在页面里用 <script src> 引入 —— 双击 HTML
   即可打开（file:// 下 fetch 会被 CORS 拦截，普通 script 不受影响）。
   分工：build.py 只做数据提取与聚合；本文件只做渲染与交互。 */
(function () {
  var ROOT = window.SITE_ROOT || "";

  var KIND_LABEL = { summary: "摘要", entity: "实体", concept: "概念" };
  var KIND_DIR = { summary: "summaries", entity: "entities", concept: "concepts" };
  var CHART_FONT = {
    family:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
    size: 12
  };

  var state = { data: null };

  /* ---------- 工具 ---------- */

  function el(id) {
    return document.getElementById(id);
  }

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function textColor() {
    return getComputedStyle(document.body).color;
  }

  function borderColor() {
    return getComputedStyle(document.body).getPropertyValue("--border").trim() || "#e9ecef";
  }

  function sum(obj) {
    return Object.keys(obj).reduce(function (n, k) {
      return n + obj[k];
    }, 0);
  }

  function sortByValue(obj) {
    return Object.keys(obj)
      .map(function (k) {
        return { key: k, value: obj[k] };
      })
      .sort(function (a, b) {
        return b.value - a.value;
      });
  }

  function showFatal(message, hint) {
    var main = el("main");
    if (!main) return;
    main.innerHTML =
      '<div class="empty"><strong>' + esc(message) + "</strong>" +
      (hint ? "<span>" + hint + "</span>" : "") +
      "</div>";
  }

  /* ---------- 渲染：统计卡片 ---------- */

  function renderStats() {
    var host = el("stats");
    if (!host) return;
    var s = state.data.stats;
    var cards = [
      { label: "Wiki 页面", value: s.pages, foot: "摘要 + 实体 + 概念", color: "var(--c-schema)" },
      { label: "摘要页", value: s.summaries, foot: "每篇源文件一篇", color: "var(--c-summary)" },
      { label: "实体页", value: s.entities, foot: "人 / 组织 / 产品 / 项目", color: "var(--c-entity)" },
      { label: "概念页", value: s.concepts, foot: "理论 / 术语 / 方法", color: "var(--c-concept)" },
      { label: "原始资料", value: s.rawSources, foot: "分布 " + s.knowledgePoints + " 个知识点", color: "var(--c-other)" },
      { label: "双向链接", value: s.links, foot: "标签 " + s.tags + " 个 · 日志 " + s.logs + " 条", color: "var(--c-academic)" }
    ];
    host.innerHTML = cards
      .map(function (c) {
        return (
          '<div class="stat">' +
          '<div class="stat__label"><span class="stat__dot" style="background:' + c.color + '"></span>' + esc(c.label) + "</div>" +
          '<div class="stat__value">' + c.value.toLocaleString() + "</div>" +
          '<div class="stat__foot">' + esc(c.foot) + "</div>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---------- 渲染：图例 ---------- */

  function renderLegend(hostId, entries, total) {
    var host = el(hostId);
    if (!host) return;
    host.innerHTML = entries
      .map(function (e) {
        var pct = total ? ((e.value / total) * 100).toFixed(1) + "%" : "";
        return (
          '<div class="legend__row">' +
          '<span class="legend__dot" style="background:' + e.color + '"></span>' +
          '<span class="legend__name">' + esc(e.label) + "</span>" +
          '<span class="legend__val">' + e.value + "</span>" +
          '<span class="legend__pct">' + pct + "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---------- 渲染：Chart.js 图表 ---------- */

  function hasChart() {
    return typeof window.Chart !== "undefined";
  }

  function doughnut(canvasId, rows, meta) {
    var canvas = el(canvasId);
    if (!canvas || !hasChart()) return;
    return new Chart(canvas, {
      type: "doughnut",
      data: {
        labels: rows.map(function (r) {
          return (meta[r.key] && meta[r.key].label) || r.key;
        }),
        datasets: [
          {
            data: rows.map(function (r) {
              return r.value;
            }),
            backgroundColor: rows.map(function (r) {
              return (meta[r.key] && meta[r.key].color) || "#adb5bd";
            }),
            borderColor: getComputedStyle(document.body).backgroundColor,
            borderWidth: 2,
            hoverOffset: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "64%",
        animation: { duration: 600 },
        plugins: {
          legend: { display: false },
          tooltip: {
            padding: 10,
            cornerRadius: 6,
            displayColors: true,
            callbacks: {
              label: function (ctx) {
                var total = ctx.dataset.data.reduce(function (a, b) {
                  return a + b;
                }, 0);
                return " " + ctx.label + " " + ctx.parsed + " 页 (" + ((ctx.parsed / total) * 100).toFixed(1) + "%)";
              }
            }
          }
        }
      }
    });
  }

  function knowledgePointChart() {
    var canvas = el("chart-kp");
    if (!canvas || !hasChart()) return;
    var rows = state.data.byKnowledgePoint;
    var color = (state.data.palette || {}).primary || "#1971c2";
    return new Chart(canvas, {
      type: "bar",
      data: {
        labels: rows.map(function (r) {
          return r.label + "  " + r.folder;
        }),
        datasets: [
          {
            label: "源文件数",
            data: rows.map(function (r) {
              return r.count;
            }),
            backgroundColor: color,
            borderRadius: 3,
            barThickness: 13
          }
        ]
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        plugins: {
          legend: { display: false },
          tooltip: { padding: 10, cornerRadius: 6 }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: { color: textColor(), stepSize: 2, font: CHART_FONT },
            grid: { color: borderColor(), drawBorder: false },
            border: { display: false }
          },
          y: {
            ticks: { color: textColor(), font: CHART_FONT, autoSkip: false },
            grid: { display: false },
            border: { display: false }
          }
        }
      }
    });
  }

  function growthChart() {
    var canvas = el("chart-growth");
    if (!canvas || !hasChart()) return;
    var rows = state.data.timeline;
    var pal = state.data.palette || {};
    var accent = pal.accent || "#9c36b5";
    var warn = pal.warn || "#f08c00";
    return new Chart(canvas, {
      data: {
        labels: rows.map(function (r) {
          return r.month;
        }),
        datasets: [
          {
            type: "line",
            label: "累计页面数",
            data: rows.map(function (r) {
              return r.cumulative;
            }),
            borderColor: accent,
            backgroundColor: hexA(accent, 0.1),
            fill: true,
            tension: 0.32,
            pointRadius: 4,
            pointBackgroundColor: accent,
            pointBorderColor: getComputedStyle(document.body).backgroundColor,
            pointBorderWidth: 2,
            yAxisID: "y"
          },
          {
            type: "bar",
            label: "当月摄入源文件数",
            data: rows.map(function (r) {
              return r.ingests;
            }),
            backgroundColor: hexA(warn, 0.85),
            borderRadius: 4,
            barPercentage: 0.42,
            yAxisID: "y1"
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 600 },
        interaction: { mode: "index", intersect: false },
        plugins: {
          legend: {
            display: true,
            position: "top",
            align: "end",
            labels: { color: textColor(), boxWidth: 10, boxHeight: 10, usePointStyle: true, font: CHART_FONT }
          },
          tooltip: { padding: 10, cornerRadius: 6 }
        },
        scales: {
          x: {
            ticks: { color: textColor(), font: CHART_FONT },
            grid: { display: false },
            border: { display: false }
          },
          y: {
            position: "left",
            beginAtZero: true,
            title: { display: true, text: "累计页面", color: textColor(), font: CHART_FONT },
            ticks: { color: textColor(), font: CHART_FONT },
            grid: { color: borderColor(), drawBorder: false },
            border: { display: false }
          },
          y1: {
            position: "right",
            beginAtZero: true,
            title: { display: true, text: "当月摄入", color: textColor(), font: CHART_FONT },
            ticks: { color: textColor(), font: CHART_FONT, precision: 0 },
            grid: { display: false },
            border: { display: false }
          }
        }
      }
    });
  }

  function renderCharts() {
    var d = state.data;
    var typeRows = sortByValue(d.byType);
    var statusRows = sortByValue(d.byStatus);
    var domainRows = sortByValue(d.byDomain);

    doughnut("chart-type", typeRows, d.typeMeta);
    doughnut("chart-status", statusRows, d.statusMeta);
    doughnut("chart-domain", domainRows, d.domainMeta);
    knowledgePointChart();
    growthChart();

    renderLegend(
      "legend-type",
      typeRows.map(function (r) {
        return { label: (d.typeMeta[r.key] || {}).label || r.key, value: r.value, color: (d.typeMeta[r.key] || {}).color };
      }),
      sum(d.byType)
    );
    renderLegend(
      "legend-status",
      statusRows.map(function (r) {
        return { label: (d.statusMeta[r.key] || {}).label || r.key, value: r.value, color: (d.statusMeta[r.key] || {}).color };
      }),
      sum(d.byStatus)
    );
    renderLegend(
      "legend-domain",
      domainRows.map(function (r) {
        return { label: (d.domainMeta[r.key] || {}).label || r.key, value: r.value, color: (d.domainMeta[r.key] || {}).color };
      }),
      sum(d.byDomain)
    );
  }

  /* ---------- 渲染：TOP 标签（CSS 条形，信息密度高于图表） ---------- */

  function renderTopTags() {
    var host = el("top-tags");
    if (!host) return;
    var rows = state.data.topTags;
    var max = rows.length ? rows[0].count : 1;
    host.innerHTML = rows
      .map(function (r) {
        var w = Math.max(2, (r.count / max) * 100);
        return (
          '<div class="bar">' +
          '<span class="bar__label">#' + esc(r.tag) + "</span>" +
          '<span class="bar__track"><span class="bar__fill" style="width:' + w.toFixed(1) + '%"></span></span>' +
          '<span class="bar__val">' + r.count + "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---------- 渲染：最近活动 ---------- */

  function renderActivity() {
    var host = el("activity");
    if (!host) return;
    var rows = state.data.activity || [];
    if (!rows.length) {
      host.innerHTML = '<div class="empty"><strong>暂无日志记录</strong></div>';
      return;
    }
    host.innerHTML = rows
      .map(function (r) {
        return (
          '<div class="tl-item">' +
          '<span class="tl-item__date">' + esc(r.date) + "</span>" +
          '<span class="tl-item__kind">' + esc(r.kind) + "</span>" +
          '<span class="tl-item__title" title="' + esc(r.title) + '">' + esc(r.title) + "</span>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---------- 渲染：内容列表页 ---------- */

  function pageCard(page, kind) {
    var meta = state.data.typeMeta[kind] || {};
    var statusMeta = state.data.statusMeta[page.status] || {};
    var tags = page.tags
      .slice(0, 3)
      .map(function (t) {
        return '<span class="tag">' + esc(t) + "</span>";
      })
      .join("");

    return (
      '<article class="card" style="--tone:' + (meta.color || "#dee2e6") + '">' +
      '<div class="card__top">' +
      '<span class="chip" style="background:' + hexA(meta.color, 0.14) + ";color:" + meta.color + '">' + esc(KIND_LABEL[kind] || kind) + "</span>" +
      '<span class="card__status">' +
      '<i style="background:' + (statusMeta.color || "#adb5bd") + '"></i>' +
      esc(statusMeta.label || page.status) +
      "</span>" +
      "</div>" +
      '<h3 class="card__title">' + esc(page.title) + "</h3>" +
      '<p class="card__blurb">' + esc(page.blurb || "（该页尚未提取到简介）") + "</p>" +
      '<div class="card__foot">' + tags +
      '<span class="card__date">' + esc(page.updated || page.created || "") + "</span>" +
      "</div>" +
      "</article>"
    );
  }

  function hexA(hex, alpha) {
    if (!hex || hex.charAt(0) !== "#") return "rgba(134,142,150," + alpha + ")";
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + ((n >> 16) & 255) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + alpha + ")";
  }

  function initListPage() {
    var kind = document.body.dataset.kind; // summary | entity | concept
    var dir = KIND_DIR[kind];
    var pages = (state.data.pages && state.data.pages[dir]) || [];

    var domainSel = el("filter-domain");
    var statusSel = el("filter-status");
    var tagSel = el("filter-tag");
    var search = el("filter-search");
    var reset = el("filter-reset");
    var count = el("filter-count");
    var grid = el("card-grid");

    function fillOptions(select, values, meta, allLabel) {
      if (!select) return;
      var opts = ['<option value="">' + allLabel + "</option>"];
      values.forEach(function (v) {
        var label = meta && meta[v] ? meta[v].label + " · " + v : v;
        opts.push('<option value="' + esc(v) + '">' + esc(label) + "</option>");
      });
      select.innerHTML = opts.join("");
    }

    var domains = Array.from(new Set(pages.map(function (p) { return p.domain; }))).sort();
    var statuses = Array.from(new Set(pages.map(function (p) { return p.status; }))).sort();
    var tags = Array.from(
      new Set(pages.reduce(function (acc, p) { return acc.concat(p.tags); }, []))
    ).sort();

    fillOptions(domainSel, domains, state.data.domainMeta, "全部领域");
    fillOptions(statusSel, statuses, state.data.statusMeta, "全部状态");
    fillOptions(tagSel, tags, null, "全部标签");

    function apply() {
      var d = domainSel ? domainSel.value : "";
      var s = statusSel ? statusSel.value : "";
      var t = tagSel ? tagSel.value : "";
      var q = search ? search.value.trim().toLowerCase() : "";

      var hits = pages.filter(function (p) {
        if (d && p.domain !== d) return false;
        if (s && p.status !== s) return false;
        if (t && p.tags.indexOf(t) === -1) return false;
        if (q) {
          var hay = (p.title + " " + p.blurb + " " + p.tags.join(" ") + " " + p.sources.join(" ")).toLowerCase();
          if (hay.indexOf(q) === -1) return false;
        }
        return true;
      });

      if (count) count.innerHTML = "命中 <b>" + hits.length + "</b> / " + pages.length + " 页";

      if (!hits.length) {
        grid.innerHTML =
          '<div class="empty" style="grid-column:1/-1"><strong>没有匹配的页面</strong>' +
          "<span>放宽筛选条件，或清空搜索关键词</span></div>";
        return;
      }

      grid.innerHTML = hits
        .sort(function (a, b) {
          return (b.updated || "").localeCompare(a.updated || "");
        })
        .map(function (p) {
          return pageCard(p, kind);
        })
        .join("");
    }

    [domainSel, statusSel, tagSel].forEach(function (sel) {
      if (sel) sel.addEventListener("change", apply);
    });
    if (search) search.addEventListener("input", apply);
    if (reset)
      reset.addEventListener("click", function () {
        [domainSel, statusSel, tagSel].forEach(function (sel) {
          if (sel) sel.value = "";
        });
        if (search) search.value = "";
        apply();
      });

    apply();
  }

  /* ---------- 启动 ---------- */

  function boot() {
    if (!window.KB_DATA) {
      showFatal(
        "数据未加载",
        "本页依赖 <code>data/wiki-data.js</code>。请确认该文件存在，且当前页面的 <code>&lt;script src&gt;</code> 路径正确（子页需用 <code>../data/wiki-data.js</code>）。<br><br>若数据缺失，在仓库根目录执行一次：<br><br><code>python3 scripts/build.py</code>"
      );
      return;
    }

    var data = window.KB_DATA;
    state.data = data;

    var stamp = el("generated-at");
    if (stamp) stamp.textContent = "数据生成于 " + data.generatedAt;

    var page = document.body.dataset.page;
    if (page === "dashboard") {
      renderStats();
      renderCharts();
      renderTopTags();
      renderActivity();
    } else if (page === "list") {
      initListPage();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
