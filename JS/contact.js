/* ============================================================
   STACKLY — Healthcare Management · Contact.js (v1)
   Preloader · Lenis · GSAP · Magnetic ·
   Open-channels hero · Channel doors · Quick help · Embedded map ·
   Desk finder · Dispatch form · Coverage clock · Office flips ·
   Visit-prep collage · Final CTA
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  const isDesktop = function () { return window.matchMedia("(min-width: 761px)").matches; };
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

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
        html += '<span class="pulse' + hi + '" style="height:' + h + 'px"></span>';
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

  /* ---------- 02 · HERO — OPEN CHANNELS ---------- */
  function initHero() {
    if (!hasGSAP) return;
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.fromTo(".cx-eyebrow", { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
      .fromTo(".cx-w", { yPercent: 118, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.05, stagger: 0.12 }, "-=0.35")
      .fromTo(".cx-sub", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.6")
      .fromTo(".cx-actions", { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
      .fromTo(".cx-chips .cx-chip", { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 }, "-=0.45")
      .fromTo(".cx-console", { y: 40, opacity: 0, rotateY: -6, scale: 0.96 }, { y: 0, opacity: 1, rotateY: -6, scale: 1, duration: 1, ease: "power3.out" }, 0.35)
      .fromTo(".cx-badge", { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" }, 0.9)
      .fromTo(".cx-msg--a", { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 1.05)
      .fromTo(".cx-msg--b", { x: 20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 1.2)
      .fromTo(".cx-tape", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.4");

    if (prefersReduced) return;

    gsap.to(".cx-hero-copy", {
      yPercent: -12, opacity: 0.3, ease: "none",
      scrollTrigger: { trigger: ".cx-hero", start: "top top", end: "62% top", scrub: 1 }
    });
    gsap.to(".cx-console", {
      yPercent: 10, ease: "none",
      scrollTrigger: { trigger: ".cx-hero", start: "top top", end: "bottom top", scrub: 1 }
    });
  }

  /* ---------- 03 · CHANNELS (doors + spotlight) ---------- */
  function initChannels() {
    const cards = $$(".cx-chan-card");
    const row = $("#cxChanRow");
    const section = $(".cx-chan");
    const spot = $("#cxSpot");

    if (cards.length) {
      const open = function (target) {
        cards.forEach(function (c) { c.classList.toggle("is-open", c === target); });
      };
      cards.forEach(function (c) {
        c.addEventListener("mouseenter", function () { open(c); });
        c.addEventListener("focusin", function () { open(c); });
        c.addEventListener("click", function () { open(c); });
      });
    }

    if (row && section && spot && isDesktop() && !prefersReduced) {
      section.addEventListener("mousemove", function (e) {
        const r = section.getBoundingClientRect();
        const x = e.clientX - r.left - 230;
        const y = e.clientY - r.top - 230;
        spot.style.transform = "translate(" + x + "px," + y + "px)";
      });
      section.addEventListener("mouseenter", function () { section.classList.add("spot-on"); });
      section.addEventListener("mouseleave", function () { section.classList.remove("spot-on"); });
    }
  }

  /* ---------- 04 · QUICK HELP (live clock + parallax) ---------- */
  function initHelp() {
    const clock = $("#cxClock");
    if (clock) {
      const tick = function () {
        const d = new Date();
        const p = function (n) { return String(n).padStart(2, "0"); };
        clock.textContent = p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
      };
      tick();
      setInterval(tick, 1000);
    }
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".cx-help-copy", { x: -46, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".cx-help-band", start: "top 78%" }
    });
    gsap.fromTo(".cx-help-card", { x: 46, opacity: 0 }, {
      x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
      scrollTrigger: { trigger: ".cx-help-band", start: "top 78%" }
    });
    gsap.to(".cx-help-bg img", {
      yPercent: -9, scale: 1.08, ease: "none",
      scrollTrigger: { trigger: ".cx-help-band", start: "top bottom", end: "bottom top", scrub: 1 }
    });
  }

  /* ---------- 05 · MAP ---------- */
  function initMap() {
    if (!hasGSAP || prefersReduced) return;
    gsap.fromTo(".cx-map-frame", { scale: 0.95, opacity: 0 }, {
      scale: 1, opacity: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".cx-map-wrap", start: "top 82%" }
    });
  }

  /* ---------- 06 · DESK FINDER ---------- */
  function initDesks() {
    const tabs = $$(".cx-desk-tab");
    const photos = $$(".cx-desk-photo");
    const views = $$(".cx-desk-view");
    const tag = $("#cxDeskTag");
    if (!tabs.length) return;

    const set = function (key) {
      tabs.forEach(function (t) {
        const on = t.dataset.desk === key;
        t.classList.toggle("is-on", on);
        t.setAttribute("aria-selected", String(on));
        if (on && tag) tag.innerHTML = t.innerHTML;
      });
      photos.forEach(function (p) { p.classList.toggle("is-on", p.dataset.desk === key); });
      views.forEach(function (v) { v.classList.toggle("is-on", v.dataset.desk === key); });
    };

    tabs.forEach(function (t) {
      t.addEventListener("click", function () { set(t.dataset.desk); });
    });
  }

  /* ---------- 07 · DISPATCH (rail swap + per-field validation) ---------- */
  function initSend() {
    const railImgs = $$(".cx-rail-img");
    const railCap = $("#cxRailCap");
    const caps = {
      cxName: "Tell us who you are",
      cxEmail: "Where we'll send the reply",
      cxPhone: "Best number to reach you",
      cxTopic: "Routing it to the right desk",
      cxMsg: "Say it in your own words"
    };
    const setRail = function (key) {
      if (!key) return;
      railImgs.forEach(function (img) { img.classList.toggle("is-on", img.dataset.field === key); });
      if (railCap && caps[key]) railCap.textContent = caps[key];
    };

    $$(".cx-field input, .cx-field textarea, .cx-field select").forEach(function (el) {
      el.addEventListener("focus", function () { setRail(el.id); });
    });

    const form = $("#cxForm");
    if (!form) return;
    const name = $("#cxName"), email = $("#cxEmail"), phone = $("#cxPhone"),
          topic = $("#cxTopic"), msg = $("#cxMsg"), consent = $("#cxConsent"),
          note = $("#cxFormNote"), ok = $("#cxFormOk"), okMail = $("#cxOkMail");
    const noteDefault = '<i class="fa-solid fa-lock"></i> Encrypted · never shared';
    const phoneRe = /^[+()\-.\s\d]{7,18}$/;

    const fields = [
      { el: name, err: $("#errCxName") },
      { el: email, err: $("#errCxEmail") },
      { el: phone, err: $("#errCxPhone") },
      { el: topic, err: $("#errCxTopic") },
      { el: msg, err: $("#errCxMsg") },
      { el: consent, err: $("#errCxConsent") }
    ];

    const validators = {
      name: function (v) { return v.length >= 2 ? "" : "Please tell us your name (at least 2 letters)."; },
      email: function (v) { return emailRe.test(v) ? "" : "Enter a valid email address."; },
      phone: function (v) { return !v || phoneRe.test(v) ? "" : "Enter a valid phone number."; },
      topic: function () { return topic.value ? "" : "Please choose what it's about."; },
      msg: function (v) { return v.trim().length >= 10 ? "" : "Your message should be at least 10 characters."; },
      consent: function () { return consent.checked ? "" : "Please tick the consent box before sending."; }
    };

    const showErr = function (f, message) {
      if (f.el) f.el.classList.add("is-bad");
      if (f.err) {
        f.err.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + message;
        f.err.hidden = false;
      }
    };
    const clearErr = function (f) {
      if (f.el) f.el.classList.remove("is-bad");
      if (f.err) { f.err.textContent = ""; f.err.hidden = true; }
    };
    const resetNote = function () {
      note.classList.remove("is-bad");
      note.innerHTML = noteDefault;
      ok.hidden = true;
    };
    const validateField = function (f) {
      if (!f.el) return "";
      const val = f.el.value ? f.el.value.trim() : "";
      const key = f.el.id.replace("cx", "").toLowerCase();
      return validators[key] ? validators[key](val) : "";
    };

    let touched = {};

    $$("input, textarea, select", form).forEach(function (el) {
      el.addEventListener("input", function () {
        if (el === name) {
          const cleaned = name.value.replace(/[^A-Za-z\s.'-]/g, "");
          if (cleaned !== name.value) name.value = cleaned;
        }
        resetNote();
        const f = fields.find(function (x) { return x.el === el; });
        if (f && touched[f.el.id]) {
          const err = validateField(f);
          if (err) showErr(f, err);
          else clearErr(f);
        }
      });
    });

    fields.forEach(function (f) {
      if (!f.el) return;
      const validate = function () {
        touched[f.el.id] = true;
        const err = validateField(f);
        if (err) showErr(f, err);
        else clearErr(f);
      };
      f.el.addEventListener("blur", validate);
      if (f.el.type === "checkbox") f.el.addEventListener("change", validate);
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      resetNote();
      let first = null;
      fields.forEach(function (f) {
        touched[f.el.id] = true;
        const err = validateField(f);
        if (err) {
          showErr(f, err);
          if (!first) first = f.el;
        } else {
          clearErr(f);
        }
      });
      if (first) {
        note.classList.add("is-bad");
        note.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> Please fix the highlighted fields below.';
        first.focus();
        return;
      }

      window.location.href = "404.html";
    });
  }

  /* ---------- seamless marquees (data-mq tracks) ---------- */
  function initMarquees() {
    const tracks = $$("[data-mq]");
    const speeds = { "cxt-track": 42 };
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
        track.style.animationDuration = Math.max(8, half / (speeds[track.className] || 46)).toFixed(1) + "s";
      };
      calc();
      window.addEventListener("resize", function () { calc(); }, { passive: true });
    });
  }

  /* ---------- 08 · COVERAGE CLOCK ---------- */
  function initClock() {
    const ticks = $("#cxTicks");
    const hand = $("#cxHand");
    const label = $("#cxHourLabel");
    const title = $("#cxHourTitle");
    const text = $("#cxHourText");
    const badge = $("#cxHourBadge");
    if (!ticks) return;

    const info = function (h) {
      if (h < 6) return { t: "Night team on site", d: "Emergency, maternity and the inpatient wards run through the small hours, staffed by the on-call crew.", b: "Moon · night shift", i: "fa-moon" };
      if (h < 8) return { t: "Early birds open up", d: "Pharmacy, diagnostics and the day reception start coming online before the first clinics open.", b: "Sun · early start", i: "fa-sun" };
      if (h < 18) return { t: "Outpatient clinics", d: "Doors open for appointments, walk-in triage and diagnostics. Most clinics run straight through until 20:00.", b: "Sun · day team on site", i: "fa-sun" };
      if (h < 21) return { t: "Evening handover", d: "Day teams brief the night crew, but reception, emergency and the phone lines stay fully open.", b: "Sunset · handover hour", i: "fa-cloud-sun" };
      return { t: "Night team on site", d: "A calm, fully-lit campus — emergency, maternity and triage keep running, and someone always answers.", b: "Moon · night shift", i: "fa-moon" };
    };

    const pad = function (n) { return String(n).padStart(2, "0"); };
    const set = function (h) {
      if (hand) hand.style.setProperty("--deg", (h * 15) + "deg");
      const d = info(h);
      if (label) label.textContent = pad(h) + ":00";
      if (title) title.textContent = d.t;
      if (text) text.textContent = d.d;
      if (badge) badge.innerHTML = '<i class="fa-solid ' + d.i + '"></i> ' + d.b;
      $$(".cx-tick", ticks).forEach(function (t) { t.classList.toggle("is-on", Number(t.dataset.h) === h); });
    };

    for (let h = 0; h < 24; h++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cx-tick";
      b.dataset.h = h;
      b.style.setProperty("--i", h);
      b.setAttribute("aria-label", pad(h) + ":00");
      b.addEventListener("mouseenter", function () { set(h); });
      b.addEventListener("focus", function () { set(h); });
      b.addEventListener("click", function () { set(h); });
      ticks.appendChild(b);
    }

    set(new Date().getHours());
  }

  /* ---------- 10 · VISIT-PREP COLLAGE ---------- */
  function initCollage() {
    const box = $("#cxCollage");
    if (!box || !hasGSAP || prefersReduced || !isDesktop()) return;
    const cols = $$(".cx-col", box);
    box.addEventListener("mousemove", function (e) {
      const r = box.getBoundingClientRect();
      const cx = (e.clientX - r.left) / r.width - 0.5;
      const cy = (e.clientY - r.top) / r.height - 0.5;
      cols.forEach(function (c) {
        const d = parseFloat(c.dataset.depth) || 20;
        gsap.to(c, { x: cx * d * 2.2, y: cy * d * 2.2, duration: 0.7, ease: "power3.out", overwrite: "auto" });
      });
    });
    box.addEventListener("mouseleave", function () {
      cols.forEach(function (c) { gsap.to(c, { x: 0, y: 0, duration: 0.9, ease: "power3.out" }); });
    });
  }

  /* ---------- scroll reveals ---------- */
  function initReveals() {
    if (!hasGSAP || prefersReduced) return;
    const reveal = function (sel, vars, stagger) {
      const els = $$(sel);
      if (!els.length) return;
      gsap.fromTo(els, { y: 40, opacity: 0 }, Object.assign({
        y: 0, opacity: 1, duration: 0.85, ease: "power3.out",
        stagger: stagger || 0.1,
        scrollTrigger: { trigger: els[0], start: "top 82%" }
      }, vars || {}));
    };

    reveal(".cx-chan-head > *", { stagger: 0.12 });
    reveal(".cx-chan-card", {}, 0.1);
    reveal(".cx-desks-head > *", { stagger: 0.12 });
    reveal(".cx-desk-nav", {});
    reveal(".cx-desk-stage", {});
    reveal(".cx-send-rail", {});
    reveal(".cx-send-formwrap > .eyebrow, .cx-send-formwrap > .sec-title, .cx-send-lead", { stagger: 0.1 });
    reveal(".cx-form > *", {}, 0.06);
    reveal(".cx-hours-ringwrap", {});
    reveal(".cx-hours-info", {});
    reveal(".cx-hours-cards .cx-hours-card", {}, 0.12);
    reveal(".cx-offices-head > *", { stagger: 0.12 });
    reveal(".cx-office", {}, 0.12);
    reveal(".cx-visit-copy > *", { stagger: 0.1 });
    reveal(".cx-visit-collage", {});

    gsap.fromTo(".cx-talk-copy", { y: 50, opacity: 0 }, {
      y: 0, opacity: 1, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".cx-talk-banner", start: "top 76%" }
    });
    gsap.to(".cx-talk-bg img", {
      yPercent: -8, scale: 1.1, ease: "none",
      scrollTrigger: { trigger: ".cx-talk-banner", start: "top bottom", end: "bottom top", scrub: 1 }
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

  /* ---------- office flip cards ---------- */
  function initOffices() {
    $$(".cx-office-back a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        window.location.href = "404.html";
      });
    });
  }

  /* ---------- newsletter ---------- */
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

  /* ---------- boot ---------- */
  function boot() {
    buildECG();
    initMarquees();
    initChannels();
    initDesks();
    initSend();
    initClock();
    initCollage();
    initScrub();
    initMobileMenu();
    initAnchors();
    initOffices();
    initNewsletter();

    if (prefersReduced || !hasGSAP) {
      runPreloader(function () {
        window.addEventListener("load", function () { ScrollTrigger && ScrollTrigger.refresh(); });
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    runPreloader(function () {
      initHero();
      initHelp();
      initMap();
      initReveals();
      initMagnetic();

      window.addEventListener("load", function () { ScrollTrigger.refresh(); });
      setTimeout(function () { ScrollTrigger.refresh(); }, 700);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
