/* Iza Rossiter Advocacia — lista de artigos do blog.
   Lê blog/posts.json (gravado pelo pipeline de conteúdo) e preenche toda lista
   marcada com [data-blog-list]. Sem artigos, o conteúdo original fica como está. */
(function () {
  "use strict";

  var MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  var dataCurta = function (iso) {
    var p = String(iso).split("-");
    return p.length === 3 ? Number(p[2]) + " " + MESES[Number(p[1]) - 1] + " " + p[0] : "";
  };

  var card = function (post, base) {
    return '<li class="blog-card blog-card--post">' +
      '<span class="blog-card__tag">' + esc(post.area) + "</span>" +
      '<h3><a class="blog-card__link" href="' + esc(base + post.slug) + '.html">' + esc(post.titulo) + "</a></h3>" +
      '<p class="blog-card__excerpt">' + esc(post.resumo) + "</p>" +
      '<span class="blog-card__meta"><time datetime="' + esc(post.data) + '">' + dataCurta(post.data) + "</time> · " +
      esc(post.leitura) + " min de leitura</span>" +
      "</li>";
  };

  Array.prototype.forEach.call(document.querySelectorAll("[data-blog-list]"), function (list) {
    var scope = list.closest("[data-blog-scope]") || document;
    var base = list.getAttribute("data-base") || "";
    var limit = parseInt(list.getAttribute("data-limit"), 10) || 0;

    fetch(list.getAttribute("data-src"), { cache: "no-cache" })
      .then(function (r) { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then(function (posts) {
        if (!Array.isArray(posts) || !posts.length) return;
        posts = posts.slice().sort(function (a, b) { return String(b.data).localeCompare(String(a.data)); });
        if (limit) posts = posts.slice(0, limit);
        list.innerHTML = posts.map(function (p) { return card(p, base); }).join("");
        Array.prototype.forEach.call(scope.querySelectorAll("[data-blog-when-posts]"), function (el) { el.hidden = false; });
        Array.prototype.forEach.call(scope.querySelectorAll("[data-blog-when-empty]"), function (el) { el.hidden = true; });
      })
      .catch(function () { /* sem lista: mantém o conteúdo original */ });
  });
})();
