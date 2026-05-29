// doc-nav.js — populates the left sidebar on /doc/ pages with a static
// navigation tree and a client-side filter input.
(function () {
  'use strict';

  var NAV = [
    { label: 'Getting Started', children: [
      { label: 'Install Go',           url: '/doc/install' },
      { label: 'Tutorial: Hello World', url: '/doc/tutorial/getting-started' },
      { label: 'How to write Go code', url: '/doc/code' },
    ]},
    { label: 'Learning', children: [
      { label: 'A Tour of Go',      url: '/tour/' },
      { label: 'Effective Go',      url: '/doc/effective_go' },
      { label: 'Go by Example',     url: 'https://gobyexample.com' },
      { label: 'Common Mistakes',   url: '/doc/common-mistakes' },
    ]},
    { label: 'Using Go', children: [
      { label: 'Managing dependencies', url: '/doc/modules/managing-dependencies' },
      { label: 'Module reference',      url: '/doc/modules/gomod-ref' },
      { label: 'Go Modules Blog',       url: '/blog/using-go-modules' },
      { label: 'Workspace mode',        url: '/doc/modules/workspaces' },
      { label: 'cgo',                   url: '/doc/cmd/cgo' },
    ]},
    { label: 'References', children: [
      { label: 'Language Specification', url: '/ref/spec' },
      { label: 'Standard library',       url: 'https://pkg.go.dev/std' },
      { label: 'Command reference',      url: '/doc/cmd' },
      { label: 'Go assembler',           url: '/doc/asm' },
    ]},
    { label: 'Tools', children: [
      { label: 'Diagnostics',  url: '/doc/diagnostics' },
      { label: 'Data race detector', url: '/doc/articles/race_detector' },
      { label: 'Profiling (pprof)',   url: '/blog/pprof' },
      { label: 'GC guide',           url: '/doc/gc-guide' },
      { label: 'Fuzzing',            url: '/doc/fuzz/' },
    ]},
    { label: 'Release Notes', children: [
      { label: 'Go 1.24', url: '/doc/go1.24' },
      { label: 'Go 1.23', url: '/doc/go1.23' },
      { label: 'Go 1.22', url: '/doc/go1.22' },
      { label: 'Go 1.21', url: '/doc/go1.21' },
      { label: 'All releases', url: '/doc/devel/release' },
    ]},
    { label: 'Contributing', children: [
      { label: 'Contributing to Go', url: '/doc/contribute' },
      { label: 'Security policy',    url: '/doc/security/policy' },
      { label: 'Security model',     url: '/doc/security/model' },
    ]},
  ];

  function currentPath() {
    var p = window.location.pathname;
    // Strip /go.dev/ prefix used in local dev server.
    return p.replace(/^\/go\.dev/, '');
  }

  function buildNav(items, searchEl) {
    var nav = document.querySelector('.js-docNav');
    if (!nav) return;

    var currentUrl = currentPath();
    var ul = document.createElement('ul');
    ul.className = 'DocNav-list';

    items.forEach(function (section) {
      var li = document.createElement('li');
      li.className = 'DocNav-section';

      var btn = document.createElement('button');
      btn.className = 'DocNav-sectionBtn';
      btn.textContent = section.label;
      btn.setAttribute('aria-expanded', 'true');

      var child = document.createElement('ul');
      child.className = 'DocNav-children';

      var hasActive = false;
      section.children.forEach(function (item) {
        var childLi = document.createElement('li');
        childLi.className = 'DocNav-item';

        var a = document.createElement('a');
        a.href = item.url;
        a.textContent = item.label;
        a.className = 'DocNav-link';

        // Mark active page.
        var itemPath = item.url.replace(/^https?:\/\/[^/]+/, '');
        if (currentUrl === itemPath || currentUrl === itemPath + '/') {
          a.classList.add('DocNav-link--active');
          a.setAttribute('aria-current', 'page');
          hasActive = true;
        }

        childLi.appendChild(a);
        child.appendChild(childLi);
      });

      btn.addEventListener('click', function () {
        var expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        child.hidden = expanded;
      });

      li.appendChild(btn);
      li.appendChild(child);
      ul.appendChild(li);
    });

    nav.appendChild(ul);

    // Client-side filter.
    if (searchEl) {
      searchEl.addEventListener('input', function () {
        var q = searchEl.value.trim().toLowerCase();
        nav.querySelectorAll('.DocNav-item').forEach(function (item) {
          var text = item.textContent.toLowerCase();
          item.hidden = q !== '' && !text.includes(q);
        });
        // Show all sections while filtering.
        nav.querySelectorAll('.DocNav-children').forEach(function (ul) {
          if (q !== '') {
            ul.hidden = false;
          }
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sidebar = document.querySelector('.js-docSidebar');
    if (!sidebar) return;

    var searchEl = sidebar.querySelector('.js-docSearch');
    buildNav(NAV, searchEl);

    // Mobile toggle: show/hide the sidebar.
    var toggleBtn = document.querySelector('.js-docMobileToggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('is-open');
      });
      // Close sidebar when clicking outside on mobile.
      document.addEventListener('click', function (e) {
        if (!sidebar.contains(e.target) && e.target !== toggleBtn) {
          sidebar.classList.remove('is-open');
        }
      });
    }
  });
})();
