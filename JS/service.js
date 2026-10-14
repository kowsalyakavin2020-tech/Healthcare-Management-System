/* ============================================================
   STACKLY — Healthcare Management · Service.js (v1)
   Preloader · Lenis · GSAP · Hero · Care lines · Journey ·
   Emergency · Virtual care · Labs · Insurance · Stories · FAQ · CTA
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  /* ---------- build decorative ECG for the preloader ---------- */
  function buildECG() {
    const box = $("#ecg");
    if (!box) return;
    const wave = [2,2,3,4,6,16,10,5,3,2,2,2,3,3,3,2,2,2,3,9,18,7,3,2,2,3,3,2,2,2,2,3,6,14,8,4,3,2,2,2,2,2,3,3,4,7,12,6,3,2,2,2];
    let html = "";
    for (let rep = 0; rep < 2; rep++) {
      for (let i = 0; i < 52; i++) {
        const h = wave[i % wave.length];
        const hi = (i % wave.length) > 14 && (i % wave.length) < 28 ? " hi" : "";
        html += `<span class="pulse${hi}" style="height:${h}px"></span>`;
      }
    }
    box.innerHTML = html;
    setTimeout(function () { box.classList.add("go"); }, 400);
  }

  /* ---------- Lenis smooth scroll ---------- */
  let lenis = null;
  if (typeof Lenis !== "undefined" && !prefersReduced) {
    lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 1, smoothWheel: true });
    if (hasGSAP) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }

  function scrollToId(href) {
    const target = document.querySelector(href);
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: -84, duration: 1.5 });
    else target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- magnetic buttons ---------- */
  function initMagnetic() {
    $$("[data-magnetic]").forEach(function (el) {
      if (prefersReduced || !hasGSAP) return;
      const strength = 0.35;
      const inner = el.querySelector("span") || el;
      el.addEventListener("mousemove", function (e) {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: "power3.out" });
        if (inner !== el) gsap.to(inner, { x: x * strength * 0.6, y: y * strength * 0.6, duration: 0.6, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.35)" });
        if (inner !== el) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.35)" });
      });
    });
  }

  /* ---------- preloader (identical logic to landing) ---------- */
  function runPreloader(onDone) {
    const el = $("#preloader");
    const countEl = $("#preCount");
    const bar = $("#preBar");
    const letters = $$(".pre-letter", el);
    if (!el || prefersReduced) { onDone && onDone(); return; }

    letters.forEach(function (l, i) {
      setTimeout(function () { l.classList.add("on"); }, 180 + i * 90);
    });

    const duration = 2400;
    let elapsed = 0;
    const tick = function () {
      elapsed += 16;
      const p = Math.min(1, elapsed / duration);
      const eased = 0.5 - 0.5 * Math.cos(p * Math.PI);
      const val = Math.floor(eased * 100);
      if (countEl) countEl.textContent = val;
      if (bar) bar.style.width = eased * 100 + "%";
      return p >= 1;
    };
    const timer = setInterval(function () {
      if (tick()) {
        clearInterval(timer);
        setTimeout(function () {
          el.classList.add("pre-done");
          document.body.classList.add("loaded");
          setTimeout(function () { el.style.display = "none"; }, 900);
          onDone && onDone();
        }, 380);
      }
    }, 16);
  }

  /* ---------- generic counters ---------- */
  function initCounters() {
    if (!hasGSAP) {
      $$(".count").forEach(function (n) { n.textContent = (parseInt(n.dataset.count, 10) || 0).toLocaleString("en-US"); });
      return;
    }
    $$(".count").forEach(function (el) {
      const target = parseInt(el.dataset.count, 10) || 0;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%" },
        onUpdate: function () { el.textContent = Math.round(obj.v).toLocaleString("en-US"); }
      });
    });
  }

  /* ============ 02 · HERO ============ */
  function initHero() {
    if (!hasGSAP) return;

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(".sh-top .eyebrow", { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo(".sh-title-big", { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, "-=0.4")
      .fromTo(".sh-lede", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.62")
      .fromTo(".sh-actions", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.55")
      .fromTo(".sh-cast", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
      .fromTo(".sh-cast-faces figure", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)", stagger: 0.08 }, "-=0.55")
      .fromTo(".sh-pnl", { yPercent: 30, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" }, "-=0.4")
      .fromTo(".sh-pnl-ico", { scale: 0, rotate: -60 }, { scale: 1, rotate: 0, duration: 0.6, stagger: 0.08, ease: "back.out(2)" }, "-=0.5");

    /* rotating headline word */
    const rot = $("#shRot");
    if (rot) {
      const words = ["emergency", "cardiology", "pediatrics", "radiology", "maternity"];
      let idx = 0;
      setInterval(function () {
        idx = (idx + 1) % words.length;
        gsap.fromTo(rot, { yPercent: 45, opacity: 0 }, {
          yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out",
          onStart: function () { rot.textContent = words[idx]; }
        });
      }, 2600);
    }

    /* expanding service panels — auto-cycle with hover/focus override */
    const panels = $$(".sh-pnl");
    if (panels.length) {
      let active = 0;
      let timer = null;
      const open = function (i) {
        panels.forEach(function (p, n) { p.classList.toggle("is-open", n === i); });
        active = i;
      };
      const stop = function () { if (timer) { clearInterval(timer); timer = null; } };
      const start = function () {
        stop();
        timer = setInterval(function () { open((active + 1) % panels.length); }, 3200);
      };
      open(0);
      if (!prefersReduced) start();
      panels.forEach(function (p, i) {
        p.addEventListener("mouseenter", function () { stop(); open(i); });
        p.addEventListener("focus", function () { stop(); open(i); });
        p.addEventListener("click", function () { open(i); });
      });
      const wrap = $("#shPanels");
      if (wrap) {
        wrap.addEventListener("mouseleave", function () { if (!prefersReduced) start(); });
        wrap.addEventListener("focusout", function () {
          setTimeout(function () { if (!prefersReduced && !wrap.contains(document.activeElement)) start(); }, 0);
        });
      }
    }

    if (prefersReduced) return;

    gsap.to(".sh-top", {
      yPercent: -10, opacity: 0.5, ease: "none",
      scrollTrigger: { trigger: ".svc-hero", start: "top top", end: "70% top", scrub: 1 }
    });
    gsap.to(".sh-panels", {
      yPercent: -6, ease: "none",
      scrollTrigger: { trigger: ".svc-hero", start: "top top", end: "bottom top", scrub: 1 }
    });
  }

  /* ============ 03 · CARE LINES ============ */
  function initLines() {
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".sl-card", { y: 60, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".sl-grid", start: "top 78%" }
    });
    gsap.fromTo(".svc-lines .sec-head > *", { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".svc-lines .sec-head", start: "top 85%" }
    });
  }

  /* ============ 04 · JOURNEY ============ */
  function initJourney() {
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".sj-step", { y: 54, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.14,
      scrollTrigger: { trigger: ".sj-steps", start: "top 80%" }
    });
    gsap.fromTo(".sj-fill", { scaleX: 0 }, {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: ".sj-steps", start: "top 82%", end: "bottom 70%", scrub: 1 }
    });
    gsap.fromTo(".sj-media", { y: 40, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".svc-journey .sec-head", start: "top 82%" }
    });
  }

  /* ============ 05 · EMERGENCY ============ */
  function initER() {
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".er-copy > *", { x: -40, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.75, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".er-grid", start: "top 78%" }
    });
    gsap.fromTo(".er-photo", { y: 50, scale: 0.95, opacity: 0 }, {
      y: 0, scale: 1, opacity: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".er-grid", start: "top 78%" }
    });
    gsap.to(".er-photo img", {
      yPercent: -8, ease: "none",
      scrollTrigger: { trigger: ".svc-er", start: "top bottom", end: "bottom top", scrub: 1 }
    });
  }

  /* ============ 06 · VIRTUAL CARE ============ */
  function initVirtual() {
    /* ticking call timer */
    const t = $("#svTimer");
    if (t) {
      let secs = 12 * 60 + 4;
      setInterval(function () {
        secs++;
        const m = String(Math.floor(secs / 60)).padStart(2, "0");
        const s = String(secs % 60).padStart(2, "0");
        t.textContent = m + ":" + s;
      }, 1000);
    }

    /* virtual call controls (mic / video / audio) → 404 */
    $$(".sv-ctrl").forEach(function (btn) {
      btn.addEventListener("click", function () { window.location.href = "404.html"; });
    });

    if (!hasGSAP || prefersReduced) return;

    gsap.fromTo(".sv-screen", { y: 60, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.95, ease: "power3.out",
      scrollTrigger: { trigger: ".sv-grid", start: "top 76%" }
    });
    gsap.fromTo(".sv-copy > *", { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".sv-grid", start: "top 76%" }
    });
    gsap.to(".sv-screen", {
      yPercent: -8, ease: "none",
      scrollTrigger: { trigger: ".svc-virtual", start: "top bottom", end: "bottom top", scrub: 1 }
    });
  }

  /* ============ 07 · LABS ============ */
  function initLabs() {
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".lb-head > *", { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".svc-labs", start: "top 76%" }
    });
    gsap.fromTo(".lb-viz", { scale: 0.85, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".lb-stage", start: "top 82%" }
    });
    gsap.fromTo(".lb-node", { scale: 0, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.12,
      scrollTrigger: { trigger: ".lb-stage", start: "top 74%" }
    });
    gsap.fromTo(".lb-row", { y: 24, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".lb-rows", start: "top 82%" }
    });
    gsap.utils.toArray(".lb-track i").forEach(function (bar) {
      gsap.fromTo(bar, { scaleX: 0 }, {
        scaleX: (parseFloat(bar.dataset.w) || 80) / 100, duration: 1.4, ease: "power3.out",
        scrollTrigger: { trigger: bar, start: "top 92%" }
      });
    });
    gsap.fromTo(".lb-foot > div", { y: 24, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".lb-foot", start: "top 88%" }
    });
  }

  /* ============ 08 · INSURANCE ============ */
  function initInsurance() {
    const toggle = $("#inToggle");
    const price = $("#inPrice");
    if (toggle) {
      const copy = {
        insured: '<i class="fa-solid fa-circle-check"></i> In-network · $0 typical copay',
        self: '<i class="fa-solid fa-circle-check"></i> Flat pricing · save up to 30% up front'
      };
      $$(".in-tab", toggle).forEach(function (tab) {
        tab.addEventListener("click", function () {
          $$(".in-tab", toggle).forEach(function (x) { x.classList.remove("is-on"); });
          tab.classList.add("is-on");
          if (price) price.innerHTML = copy[tab.dataset.mode] || copy.insured;
        });
      });
    }
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".in-p", { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: ".in-partners", start: "top 82%" }
    });
    gsap.fromTo(".in-bill", { y: 46, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".in-bill", start: "top 82%" }
    });
  }

  /* ============ 09 · STORIES ============ */
  function initStories() {
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".st-card", { y: 60, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.14,
      scrollTrigger: { trigger: ".st-row", start: "top 80%" }
    });
  }

  /* ============ 10 · FAQ ============ */
  function initFaq() {
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".fq-side > *", { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".faq-grid", start: "top 80%" }
    });
    gsap.fromTo(".fq-item", { y: 26, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.6, ease: "power3.out", stagger: 0.08,
      scrollTrigger: { trigger: ".fq-list", start: "top 82%" }
    });
    /* accordion: keep one open at a time */
    const items = $$(".fq-item");
    items.forEach(function (item) {
      item.addEventListener("toggle", function () {
        if (item.open) items.forEach(function (o) { if (o !== item) o.open = false; });
      });
    });
  }

  /* ============ 11 · CTA ============ */
  function initCta() {
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".sc-copy > *", { y: 30, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.7, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".sc-banner", start: "top 80%" }
    });
    gsap.to(".sc-img", {
      yPercent: -10, ease: "none",
      scrollTrigger: { trigger: ".sc-banner", start: "top bottom", end: "bottom top", scrub: 1 }
    });
  }

  /* ---------- newsletter (identical to landing) ---------- */
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function initNewsletter() {
    const form = $("#newsForm");
    if (!form) return;
    const email = $("#newsEmail");
    const err = $("#newsErr");
    const ok = $("#newsOk");
    const errMsg = function (msg) { err.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + msg; };
    email.addEventListener("input", function () { email.classList.remove("err"); err.hidden = true; });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const v = email.value.trim();
      if (!v) {
        email.classList.add("err"); errMsg("Please enter a mail ID"); err.hidden = false; ok.hidden = true; email.focus();
      } else if (!emailRe.test(v)) {
        email.classList.add("err"); errMsg("Enter a valid mail address"); err.hidden = false; ok.hidden = true; email.focus();
      } else {
        email.classList.remove("err"); err.hidden = true; ok.hidden = true; window.location.href = "404.html";
      }
    });
  }

  /* ---------- seamless marquees (data-mq tracks) ---------- */
  function initMarquees() {
    const tracks = $$("[data-mq]");
    const speeds = { "sh-strip": 62, "lb-mq-track": 46 };
    const view = window.innerWidth;
    tracks.forEach(function (track) {
      const unit = parseInt(track.dataset.mq, 10) || 0;
      if (!unit || !track.children.length) return;
      const copy = track.children[0].parentElement.innerHTML;
      track.innerHTML = copy;
      track.style.display = "flex";
      track.style.width = "max-content";
      const calc = function () {
        const one = track.scrollWidth / track.children.length * unit;
        const copies = Math.ceil(view * 2 / (Math.max(one, 1))) + 2;
        const even = copies % 2 ? copies + 1 : copies;
        while (track.children.length < even * unit) {
          const proto = Array(unit).fill(0).map(function (_, i) { return track.children[i % unit].outerHTML; });
          track.insertAdjacentHTML("beforeend", proto.join(""));
        }
        const half = track.scrollWidth / 2;
        track.style.animationDuration = (half / (speeds[track.className] || 46)) + "s";
      };
      calc();
      window.addEventListener("resize", function () { calc(); }, { passive: true });
    });
  }

  /* ---------- header + progress + to-top ---------- */
  function initScrub() {
    const header = $("#siteHeader");
    const toTop = $("#toTop");
    const prog = $("#scrollProgress");
    let bar = null;
    if (prog) {
      bar = document.createElement("span");
      prog.appendChild(bar);
    }
    const onScroll = function () {
      const y = window.scrollY || document.documentElement.scrollTop;
      if (header) header.classList.toggle("is-scrolled", y > 30);
      if (toTop) toTop.classList.toggle("show", y > 700);
      if (bar) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (toTop) toTop.addEventListener("click", function () { scrollToId("#top"); });
  }

  /* ---------- mobile menu ---------- */
  function initMobileMenu() {
    const burger = $("#hamburger");
    const menu = $("#mobileMenu");
    const close = $("#mmClose");
    if (!burger || !menu) return;
    const toggle = function (open) {
      menu.classList.toggle("open", open);
      burger.classList.toggle("active", open);
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      document.body.style.overflow = open ? "hidden" : "";
      if (lenis) open ? lenis.stop() : lenis.start();
    };
    burger.addEventListener("click", function () { toggle(!menu.classList.contains("open")); });
    close && close.addEventListener("click", function () { toggle(false); });
    $$(".mm-link", menu).forEach(function (a) {
      a.addEventListener("click", function () { toggle(false); });
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
  }

  /* ---------- anchor smooth scroll ---------- */
  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        const href = a.getAttribute("href");
        if (!href || href === "#" || href === "#!") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        scrollToId(href);
      });
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    buildECG();
    initMarquees();

    if (prefersReduced || !hasGSAP) {
      runPreloader(function () {
        initCounters(); initScrub(); initMobileMenu(); initAnchors(); initNewsletter();
        initVirtual();
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    runPreloader(function () {
      initHero();
      initLines();
      initJourney();
      initER();
      initVirtual();
      initLabs();
      initInsurance();
      initStories();
      initFaq();
      initCta();
      initCounters();
      initScrub();
      initMagnetic();
      initNewsletter();
      initMobileMenu();
      initAnchors();

      window.addEventListener("load", function () { ScrollTrigger.refresh(); });
      setTimeout(function () { ScrollTrigger.refresh(); }, 700);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
