/* Camp Host store. Hosts buy gear from Liberty (Randall).
   Prices are private and not set: every price shows $TBD.
   TEST checkout only. No payment, nothing sent. */
(function () {
  "use strict";
  var ITEMS = [
    { id: "ring-std", name: "Fire ring, standard", cat: "Fire", note: "Steel fire ring for the pad." },
    { id: "ring-smk", name: "Fire ring, smokeless", cat: "Fire", note: "Smokeless style fire ring." },
    { id: "firstaid", name: "First aid kit", cat: "Safety gear", note: "Site first aid kit." },
    { id: "blanket", name: "Fire blanket", cat: "Safety gear", note: "Fire blanket for the site." },
    { id: "extinguisher", name: "Fire extinguisher", cat: "Safety gear", note: "Extinguisher for the site." },
    { id: "wood", name: "Firewood", cat: "Fire", note: "Firewood for guest fires." },
    { id: "pole", name: "Flag pole", cat: "Site", note: "Extendable flag pole." },
    { id: "signs", name: "Camping signage", cat: "Site", note: "Site, trail and rules signs." },
    { id: "lights", name: "Solar security path lights", cat: "Site", note: "Solar lights for paths." }
  ];
  var ICON = { "ring-std": "fire", "ring-smk": "fire", firstaid: "aid", blanket: "blanket", extinguisher: "extinguisher", wood: "wood", pole: "flag", signs: "sign", lights: "light" };

  var cart = {};
  function $(s) { return document.querySelector(s); }
  var grid = $("#store-grid");
  if (!grid) return;
  grid.innerHTML = ITEMS.map(function (p) {
    return '<article class="product"><div class="art">' + '<svg class="ic" role="img" aria-label="' + p.name + ' (icon)"><use href="#i-' + ICON[p.id] + '"/></svg>' + '</div><div class="body"><span class="tag">' + p.cat + '</span> <span class="tbd">Price $TBD</span><h3 style="margin-top:6px">' + p.name + '</h3><p>' + p.note + '</p><button class="btn brick" type="button" data-add="' + p.id + '">Add to cart</button></div></article>';
  }).join("");
  function byId(id) { return ITEMS.filter(function (i) { return i.id === id; })[0]; }
  function count() { var n = 0; for (var k in cart) n += cart[k]; return n; }
  function render() {
    var ids = Object.keys(cart);
    $("#cart-count").textContent = count();
    $("#cart-list").innerHTML = ids.length ? ids.map(function (id) {
      return '<li><span>' + byId(id).name + ' <span class="tbd">$TBD</span></span><span class="qty"><button type="button" data-dec="' + id + '" aria-label="Remove one">-</button><b>' + cart[id] + '</b><button type="button" data-inc="' + id + '" aria-label="Add one">+</button></span></li>';
    }).join("") : '<li><span class="muted">Cart is empty.</span></li>';
    $("#cart-go").disabled = !ids.length;
  }
  document.addEventListener("click", function (e) {
    var t = e.target, id;
    if ((id = t.getAttribute && t.getAttribute("data-add"))) { cart[id] = (cart[id] || 0) + 1; t.textContent = "Added (" + cart[id] + ")"; render(); }
    else if ((id = t.getAttribute && t.getAttribute("data-inc"))) { cart[id]++; render(); }
    else if ((id = t.getAttribute && t.getAttribute("data-dec"))) { if (--cart[id] <= 0) delete cart[id]; render(); }
  });
  $("#cart-go").addEventListener("click", function () { $("#store-checkout").hidden = false; $("#store-checkout").scrollIntoView(); });
  $("#store-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target;
    if (!f.checkValidity()) { f.reportValidity(); return; }
    var num = "LR-HOST-TEST-" + String(Math.floor(1000 + Math.random() * 9000));
    $("#so-num").textContent = num;
    $("#so-list").innerHTML = Object.keys(cart).map(function (id) { return "<li><span>" + byId(id).name + "</span><b>x" + cart[id] + "</b></li>"; }).join("") + "<li><span>Total</span><b>$TBD (test, not charged)</b></li>";
    cart = {}; render(); f.reset();
    $("#store-checkout").hidden = true; $("#store-done").hidden = false; $("#store-done").scrollIntoView();
  });
})();
