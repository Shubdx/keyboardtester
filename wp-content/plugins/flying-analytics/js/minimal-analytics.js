!(function (e, t, o) {
  var n = e.history,
    i = document,
    r = navigator || {},
    a = localStorage,
    c = encodeURIComponent,
    d = n.pushState,
    l = function () {
      return a.cid || (a.cid = Math.random().toString(36)), a.cid;
    },
    s = function (n, a, d, s, u, v, p) {
      var h = "https://www.google-analytics.com/collect",
        w = (function (e) {
          var t = [];
          for (var o in e)
            e.hasOwnProperty(o) &&
              void 0 !== e[o] &&
              t.push(c(o) + "=" + c(e[o]));
          return t.join("&");
        })({
          v: "1",
          ds: "web",
          aip: o.anonymizeIp ? 1 : void 0,
          tid: t,
          cid: l(),
          t: n || "pageview",
          sd:
            o.colorDepth && screen.colorDepth
              ? screen.colorDepth + "-bits"
              : void 0,
          dr: i.referrer || void 0,
          dt: i.title,
          dl: i.location.origin + i.location.pathname + i.location.search,
          ul: o.language ? (r.language || "").toLowerCase() : void 0,
          de: o.characterSet ? i.characterSet : void 0,
          sr: o.screenSize
            ? (e.screen || {}).width + "x" + (e.screen || {}).height
            : void 0,
          vp:
            o.screenSize && e.visualViewport
              ? (e.visualViewport || {}).width +
                "x" +
                (e.visualViewport || {}).height
              : void 0,
          ec: a || void 0,
          ea: d || void 0,
          el: s || void 0,
          ev: u || void 0,
          exd: v || void 0,
          exf: void 0 !== p && 0 == !!p ? 0 : void 0,
        });
      if (r.sendBeacon) r.sendBeacon(h, w);
      else {
        var g = new XMLHttpRequest();
        g.open("POST", h, !0), g.send(w);
      }
    };
  (n.pushState = function (e) {
    return (
      "function" == typeof n.onpushstate && n.onpushstate({ state: e }),
      setTimeout(s, o.delay || 10),
      d.apply(n, arguments)
    );
  }),
    s(),
    (e.ma = {
      trackEvent: function (e, t, o, n) {
        return s("event", e, t, o, n);
      },
      trackException: function (e, t) {
        return s("exception", null, null, null, null, e, t);
      },
    });
})(window, window.GA_ID, {
  anonymizeIp: !0,
  colorDepth: !0,
  characterSet: !0,
  screenSize: !0,
  language: !0,
});
