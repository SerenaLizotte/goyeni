---
layout: post
title: "The Unglamorous Work: Deploying Goyeni to Production"
date: 2026-08-20
---

Today's session had almost nothing to do with writing application code. It was infrastructure, tooling, and the kind of debugging that never makes it into a demo — but it's exactly the work that separates "runs on my machine" from "actually shipped."

## Ruby, before Jekyll could even start

I wanted to set up a proper devlog blog on GitHub Pages, which meant Jekyll, which meant Ruby. macOS ships with a system Ruby (2.6.10) that's old enough to predate most current tooling, and it lives in a directory you don't have permission to write to. `gem install jekyll` failed immediately with a `Gem::FilePermissionError`.

The fix wasn't to force it with `sudo` — that causes its own problems on macOS. It was `rbenv`: install a separate, user-owned Ruby version (3.3.12), scope it to this project specifically with a `.ruby-version` file, and leave the system Ruby untouched. Even then, the first `ruby --version` check still showed the old system Ruby, because the shell had cached the old command location. `hash -r` cleared it.

None of this was hard, exactly. It was just a chain of small, specific problems that each needed to be understood before the next step made sense.

## The backend that ran, but wasn't reachable

Deploying the Express API to Render looked successful — clean build, "Your service is live," logs showing the server had started. But every request to it returned a 404 with a header that gave the real story away: `x-render-routing: no-server`. The process was running. Render's routing layer just couldn't find it.

The cause: `app.listen(PORT, callback)` without an explicit host binds in a way that doesn't reliably reach Render's proxy in a container environment. The fix was one line — binding explicitly to `0.0.0.0` instead of leaving it implicit. Small change, but the kind of thing you only learn by hitting it.

## What "done" actually looked like

By the end of the session: a live backend on Render, a live frontend on Vercel actually talking to that real backend (not `localhost`), and a live Jekyll blog on GitHub Pages documenting all of it. Three separate deployment targets, three separate sets of gotchas, all working together.

The lesson I keep relearning: the parts of building software that take the longest are rarely the parts anyone shows off.