/* Book page: 4 FAKE sample sites, each with its own calendar. TEST only. No payment. */
(function () {
  "use strict";
  var C = window.LIBERTY || {};
  var RATE = C.PRICE_PRIMITIVE_NIGHT || 80;
  var SITES = [
    { id: "one", name: "Sample Site One", type: "Primitive", photo: "primitive-tent", priced: true,
      desc: "Hardwood clearing, level tent pad. Bring your own tent.", blocked: [2, 3, 9, 10, 16, 17, 23, 30, 31, 37, 38, 44] },
    { id: "two", name: "Sample Site Two", type: "Glamping", photo: "tent-woods-night", priced: false,
      desc: "Canvas tent on a deck. Details set by the Camp Host.", blocked: [4, 5, 6, 12, 13, 25, 26, 33, 34, 40] },
    { id: "three", name: "Sample Site Three", type: "Cabin", photo: "cabin", priced: false,
      desc: "Small cabin in the trees. Details set by the Camp Host.", blocked: [1, 7, 8, 14, 15, 21, 22, 28, 35, 42] },
    { id: "four", name: "Sample Site Four", type: "Waterfront", photo: "waterfront", priced: false,
      desc: "Tent pad near the water. Water rules set by the Camp Host.", blocked: [3, 4, 11, 18, 19, 27, 28, 36, 39, 45] }
  ];
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); }
  function ic(n) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + n + '"/></svg>'; }
  function key(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function fromKey(k) { var p = k.split("-"); return new Date(+p[0], p[1] - 1, +p[2]); }
  function nice(k) { return fromKey(k).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }); }
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var LS = "lrm_test_bookings";
  function load() { try { return JSON.parse(localStorage.getItem(LS) || "[]"); } catch (e) { return []; } }
  function save(b) { try { localStorage.setItem(LS, JSON.stringify(b)); } catch (e) {} }
  function booked(site) {
    var s = {};
    site.blocked.forEach(function (o) { var d = new Date(today); d.setDate(d.getDate() + o); s[key(d)] = 1; });
    load().forEach(function (b) {
      if (b.site !== site.id) return;
      var d = fromKey(b.ci), e = fromKey(b.co);
      while (d < e) { s[key(d)] = 1; d.setDate(d.getDate() + 1); }
    });
    return s;
  }
  var INC = '<ul class="inc">' + [["fire", "Fire ring"], ["flag", "Flag pole with flags"], ["aid", "First aid kit"], ["blanket", "Fire blanket"]].map(function (x) { return "<li>" + ic(x[0]) + x[1] + "</li>"; }).join("") + "</ul>";
  var list = $("#book-list");
  list.innerHTML = SITES.map(function (s) {
    var price = s.priced
      ? '<p class="priceline">$' + RATE + ' <small>/ night / site</small></p><p class="fine">Includes fire ring, flag pole with flags, first aid kit, fire blanket. Host extras optional. Per site, not per person.</p>'
      : '<p class="hostpriced">Host-priced. Your host will confirm pricing.</p>';
    return '<article class="panel" id="site-' + s.id + '"><div class="photo" role="img" aria-label="' + s.type + ' sample photo" style="background-image:url(assets/img/photos/' + s.photo + '.jpg)"></div><div class="pb">' +
      '<span class="tag' + (s.priced ? "" : " khaki") + '">' + s.type + '</span> <span class="tag outline">Fake sample site</span>' +
      '<h2>' + s.name + '</h2><p class="desc">' + esc(s.desc) + '</p>' + (s.priced ? INC : "") + price +
      '<div class="cal" data-cal="' + s.id + '"><div class="cal-head"><button type="button" data-prev aria-label="Previous month">&lsaquo;</button><b data-month></b><button type="button" data-next aria-label="Next month">&rsaquo;</button></div><div class="cal-grid" data-grid></div>' +
      '<div class="legend"><span><i style="background:#F3ECE1"></i>Available</span><span><i style="background:#DDD3C3"></i>Booked (fake)</span><span><i style="background:#9B2C2C"></i>Selected</span></div></div>' +
      '<div class="req-row"><div class="field"><label for="party-' + s.id + '">Group size</label><select id="party-' + s.id + '" data-party><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6 or more</option></select><p class="hint">Host limit applies.</p></div>' +
      '<p class="req-sum" data-sum aria-live="polite">Tap a check-in date.</p>' +
      '<button class="btn" type="button" data-req disabled>' + (s.priced ? "Request this site" : "Request details") + '</button></div></div></article>';
  }).join("");

  var state = {};
  SITES.forEach(function (s) {
    var root = $("#site-" + s.id);
    var st = state[s.id] = { site: s, root: root, month: new Date(today.getFullYear(), today.getMonth(), 1), ci: null, co: null };
    $("[data-prev]", root).addEventListener("click", function () { var m = new Date(st.month); m.setMonth(m.getMonth() - 1); if (m >= new Date(today.getFullYear(), today.getMonth(), 1)) { st.month = m; render(st); } });
    $("[data-next]", root).addEventListener("click", function () { st.month.setMonth(st.month.getMonth() + 1); render(st); });
    $("[data-grid]", root).addEventListener("click", function (e) {
      var b = e.target.closest("[data-day]"); if (!b || b.disabled) return;
      var k = b.getAttribute("data-day");
      if (!st.ci || st.co || k <= st.ci) { st.ci = k; st.co = null; }
      else {
        var bl = booked(s), d = fromKey(st.ci), ok = true;
        while (key(d) < k) { if (bl[key(d)]) ok = false; d.setDate(d.getDate() + 1); }
        if (ok) st.co = k; else { st.ci = k; st.co = null; }
      }
      render(st);
    });
    $("[data-req]", root).addEventListener("click", function () { openCheckout(st); });
    render(st);
  });
  function nights(st) { return st.ci && st.co ? Math.round((fromKey(st.co) - fromKey(st.ci)) / 864e5) : 0; }
  function render(st) {
    var bl = booked(st.site), m = st.month, root = st.root;
    $("[data-month]", root).textContent = m.toLocaleDateString("en-US", { month: "long", year: "numeric" });
    var h = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(function (x) { return '<span class="dow">' + x + "</span>"; }).join("");
    for (var i = 0; i < m.getDay(); i++) h += "<span></span>";
    var d = new Date(m);
    while (d.getMonth() === m.getMonth()) {
      var k = key(d), c = [], dis = false;
      if (d < today) { c.push("past"); dis = true; } else if (bl[k]) { c.push("booked"); dis = true; }
      if (k === st.ci || k === st.co) c.push("sel"); else if (st.ci && st.co && k > st.ci && k < st.co) c.push("inrange");
      h += '<button type="button" data-day="' + k + '" class="' + c.join(" ") + '"' + (dis ? " disabled" : "") + ' aria-label="' + nice(k) + (bl[k] ? ", booked" : "") + '">' + d.getDate() + "</button>";
      d.setDate(d.getDate() + 1);
    }
    $("[data-grid]", root).innerHTML = h;
    var n = nights(st), sum = $("[data-sum]", root);
    if (!st.ci) sum.textContent = "Tap a check-in date.";
    else if (!st.co) sum.textContent = "Check-in " + nice(st.ci) + ". Now tap check-out.";
    else sum.innerHTML = esc(n + " night" + (n > 1 ? "s" : "") + ", " + nice(st.ci) + " to " + nice(st.co)) + (st.site.priced ? '. Total <b>$' + n * RATE + "</b> ($" + RATE + " x " + n + ", per site)" : "");
    $("[data-req]", root).disabled = !n;
  }
  var ck = $("#checkout"), cf = $("#confirm"), cur = null;
  function openCheckout(st) {
    cur = st; var n = nights(st);
    $("#ck-site").textContent = st.site.name + " (" + st.site.type + ")";
    $("#ck-dates").textContent = nice(st.ci) + " to " + nice(st.co) + ", " + n + " night" + (n > 1 ? "s" : "");
    $("#ck-party").value = $("[data-party]", st.root).value;
    var tr = $("#ck-total-row");
    if (st.site.priced) { tr.hidden = false; $("#ck-total").textContent = "$" + n * RATE + " ($" + RATE + " x " + n + " nights, per site)"; $("#ck-pricing").hidden = true; }
    else { tr.hidden = true; $("#ck-pricing").hidden = false; }
    $("#ck-title").textContent = st.site.priced ? "Request this site" : "Request details";
    cf.hidden = true; ck.hidden = false; ck.scrollIntoView({ block: "start" });
  }
  $("#ck-cancel").addEventListener("click", function () { ck.hidden = true; cur.root.scrollIntoView({ block: "start" }); });
  $("#ck-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target; if (!f.checkValidity()) { f.reportValidity(); return; }
    var st = cur, n = nights(st), num = "LR-TEST-" + String(Math.floor(1000 + Math.random() * 9000));
    var all = load(); all.push({ num: num, site: st.site.id, ci: st.ci, co: st.co }); save(all);
    var rows = [["Guest", f.name.value], ["Email", f.email.value], ["Phone", f.phone.value], ["Group size", f.party.value], ["Site", st.site.name + " (" + st.site.type + ")"], ["Arrive", nice(st.ci)], ["Leave", nice(st.co)], ["Nights", n]];
    rows.push(st.site.priced ? ["Total (TEST, not charged)", "$" + n * RATE] : ["Pricing", "Host-priced. Host will confirm."]);
    $("#cf-num").textContent = num;
    $("#cf-list").innerHTML = rows.map(function (r) { return "<li><span>" + esc(r[0]) + "</span><b>" + esc(r[1]) + "</b></li>"; }).join("");
    st.ci = st.co = null; render(st); f.reset();
    ck.hidden = true; cf.hidden = false; cf.scrollIntoView({ block: "start" });
  });
  $("#cf-again").addEventListener("click", function () { cf.hidden = true; list.scrollIntoView({ block: "start" }); });
  $("#reset-tests").addEventListener("click", function () { save([]); Object.keys(state).forEach(function (k) { render(state[k]); }); this.textContent = "Test requests cleared"; });
})();
