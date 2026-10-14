/* Gear Up product list. Easy to switch from Amazon affiliate to own stock.
   mode: 'affiliate' = button goes to Amazon with AFFILIATE_TAG from config.js
   mode: 'own'       = Randall sells and ships it (needs a price and a checkout later)
   All items below are placeholders. Swap in real Amazon product links (ASINs) later. */
(function () {
  "use strict";
  var C = window.LIBERTY || {};
  var TAG = C.AFFILIATE_TAG || "";
  var PRODUCTS = [
    { name: "Tent", note: "A sturdy tent for a primitive pad.", mode: "affiliate", search: "camping tent 4 person", icon: "tent" },
    { name: "Sleeping bag", note: "Rated for cool Ohio nights.", mode: "affiliate", search: "sleeping bag 30 degree", icon: "bag" },
    { name: "Sleeping pad", note: "Something between you and the dirt.", mode: "affiliate", search: "camping sleeping pad", icon: "pad" },
    { name: "Lantern", note: "Warm light after the fire is out.", mode: "affiliate", search: "LED camping lantern", icon: "lantern" },
    { name: "Pie iron", note: "Cast iron over the ring.", mode: "affiliate", search: "pie iron campfire cooker", icon: "pie" },
    { name: "Camp chair", note: "A seat by the fire.", mode: "affiliate", search: "folding camp chair", icon: "chair" },
    { name: "Cooler", note: "Food and water for the stay.", mode: "affiliate", search: "camping cooler", icon: "cooler" },
    { name: "Headlamp", note: "Hands free after dark.", mode: "affiliate", search: "headlamp camping", icon: "headlamp" }
  ];

  function link(p) {
    if (p.mode === "own") return p.url || "#";
    return "https://www.amazon.com/s?k=" + encodeURIComponent(p.search) + (TAG ? "&tag=" + encodeURIComponent(TAG) : "");
  }
  var grid = document.getElementById("gear-grid");
  if (!grid) return;
  grid.innerHTML = PRODUCTS.map(function (p) {
    var btn = p.mode === "own"
      ? '<button class="btn soon" type="button" disabled>Coming soon from Liberty</button>'
      : '<a class="btn brick" href="' + link(p) + '" target="_blank" rel="sponsored noopener">Shop on Amazon</a>';
    return '<article class="product"><div class="art">' + '<svg class="ic" role="img" aria-label="' + p.name + ' (icon)"><use href="#i-' + p.icon + '"/></svg>' + '</div><div class="body"><span class="tag">' + (p.mode === "own" ? "Liberty stock" : "Amazon pick") + '</span> <span class="tbd">Placeholder</span><h3 style="margin-top:6px">' + p.name + '</h3><p>' + p.note + '</p>' + btn + '</div></article>';
  }).join("");
})();
