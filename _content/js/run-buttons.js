// run-buttons.js — adds an "Open in Playground" button to code blocks
// on doc pages. Only activates on <pre><code> blocks that contain
// Go code (detected by the presence of "package" or "func ").
(function () {
  'use strict';

  var PLAY_URL = 'https://go.dev/play/';

  function looksLikeGo(code) {
    return /\bpackage\s+\w/.test(code) || /\bfunc\s+\w/.test(code);
  }

  function addButton(pre) {
    var code = pre.querySelector('code');
    var src = code ? code.textContent : pre.textContent;
    if (!looksLikeGo(src)) return;

    // Avoid duplicate buttons.
    if (pre.querySelector('.RunBtn')) return;

    var btn = document.createElement('button');
    btn.className = 'RunBtn';
    btn.setAttribute('aria-label', 'Open in Go Playground');
    btn.innerHTML =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M8 5v14l11-7z"/></svg>' +
      ' Run';

    btn.addEventListener('click', function () {
      var form = document.createElement('form');
      form.method = 'POST';
      form.action = PLAY_URL;
      form.target = '_blank';
      form.style.display = 'none';

      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'code';
      input.value = src;
      form.appendChild(input);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    });

    // Wrap pre in a relative-positioned container so the button can be
    // absolutely positioned in the top-right corner.
    if (!pre.parentElement.classList.contains('CodeWrapper')) {
      var wrapper = document.createElement('div');
      wrapper.className = 'CodeWrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
    }
    pre.parentElement.appendChild(btn);
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Only activate on /doc/ pages and /practice/ pages.
    var path = window.location.pathname.replace(/^\/go\.dev/, '');
    if (!path.startsWith('/doc/') && !path.startsWith('/practice/')) return;

    document.querySelectorAll('pre').forEach(addButton);
  });
})();
