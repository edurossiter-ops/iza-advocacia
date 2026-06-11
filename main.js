/* Iza Rossiter Advocacia — interações base.
   Motion refinado depois pelas skills Taste / Emil Kowalski. */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Header: estado "scrolled" ---- */
  var header = document.getElementById("header");
  var onScroll = function () {
    if (window.scrollY > 24) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Menu mobile ---- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      nav.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });
  }

  /* ---- Formulário de contato → compõe e-mail (sem backend) ---- */
  var form = document.getElementById("contatoForm");
  if (form) {
    var note = document.getElementById("formNote");
    var markField = function (input, bad) {
      var field = input.closest(".field");
      if (field) field.classList.toggle("invalid", bad);
      if (bad) input.setAttribute("aria-invalid", "true");
      else input.removeAttribute("aria-invalid");
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var nome = form.nome.value.trim();
      var email = form.email.value.trim();
      var msg = form.mensagem.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      markField(form.nome, !nome);
      markField(form.email, !emailOk);
      markField(form.mensagem, !msg);

      if (!nome || !emailOk || !msg) {
        note.classList.remove("ok");
        note.textContent = "Preencha nome, um e-mail válido e a mensagem para continuar.";
        var firstBad = form.querySelector(".field.invalid input, .field.invalid textarea");
        if (firstBad) firstBad.focus();
        return;
      }

      var area = form.area.value;
      var tel = form.telefone.value.trim();
      var subject = "Contato pelo site: " + area;
      var body =
        "Nome: " + nome + "\n" +
        "E-mail: " + email + "\n" +
        (tel ? "WhatsApp: " + tel + "\n" : "") +
        "Área: " + area + "\n\n" +
        msg + "\n";
      var href = "mailto:advocacia@izarossiter.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);

      note.classList.add("ok");
      note.textContent = "Abrindo seu aplicativo de e-mail com a mensagem pronta para a Iza…";
      window.location.href = href;
    });
  }

  /* ---- Reveal on scroll ---- */
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  if (prefersReduced || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }
})();
