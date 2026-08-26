---
layout: post
title: "From Mock Login to Real Authentication"
date: 2026-08-25
---

Up to this point, "logging in" on Goyeni meant typing an email and getting a candidate record created for you on the spot — no password, no verification, nothing stopping you from typing in someone else's email and landing in their profile. That was fine for testing routing and layout, but it wasn't real, and it was time to fix that.

## Wiping the slate to do it right

Adding a password field to an existing table full of passwordless test candidates is messy — you either make the field optional forever, or you write migration logic to backfill fake values nobody should trust. Since the only data in the database was test data from earlier sessions, the simpler move was resetting the dev database entirely and making `passwordHash` a required field from day one. `prisma migrate reset` wiped it clean, and the schema stayed simple.

## bcrypt vs bcryptjs

The first attempt at adding password hashing used `bcrypt`, the more commonly recommended package — until `npm install` flagged that its native compile step (`node-gyp-build`) had been skipped. That's a package that needs to compile C++ bindings on install, which is exactly the kind of thing that works fine on a local machine and then fails mysteriously on a build server. Swapped to `bcryptjs` instead: same API, pure JavaScript, nothing to compile, one less way for Render's build to break.

## A pre-existing crack, finally visible

Building the auth middleware surfaced something that had nothing to do with authentication: running `npx tsc --noEmit` for the first time on this project turned up 63 type errors, in every single backend file, including ones that have been running in production for weeks. The cause was a mismatch between `tsconfig.json` (`verbatimModuleSyntax: true`, targeting ECMAScript modules) and `package.json` (`"type": "commonjs"`) — a conflict that was there from the start, just never actually checked, because nothing in the test or build pipeline ran a real type-check. Everything still worked because the actual build tools transpile without fully type-checking. Turning off `verbatimModuleSyntax` cleared it in one line, with zero effect on how anything runs.

## Login/signup, for real this time

The new flow: a toggle between Log In and Sign Up on one page, real password fields, JWTs issued on success and checked on every request that touches a candidate's own data. The backend now refuses to tell you whether a failed login was a wrong password or an email that doesn't exist — same error either way, which is the correct, boring, secure thing to do, and also the reason the old "just try to log in and we'll create you" trick had to go. New candidates now explicitly sign up.

The Account page grew alongside it: a read-only view by default, an "Edit Account" toggle to change your name or email, and a real change-password form that requires your current password — no more disabled "coming soon" placeholder.

## Two copies of the same test file, two copies of the same bug

Both the Vitest suite and the Playwright suite had tests hard-coded against the old passwordless `POST /candidates` endpoint, and once real auth was in, both failed the same way for the same reason. Fixed once, then fixed again in the second file — a good reminder that duplicated test setups mean duplicated maintenance later.

The last surprise was environment-specific: local tests passed, GitHub Actions failed with a 500 on login. `JWT_SECRET` existed locally and nowhere else — not in the CI secrets, not on Render. Added in both places, and the whole pipeline, from a fresh signup to a live login on the production site, finally matched end to end.