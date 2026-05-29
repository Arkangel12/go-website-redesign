// Copyright 2024 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

(() => {
  'use strict';

  const runBtn = document.querySelector('.js-heroPlaygroundRun');
  const codeEl = document.querySelector('.js-heroPlaygroundCode');
  const outputEl = document.querySelector('.js-heroPlaygroundOutput');

  if (!runBtn || !codeEl || !outputEl) return;

  runBtn.addEventListener('click', async () => {
    runBtn.disabled = true;
    runBtn.textContent = '⏳ Running…';
    outputEl.hidden = false;
    outputEl.textContent = '';
    outputEl.classList.remove('Hero-playground-output--error');

    try {
      const res = await fetch('/_/compile', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'version=2&body=' + encodeURIComponent(codeEl.value),
      });
      const data = await res.json();

      if (data.Errors) {
        outputEl.classList.add('Hero-playground-output--error');
        outputEl.textContent = data.Errors;
      } else {
        const events = data.Events || [];
        outputEl.textContent = events.map(e => e.Message).join('') || '(no output)';
      }
    } catch {
      outputEl.classList.add('Hero-playground-output--error');
      outputEl.textContent = 'Could not reach the Go playground. Try again.';
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = '▶ Run';
    }
  });
})();
