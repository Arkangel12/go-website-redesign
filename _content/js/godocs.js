// Copyright 2012 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Rewritten in vanilla JS — no jQuery dependency.
(function () {
  'use strict';

  // ── Mobile menu toggle ──────────────────────────────────────────
  var headerEl = document.querySelector('.js-header');
  var menuButtonEl = document.querySelector('.js-golangorg-headerMenuButton');

  if (menuButtonEl) {
    menuButtonEl.addEventListener('click', function (e) {
      e.preventDefault();
      headerEl.classList.toggle('is-active');
      menuButtonEl.setAttribute(
        'aria-expanded',
        String(headerEl.classList.contains('is-active'))
      );
    });
  }

  // ── Table of Contents ───────────────────────────────────────────
  // Populates #nav with a vertical ToC from h2/h3 elements that
  // follow it in the DOM. For doc pages the ToC container sits in
  // the right column (.DocLayout-toc) and gets sticky behaviour
  // from CSS; for other pages it stays in the content flow.
  function generateTOC() {
    if (document.getElementById('manual-nav')) return;

    var nav = document.getElementById('nav');
    if (!nav) return;

    // Collect headings that come after #nav in the article.
    var article = nav.closest('article') || document.body;
    var allHeadings = article.querySelectorAll('h2, h3, div.markdown h2, div.markdown h3');
    var headings = [];
    allHeadings.forEach(function (h) {
      // Only include headings that are after #nav in document order.
      if (nav.compareDocumentPosition(h) & Node.DOCUMENT_POSITION_FOLLOWING) {
        headings.push(h);
      }
    });

    if (headings.length <= 1) return;

    headings.forEach(function (h, i) {
      if (!h.id) h.id = 'tmp_' + i;
    });

    var header = document.createElement('p');
    header.className = 'TOC-title';
    header.textContent = 'Contents';
    nav.appendChild(header);

    var dl = document.createElement('dl');
    headings.forEach(function (h) {
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.replace(/¶$/, '').trim();

      var item = document.createElement(h.tagName === 'H2' ? 'dt' : 'dd');
      if (h.tagName === 'H3') item.className = 'indent';
      item.appendChild(a);
      dl.appendChild(item);
    });
    nav.appendChild(dl);

    // Highlight active section on scroll.
    var tocLinks = nav.querySelectorAll('a');
    if ('IntersectionObserver' in window) {
      var active = null;
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            tocLinks.forEach(function (a) {
              var isCurrent = a.getAttribute('href') === '#' + id;
              a.classList.toggle('TOC-active', isCurrent);
              if (isCurrent) active = a;
            });
          }
        });
      }, { rootMargin: '-20% 0px -60% 0px' });

      headings.forEach(function (h) { observer.observe(h); });
    }
  }

  // ── Toggle sections (collapsible examples) ──────────────────────
  function bindToggle(el) {
    var btn = el.querySelector('.toggleButton');
    if (!btn) return;
    btn.addEventListener('click', function (e) {
      if (e.target.closest('.toggle, .toggleVisible') !== el) return;
      el.classList.toggle('toggle');
      el.classList.toggle('toggleVisible');
    });
  }

  function bindToggles(selector) {
    document.querySelectorAll(selector).forEach(bindToggle);
  }

  function bindToggleLink(el, prefix) {
    el.addEventListener('click', function () {
      var href = el.getAttribute('href') || '';
      var i = href.indexOf('#' + prefix);
      if (i < 0) return;
      var id = '#' + prefix + href.slice(i + 1 + prefix.length);
      var target = document.querySelector(id);
      if (target && target.classList.contains('toggle')) {
        var btn = target.querySelector('.toggleButton');
        if (btn) btn.click();
      }
    });
  }

  function bindToggleLinks(selector, prefix) {
    document.querySelectorAll(selector).forEach(function (el) {
      bindToggleLink(el, prefix);
    });
  }

  // ── Inline playground (existing .play divs in docs) ─────────────
  function setupInlinePlayground() {
    document.querySelectorAll('div.play').forEach(function (el) {
      var code = el.querySelector('.code');
      var outputEl = el.querySelector('.output');
      var runEl = el.querySelector('.run');
      var fmtEl = el.querySelector('.fmt');
      var shareEl = el.querySelector('.share');

      var setup = function () {
        if (typeof playground === 'undefined') return;
        playground({
          codeEl: code,
          outputEl: outputEl,
          runEl: runEl,
          fmtEl: fmtEl,
          shareEl: shareEl,
          shareRedirect: '//go.dev/play/p/',
        });

        var resize = function () {
          code.style.height = '0';
          code.style.height = (code.scrollHeight + 20) + 'px';
          code.closest('.input').style.height = code.style.height;
        };
        code.addEventListener('keydown', resize);
        code.addEventListener('keyup', resize);
        resize();
      };

      if (el.style.display !== 'none' && el.offsetParent !== null) {
        setup();
        return;
      }

      var built = false;
      var toggle = el.closest('.toggle');
      if (toggle) {
        toggle.addEventListener('click', function () {
          if (!built) { setup(); built = true; }
        });
      }
    });
  }

  // ── Permalink anchors (¶) ────────────────────────────────────────
  function addPermalinks() {
    // pkg.go.dev-style anchors for #page.container headings
    var container = document.querySelector('#page .container');
    if (container) {
      container.querySelectorAll('h2[id], h3[id]').forEach(function (h) {
        if (h.querySelector('.permalink')) return;
        var a = document.createElement('a');
        a.className = 'permalink';
        a.href = '#' + h.id;
        a.innerHTML = '&#xb6;';
        h.appendChild(document.createTextNode(' '));
        h.appendChild(a);
      });
      container.querySelectorAll('dl[id]').forEach(function (dl) {
        var dt = dl.querySelector(':scope > dt');
        if (!dt || dt.querySelector('.permalink')) return;
        var a = document.createElement('a');
        a.className = 'permalink';
        a.href = '#' + dl.id;
        a.innerHTML = '&#xb6;';
        dt.appendChild(document.createTextNode(' '));
        dt.appendChild(a);
      });
    }

    // Article heading anchors (¶), added after generateTOC so the symbol
    // isn't captured in ToC text.
    document.querySelectorAll('.Article h1[id], .Article h2[id], .Article h3[id], .Article h4[id]')
      .forEach(function (el) {
        el.insertAdjacentHTML('beforeend',
          '<a href="#' + el.id + '" class="Article-idLink" aria-label="Go to ' + el.id + '">¶</a>');
      });
  }

  // ── Expand/collapse all examples ─────────────────────────────────
  var expandAllEl = document.querySelector('.js-expandAll');
  if (expandAllEl) {
    expandAllEl.addEventListener('click', function () {
      var collapsed = expandAllEl.classList.contains('collapsed');
      var targetClass = collapsed ? 'toggle' : 'toggleVisible';
      document.querySelectorAll("[id^='example_']").forEach(function (el) {
        if (el.classList.contains(targetClass)) {
          var btn = el.querySelector('.toggleButton');
          if (btn) btn.click();
        }
      });
      expandAllEl.textContent = collapsed ? '(Collapse All)' : '(Expand All)';
      expandAllEl.classList.toggle('collapsed');
    });
  }

  // ── Open a toggle section when the URL hash targets it ──────────
  function toggleHash() {
    var id = window.location.hash.slice(1);
    if (!id) return;
    var el = document.getElementById(id) ||
      document.querySelector('a[name="' + id + '"]');
    while (el) {
      if (el.classList.contains('toggle')) {
        var btn = el.querySelector('.toggleButton');
        if (btn) btn.click();
      }
      el = el.parentElement;
    }
  }

  // ── Install page personalisation ─────────────────────────────────
  function personalizeInstallInstructions() {
    var prefix = '?download=';
    var s = window.location.search;
    if (s.indexOf(prefix) !== 0) {
      var isWin = navigator.platform.indexOf('Win') !== -1;
      document.querySelectorAll('.testUnix').forEach(function (el) {
        el.style.display = isWin ? 'none' : '';
      });
      document.querySelectorAll('.testWindows').forEach(function (el) {
        el.style.display = isWin ? '' : 'none';
      });
      return;
    }

    var filename = s.slice(prefix.length);
    var m = /^go1\.\d+(\.\d+)?([a-z0-9]+)?\.([a-z0-9]+)(-[a-z0-9]+)?(-osx10\.[68])?\.([a-z.]+)$/.exec(filename);
    if (!m) return;

    document.querySelectorAll('.downloadFilename').forEach(function (el) {
      el.textContent = filename;
    });
    document.querySelectorAll('.hideFromDownload').forEach(function (el) {
      el.style.display = 'none';
    });

    var os = m[3], ext = m[6];
    if (ext !== 'tar.gz') hide('#tarballInstructions');
    if (os !== 'darwin' || ext !== 'pkg') hide('#darwinPackageInstructions');
    if (os !== 'windows') {
      hide('#windowsInstructions');
      show('.testUnix'); hide('.testWindows');
    } else {
      if (ext !== 'msi') hide('#windowsInstallerInstructions');
      if (ext !== 'zip') hide('#windowsZipInstructions');
      hide('.testUnix'); show('.testWindows');
    }

    var nav = document.getElementById('nav');
    var p = document.createElement('p');
    p.className = 'downloading';
    p.innerHTML = 'Your download should begin shortly. If it does not, click <a href="/dl/' + filename + '">this link</a>.';
    if (nav && nav.parentNode) nav.parentNode.insertBefore(p, nav.nextSibling);

    window.location = '/dl/' + filename;
  }

  function hide(sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.style.display = 'none'; });
  }
  function show(sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.style.display = ''; });
  }

  // ── Go version tag ───────────────────────────────────────────────
  function updateVersionTags() {
    var v = window.goVersion;
    if (v && /^go[0-9.]+$/.test(v)) {
      document.querySelectorAll('.versionTag').forEach(function (el) {
        el.textContent = v;
      });
      document.querySelectorAll('.whereTag').forEach(function (el) {
        el.style.display = 'none';
      });
    }
  }

  // ── Boot ─────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    generateTOC();
    addPermalinks();
    bindToggles('.toggle');
    bindToggles('.toggleVisible');
    bindToggleLinks('.exampleLink', 'example_');
    bindToggleLinks('.overviewLink', '');
    bindToggleLinks('.examplesLink', '');
    bindToggleLinks('.indexLink', '');
    setupInlinePlayground();
    toggleHash();
    personalizeInstallInstructions();
    updateVersionTags();

    // Backward-compat: execute functions pushed by play.js / codewalk.js.
    if (window.initFuncs) {
      window.initFuncs.forEach(function (fn) { fn(); });
    }
  });
})();
