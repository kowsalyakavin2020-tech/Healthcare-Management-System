/* ============================================================
   STACKLY — Healthcare Management · Doctors.js (v1)
   Preloader · Lenis · GSAP · Lottie ·
   Roster Mosaic · Coverflow · Spotlight · Gauges · Telehealth ·
   Availability · Case-file Deck · Rounds · Community Wall · CTA
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  const isDesktop = function () { return window.matchMedia("(min-width: 761px)").matches; };

  /* ---------- build ECG strip ---------- */
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

  /* ---------- preloader ---------- */
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

  /* ---------- Lottie ---------- */
  function initLottie() {
    if (typeof window.lottie === "undefined" || !window.STACKLY_LOTTIE_PULSE) return;
    ["dhLottie", "dxLottie", "dcLottie"].forEach(function (id) {
      const el = document.getElementById(id);
      if (!el) return;
      try {
        const anim = window.lottie.loadAnimation({
          container: el,
          renderer: "svg",
          loop: true,
          autoplay: !prefersReduced,
          animationData: JSON.parse(JSON.stringify(window.STACKLY_LOTTIE_PULSE))
        });
        if (prefersReduced && anim) {
          anim.addEventListener("DOMLoaded", function () { anim.goToAndStop(45, true); });
        }
      } catch (e) { /* decorative only */ }
    });
  }

  /* ---------- 02 · HERO — ROSTER MOSAIC ---------- */
  function initDh() {
    if (!hasGSAP) return;
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(".dh-eyebrow", { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo(".dh-w", { yPercent: 118, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.05, stagger: 0.12 }, "-=0.35")
      .fromTo(".dh-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.6");

    const tiles = $$(".dm-tile");
    gsap.fromTo(tiles,
      { clipPath: "inset(0 0 100% 0)", scale: 0.94, opacity: 0 },
      { clipPath: "inset(0 0 0% 0)", scale: 1, opacity: 1, duration: 0.85, ease: "power3.out", stagger: { each: 0.07, from: "center" }, delay: 0.45 }
    );
    gsap.fromTo(".dm-info", { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.5 });
    gsap.fromTo(".dht-track", { opacity: 0 }, { opacity: 1, duration: 0.9, delay: 1 });
    gsap.fromTo(".dh-ticker", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.9 });

    if (prefersReduced) return;

    gsap.to(".dh-head", {
      yPercent: -14, opacity: 0.25, ease: "none",
      scrollTrigger: { trigger: ".dh", start: "top top", end: "70% top", scrub: 1 }
    });
    gsap.to(".dh-glow--a", {
      yPercent: 18, ease: "none",
      scrollTrigger: { trigger: ".dh", start: "top top", end: "bottom top", scrub: 1 }
    });
    if (window.matchMedia("(min-width: 1024px)").matches) {
      gsap.to(".dh-mosaic", {
        yPercent: 8, ease: "none",
        scrollTrigger: { trigger: ".dh", start: "top top", end: "bottom top", scrub: 1 }
      });
    }
  }

  /* ---------- 03 · SPECIALTY COVERFLOW ---------- */
  function initCoverflow() {
    const track = $("#cfTrack");
    if (!track) return;
    const cards = $$(".cf-card", track);
    const prev = $("#cfPrev");
    const next = $("#cfNext");
    const idxEl = $("#cfIndex");
    if (!cards.length) return;

    const n = cards.length;
    let active = 0;
    let programmatic = false;

    const updateNav = function () {
      if (prev) { prev.disabled = active === 0; prev.setAttribute("aria-disabled", String(active === 0)); }
      if (next) { next.disabled = active === n - 1; next.setAttribute("aria-disabled", String(active === n - 1)); }
    };

    const scrollToActive = function () {
      const card = cards[active];
      const target = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
      programmatic = true;
      track.scrollLeft = target;
      programmatic = false;
    };

    const layout = function (animate) {
      const wide = isDesktop();
      cards.forEach(function (card, i) {
        if (wide) {
          let off = ((i - active) % n + n) % n;
          if (off > n / 2) off -= n;
          const abs = Math.abs(off);
          const props = {
            xPercent: -50,
            x: off * 190,
            yPercent: -50,
            z: -abs * 150,
            rotationY: -off * 17,
            scale: 1 - abs * 0.11,
            opacity: abs > 3 ? 0 : 1 - abs * 0.14,
            zIndex: 100 - abs
          };
          if (animate && hasGSAP && !prefersReduced) {
            gsap.to(card, Object.assign({ duration: 0.7, ease: "power3.out" }, props));
          } else if (hasGSAP) {
            gsap.set(card, props);
          } else {
            card.style.transform = "translate(-50%,-50%) translateX(" + (off * 190) + "px) scale(" + (1 - abs * 0.11) + ")";
            card.style.opacity = abs > 3 ? 0 : String(1 - abs * 0.14);
          }
        }
        card.classList.toggle("is-active", i === active);
      });
      if (idxEl) idxEl.textContent = String(active + 1).padStart(2, "0");
      updateNav();
    };

    const go = function (dir) {
      const target = active + dir;
      if (target < 0 || target >= n) { layout(false); return; }
      active = target;
      layout(true);
      if (!isDesktop()) scrollToActive(true);
    };

    prev && prev.addEventListener("click", function () { go(-1); });
    next && next.addEventListener("click", function () { go(1); });

    cards.forEach(function (c, i) {
      c.addEventListener("click", function () {
        if (i === active) return;
        active = i;
        layout(true);
        if (!isDesktop()) scrollToActive(false);
      });
    });

    if (!isDesktop()) {
      track.addEventListener("scroll", function () {
        if (programmatic) return;
        const sc = track.scrollLeft;
        let best = active;
        let bestD = Infinity;
        cards.forEach(function (c, k) {
          const d = Math.abs(c.offsetLeft - sc);
          if (d < bestD) { bestD = d; best = k; }
        });
        if (best !== active) { active = best; layout(false); }
      }, { passive: true });
    }

    document.addEventListener("keydown", function (e) {
      if (!isDesktop()) return;
      const r = track.getBoundingClientRect();
      if (r.top > window.innerHeight || r.bottom < 0) return;
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });

    layout(false);
    window.addEventListener("resize", function () { layout(false); });
  }

  /* ---------- 04 · THE RESIDENT BOARD ---------- */
  function initSpotlight() {
    const intro = $("#dibIntro");
    const cards = $$(".dib-card");
    if (!cards.length) return;

    if (hasGSAP && !prefersReduced) {
      gsap.fromTo(".dib-intro > *", { y: 28, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, stagger: 0.09, ease: "power3.out",
        scrollTrigger: { trigger: ".dib", start: "top 74%" }
      });
      gsap.fromTo(cards, { y: 70, opacity: 0, scale: 0.96 }, {
        y: 0, opacity: 1, scale: 1, duration: 0.85, stagger: 0.16, ease: "power3.out",
        scrollTrigger: { trigger: ".dib-cards", start: "top 82%" }
      });
      gsap.fromTo(".dib-line", { scaleY: 0 }, {
        scaleY: 1, duration: 0.6, stagger: 0.16, ease: "power2.out",
        scrollTrigger: { trigger: ".dib-cards", start: "top 82%" }
      });
      gsap.to(".dib-glow", {
        yPercent: 24, ease: "none",
        scrollTrigger: { trigger: ".dib", start: "top bottom", end: "bottom top", scrub: 1 }
      });
    }

    cards.forEach(function (card) {
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const link = card.querySelector("a") || card;
          link.focus();
        }
      });
    });
  }

  /* ---------- 05 · VITALS GAUGES ---------- */
  function initGauges() {
    const gauges = $$(".dg-gauge");
    if (!gauges.length) return;

    const run = function (g) {
      const val = parseInt(g.dataset.val, 10) || 0;
      const num = g.querySelector(".dg-num");
      if (hasGSAP && !prefersReduced) {
        const obj = { p: 0 };
        gsap.to(obj, {
          p: val, duration: 1.8, ease: "power2.out",
          onUpdate: function () { g.style.setProperty("--p", obj.p.toFixed(1)); }
        });
        if (num) {
          const nObj = { v: 0 };
          gsap.to(nObj, { v: val, duration: 1.8, ease: "power2.out", onUpdate: function () { num.textContent = Math.round(nObj.v); } });
        }
      } else {
        g.style.setProperty("--p", val);
        if (num) num.textContent = val;
      }
    };

    if (hasGSAP) {
      gsap.fromTo(gauges, { opacity: 0, y: 56 }, {
        opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: ".dg-row", start: "top 86%", onEnter: function () { gauges.forEach(run); } }
      });
    } else {
      gauges.forEach(run);
    }
  }

  /* ---------- 06 · TELEHEALTH CONSOLE ---------- */
  function initTelehealth() {
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".dx-copy", { opacity: 0, x: -50 }, {
      opacity: 1, x: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".dx", start: "top 74%" }
    });
    gsap.fromTo(".dx-console", { opacity: 0, x: 50, rotate: 2 }, {
      opacity: 1, x: 0, rotate: 0, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: ".dx", start: "top 74%" }
    });
    gsap.fromTo(".dx-feats li", { opacity: 0, x: -26 }, {
      opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: "power3.out",
      scrollTrigger: { trigger: ".dx-feats", start: "top 84%" }
    });
    gsap.to("#dxDoc", {
      scale: 1.08, ease: "none",
      scrollTrigger: { trigger: ".dx-console", start: "top bottom", end: "bottom top", scrub: 1 }
    });
  }

  /* ---------- 07 · AVAILABILITY BOARD ---------- */
  function initBoard() {
    const daysWrap = $("#dbDays");
    const docsWrap = $("#dbDocs");
    const slotsWrap = $("#dbSlots");
    if (!daysWrap || !docsWrap || !slotsWrap) return;

    const TESTS = ["08:30","09:15","10:00","10:45","11:30","13:00","13:45","14:30","15:15","16:00","16:45","17:30"];
    const dayEls = $$(".db-day", daysWrap);
    const docEls = $$(".db-doc", docsWrap);
    let day = "mon";
    let doc = "yorke";

    const hash = function (str) {
      let h = 0;
      for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
      return h;
    };

    const render = function () {
      slotsWrap.innerHTML = "";
      let open = 0;
      TESTS.forEach(function (t) {
        const gone = (hash(doc + day + t) % 5) < 2;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "db-slot" + (gone ? " is-gone" : "");
        btn.textContent = t;
        if (gone) { btn.disabled = true; btn.setAttribute("aria-disabled", "true"); }
        else {
          open++;
          btn.addEventListener("click", function () {
            $$(".db-slot", slotsWrap).forEach(function (o) { o.classList.remove("is-picked"); });
            btn.classList.add("is-picked");
          });
        }
        slotsWrap.appendChild(btn);
      });
      if (!open) {
        const p = document.createElement("p");
        p.className = "db-empty";
        p.innerHTML = '<i class="fa-solid fa-mug-hot"></i> Fully booked — try another day or doctor.';
        slotsWrap.appendChild(p);
      }
    };

    dayEls.forEach(function (b) {
      b.addEventListener("click", function () {
        dayEls.forEach(function (o) { o.classList.remove("is-on"); o.setAttribute("aria-selected", "false"); });
        b.classList.add("is-on"); b.setAttribute("aria-selected", "true");
        day = b.dataset.day || day;
        if (hasGSAP && !prefersReduced) gsap.fromTo(slotsWrap, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
        render();
      });
    });

    docEls.forEach(function (b) {
      b.addEventListener("click", function () {
        docEls.forEach(function (o) { o.classList.remove("is-on"); });
        b.classList.add("is-on");
        doc = b.dataset.doc || doc;
        if (hasGSAP && !prefersReduced) gsap.fromTo(slotsWrap, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" });
        render();
      });
    });

    render();

    if (hasGSAP && !prefersReduced) {
      gsap.fromTo(".db-wrap", { opacity: 0, y: 56 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: ".db-wrap", start: "top 82%" }
      });
    }
  }

  /* ---------- 08 · CASE-FILE DECK ---------- */
  function initDeck() {
    if (!hasGSAP) return;
    const stage = $("#dkStage");
    const cards = $$(".dk-card");
    if (!stage || !cards.length) return;

    gsap.fromTo(".dk-head", { opacity: 0, y: 46 }, {
      opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".dk-head", start: "top 84%" }
    });

    if (prefersReduced || !isDesktop()) {
      gsap.fromTo(cards, { opacity: 0, y: 40 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: stage, start: "top 82%" }
      });
      return;
    }

    gsap.fromTo(cards,
      {
        x: function (i, el) {
          const sr = stage.getBoundingClientRect();
          const cr = el.getBoundingClientRect();
          return (sr.left + sr.width / 2) - (cr.left + cr.width / 2);
        },
        y: 64, scale: 0.84, opacity: 0
      },
      {
        x: 0, y: 0, scale: 1, opacity: 1,
        duration: 1, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: stage, start: "top 80%" }
      }
    );
  }

  /* ---------- 09 · ROUNDS LOG ---------- */
  function initRounds() {
    const list = $("#drList");
    if (!list) return;
    const rows = $$(".dr-row", list);
    const preview = $("#drPreview");
    const pImg = $("#drImg");

    if (hasGSAP && !prefersReduced) {
      gsap.fromTo(rows, { opacity: 0, x: -36 }, {
        opacity: 1, x: 0, duration: 0.7, stagger: 0.1, ease: "power3.out",
        scrollTrigger: { trigger: list, start: "top 82%" }
      });
    }

    if (!preview || !pImg) return;

    const desktop = function () { return window.matchMedia("(min-width: 761px) and (pointer: fine)").matches; };

    rows.forEach(function (row) {
      row.addEventListener("mouseenter", function () {
        if (!desktop() || prefersReduced) return;
        const src = row.dataset.img;
        if (src) pImg.src = src;
        preview.classList.add("on");
      });
      row.addEventListener("mouseleave", function () {
        preview.classList.remove("on");
      });
    });

    $$(".dr-ar", list).forEach(function (ar) {
      ar.addEventListener("mouseenter", function () {
        if (!desktop() || prefersReduced) return;
        preview.classList.remove("on");
      });
      ar.addEventListener("mouseleave", function () {
        if (!desktop() || prefersReduced) return;
        const row = ar.closest(".dr-row");
        if (row && row.matches(":hover")) preview.classList.add("on");
      });
      ar.addEventListener("click", function (e) {
        e.stopPropagation();
        window.location.href = "404.html";
      });
    });

    list.addEventListener("mousemove", function (e) {
      if (!desktop() || prefersReduced) return;
      if (hasGSAP) {
        gsap.to(preview, { left: e.clientX, top: e.clientY, duration: 0.4, ease: "power3.out" });
      } else {
        preview.style.left = e.clientX + "px";
        preview.style.top = e.clientY + "px";
      }
    });
  }

  /* ---------- 10 · COMMUNITY WALL ---------- */
  function initWall() {
    if (!hasGSAP || prefersReduced) return;
    const cols = $$(".dw-col");
    cols.forEach(function (col, i) {
      const dir = i === 1 ? 1 : -1;
      gsap.fromTo(col, { y: 60 * dir }, {
        y: -60 * dir, ease: "none",
        scrollTrigger: { trigger: ".dw-cols", start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });
    gsap.fromTo(".dw-shot", { opacity: 0, y: 56 }, {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out",
      scrollTrigger: { trigger: ".dw-cols", start: "top 80%" }
    });
  }

  /* ---------- 11 · BOOKING CTA ---------- */
  function initBooking() {
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".dc-copy", { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".dc-banner", start: "top 76%" }
    });
    gsap.to(".dc-bg img", {
      scale: 1.12, yPercent: -8, ease: "none",
      scrollTrigger: { trigger: ".dc-banner", start: "top bottom", end: "bottom top", scrub: 1 }
    });
  }

  /* ---------- telehealth console dock → 404 ---------- */
  function initDock404() {
    $$(".dx-dock button").forEach(function (b) {
      b.addEventListener("click", function () { window.location.href = "404.html"; });
    });
  }

  /* ---------- seamless marquees (data-mq tracks) ---------- */
  function initMarquees() {
    const tracks = $$("[data-mq]");
    const speeds = { "dht-track": 46 };
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

  /* ---------- no-motion / no-GSAP staging ---------- */
  function fallbackStaging() {
    $$(".dg-gauge").forEach(function (g) {
      const val = parseInt(g.dataset.val, 10) || 0;
      g.style.setProperty("--p", val);
      const num = g.querySelector(".dg-num");
      if (num) num.textContent = val;
    });
    $$(".ds-block").forEach(function (b, i) { b.classList.toggle("is-on", i === 0); });
  }

  /* ---------- newsletter ---------- */
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
        email.classList.add("err"); errMsg("Please enter a mail ID");
        err.hidden = false; ok.hidden = true; email.focus();
      } else if (!emailRe.test(v)) {
        email.classList.add("err"); errMsg("Enter a valid mail address");
        err.hidden = false; ok.hidden = true; email.focus();
      } else {
        email.classList.remove("err");
        err.hidden = true; ok.hidden = true;
        window.location.href = "404.html";
      }
    });
  }

  /* ---------- header + progress + to-top ---------- */
  function initScrub() {
    const header = $("#siteHeader");
    const toTop = $("#toTop");
    const prog = $("#scrollProgress");
    let bar = null;
    if (prog) { bar = document.createElement("span"); prog.appendChild(bar); }

    const onScroll = function () {
      const y = window.scrollY || 0;
      if (header) header.classList.toggle("is-scrolled", y > 40);
      if (toTop) toTop.classList.toggle("show", y > 700);
      if (bar) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        if (h > 0) bar.style.width = (y / h) * 100 + "%";
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    if (lenis) lenis.on("scroll", onScroll);
    onScroll();

    if (toTop) toTop.addEventListener("click", function () {
      if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- mobile menu ---------- */
  function initMobileMenu() {
    const menu = $("#mobileMenu");
    const burger = $("#hamburger");
    if (!menu || !burger) return;
    const closeBtn = $("#mmClose");
    const toggle = function (open) {
      menu.classList.toggle("open", open);
      burger.classList.toggle("active", open);
      menu.setAttribute("aria-hidden", String(!open));
      if (open && lenis) lenis.stop();
      if (!open && lenis) lenis.start();
      if (open) {
        $$(".mm-link, .mm-login, .mm-bottom a", menu).forEach(function (l) { l.style.animation = "none"; void l.offsetHeight; l.style.animation = ""; });
      }
    };
    burger.addEventListener("click", function () { toggle(!menu.classList.contains("open")); });
    closeBtn && closeBtn.addEventListener("click", function () { toggle(false); });
    $$("a", menu).forEach(function (a) {
      a.addEventListener("click", function () {
        const href = a.getAttribute("href");
        if (href && href.indexOf("#") === 0 && href !== "#") toggle(false);
      });
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
    initLottie();
    initDock404();

    if (prefersReduced || !hasGSAP) {
      runPreloader(function () {
        fallbackStaging();
        initCoverflow();
        initBoard();
        initRounds();
        initSpotlight();
        initScrub(); initMobileMenu(); initAnchors(); initNewsletter();
        window.addEventListener("load", function () { ScrollTrigger && ScrollTrigger.refresh(); });
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    runPreloader(function () {
      initDh();
      initCoverflow();
      initSpotlight();
      initGauges();
      initTelehealth();
      initBoard();
      initDeck();
      initRounds();
      initWall();
      initBooking();
      initScrub();
      initMagnetic();
      initNewsletter();
      initMobileMenu();
      initAnchors();

      window.addEventListener("load", function () { ScrollTrigger.refresh(); });
      setTimeout(function () { ScrollTrigger.refresh(); }, 700);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
