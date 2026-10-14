/* ============================================================
   STACKLY — Healthcare Management · Home.js
   Preloader · Lenis · GSAP · Services pin · Swap · Validation
   ============================================================ */
(function () {
  "use strict";

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasGSAP = typeof window.gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  const desktop = window.matchMedia("(min-width: 1081px)");

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

  /* ---------- hero entrance ---------- */
  function heroTimeline() {
    if (!hasGSAP) {
      $$(".hero-title .word, .hero-sub, .hero-actions, .hero-proof, .hero-media").forEach(function (n) { n.style.opacity = 1; });
      return;
    }
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.set(".hero-title .word", { yPercent: 120 })
      .set(".hero-eyebrow", { y: 22, opacity: 0 })
      .set(".hero-sub, .hero-actions, .hero-proof", { y: 30, opacity: 0 })
      .set(".hero-photo", { scale: 0.84, opacity: 0 })
      .set("#heroImg", { scale: 1.25 })
      .set(".hero-frame", { scale: 0.6, opacity: 0 })
      .set(".hero-tag--top", { x: -80, opacity: 0 })
      .set("#heroMarquee", { yPercent: 60, opacity: 0 });

    tl.to(".hero-eyebrow", { y: 0, opacity: 1, duration: 0.7 })
      .to(".hero-title .word", { yPercent: 0, duration: 1, stagger: 0.08 }, "-=0.3")
      .to(".hero-sub", { y: 0, opacity: 1, duration: 0.7 }, "-=0.45")
      .to(".hero-actions", { y: 0, opacity: 1, duration: 0.7 }, "-=0.55")
      .to(".hero-proof", { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
      .to(".hero-photo", { scale: 1, opacity: 1, duration: 1.25, ease: "power3.out" }, "-=1.1")
      .to("#heroImg", { scale: 1, duration: 1.9, ease: "power3.out" }, "<")
      .to(".hero-frame", { scale: 1, opacity: 1, duration: 1.1 }, "-=0.9")
      .to(".hero-tag--top", { x: 0, opacity: 1, duration: 0.8 }, "-=0.8")
      .to("#heroMarquee", { yPercent: 0, opacity: 1, duration: 0.9 }, "-=0.3");
  }

  function heroParallax() {
    if (!hasGSAP || prefersReduced) return;
    const hero = $(".hero");
    if (!hero) return;
    gsap.to(".hero-copy", {
      yPercent: -12, opacity: 0.3, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "70% top", scrub: true }
    });
    gsap.to(".hero-media", {
      yPercent: 8, ease: "none",
      scrollTrigger: { trigger: hero, start: "top top", end: "70% top", scrub: true }
    });
  }

  /* ---------- counters ---------- */
  function initCounters() {
    if (!hasGSAP) return;
    $$(".stat").forEach(function (stat) {
      const num = $(".num", stat);
      const target = parseInt(stat.dataset.count, 10) || 0;
      gsap.fromTo(num, { textContent: 0 }, {
        textContent: target,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: { trigger: stat, start: "top 85%" },
        onUpdate: function () { num.textContent = Math.floor(num.textContent); }
      });
    });
  }

  /* ---------- services horizontal pinned scroll ---------- */
  function servicesPin() {
    const wrap = $("#svcScroll");
    const track = $("#svcTrack");
    if (!wrap || !track || !hasGSAP) return;

    if (desktop.matches) {
      $$(".svc", track).forEach(function (c) { c.removeAttribute("data-aos"); });
    }

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1081px)", function () {
      const getAmt = function () { return track.scrollWidth - wrap.clientWidth; };
      const tween = gsap.to(track, {
        x: function () { return -getAmt(); },
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: function () { return "+=" + getAmt(); },
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true
        }
      });
      return function () { tween.scrollTrigger && tween.scrollTrigger.kill(); tween.kill(); };
    });
  }

  /* ---------- spotlight parallax ---------- */
  function spotlightParallax() {
    if (!hasGSAP || prefersReduced) return;
    const st = $(".spotlight");
    if (!st) return;
    gsap.to("#spotImg", {
      yPercent: -10, scale: 1.08, ease: "none",
      scrollTrigger: { trigger: ".spot-visual", start: "top bottom", end: "bottom top", scrub: 1 }
    });
    gsap.to(".spot-plaque", {
      y: -26, ease: "none",
      scrollTrigger: { trigger: ".spot-visual", start: "top bottom", end: "bottom top", scrub: 1 }
    });
  }

  /* ---------- care path ---------- */
  function initProcess() {
    if (!hasGSAP) return;
    const path = $("#carePath");
    if (!path) return;

    gsap.to("#cpConveyor", {
      scaleX: 1, ease: "none", transformOrigin: "left center",
      scrollTrigger: { trigger: path, start: "top 62%", end: "bottom 40%", scrub: 0.6 }
    });

    $$(".cp-card", path).forEach(function (card) {
      gsap.fromTo(card, { y: 120, opacity: 0 }, {
        y: 0, opacity: 1, duration: 1.05, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: card, start: "top 84%" }
      });
    });
  }

  /* ---------- wall of heart swap ---------- */
  const TST_IMG_PREFIX = "Images/";
  function initWallOfHeart() {
    const txtEl = $("#tstHeroTxt");
    const whoEl = $("#tstHeroWho");
    const minis = $$(".tst-mini");
    if (!txtEl || !whoEl || !minis.length) return;

    const buildWho = function (name, role, src) {
      whoEl.innerHTML =
        '<img src="' + src + '" alt="' + name + '">' +
        '<span><strong>' + name + '</strong><p>' + role + '</p></span>';
      const img = $("img", whoEl);
      if (img && !img.complete) img.loading = "lazy";
    };

    const swap = function (mini, i, cur) {
      const name = mini.dataset.name;
      const role = mini.dataset.role;
      const src = TST_IMG_PREFIX + mini.dataset.img;
      minis.forEach(function (m) { m.classList.toggle("is-on", m === mini); });

      const dir = (i < cur) ? -1 : 1;
      const show = function () {
        txtEl.textContent = mini.dataset.txt;
        buildWho(name, role, src);
      };
      if (hasGSAP) {
        gsap.timeline()
          .to([txtEl, whoEl], { y: dir * -28, opacity: 0, duration: 0.3, ease: "power2.in", onComplete: show })
          .set([txtEl, whoEl], { y: dir * 44 })
          .to([txtEl, whoEl], { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" });
      } else {
        show();
        txtEl.style.opacity = 1;
        whoEl.style.opacity = 1;
      }
    };

    let curIdx = 0;
    minis.forEach(function (m, i) {
      m.addEventListener("click", function () {
        const prev = curIdx;
        curIdx = i;
        swap(m, i, prev);
        resetAuto();
      });
    });

    let autoTimer = null;
    const resetAuto = function () {
      if (prefersReduced) return;
      clearInterval(autoTimer);
      autoTimer = setInterval(function () {
        const next = (curIdx + 1) % minis.length;
        const prev = curIdx;
        curIdx = next;
        swap(minis[next], next, prev);
      }, 7200);
    };
    resetAuto();
  }

  /* ---------- pricing toggle ---------- */
  function initPricing() {
    const toggle = $("#billToggle");
    if (!toggle) return;
    const monthBtn = $("#billMonth");
    const yearBtn = $("#billYear");
    let isYear = false;
    const apply = function () {
      toggle.classList.toggle("bill-year", isYear);
      monthBtn && monthBtn.classList.toggle("is-on", !isYear);
      yearBtn && yearBtn.classList.toggle("is-on", isYear);
      $$(".plan .amt").forEach(function (amt) {
        const t = amt.dataset[isYear ? "year" : "month"] || amt.dataset.month;
        if (hasGSAP) gsap.to(amt, { duration: 0.4, textContent: t, ease: "power2.out", snap: { textContent: 1 } });
        else amt.textContent = t;
      });
    };
    toggle.addEventListener("click", function () { isYear = !isYear; apply(); });
    apply();
  }

  /* ---------- faq ---------- */
  function initFAQ() {
    $$(".faq-item").forEach(function (item) {
      const q = $(".faq-q", item);
      const a = $(".faq-a", item);
      q.addEventListener("click", function () {
        const open = item.classList.contains("open");
        $$(".faq-item.open").forEach(function (o) {
          o.classList.remove("open");
          const oa = $(".faq-a", o);
          if (oa) oa.style.maxHeight = null;
          const oq = $(".faq-q", o);
          if (oq) oq.setAttribute("aria-expanded", "false");
        });
        if (!open) {
          item.classList.add("open");
          q.setAttribute("aria-expanded", "true");
          a.style.maxHeight = a.scrollHeight + "px";
        }
      });
    });
  }

  /* ---------- forms ---------- */
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRe = /^[+\d][\d\s\-()]{6,17}$/;

  function initAppointment() {
    const form = $("#appointmentForm");
    if (!form) return;
    const name = $("#apName"), email = $("#apEmail"), phone = $("#apPhone"),
          dob = $("#apDate"), dept = $("#apDept");
    const success = $("#apSuccess");
    const fields = [name, email, phone, dob, dept];

    const todayStr = new Date().toISOString().split("T")[0];
    dob.max = todayStr;
    dob.min = "1900-01-01";

    const nameRe = /^[A-Za-z][A-Za-z' .-]*$/;

    const RULES = [
      { el: name,  req: "Please fill in your name.",            fmt: "Name should contain only letters.",        ok: function (v) { return nameRe.test(v); } },
      { el: email, req: "Please fill in your email address.",   fmt: "Enter a valid email address.",              ok: function (v) { return emailRe.test(v); } },
      { el: phone, req: "Please fill in your phone number.",    fmt: "Enter a valid phone number.",               ok: function (v) { return phoneRe.test(v); } },
      { el: dob,   req: "Please fill in your date of birth.",   fmt: "Enter your date of birth in the correct format.", ok: function (v) { return v >= "1900-01-01" && v <= todayStr; } },
      { el: dept,  req: "Please choose a department.",          fmt: "",                                          ok: function (v) { return true; } }
    ];

    const msgFor = function (r) {
      const v = r.el.value;
      if (!v) return r.req;
      return r.ok(v) ? "" : r.fmt;
    };

    const setMsg = function (r, msg) {
      const lab = r.el.closest(".af");
      const em = lab && lab.querySelector(".af-msg");
      r.el.classList.toggle("err", !!msg);
      if (lab) lab.classList.toggle("err-wrap", !!msg);
      if (lab) lab.setAttribute("aria-invalid", String(!!msg));
      if (em) em.textContent = msg;
      return !msg;
    };

    RULES.forEach(function (r) {
      const evt = r.el.tagName === "SELECT" ? "change" : "input";
      r.el.addEventListener(evt, function () {
        const lab = r.el.closest(".af");
        if (lab && lab.classList.contains("err-wrap")) setMsg(r, msgFor(r));
      });
    });

    const validateAll = function () {
      let ok = true, first = null;
      RULES.forEach(function (r) {
        const good = setMsg(r, msgFor(r));
        if (!good) { ok = false; first = first || r.el; }
      });
      if (first) first.focus();
      return ok;
    };

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateAll()) return;
      window.location.href = "HTML/404.html";
    });

    $("#apAgain") && $("#apAgain").addEventListener("click", function () {
      form.reset();
      form.style.display = "";
      success.hidden = true;
      fields.forEach(function (f) {
        f.classList.remove("err");
        const lab = f.closest(".af");
        if (lab) {
          lab.classList.remove("err-wrap");
          const em = lab.querySelector(".af-msg");
          if (em) em.textContent = "";
        }
      });
    });
  }

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
        window.location.href = "HTML/404.html";
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

  /* ---------- seamless marquees ----------
     Each track keeps repeated identical "units" and the CSS slides it by -50%.
     For that to loop with no blank gap, the track needs an EVEN number of
     copies and its half-width must be at least as wide as the window. We
     measure one unit, top up copies to cover any viewport, and scale the
     duration so the scroll speed never changes. */
  function initMarquees() {
    const speeds = { "mq-track": 64, "tm-track": 42, "ss-track": 34 }; // px per second
    $$("[data-mq]").forEach(function (track) {
      const unit = parseInt(track.getAttribute("data-mq"), 10);
      if (!unit) return;
      const kids = Array.from(track.children);
      if (kids.length < unit) return;
      const copyHTML = kids.slice(0, unit).map(function (n) { return n.outerHTML; }).join("");

      function fill() {
        track.innerHTML = copyHTML;
        const one = track.scrollWidth || 1;            // one copy incl. trailing margin
        const view = track.parentElement.clientWidth || window.innerWidth;
        let copies = Math.ceil((view * 2) / one);      // half (copies/2) must cover the window
        if (copies < 2) copies = 2;
        if (copies % 2) copies += 1;                   // keep the count even
        copies += 2;                                   // safety buffer
        track.innerHTML = copyHTML.repeat(copies);

        const speed = speeds[track.className.split(" ")[0]] || 40;
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
        if (typeof AOS !== "undefined") AOS.init({ once: true, duration: 700, offset: 90 });
        initScrub(); initMobileMenu(); initAnchors();
        initWallOfHeart(); initPricing(); initFAQ();
        initAppointment(); initNewsletter();
        window.addEventListener("load", function () {
          if (typeof AOS !== "undefined") AOS.refresh();
          ScrollTrigger && ScrollTrigger.refresh();
        });
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    runPreloader(function () {
      heroTimeline();
      heroParallax();
      initScrub();
      initMagnetic();
      initCounters();
      servicesPin();
      spotlightParallax();
      initProcess();
      initWallOfHeart();
      initPricing();
      initFAQ();
      initAppointment();
      initNewsletter();
      initMobileMenu();
      initAnchors();

      if (typeof AOS !== "undefined") AOS.init({ once: true, duration: 800, offset: 110 });

      window.addEventListener("load", function () {
        ScrollTrigger.refresh();
        if (typeof AOS !== "undefined") AOS.refresh();
      });
      setTimeout(function () { ScrollTrigger.refresh(); }, 700);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();