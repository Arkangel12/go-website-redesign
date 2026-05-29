// web-vitals.js — lightweight Core Web Vitals reporting via GTM data layer.
// Reports LCP, INP, and CLS without an external npm package.
(function () {
  'use strict';

  function push(name, value, rating) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'core_web_vital',
      metric_name: name,
      metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
      metric_rating: rating, // 'good' | 'needs-improvement' | 'poor'
    });
  }

  function rate(name, value) {
    // Thresholds from https://web.dev/vitals/
    var thresholds = { LCP: [2500, 4000], INP: [200, 500], CLS: [0.1, 0.25] };
    var t = thresholds[name];
    if (!t) return 'good';
    return value <= t[0] ? 'good' : value <= t[1] ? 'needs-improvement' : 'poor';
  }

  // LCP — Largest Contentful Paint
  if ('PerformanceObserver' in window) {
    try {
      new PerformanceObserver(function (list) {
        var entries = list.getEntries();
        var last = entries[entries.length - 1];
        var val = last.startTime;
        push('LCP', val, rate('LCP', val));
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (_) {}

    // CLS — Cumulative Layout Shift
    try {
      var clsValue = 0;
      new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
          if (!entry.hadRecentInput) clsValue += entry.value;
        });
        push('CLS', clsValue, rate('CLS', clsValue));
      }).observe({ type: 'layout-shift', buffered: true });
    } catch (_) {}

    // INP — Interaction to Next Paint (via event timing)
    try {
      var maxINP = 0;
      new PerformanceObserver(function (list) {
        list.getEntries().forEach(function (entry) {
          var inp = entry.processingEnd - entry.startTime;
          if (inp > maxINP) {
            maxINP = inp;
            push('INP', maxINP, rate('INP', maxINP));
          }
        });
      }).observe({ type: 'event', durationThreshold: 16, buffered: true });
    } catch (_) {}
  }
})();
