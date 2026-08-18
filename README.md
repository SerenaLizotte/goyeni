# Goyeni

[![Backend Tests](https://github.com/SerenaLizotte/goyeni/actions/workflows/backend-tests.yml/badge.svg)](https://github.com/SerenaLizotte/goyeni/actions/workflows/backend-tests.yml)

A verified, human-first career and hiring marketplace - no AI matching, no algorithmic gatekeeping. Just real people connecting with real opportunities.

## Why Goyeni

Most modern hiring platforms lean on AI to screen, rank, and match candidates. Goyeni takes the opposite approach: every match, every review, every step of the process is human-driven. "Yeni" is Turkish for "new" - this is a new take on hiring, built deliberately without AI in the product experience itself.

## Project Structure

This is a monorepo with three main parts:

- frontend/ - React + TypeScript (Vite)
- backend/ - Node + Express + Prisma + PostgreSQL
- matching-service/ - Python + FastAPI (candidate/job matching logic)

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, TypeScript, Prisma ORM
- Database: PostgreSQL (hosted on Render)
- Matching Service: Python, FastAPI
- API Docs: Swagger (OpenAPI)
- API Testing: Postman (collection included)

## Getting Started

See DEVELOPER_GUIDE.md for full setup instructions.

## API Documentation

- Swagger UI (when backend is running): http://localhost:4000/api-docs
- Endpoint reference: backend/ENDPOINTS.md
- Postman collection: backend/postman/Goyeni.postman_collection.json

## Status

Actively in development. Phase 1 focus: candidate profiles, employer postings, matching engine, and a reusable candidate question bank.

## License

Private - all rights reserved.
