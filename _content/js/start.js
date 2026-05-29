// Copyright 2024 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

(() => {
  'use strict';

  // ── Step navigation ───────────────────────────────────────────────────────

  const steps = document.querySelectorAll('.js-startStep');
  const stepBtns = document.querySelectorAll('.js-startStepBtn');
  const progressBar = document.querySelector('.js-startProgressInner');
  const TOTAL = steps.length;

  function showStep(n) {
    steps.forEach(s => s.classList.toggle('Start-step--active', +s.dataset.step === n));
    stepBtns.forEach(b => b.classList.toggle('Start-stepBtn--active', +b.dataset.step === n));
    if (progressBar) progressBar.style.width = `${(n / TOTAL) * 100}%`;
    localStorage.setItem('go-start-step', n);
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  // Next / prev buttons inside steps
  document.querySelectorAll('.js-startNextBtn').forEach(btn => {
    btn.addEventListener('click', () => showStep(+btn.dataset.next));
  });
  document.querySelectorAll('.js-startPrevBtn').forEach(btn => {
    btn.addEventListener('click', () => showStep(+btn.dataset.prev));
  });

  // Step nav pills
  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => showStep(+btn.dataset.step));
  });

  // Restore last visited step
  const saved = parseInt(localStorage.getItem('go-start-step') ?? '1', 10);
  if (saved > 1 && saved <= TOTAL) showStep(saved);

  // ── OS detection ──────────────────────────────────────────────────────────

  const osCards = document.querySelectorAll('.js-startOsCard');
  const installSections = {
    mac: document.querySelector('.js-startInstallMac'),
    windows: document.querySelector('.js-startInstallWindows'),
    linux: document.querySelector('.js-startInstallLinux'),
  };

  function showOS(os) {
    osCards.forEach(c => c.classList.toggle('Start-osCard--active', c.dataset.os === os));
    Object.entries(installSections).forEach(([key, el]) => {
      if (el) el.hidden = key !== os;
    });
  }

  osCards.forEach(card => card.addEventListener('click', () => showOS(card.dataset.os)));

  // Auto-detect OS
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('win')) showOS('windows');
  else if (ua.includes('linux')) showOS('linux');
  else showOS('mac');

  // ── Inline playground (multiple instances) ───────────────────────────────

  async function runPlayground(codeEl, outputEl, runBtn) {
    runBtn.disabled = true;
    const orig = runBtn.textContent;
    runBtn.textContent = '⏳ Running…';
    outputEl.hidden = false;
    outputEl.textContent = '';
    outputEl.classList.remove('Start-playgroundOutput--error');

    try {
      const res = await fetch('/_/compile', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'version=2&body=' + encodeURIComponent(codeEl.value),
      });
      const data = await res.json();
      if (data.Errors) {
        outputEl.classList.add('Start-playgroundOutput--error');
        outputEl.textContent = data.Errors;
      } else {
        const events = data.Events || [];
        outputEl.textContent = events.map(e => e.Message).join('') || '(no output)';
      }
    } catch {
      outputEl.classList.add('Start-playgroundOutput--error');
      outputEl.textContent = 'Could not reach the Go playground. Try again.';
    } finally {
      runBtn.disabled = false;
      runBtn.textContent = orig;
    }
  }

  // Wire up every playground block on the page
  document.querySelectorAll('.js-startPlaygroundRun').forEach(runBtn => {
    const block = runBtn.closest('.Start-stepPlayground, .Start-buildCard');
    if (!block) return;
    const codeEl = block.querySelector('.js-startPlaygroundCode');
    const outputEl = block.querySelector('.js-startPlaygroundOutput');
    if (!codeEl || !outputEl) return;

    runBtn.addEventListener('click', () => runPlayground(codeEl, outputEl, runBtn));

    // Shift+Enter shortcut
    codeEl.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault();
        runPlayground(codeEl, outputEl, runBtn);
      }
    });
  });
})();
