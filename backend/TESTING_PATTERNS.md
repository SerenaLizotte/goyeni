# API Testing Pattern

This document defines the standard, repeatable pattern used for testing every CRUD resource in the Goyeni API (Postman, Vitest, and Playwright). Any new resource (JobPosting, Question, Answer, etc.) should follow this pattern exactly.

## Why a fixed pattern, not a self-healing agent, for API tests

API contracts are structural and deliberate - a route, a request shape, and a response shape are all things a developer explicitly defines and controls. Unlike a UI (where layout, selectors, and visual structure can shift for reasons unrelated to the underlying logic), an API test failure has exactly one of two causes:

1. The API itself has a real bug or an unintentional breaking change - the test caught something that needs fixing in the code.
2. The API's contract was intentionally changed (a field renamed, a new required field added, a status code changed) - the test is now out of date and needs to be updated to match the new, intended contract.

In both cases, the correct response is a human (or PR review) decision, not automatic self-healing. A test that silently "adapts" to a changed API response could mask a real regression. This is why API tests use a fixed, explicit pattern - if a test breaks, that is a signal, not noise.

Self-healing logic is reserved for UI testing (see below), where selectors and layout genuinely can shift for reasons that don't reflect a real product regression (e.g. a CSS class rename, a reordered DOM element) - a fundamentally different problem from API contract testing.

## The Pattern

For any resource (e.g. Candidate, Employer, and future resources like JobPosting):

### 1. Create
- POST the resource with all required fields
- Assert status code 201
- Assert the response includes a generated id
- Assert isActive defaults to true (for soft-deletable resources)
- Assert every submitted field in the response matches exactly what was sent (not just that the field exists)
- Store the created id for use in subsequent tests in the same run

### 2. Get All
- GET the collection endpoint
- Assert status code 200
- Assert the response is an array
- Assert every returned item has isActive: true (since the default list endpoint should exclude disabled records)

### 3. Get By ID
- GET the resource using the stored id from step 1
- Assert status code 200
- Assert the returned id matches the stored id

### 4. Get By ID - Not Found
- GET the resource using a deliberately invalid/nonexistent id
- Assert status code 404
- Assert a clear error message is returned

### 5. Update
- PUT the resource using the stored id, with new field values
- Assert status code 200
- Assert the response reflects the newly submitted values, not the original ones

### 6. Disable (soft delete)
- PATCH the resource's /disable endpoint using the stored id
- Assert status code 200
- Assert isActive is now false

### 7. Confirm Exclusion
- GET the collection endpoint again
- Assert the disabled resource's id is NOT present in the returned list

### 8. Enable
- PATCH the resource's /enable endpoint using the stored id
- Assert status code 200
- Assert isActive is now true

## Dynamic Data Rule (Postman-specific, applies conceptually elsewhere too)

When generating random/dynamic test data (e.g. Postman's {{$randomEmail}}), the value must be resolved exactly once and stored in a variable before being used anywhere else in that request's lifecycle - never referenced as a live dynamic generator in more than one place. A dynamic generator regenerates a new value every time it's resolved, so referencing it in both the request body and a later assertion produces two different values and causes false test failures. Generate once (pre-request script), store it, then reference the stored value consistently in the body and in test assertions.

## Implementations of this pattern

- Postman: backend/postman/Goyeni.postman_collection.json (Candidates and Employers folders)
- Vitest: backend/src/__tests__/candidates.test.ts, employers.test.ts
- Playwright: backend/playwright-tests/candidates.spec.ts, employers.spec.ts

When a new resource is added, copy the structure of the existing Candidate or Employer implementation in each of these three tools rather than designing a new pattern from scratch.
