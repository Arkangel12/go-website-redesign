// Copyright 2021 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// ── Terminal code snippets ────────────────────────────────────
var SNIPPETS = {
  hello: [
    '<span class="t-line"><span class="t-comment">// concurrent HTTP server in ~20 lines</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-keyword">package</span> <span class="t-plain">main</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-keyword">import</span> <span class="t-plain">(</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-string">"fmt"</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-string">"net/http"</span></span>',
    '<span class="t-line"><span class="t-plain">)</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-keyword">func</span> <span class="t-func">handler</span><span class="t-plain">(w http.ResponseWriter, r *http.Request) {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;fmt.<span class="t-func">Fprintf</span><span class="t-plain">(w, </span><span class="t-string">"Hello, %s"</span><span class="t-plain">, r.URL.Path)</span></span>',
    '<span class="t-line"><span class="t-plain">}</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-keyword">func</span> <span class="t-func">main</span><span class="t-plain">() {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;http.<span class="t-func">HandleFunc</span><span class="t-plain">(</span><span class="t-string">"/"</span><span class="t-plain">, handler)</span></span>',
    '<span class="t-line">&nbsp;&nbsp;http.<span class="t-func">ListenAndServe</span><span class="t-plain">(</span><span class="t-string">":8080"</span><span class="t-plain">, </span><span class="t-keyword">nil</span><span class="t-plain">)</span></span>',
    '<span class="t-line"><span class="t-plain">}</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-prompt">$</span> <span class="t-plain">go run main.go</span><span class="t-cursor"></span></span>',
  ],
  goroutines: [
    '<span class="t-line"><span class="t-comment">// spawn 1000 goroutines concurrently</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-keyword">package</span> <span class="t-plain">main</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-keyword">import</span> <span class="t-plain">(</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-string">"fmt"</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-string">"sync"</span></span>',
    '<span class="t-line"><span class="t-plain">)</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-keyword">func</span> <span class="t-func">main</span><span class="t-plain">() {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-keyword">var</span> <span class="t-plain">wg sync.</span><span class="t-type">WaitGroup</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-keyword">for</span> <span class="t-plain">i := </span><span class="t-type">0</span><span class="t-plain">; i &lt; </span><span class="t-type">1000</span><span class="t-plain">; i++ {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;&nbsp;&nbsp;wg.<span class="t-func">Add</span><span class="t-plain">(1)</span></span>',
    '<span class="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-keyword">go func</span><span class="t-plain">(n </span><span class="t-type">int</span><span class="t-plain">) {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-keyword">defer</span> wg.<span class="t-func">Done</span><span class="t-plain">()</span></span>',
    '<span class="t-line">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fmt.<span class="t-func">Println</span><span class="t-plain">(n)</span></span>',
    '<span class="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-plain">}(i)</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-plain">}</span></span>',
    '<span class="t-line">&nbsp;&nbsp;wg.<span class="t-func">Wait</span><span class="t-plain">()</span></span>',
    '<span class="t-line"><span class="t-plain">}</span></span>',
    '<span class="t-line"><span class="t-prompt">$</span> <span class="t-plain">go run main.go</span><span class="t-cursor"></span></span>',
  ],
  channels: [
    '<span class="t-line"><span class="t-comment">// pipeline: generator → square → print</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-keyword">func</span> <span class="t-func">gen</span><span class="t-plain">(nums ...</span><span class="t-type">int</span><span class="t-plain">) &lt;-<span class="t-keyword">chan</span> </span><span class="t-type">int</span><span class="t-plain"> {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;out := <span class="t-func">make</span><span class="t-plain">(<span class="t-keyword">chan</span> </span><span class="t-type">int</span><span class="t-plain">)</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-keyword">go func</span><span class="t-plain">() {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-keyword">for</span><span class="t-plain">, n := </span><span class="t-keyword">range</span><span class="t-plain"> nums { out &lt;- n }</span></span>',
    '<span class="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-func">close</span><span class="t-plain">(out)</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-plain">}()</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-keyword">return</span><span class="t-plain"> out</span></span>',
    '<span class="t-line"><span class="t-plain">}</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-keyword">func</span> <span class="t-func">sq</span><span class="t-plain">(in &lt;-<span class="t-keyword">chan</span> </span><span class="t-type">int</span><span class="t-plain">) &lt;-<span class="t-keyword">chan</span> </span><span class="t-type">int</span><span class="t-plain"> {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;out := <span class="t-func">make</span><span class="t-plain">(<span class="t-keyword">chan</span> </span><span class="t-type">int</span><span class="t-plain">)</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-keyword">go func</span><span class="t-plain">() {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-keyword">for</span><span class="t-plain"> n := </span><span class="t-keyword">range</span><span class="t-plain"> in { out &lt;- n*n }</span></span>',
    '<span class="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-func">close</span><span class="t-plain">(out)</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-plain">}()</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-keyword">return</span><span class="t-plain"> out</span></span>',
    '<span class="t-line"><span class="t-plain">}</span></span>',
    '<span class="t-line"><span class="t-prompt">$</span> <span class="t-plain">go run main.go</span><span class="t-cursor"></span></span>',
  ],
  generics: [
    '<span class="t-line"><span class="t-comment">// generic Map/Filter — Go 1.18+</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-keyword">func</span> <span class="t-func">Map</span><span class="t-plain">[T, U </span><span class="t-type">any</span><span class="t-plain">](s []T, f </span><span class="t-keyword">func</span><span class="t-plain">(T) U) []U {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;out := <span class="t-func">make</span><span class="t-plain">([]U, </span><span class="t-func">len</span><span class="t-plain">(s))</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-keyword">for</span><span class="t-plain"> i, v := </span><span class="t-keyword">range</span><span class="t-plain"> s { out[i] = </span><span class="t-func">f</span><span class="t-plain">(v) }</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-keyword">return</span><span class="t-plain"> out</span></span>',
    '<span class="t-line"><span class="t-plain">}</span></span>',
    '<span class="t-line">&nbsp;</span>',
    '<span class="t-line"><span class="t-keyword">func</span> <span class="t-func">Filter</span><span class="t-plain">[T </span><span class="t-type">any</span><span class="t-plain">](s []T, f </span><span class="t-keyword">func</span><span class="t-plain">(T) </span><span class="t-type">bool</span><span class="t-plain">) []T {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-keyword">var</span><span class="t-plain"> out []T</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-keyword">for</span><span class="t-plain"> _, v := </span><span class="t-keyword">range</span><span class="t-plain"> s {</span></span>',
    '<span class="t-line">&nbsp;&nbsp;&nbsp;&nbsp;<span class="t-keyword">if</span><span class="t-plain"> </span><span class="t-func">f</span><span class="t-plain">(v) { out = </span><span class="t-func">append</span><span class="t-plain">(out, v) }</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-plain">}</span></span>',
    '<span class="t-line">&nbsp;&nbsp;<span class="t-keyword">return</span><span class="t-plain"> out</span></span>',
    '<span class="t-line"><span class="t-plain">}</span></span>',
    '<span class="t-line"><span class="t-prompt">$</span> <span class="t-plain">go run main.go</span><span class="t-cursor"></span></span>',
  ],
};

