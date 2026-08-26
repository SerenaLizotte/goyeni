# Goyeni API Endpoints

Base URL (local): `http://localhost:4000`
Interactive docs (Swagger): `http://localhost:4000/api-docs`

## Health
- `GET /health` — returns `{ status: "ok" }`, confirms server is running

## Candidates
- `POST /candidates/register` — register a new candidate with email, password, first/last name; returns the candidate and a JWT token
- `POST /candidates/login` — log in with email and password; returns the candidate and a JWT token
- `GET /candidates` — returns all active candidates
- `GET /candidates/{id}` — get a candidate by ID (returns regardless of active status)
- `PUT /candidates/{id}` — update a candidate's details (requires `Authorization: Bearer <token>`; candidates can only update their own record)
- `PUT /candidates/{id}/password` — change password, requires current password (requires `Authorization: Bearer <token>`)
- `PATCH /candidates/{id}/disable` — soft-delete (sets isActive to false)
- `PATCH /candidates/{id}/enable` — re-activate a disabled candidate

## Employers

- `GET /employers` — returns all active employers
- `POST /employers` — create an employer
- `GET /employers/{id}` — get an employer by ID (returns regardless of active status)
- `PUT /employers/{id}` — update an employer's details
- `PATCH /employers/{id}/disable` — soft-delete (sets isActive to false)
- `PATCH /employers/{id}/enable` — re-activate a disabled employer

## Job Postings
_Not yet built_

## Questions / Answers
_Not yet built_
