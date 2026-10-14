/* ============================================================
   STACKLY — Healthcare Management · 404.js
   Animated, full-viewport "page flatlined" error screen.
   ECG monitor · revive interaction · tilt parallax · magnetic buttons
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined";
  const isDesktop = function () { return window.matchMedia("(min-width: 761px)").matches; };

  /* ---------- ECG waveform ---------- */
  const WAVE = [8, 8, 8, 9, 10, 9, 8, 8, 26, 64, 100, 52, 30, 80, 44, 20, 9, 8, 8, 8, 7, 8];
  const ecg = $("#nfEcg");
  const bars = [];
  if (ecg) {
    WAVE.forEach(function (h) {
      const b = document.createElement("span");
      b.className = "nf-bar";
      b.style.setProperty("--h", h);
      ecg.appendChild(b);
      bars.push(b);
    });
  }

  /* ---------- traveling playhead ---------- */
  let idx = 0;
  let playing = true;
  if (bars.length && !prefersReduced) {
    setInterval(function () {
      const n = bars.length;
      if (playing) {
        for (let i = 0; i < n; i++) bars[i].classList.toggle("on", i === idx);
        idx = (idx + 1) % n;
      }
    }, 90);
  } else {
    bars.forEach(function (b) { b.classList.add("on"); });
  }

  /* ---------- revive the monitor ---------- */
  const monitor = $("#nfMonitor");
  const tag = $("#nfTag");
  const tagHTML = function (txt) { return '<i class="fa-solid fa-circle" aria-hidden="true"></i> ' + txt; };
  let live = false;

  function revive() {
    if (!monitor || live || prefersReduced) return;
    live = true;
    playing = false;
    monitor.classList.add("is-live");
    bars.forEach(function (b) { b.classList.add("on"); });
    if (tag) { tag.classList.add("is-live"); tag.innerHTML = tagHTML("SIGNAL RESTORED"); }
    setTimeout(function () {
      live = false;
      playing = true;
      monitor.classList.remove("is-live");
      if (tag) { tag.classList.remove("is-live"); tag.innerHTML = tagHTML("NO SIGNAL"); }
    }, 1900);
  }

  if (monitor) {
    monitor.addEventListener("click", revive);
    monitor.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); revive(); }
    });
  }

  /* ---------- go back ---------- */
  const back = $("#nfBack");
  if (back) {
    back.addEventListener("click", function () {
      if (window.history.length > 1 && document.referrer) window.history.back();
      else window.location.href = "../index.html";
    });
  }

  /* ---------- magnetic buttons ---------- */
  function initMagnetic() {
    if (!hasGSAP || prefersReduced) return;
    $$("[data-magnetic]").forEach(function (el) {
      const inner = el.querySelector("span") || el;
      const strength = 0.3;
      el.addEventListener("mousemove", function (e) {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.6, ease: "power3.out" });
        if (inner !== el) gsap.to(inner, { x: x * strength * 0.5, y: y * strength * 0.5, duration: 0.6, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.35)" });
        if (inner !== el) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1,0.35)" });
      });
    });
  }

  /* ---------- pointer tilt + glow parallax ---------- */
  function initParallax() {
    if (!hasGSAP || prefersReduced || !isDesktop()) return;
    const core = $("#nfCore");
    if (!core) return;
    const ga = $(".nf-glow--a"), gb = $(".nf-glow--b"), gc = $(".nf-glow--c");

    gsap.set(core, { transformPerspective: 1000, transformOrigin: "50% 50%" });
    if (gc) gsap.set(gc, { xPercent: -50, yPercent: -50 });

    const qx = gsap.quickTo(core, "x", { duration: 0.8, ease: "power3.out" });
    const qy = gsap.quickTo(core, "y", { duration: 0.8, ease: "power3.out" });
    const qrx = gsap.quickTo(core, "rotationY", { duration: 0.8, ease: "power3.out" });
    const qry = gsap.quickTo(core, "rotationX", { duration: 0.8, ease: "power3.out" });

    window.addEventListener("mousemove", function (e) {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      qx(x * -18);
      qy(y * -14);
      qrx(x * 7);
      qry(y * -6);
      if (ga) gsap.to(ga, { x: x * 60, y: y * 40, duration: 1.1, ease: "power2.out" });
      if (gb) gsap.to(gb, { x: x * -70, y: y * -50, duration: 1.1, ease: "power2.out" });
      if (gc) gsap.to(gc, { x: x * 30, y: y * 24, duration: 1.1, ease: "power2.out" });
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    initMagnetic();
    initParallax();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
