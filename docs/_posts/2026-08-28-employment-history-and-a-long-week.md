---
layout: post
title: "Employment History, and Pushing Through a Long Week"
date: 2026-08-28
---

Honest opener: I did not feel like sitting down to work on Goyeni today. It had been a long week, and the pull to just close the laptop was strong. But goals don't hit themselves, so here we are - and it turned into a genuinely productive session once I got going.

## Finishing what got deferred

Profile got the same read/edit toggle Account picked up a few sessions back - a read-only view by default, an explicit Edit button, rather than an always-open form. While I was in there, I found and fixed a real bug: `ProfileRoute`'s save function was never updated when `PUT /candidates/{id}` got protected with authentication, so saving your profile had been silently failing (401, no visible error) since the day real auth shipped. The fix was one line - adding the missing `Authorization` header - but the actual lesson is the habit: when a route gets protected, grep the whole frontend for every call to it, not just the ones already open in the same change.

A smaller one alongside it: logging in, going back to the homepage, and clicking "I'm a Job Seeker" again was sending already-logged-in candidates back to the login screen instead of straight to their dashboard. The landing page's routing never checked for an existing session. Now it does.

## Building employment history

The bigger piece: candidates can now add work experience entries directly on their profile - title, employer, dates, city/state, a description - styled as a read view similar to LinkedIn or Dice, with an editable list behind an Edit toggle.

New `WorkExperience` model, tied to Candidate, with its own set of authenticated endpoints (create, update, delete) mounted alongside the existing candidate routes. Ownership is checked the same way as everything else auth-protected: the token's candidate ID has to match the record being touched.

This one had a genuinely rough middle. At one point an edit meant to add a database `include` clause landed in the wrong function entirely - it got pasted into the middle of the `/register` handler instead of the separate `GET /:id` handler further down, silently deleting the password-hashing and candidate-creation logic in the process and leaving a mismatched brace that took a few rounds of "just give me the whole file" to actually track down. A good reminder that when something looks structurally wrong, the fastest fix is reading the real file directly rather than guessing at a patch.

Once that settled, there was a real TypeScript puzzle: Express types route params as `string | string[]`, to account for the (rare) case of repeated route segments, and that ambiguity was leaking into every Prisma call that touched `req.params`. A small `asString()` normalizer at the top of the file cleared it in one place instead of scattered guards everywhere.

## The date picker detour

First pass used the native browser `<input type="month">` - no library, built into HTML, seemed like the obviously simple choice. It turned out to have a genuinely bad year-navigation UX: no visible arrows, you have to know to click directly on the year text to get a year-selection grid. Not a bug, just a known rough edge of that native control. Swapped to `react-datepicker` in month/year mode instead - visible prev/next arrows, closer to what a resume-building tool should feel like.

## What's next

A "View As Employer" toggle and the actual employer-facing view are queued for Sprint 3 - candidates should be able to preview exactly what a recruiter sees before it's live. For now, employment history ships, and honestly, getting through this session at all felt like its own small win.

As I finish up my work for the day, I realize that I indeed, am not a UX designer.