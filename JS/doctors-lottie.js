/* ============================================================
   STACKLY — Doctors page · local Lottie animation data
   Rendered by lottie-web. No external asset fetch required.
   "pulse" = staggered amber ripple rings + a heartbeat core.
   ============================================================ */
(function (w) {
  "use strict";

  function ring(ind, nm, delay) {
    var hold = delay;
    var end = 90;
    var appear = delay === 0 ? 0 : delay;
    var fadeStart = delay === 0 ? 58 : delay + 34;
    return {
      ddd: 0, ind: ind, ty: 4, nm: nm, sr: 1,
      ks: {
        o: {
          a: 1, k: [
            { t: 0, s: [delay === 0 ? 90 : 0] },
            { t: appear, s: [delay === 0 ? 90 : 85] },
            { t: fadeStart, s: [0] },
            { t: end, s: [0] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1, k: [
            { t: 0, s: [8, 8] },
            { t: hold, s: [8, 8] },
            { t: end, s: [100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [{
        ty: "gr", nm: nm + "-g", it: [
          { ty: "el", nm: "e", d: 1, p: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] } },
          { ty: "st", nm: "s", c: { a: 0, k: [0.906, 0.635, 0.243, 1] }, o: { a: 0, k: 100 }, w: { a: 0, k: 5 }, lc: 2, lj: 1, ml: 4 },
          { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } }
        ]
      }],
      ip: 0, op: end, st: 0, bm: 0
    };
  }

  var core = {
    ddd: 0, ind: 10, ty: 4, nm: "core", sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 0, k: 0 },
      p: { a: 0, k: [100, 100, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: {
        a: 1, k: [
          { t: 0, s: [78, 78] },
          { t: 14, s: [122, 122] },
          { t: 28, s: [82, 82] },
          { t: 42, s: [112, 112] },
          { t: 56, s: [78, 78] },
          { t: 90, s: [78, 78] }
        ]
      }
    },
    ao: 0,
    shapes: [{
      ty: "gr", nm: "core-g", it: [
        { ty: "el", nm: "e", d: 1, p: { a: 0, k: [0, 0] }, s: { a: 0, k: [34, 34] } },
        { ty: "fl", nm: "f", c: { a: 0, k: [0.906, 0.635, 0.243, 1] }, o: { a: 0, k: 100 } },
        { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 }, sk: { a: 0, k: 0 }, sa: { a: 0, k: 0 } }
      ]
    }],
    ip: 0, op: 90, st: 0, bm: 0
  };

  w.STACKLY_LOTTIE_PULSE = {
    v: "5.7.4", fr: 30, ip: 0, op: 90, w: 200, h: 200, nm: "StacklyPulse", ddd: 0,
    assets: [],
    layers: [core, ring(1, "ring-a", 0), ring(2, "ring-b", 28), ring(3, "ring-c", 56)]
  };
})(window);
