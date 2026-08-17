# Goyeni API Endpoints

Base URL (local): `http://localhost:4000`
Interactive docs (Swagger): `http://localhost:4000/api-docs`

## Health
- `GET /health` — returns `{ status: "ok" }`, confirms server is running

## Candidates
- `GET /candidates` — returns all active candidates
- `POST /candidates` — create a candidate
- `GET /candidates/{id}` — get a candidate by ID (returns regardless of active status)
- `PUT /candidates/{id}` — update a candidate's details
- `PATCH /candidates/{id}/disable` — soft-delete (sets isActive to false)
- `PATCH /candidates/{id}/enable` — re-activate a disabled candidate

## Employers
_Not yet built_

## Job Postings
_Not yet built_

## Questions / Answers
_Not yet built_
