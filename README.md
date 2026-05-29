# Go website

[![Go Reference](https://pkg.go.dev/badge/golang.org/x/website.svg)](https://pkg.go.dev/golang.org/x/website)

This repo holds content and serving programs for the go.dev and golang.org web sites.

Content is in \_content/ (go.dev) and tour/ (go.dev/tour).
Server code is in cmd/ and internal/.

## Running locally

Requirements: Go 1.25+ (per `go.mod`) and an internet connection (Google Fonts are
loaded from a CDN — without internet the typography falls back to the
system stack).

Start the combined go.dev+golang.org server:

    go run ./cmd/golangorg

Then open <http://localhost:6060/>. The root path redirects to
`/go.dev/`, where the redesigned content lives. To use a different
port, pass `-http`:

    go run ./cmd/golangorg -http=:8891

No build step is needed: HTML/CSS/JS in `_content/` is served
directly, and TypeScript files are transformed on the fly.

The supporting programs cmd/admingolangorg and cmd/googlegolangorg
are the servers for admin.golang.org and google.golang.org.
(They do not use the \_content/ directories.)

Each command directory has its own README.md explaining deployment.

## Redesign (this fork)

This fork ships a redesigned go.dev with a dark-first, terminal-inspired
aesthetic. The diff vs. upstream lives entirely in `_content/` and
`cmd/golangorg/testdata/screentest/` — server code is untouched.

**New pages**

- `/` — new homepage (`_content/index.html`) with Hero, Trusted-by
  logos, Why-Go pillars, Use Cases grid, Benchmark chart, and Install
  CTA. Replaces the previous Markdown homepage.
- `/learn` — new HTML landing page (`_content/learn/index.html`),
  replaces `learn/index.md`.
- `/start/` — new "getting started" section with language-switch
  guides: `from-dart`, `from-java`, `from-javascript`, `from-python`.
- `/practice/` — new hands-on examples: `cli-tool`,
  `concurrent-worker`, `rest-api`.

**Design system**

`_content/css/styles.css` adds a token layer (`--ds-bg`, `--ds-surface`,
`--ds-text`, `--ds-teal`, etc.) with light defaults and a
`[data-theme='dark']` / `prefers-color-scheme: dark` override, plus
component styles for `HomeHero`, `HomePillars`, `HomeUC`, `HomeBench`,
`HomeCTA`, `HomeInstall`, and a code-terminal surface used in the hero.
Typography uses Space Mono and DM Sans (Google Fonts), with Fragment
Mono for inline code.

**New JS modules** (in `_content/js/`)

- `hero-playground.js` — animates the hero's mock terminal
- `doc-nav.js` — sticky doc-page navigation
- `run-buttons.js` — interactive "Run" buttons on code blocks
- `learn-filter.js` — filters on the `/learn` page
- `start.js` — platform switch on the install CTA
- `web-vitals.js` — Core Web Vitals reporting

The site template (`_content/site.tmpl`) was updated to load the new
fonts and script tags. `_content/menus.yaml` adds `/start` to the
top-level nav. Screentest goldens at
`cmd/golangorg/testdata/screentest/godev.txt` are refreshed.

## JS/TS/CSS Formatting

This repository uses [eslint](https://eslint.org/) to format JS and TS files,
and [stylelint](https://stylelint.io/) to format CSS files.

See also:

- [CSS](https://go.dev/wiki/CSSStyleGuide)
- [JavaScript](https://google.github.io/styleguide/jsguide.html)
- [TypeScript](https://google.github.io/styleguide/tsguide.html)

It is encouraged that all JS, TS, and CSS code be run through formatters before
submitting a change. However, it is not a strict requirement enforced by CI.

### Installing npm Dependencies:

1. Install [docker](https://docs.docker.com/get-docker/)
2. Create a .gitignore file at repo root
3. Add .gitignore and node_modules to .gitignore
4. Run `./npm install`

### Run ESlint

    ./npx eslint [options] [file] [dir]

### Run Stylelint

    ./npx stylelint [input] [options]

## TypeScript Support

TypeScript files served from _content are transformed into JavaScript.
Reference .ts files in html templates as module code.

  `<script type="module" src="/ts/filename.ts">`

Write unit tests for TypeScript code using the [jest](https://jestjs.io/)
testing framework.

### Run Jest

    ./npx jest [TestPathPattern]

## Deploying

Each time a CL is reviewed and submitted, the code is deployed to App Engine.
See [cmd/golangorg/README.md](cmd/golangorg/README.md#deploying-to-go_dev-and-golang_org) for details.

## Report Issues / Send Patches

This repository uses Gerrit for code changes. To learn how to submit changes to
this repository, see https://go.dev/doc/contribute.

The git repository is https://go.googlesource.com/website.

The main issue tracker for the website repository is located at
https://go.dev/issues. Prefix your issue with "x/website:" in the
subject line, so it is easy to find.
