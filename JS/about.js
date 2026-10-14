/* ============================================================
   STACKLY — Healthcare Management · About.js (v3)
   Preloader · Lenis · GSAP · Vital Hall · Origin Tape · Orders ·
   One Day rail · Leadership · Eras · Viewfinder · Creds · Voices
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  const esc = function (s) {
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  };

  /* ---------- build decorative bits ---------- */
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
      if (p < 1) return false;
      return true;
    };
    const timer = setInterval(function () {
      const done = tick();
      if (done) {
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

  /* ---------- 02 · THE WARD WALL (hero) ---------- */
  function initVh() {
    if (!hasGSAP) return;
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(".vh-eyebrow", { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo(".vh-word", { yPercent: 118, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.05, stagger: 0.12 }, "-=0.35")
      .fromTo(".vh-sub", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.55")
      .fromTo(".vh-cast", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
      .fromTo(".vh-cast-faces figure", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.8)", stagger: 0.08 }, "-=0.55")
      .fromTo(".vh-actions", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.35");

    gsap.fromTo(".vb-tile, .vb-quote", { clipPath: "inset(0 0 100% 0)", opacity: 0 }, {
      clipPath: "inset(0 0 0% 0)", opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.09, delay: 0.35
    });
    gsap.fromTo(".vh-stat", { y: 24, opacity: 0 }, {
      y: 0, opacity: 1, duration: 0.55, stagger: 0.08, ease: "power3.out", delay: 0.9
    });

    /* stat counters */
    $$(".hs-count").forEach(function (el) {
      const target = parseInt(el.dataset.count, 10) || 0;
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 1.6, ease: "power2.out",
        scrollTrigger: { trigger: ".vh-stats", start: "top 92%" },
        onUpdate: function () { el.textContent = Math.round(obj.v).toLocaleString("en-US"); }
      });
    });

    if (prefersReduced) return;

    gsap.to(".vh-head", {
      yPercent: -12, opacity: 0.2, ease: "none",
      scrollTrigger: { trigger: ".vh", start: "top top", end: "72% top", scrub: 1 }
    });
    [".vb-tile--1", ".vb-tile--2", ".vb-tile--3", ".vb-tile--4"].forEach(function (sel, i) {
      const dirs = [-14, 10, -9, 14];
      gsap.to(sel, {
        yPercent: dirs[i], ease: "none",
        scrollTrigger: { trigger: ".vh", start: "top top", end: "bottom top", scrub: 1 }
      });
    });
    gsap.to(".vh-stats", {
      yPercent: 10, ease: "none",
      scrollTrigger: { trigger: ".vh", start: "top top", end: "bottom top", scrub: 1 }
    });
  }

  /* ---------- 03 · ORIGIN TAPE ---------- */
  function initSnaps() {
    if (!hasGSAP) return;
    gsap.fromTo(".sn-copy", { opacity: 0, x: -44 }, {
      opacity: 1, x: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".sn-body", start: "top 72%" }
    });
    gsap.fromTo(".sn-row", { opacity: 0, y: 62 }, {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.18, ease: "power3.out",
      scrollTrigger: { trigger: ".sn-tape", start: "top 74%" }
    });
    $$(".sn-shot").forEach(function (shot) {
      const img = shot.querySelector("img");
      gsap.fromTo(shot, { clipPath: "inset(0 100% 0 0)" }, {
        clipPath: "inset(0 0% 0 0)", duration: 0.9, ease: "power3.inOut",
        scrollTrigger: { trigger: shot, start: "top 84%" }
      });
      if (img) gsap.fromTo(img, { scale: 1.24 }, {
        scale: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: shot, start: "top 84%" }
      });
      const stamp = shot.querySelector(".sn-stamp");
      if (stamp) gsap.fromTo(stamp, { scale: 0.3, rotate: -30, opacity: 0 }, {
        scale: 1, rotate: 0, opacity: 1, duration: 0.5, ease: "back.out(1.9)",
        scrollTrigger: { trigger: shot, start: "top 80%" }
      });
    });
    gsap.fromTo(".ss-stat", { opacity: 0, y: 36 }, {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out", clearProps: "transform,opacity",
      scrollTrigger: { trigger: ".sn-stats", start: "top 88%" }
    });
    $$(".ss-num").forEach(function (num) {
      const target = parseInt(num.dataset.count, 10) || 0;
      gsap.fromTo(num, { textContent: 0 }, {
        textContent: target,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: { trigger: ".sn-stats", start: "top 88%" },
        onUpdate: function () { num.textContent = Number(num.textContent).toLocaleString("en-US"); }
      });
    });
  }

  /* ---------- 04 · THE ORDERS ---------- */
  function initRules() {
    if (!hasGSAP) return;
    gsap.fromTo(".rules-intro", { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".rules-intro", start: "top 80%" }
    });
    gsap.fromTo(".rl-pad", { rotate: -6, y: 30, opacity: 0 }, {
      rotate: 0, y: 0, opacity: 1, duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: ".rl-pad", start: "top 84%" }
    });
    gsap.to("#rlBar", {
      scaleX: 1, ease: "none",
      scrollTrigger: { trigger: ".rules", start: "top 72%", end: "bottom 82%", scrub: true }
    });
    $$(".rl-row").forEach(function (row, i) {
      const dir = (i % 2 === 0) ? -44 : 44;
      gsap.fromTo(row, { opacity: 0, x: dir }, {
        opacity: 1, x: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 84%" }
      });
      const thumb = row.querySelector(".rl-thumb");
      const seal = row.querySelector(".rl-seal");
      const img = thumb && thumb.querySelector("img");
      if (img) gsap.fromTo(img, { scale: 1.3 }, {
        scale: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 84%" }
      });
      if (seal) gsap.fromTo(seal, { scale: 0.2, rotate: 40, opacity: 0.9 }, {
        scale: 1, rotate: -7, opacity: 0.9, duration: 0.5, ease: "back.out(2.2)", clearProps: "transform,opacity",
        scrollTrigger: { trigger: row, start: "top 84%" }
      });
    });
  }

  /* ---------- 05 · ONE DAY — horizontal pinned rail ---------- */
  function initDay() {
    const pin = $("#dayPin");
    const track = $("#dayTrack");
    if (!pin || !track || !hasGSAP) return;
    const cards = $$(".day-cd", track);
    if (!cards.length) return;

    const times = cards.map(function (c) {
      const t = c.querySelector(".dc-time");
      return t ? t.textContent.replace(/\s+/g, "").trim() : "";
    });
    const labels = cards.map(function (c) {
      const cap = c.querySelector("figcaption b");
      return cap ? cap.textContent.trim() : "";
    });
    const clockEl = $("#dfClock");
    const barEl = $("#dfBar");
    const txtEl = $("#dfTxt");

    const footAt = function (p) {
      p = Math.max(0, Math.min(1, p));
      const span = p * cards.length;
      const i = Math.min(cards.length - 1, Math.floor(span));
      if (clockEl) clockEl.textContent = times[i];
      if (barEl) barEl.style.width = (p * 100) + "%";
      if (txtEl) txtEl.textContent = labels[i];
    };

    if (prefersReduced) { footAt(0); return; }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1081px)", function () {
      pin.classList.add("h");
      const st = gsap.to(track, {
        x: function () { return -(track.scrollWidth - window.innerWidth); },
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: function () { return "+=" + (track.scrollWidth - window.innerWidth); },
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: function (self) { footAt(self.progress); }
        }
      });
      gsap.fromTo(cards, { opacity: 0, y: 34 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power3.out",
        scrollTrigger: { trigger: pin, start: "top 60%" }
      });
      footAt(0);
      return function () {
        pin.classList.remove("h");
        if (st && st.scrollTrigger) st.scrollTrigger.kill();
      };
    });

    mm.add("(max-width: 1080px)", function () {
      const st = ScrollTrigger.create({
        trigger: ".day",
        start: "top 74%",
        end: "bottom 18%",
        scrub: 1,
        onUpdate: function (self) { footAt(self.progress); }
      });
      footAt(0);
      return function () { st.kill(); };
    });
  }

  /* ---------- 06 · LEADERSHIP (unchanged) ---------- */
  function leadersReveal() {
    if (!hasGSAP) return;
    $$(".ld-row").forEach(function (row, i) {
      const dir = (i % 2 === 0) ? -1 : 1;
      gsap.fromTo(row, { opacity: 0, x: 70 * dir }, {
        opacity: 1, x: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: row, start: "top 84%" }
      });
    });
  }

  /* ---------- 07 · THE LONG WAY HERE — eras ---------- */
  function initEra() {
    if (!hasGSAP) return;
    $$(".era-led").forEach(function (led) {
      const year = led.querySelector(".el-year");
      const shot = led.querySelector(".el-shot");
      const img = shot && shot.querySelector("img");
      if (year) gsap.fromTo(year, { x: -26, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: led, start: "top 82%" }
      });
      if (shot) gsap.fromTo(shot, { clipPath: "inset(100% 0% 0% 0%)" }, {
        clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.inOut",
        scrollTrigger: { trigger: led, start: "top 82%" }
      });
      if (img) gsap.fromTo(img, { scale: 1.28 }, {
        scale: 1, duration: 1.4, ease: "power3.out",
        scrollTrigger: { trigger: led, start: "top 82%" }
      });
      gsap.fromTo(led.querySelector(".el-note"), { opacity: 0, y: 34 }, {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: led, start: "top 82%" }
      });
      if (year) gsap.to(year, {
        y: -26, ease: "none",
        scrollTrigger: { trigger: led, start: "top bottom", end: "bottom top", scrub: 1 }
      });
    });
  }

  /* ---------- 08 · THE VIEWFINDER ---------- */
  function initTour() {
    const items = $$(".tv-item");
    const img = $("#tvImg");
    const name = $("#tvName");
    const coords = $("#tvCoords");
    if (!img) return;

    const swap = function (it) {
      if (it.classList.contains("is-active")) return;
      items.forEach(function (o) { o.classList.remove("is-active"); });
      it.classList.add("is-active");
      const src = it.dataset.img || img.getAttribute("src");
      const n = it.dataset.name || "";
      const c = it.dataset.coords || "";
      if (hasGSAP && !prefersReduced) {
        gsap.timeline()
          .to(img, { clipPath: "inset(0 100% 0 0)", duration: 0.3, ease: "power1.in" })
          .add(function () {
            img.src = src;
            img.alt = n;
            if (name) name.textContent = n;
            if (coords) coords.textContent = c;
          })
          .fromTo(img, { clipPath: "inset(0 100% 0 0)", scale: 1.14 }, {
            clipPath: "inset(0 0 0 0)", scale: 1, duration: 0.6, ease: "power2.out"
          });
        gsap.fromTo(name, { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 });
        gsap.fromTo(coords, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, delay: 0.12 });
      } else {
        img.src = src;
        img.alt = n;
        if (name) name.textContent = n;
        if (coords) coords.textContent = c;
      }
    };

    items.forEach(function (it) {
      it.addEventListener("click", function () { swap(it); });
      it.addEventListener("mouseenter", function () { if (prefersReduced || !hasGSAP) return; const tm = setTimeout(function () { swap(it); }, 420); it._tvTimer = tm; });
      it.addEventListener("mouseleave", function () { clearTimeout(it._tvTimer); });
    });

    if (!hasGSAP) return;

    const frame = $("#tvFrame");
    const scope = $(".tv-scope");
    if (scope && frame) {
      gsap.set(scope, { perspective: 1000 });
      const rotX = gsap.quickTo(frame, "rotationX", { duration: 0.6, ease: "power3.out" });
      const rotY = gsap.quickTo(frame, "rotationY", { duration: 0.6, ease: "power3.out" });
      scope.addEventListener("mousemove", function (e) {
        const r = scope.getBoundingClientRect();
        const nx = (e.clientX - r.left) / r.width - 0.5;
        const ny = (e.clientY - r.top) / r.height - 0.5;
        rotX(-ny * 5);
        rotY(nx * 7);
      });
      scope.addEventListener("mouseleave", function () { rotX(0); rotY(0); });
    }

    gsap.fromTo(".tv-item", { opacity: 0, x: -26 }, {
      opacity: 1, x: 0, duration: 0.6, stagger: 0.07, ease: "power3.out",
      scrollTrigger: { trigger: ".tv-list", start: "top 78%" }
    });
    gsap.fromTo("#tvFrame", { opacity: 0, scale: 0.94 }, {
      opacity: 1, scale: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".tv-scope", start: "top 80%" }
    });
  }

  /* ---------- 09 · VERIFIABLY GOOD ---------- */
  function initCreds() {
    if (!hasGSAP) return;
    $$(".cred-pane").forEach(function (pane, i) {
      const dir = (i % 2 === 0) ? -1 : 1;
      gsap.fromTo(pane, { opacity: 0, y: 60, rotate: 8 * dir }, {
        opacity: 1, y: 0, rotate: 0, duration: 0.9, ease: "power3.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: pane, start: "top 90%", onEnter: function () { pane.classList.add("in"); } }
      });
      const seal = pane.querySelector(".cr-seal");
      if (seal) gsap.fromTo(seal, { scale: 0.25, rotate: 50, opacity: 0 }, {
        scale: 1, rotate: -8, opacity: 1, duration: 0.55, ease: "back.out(2)", clearProps: "transform,opacity",
        scrollTrigger: { trigger: pane, start: "top 90%" }
      });
    });
  }

  /* ---------- 10 · THE GUESTBOOK ---------- */
  function initVoices() {
    const rig = $("#voicesRig");
    const back = $("#voBack");
    const backImg = back && back.querySelector("img");
    const quoteEl = $("#voQuote");
    const bigEl = $("#voBig");
    const sigEl = $("#voSig");
    if (!rig || !quoteEl) return;

    const entries = [
      {
        name: "Hugo P.", role: "Guardian member",
        quote: "The nurse remembered my name — and my dog's name. That was the whole hospital in one sentence.",
        hl: "The nurse remembered my name"
      },
      {
        name: "Renata M.", role: "Parent",
        quote: "The ward never closed for me. When my daughter was in the NICU I slept here, ate here, and nobody once made me feel like a visitor.",
        hl: "nobody once made me feel like a visitor"
      },
      {
        name: "Sam K.", role: "Porter team",
        quote: "I wheel the gurneys. What sticks is that the surgeons still stop to ask about my daughter's graduation. That's the place I work.",
        hl: "the surgeons still stop to ask about my daughter"
      }
    ];
    const items = $$(".vo-item", rig);
    const srcOf = function (it) {
      const a = it && it.querySelector(".vo-ava img");
      return a ? a.getAttribute("src") : "";
    };
    const quoteHtml = function (entry) {
      const i = entry.quote.indexOf(entry.hl);
      const head = i > 0 ? esc(entry.quote.slice(0, i)) : "";
      const tail = entry.quote.slice(i + entry.hl.length);
      return "&ldquo;" + head + '<em class="vo-hl">' + esc(entry.hl) + "</em>" + esc(tail) + "&rdquo;";
    };

    const render = function (idx, animate) {
      if (!items[idx]) return;
      items.forEach(function (it, i) { it.classList.toggle("is-active", i === idx); });
      const src = srcOf(items[idx]);
      if (backImg && src) {
        if (animate && hasGSAP && !prefersReduced) {
          gsap.to(back, { opacity: 0, duration: 0.34, ease: "power1.in", onComplete: function () {
            backImg.src = src;
            gsap.to(back, { opacity: 1, duration: 0.5, ease: "power2.out" });
          } });
        } else {
          backImg.src = src;
        }
      }
      if (animate && hasGSAP && !prefersReduced) {
        gsap.fromTo(quoteEl, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" });
        gsap.fromTo(bigEl, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.08 });
        gsap.fromTo(sigEl, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.16 });
      }
      quoteEl.innerHTML = quoteHtml(entries[idx]);
      if (bigEl) bigEl.textContent = String(idx + 1).padStart(2, "0");
      if (sigEl) sigEl.textContent = "signed: " + entries[idx].name + " · " + entries[idx].role;
    };

    items.forEach(function (it) {
      it.addEventListener("click", function () {
        const idx = parseInt(it.dataset.i, 10) || 0;
        clearInterval(timer);
        render(idx, true);
        timer = setInterval(next, 6000);
      });
    });

    let paused = false;
    rig.addEventListener("mouseenter", function () { paused = true; });
    rig.addEventListener("mouseleave", function () { paused = false; });

    let idx = 0;
    const next = function () {
      if (paused) return;
      idx = (idx + 1) % entries.length;
      render(idx, true);
    };
    let timer = setInterval(next, 6000);
    render(0, false);
  }

  /* ---------- seamless marquees ----------
     Each track repeats identical units and the CSS slides it by -50%.
     For that to loop with no blank gap the track needs an EVEN number of
     copies whose half-width is at least as wide as the window. We measure
     one unit, top up copies to cover any viewport, and scale the duration
     so the scroll speed never changes. */
  function initMarquees() {
    const speeds = { "vh-tape": 62, "vo-run": 46, "join-tape": 52 }; // px per second
    $$("[data-mq]").forEach(function (track) {
      const unit = parseInt(track.getAttribute("data-mq"), 10);
      if (!unit) return;
      const kids = Array.from(track.children);
      if (kids.length < unit) return;
      const copyHTML = kids.slice(0, unit).map(function (n) { return n.outerHTML; }).join("");

      function fill() {
        track.innerHTML = copyHTML;
        const one = track.scrollWidth || 1;            // one copy incl. trailing margin
        const view = window.innerWidth;                // half (copies/2) must cover the window
        let copies = Math.ceil((view * 2) / one);
        if (copies < 2) copies = 2;
        if (copies % 2) copies += 1;                   // keep the count even
        copies += 2;                                   // safety buffer
        track.innerHTML = copyHTML.repeat(copies);

        const speed = speeds[track.classList[0]] || 46;
        const half = (copies / 2) * one;
        track.style.animationDuration = Math.max(8, half / speed).toFixed(1) + "s";
      }

      fill();
      window.addEventListener("resize", function () {
        window.clearTimeout(track._mqT);
        track._mqT = window.setTimeout(fill, 200);
      });
    });
  }

  /* ---------- 11 · JOIN (unchanged) ---------- */
  function joinAnim() {
    if (!hasGSAP) return;
    gsap.fromTo(".join-copy", { opacity: 0, y: 50 }, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".join-banner", start: "top 72%" }
    });
    gsap.to(".join-img img", {
      scale: 1.12, yPercent: -8, ease: "none",
      scrollTrigger: { trigger: ".join-banner", start: "top bottom", end: "bottom top", scrub: 1 }
    });
  }

  /* ---------- no-motion / no-GSAP staging ---------- */
  function fallbackStaging() {
    $$(".ss-num").forEach(function (n) { n.textContent = (parseInt(n.dataset.count, 10) || 0).toLocaleString("en-US"); });
    $$(".hs-count").forEach(function (n) { n.textContent = (parseInt(n.dataset.count, 10) || 0).toLocaleString("en-US"); });
    $$(".cred-pane").forEach(function (p) { p.classList.add("in"); });
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
        email.classList.add("err");
        errMsg("Please enter a mail ID");
        err.hidden = false; ok.hidden = true;
        email.focus();
      } else if (!emailRe.test(v)) {
        email.classList.add("err");
        errMsg("Enter a valid mail address");
        err.hidden = false; ok.hidden = true;
        email.focus();
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
    if (prog) {
      bar = document.createElement("span");
      prog.appendChild(bar);
    }

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

    if (prefersReduced || !hasGSAP) {
      runPreloader(function () {
        fallbackStaging();
        initScrub(); initMobileMenu(); initAnchors(); initNewsletter(); initTour(); initVoices();
        window.addEventListener("load", function () { ScrollTrigger && ScrollTrigger.refresh(); });
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    runPreloader(function () {
      initVh();
      initSnaps();
      initRules();
      initDay();
      leadersReveal();
      initEra();
      initTour();
      initCreds();
      initVoices();
      joinAnim();
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