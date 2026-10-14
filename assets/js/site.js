/* Shared: draft banner, nav, host gate, simple forms. No outside calls. */
(function () {
  "use strict";
  var C = window.LIBERTY || {};
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  if (C.SHOW_DRAFT_BANNER) {
    var d = document.createElement("div"); d.className = "draft-strip";
    d.textContent = "Private mock-up. Not published.";
    document.body.insertBefore(d, document.body.firstChild);
  }
  var t = $(".nav-toggle"), n = $("#site-nav");
  if (t && n) t.addEventListener("click", function () {
    var o = t.getAttribute("aria-expanded") === "true";
    t.setAttribute("aria-expanded", o ? "false" : "true"); n.classList.toggle("open", !o);
  });
  $$("[data-year]").forEach(function (e) { e.textContent = String(new Date().getFullYear()); });

  /* Host gate. NOT REAL SECURITY. */
  var gate = $("#host-gate");
  if (gate) {
    var gated = $("[data-gated]"), KEY = "lrm_host_ok";
    function unlock() { gate.hidden = true; gated.hidden = false; }
    try { if (sessionStorage.getItem(KEY) === "1") unlock(); } catch (e) {}
    $("form", gate).addEventListener("submit", function (e) {
      e.preventDefault();
      var pw = $("#host-pass"), msg = $("#gate-msg");
      if (pw.value.trim() === String(C.HOST_PASSWORD || "")) {
        try { sessionStorage.setItem(KEY, "1"); } catch (er) {}
        msg.textContent = ""; unlock(); window.scrollTo(0, 0);
      } else { msg.textContent = pw.value ? "That password is not right." : "Enter the Camp Host password."; pw.focus(); }
    });
    var lock = $("#host-lock");
    if (lock) lock.addEventListener("click", function () { try { sessionStorage.removeItem(KEY); } catch (e) {} location.reload(); });
  }

  /* Simple forms: validate, then show on-screen confirmation. Nothing is sent. */
  $$("form[data-lr-form]").forEach(function (f) {
    f.setAttribute("novalidate", "");
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.checkValidity()) { f.reportValidity(); return; }
      var c = document.getElementById(f.getAttribute("data-confirm"));
      f.hidden = true; if (c) { c.hidden = false; c.setAttribute("tabindex", "-1"); c.focus(); }
    });
  });
})();