window.addEventListener('DOMContentLoaded', function () {
  initTerminal();
  initPlatformSwitcher();
  initBenchmarkBars();
  initPlayground();
});

// ── Terminal tabs ─────────────────────────────────────────────
function initTerminal() {
  var terminal = document.querySelector('.js-terminal');
  if (!terminal) return;
  var body = terminal.querySelector('.js-terminalBody');
  var tabs = terminal.querySelectorAll('.Terminal-tab');

  function show(key) {
    var lines = SNIPPETS[key];
    if (!lines) return;
    body.innerHTML = lines.join('');
  }

  show('hello');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      show(tab.dataset.snippet);
    });
  });
}

// ── Platform install switcher ─────────────────────────────────
function initPlatformSwitcher() {
  var pills = document.querySelectorAll('.HomePlatform');
  var cmdEl = document.querySelector('.js-installCmd');
  if (!pills.length || !cmdEl) return;

  pills.forEach(function (pill) {
    pill.addEventListener('click', function () {
      pills.forEach(function (p) { p.classList.remove('is-active'); });
      pill.classList.add('is-active');
      var key = pill.dataset.platform;
      cmdEl.textContent = cmdEl.dataset[key] || '';
    });
  });
}

// ── Benchmark bar animation (trigger on scroll into view) ─────
function initBenchmarkBars() {
  var rows = document.querySelectorAll('.js-benchRow');
  if (!rows.length) return;

  var animated = false;
  function animateBars() {
    if (animated) return;
    animated = true;
    rows.forEach(function (row) {
      var bar = row.querySelector('.HomeBench-bar');
      var pct = row.dataset.bar;
      if (bar && pct) {
        bar.style.width = pct + '%';
      }
    });
  }

  if ('IntersectionObserver' in window) {
    var bench = document.querySelector('.js-bench');
    if (bench) {
      new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) animateBars();
      }, { threshold: 0.2 }).observe(bench);
    }
  } else {
    animateBars();
  }
}

// ── Homepage playground (kept for backward compat) ────────────
function initPlayground() {
  if (window.playground) {
    window.playground({
      'codeEl':        '.js-playgroundCodeEl',
      'outputEl':      '.js-playgroundOutputEl',
      'runEl':         '.js-playgroundRunEl',
      'fmtEl':         '.js-playgroundFmtEl',
      'shareEl':       '.js-playgroundShareEl',
      'shareRedirect': '/play/p/',
      'toysEl':        '.js-playgroundToysEl',
    });
    document.querySelector('.js-playgroundOutputEl pre')
      ?.classList.add('Playground-output');
    var toysEl = document.querySelector('.js-playgroundToysEl');
    if (toysEl) {
      toysEl.value = 'hello.go';
      toysEl.dispatchEvent(new Event('change'));
    }
  } else {
    var pg = document.querySelector('.Playground');
    if (pg) pg.style.display = 'none';
  }
}
