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

  /* ---- Smooth scroll (Lenis), respeitando prefers-reduced-motion ---- */
  var lenis = null;
  if (!prefersReduced && typeof window.Lenis === "function") {
    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
  /* Âncoras internas: rolagem suave com offset do header (skip-link mantém foco nativo) */
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    if (a.classList.contains("skip-link")) return;
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: -88 });
      else target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" });
    });
  });

  /* ---- Formulário de contato → envia direto para o e-mail (sem backend) ---- */
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
      var submitBtn = form.querySelector('button[type="submit"]');
      var btnLabel = submitBtn ? submitBtn.textContent : "";

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Enviando…"; }
      note.classList.remove("ok");
      note.textContent = "Enviando sua mensagem…";

      fetch("https://formsubmit.co/ajax/advocacia@izarossiter.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          Nome: nome,
          "E-mail": email,
          WhatsApp: tel || "(não informado)",
          "Área": area,
          Mensagem: msg,
          _subject: "Contato pelo site: " + area,
          _template: "table",
          _captcha: "false"
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (d) {
          if (d && (d.success === true || d.success === "true")) {
            form.reset();
            note.classList.add("ok");
            note.textContent = "Mensagem enviada. A Iza responde assim que possível. Obrigado!";
          } else {
            throw new Error("falha");
          }
        })
        .catch(function () {
          note.classList.remove("ok");
          note.innerHTML = 'Não consegui enviar agora. Tente novamente ou ' +
            '<a class="ulink" href="https://wa.me/4915750995941" target="_blank" rel="noopener">fale pelo WhatsApp</a>.';
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = btnLabel; }
        });
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
