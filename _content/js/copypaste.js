(() => {
  'use strict';

  function copyToClipboard(text) {
    if (typeof navigator?.clipboard?.writeText !== 'function') return;
    navigator.clipboard.writeText(text);
  }

  // Handle existing .CopyPaste buttons (install commands etc.)
  for (const btn of document.querySelectorAll('.CopyPaste button')) {
    btn.addEventListener('click', () => {
      const content = btn?.previousElementSibling?.textContent ?? '';
      const text = content.substring(content?.[0] === '$' ? 1 : 0);
      copyToClipboard(text);
    });
  }

  // Inject copy buttons on all <pre> blocks that aren't already wrapped.
  for (const pre of document.querySelectorAll('pre')) {
    if (pre.closest('.CopyPaste') || pre.closest('.js-codeCopyWrapper')) continue;
    if (pre.closest('.Hero-playground-output')) continue;

    const wrapper = document.createElement('div');
    wrapper.className = 'js-codeCopyWrapper';
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    const btn = document.createElement('button');
    btn.className = 'js-codeCopyBtn';
    btn.textContent = 'Copy';
    btn.setAttribute('aria-label', 'Copy code to clipboard');
    btn.addEventListener('click', () => {
      copyToClipboard(pre.textContent ?? '');
      btn.textContent = 'Copied!';
      btn.classList.add('js-codeCopyBtn--copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('js-codeCopyBtn--copied');
      }, 2000);
    });
    wrapper.appendChild(btn);
  }
})();
