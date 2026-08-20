---
layout: post
title: "Building Goyeni: A Human-First Hiring Platform, Built in the Open"
date: 2026-08-20
---

Goyeni is a career and hiring marketplace with one deliberate constraint: no AI matching, no algorithmic gatekeeping. Every match, every review, every step of the process is human-driven. "Yeni" is Turkish for "new" — this is a new take on hiring, built without AI in the product experience itself.

The irony isn't lost on me: I'm building an anti-AI product using AI-assisted development tools. That's actually the point of this blog.

## Why this blog exists

This is my portfolio project, and I wanted a way to show, not just tell, what it actually looks like to build real, working software using AI tools — including the parts that don't make it into a polished demo: the bugs, the wrong turns, the moments where I pushed back on a suggestion because it was quietly wrong.

Some of what I'll be documenting here:
- Real problems I hit (a broken CSS file that silently contained backend code for who knows how long, file-casing bugs, a CI pipeline that took several rounds to actually work)
- Decisions I made deliberately, and why (why API tests should never "self-heal" past a real data regression, but UI tests can and should)
- What it's actually like working this way day to day, as someone relearning software development after a health setback

## What's built so far

- A full backend API (Node/Express/TypeScript/Prisma/PostgreSQL) with Candidate and Employer resources
- Swagger documentation, a Postman test collection, Vitest unit tests, and Playwright API tests
- Full CI/CD via GitHub Actions, with branch protection and required status checks
- Code coverage reporting on every pull request
- A React frontend with a real login/profile flow and a landing page

More is coming — job postings, the matching engine, a self-healing UI test suite, and eventually deployment.

If you're reading this because you're evaluating me for a role: this is genuinely how I work. Slower in some places than a "just paste the code" approach, on purpose.