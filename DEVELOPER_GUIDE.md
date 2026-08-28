# Developer Guide

This guide covers everything needed to set up, run, and understand the Goyeni codebase.

## Prerequisites

- Node.js (v20+ recommended)
- npm
- Python 3.10+ (for matching-service, once built)
- Git
- A GitHub account with access to the SerenaLizotte/goyeni repo
- Postman (for API testing)

## Repository Structure

- frontend/ - React + TypeScript app (Vite)
- backend/ - Node + Express API server (Prisma ORM, PostgreSQL)
- matching-service/ - Python + FastAPI service (not yet built)

## Git Identity

This repo uses the SerenaLizotte GitHub account (separate from the sldakin account used for Netakina). If cloning fresh, set the local git identity inside the repo folder:

    git config user.name "Serena Lizotte"
    git config user.email "serena.lizotte@gmail.com"

## Backend Setup

1. Navigate to the backend folder:

       cd backend

2. Install dependencies:

       npm install

3. Create a .env file in backend/ with the following variables:

       DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME"
       DB_PASSWORD="your-db-password-here"
       JWT_SECRET="generate-with-openssl-rand-base64-32"
       PORT=4000

   Note: DATABASE_URL, DB_PASSWORD, and JWT_SECRET are all currently required. DATABASE_URL is used by the Prisma CLI (migrate/push/generate). DB_PASSWORD is used directly by the app itself, since passing the full connection string to the PrismaPg adapter caused persistent authentication errors with our Render Postgres instance. The adapter is configured with individual connection fields (host, user, password, database) instead of a single connection string - see backend/src/index.ts. JWT_SECRET signs and verifies candidate auth tokens - generate one with `openssl rand -base64 32` and use a different value in each environment (local, CI, production).

4. Sync the Prisma schema to the database:

       npx prisma db push
       npx prisma generate

   Note: we use db push instead of migrate dev. Render's free-tier Postgres user does not have superuser privileges, and migrate dev requires creating a temporary shadow database, which fails with a permission error on restricted accounts. db push works fine and does not require shadow database creation. This does mean we do not have formal migration history - worth revisiting if this becomes a team project or moves to a paid database tier with full permissions.

5. Start the dev server:

       npm run dev

   Server runs at http://localhost:4000
   Swagger docs available at http://localhost:4000/api-docs

## Known Setup Gotchas

- Prisma 7 moved the database connection URL out of schema.prisma and into prisma.config.ts. If you see an error about the datasource url field being unsupported, check that prisma.config.ts (not schema.prisma) contains the DATABASE_URL reference.
- ts-node-dev is not compatible with newer TypeScript versions and is no longer maintained. This project uses tsx instead (npm run dev runs tsx watch src/index.ts).
- Our own Express server code does not automatically load .env - only the Prisma CLI does that. The app itself needs import "dotenv/config"; as the very first line in src/index.ts.
- Render Postgres requires SSL. The PrismaPg adapter needs ssl: { rejectUnauthorized: false } passed explicitly.
- verbatimModuleSyntax in tsconfig.json conflicts with "type": "commonjs" in package.json - running npx tsc --noEmit shows 63 pre-existing errors across every backend file (not caused by any specific change) because nothing in the build/test pipeline actually runs a full type-check. This was turned off (verbatimModuleSyntax: false) since it caught nothing real and only added editor noise.
- Express types `req.params.*` as `string | string[]` (to account for repeated route segments), which conflicts with `noUncheckedIndexedAccess` once that value flows into a Prisma call. Fixed with a small `asString()` normalizer at the top of the route file rather than scattering individual guards everywhere the param is used.

## Postman

A Postman collection is maintained at backend/postman/Goyeni.postman_collection.json. Import this directly into Postman (drag and drop into the Import dialog, or File > Import).

### Variable chaining
The collection uses collection variables to chain requests together within a folder:
- baseUrl - defaults to http://localhost:4000
- candidateId / employerId - captured automatically from the Create request's response (post-response script), so subsequent requests (Get by ID, Update, Disable, Enable) act on the same freshly created test record
- newCandidate* / newEmployer* and updatedCandidate* / updatedEmployer* variables - generated once in a pre-request script (using Postman's built-in $random dynamic variables, e.g. $randomEmail, $randomFirstName) and stored as collection variables, so the exact same value is both sent in the request body and used later in test assertions. This two-step pattern (generate once in pre-request, reference the stored variable everywhere else) is required because dynamic variables like {{$randomEmail}} regenerate a new value every time they are resolved - referencing {{$randomEmail}} directly in both the body and a test would produce two different values and cause false test failures.

### Test coverage
Every request in the Candidates and Employers folders has pm.test assertions covering:
- Correct status code
- Response shape / required fields present
- For Create and Update: the response data actually matches what was submitted (not just that some value exists)
- For Disable/Enable: isActive reflects the expected true/false state
- ID chaining: confirms the response id matches the stored candidateId/employerId collection variable

Run the whole Candidates or Employers folder (or the whole collection) via Postman's Run button to execute the full chain and see a pass/fail report.

## API Documentation

Every new endpoint should be documented with an @openapi JSDoc comment block directly above its route handler in src/index.ts - Swagger reads these automatically. Also update backend/ENDPOINTS.md with a plain-language summary whenever endpoints are added or changed.

## Frontend Setup

1. Navigate to the frontend folder:

       cd frontend

2. Install dependencies:

       npm install

3. Start the dev server:

       npm run dev

   Runs at http://localhost:5173

## Deployment (planned, not yet configured)

- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL (currently free tier - has a shadow-database permission restriction noted above; upgrading to a paid tier may resolve this)

## Testing

Unit/integration testing is built and running in CI. Accessibility, security, and performance testing are still planned.

### Unit / Integration Tests (Built)
- Tool: Vitest, with Supertest for HTTP-level testing against the Express app in-process
- The Express app was refactored out of src/index.ts into src/app.ts (which exports the app and the Prisma client) so it can be imported directly into tests without starting a real server. src/index.ts is now just the thin entry point that imports app and calls .listen()
- Test files live in src/__tests__/ - currently health.test.ts, candidates.test.ts, and employers.test.ts, covering the full CRUD + disable/enable lifecycle for each resource, plus 404 handling on bad IDs
- Run locally with: npm run test (defined as "vitest run" in package.json)
- Known limitation: tests currently run against the real Render database, not a dedicated test database or mocked Prisma client, since a separate test database has not been set up yet. Worth revisiting - see Render free-tier notes above.

### API Tests (Built) - Playwright
- Test files live in backend/playwright-tests/ - health.spec.ts, candidates.spec.ts, employers.spec.ts
- Config: backend/playwright.config.ts - baseURL defaults to http://localhost:4000, overridable via API_BASE_URL env var
- Run locally with: npm run test:playwright (requires the dev server running separately via npm run dev)
- Uses test.describe.serial() per resource file, since each CRUD test depends on the id created in the first test - Playwright parallelizes by default, so this is required to keep the lifecycle in order
- View the HTML report with: npx playwright show-report
- The exact testing approach (what to assert, in what order, and why) is documented separately in backend/TESTING_PATTERNS.md - read that before adding tests for a new resource

### Planned: UI Self-Healing Tests
- Tool: Playwright, extended with a self-healing selector/retry agent, once the frontend has real pages to test
- This is a deliberately different approach from the API tests above: API contracts are structural and should NOT self-heal (a breaking API change is a signal that needs a human decision, not silent adaptation) - see the "Why a fixed pattern, not a self-healing agent" section of TESTING_PATTERNS.md for the full reasoning
- UI layout/selectors genuinely can shift for reasons unrelated to real regressions (a CSS class rename, reordered DOM), which is where self-healing logic is actually the right tool
- This becomes a second flagship self-healing test suite alongside the one already built for Netakina - proof that the skill is a repeatable, generalizable capability, not a one-off

### Accessibility Testing
- Tool: axe-core, via @axe-core/playwright
- Integrates directly into the Playwright E2E suite (no separate tooling needed)
- Catches WCAG violations automatically as part of normal test runs - missing alt text, poor color contrast, missing ARIA labels, keyboard navigation issues

### Security Testing
- Dependency scanning: npm audit (built-in, free) plus GitHub Dependabot enabled on the repo, to catch known vulnerable packages automatically
- API security scanning: OWASP ZAP (free) for automated checks against the running API - SQL injection attempts, auth bypass checks, common attack patterns
- Input validation: every endpoint should validate/sanitize request bodies before hitting the database (not yet implemented - currently relying on Prisma's type safety alone, which is not sufficient on its own)
- Error handling: current dev setup returns full stack traces in API error responses (useful for debugging, but must be locked down before any public/production deployment - should return generic error messages in production and log full details server-side only)

### Performance Testing
- Tool: k6 or Artillery (both free, scriptable)
- Load-test key endpoints (e.g. GET /candidates, POST /candidates) by simulating concurrent users once there is enough built out to make this meaningful
- In the meantime, keep an informal eye on response times as features are added

## CI/CD

### GitHub Actions (Built)
- Workflow: .github/workflows/backend-tests.yml
- Runs both the Vitest suite and the Playwright API suite automatically on every pull request targeting main, and on every push to main
- Requires DATABASE_URL, DB_PASSWORD, and JWT_SECRET as GitHub repository secrets (Settings > Secrets and variables > Actions) - both suites run against the real Render database
- Environment variables must be set at the job level (not just on individual steps) so they are available to every step, including npx prisma generate - this was a real bug we hit and fixed: setting env only on the "Run tests" step caused the earlier "Generate Prisma Client" step to fail with a PrismaConfigEnvError
- Playwright tests need the server actually running (unlike Vitest, which imports the app in-process) - the workflow starts the server in the background (npx tsx src/index.ts &) then uses wait-on to poll /health until it responds before running tests
- vitest.config.ts must explicitly exclude playwright-tests/** - by default Vitest's test discovery picks up any *.spec.ts file, which caused it to try (and fail) to run the Playwright spec files, since @playwright/test isn't a valid import under Vitest's runner
- Playwright must be invoked via an npm script (npm run test:playwright, defined as "playwright test" in package.json), not npx playwright test - npx resolves against a separate global npx cache that may hold a different "playwright" package than the project's local @playwright/test devDependency, causing a "Cannot find module '@playwright/test'" error even though it's correctly installed locally. The same applies to installing browsers: use npm exec playwright install --with-deps chromium, not npx playwright install
- Double-check that @playwright/test actually appears under devDependencies in package.json after installing - in one session it silently failed to persist to package.json despite the install command reporting success locally, which only surfaced as a "playwright: not found" failure in CI

### Branch Protection (Built)
- main is protected: all changes must go through a pull request (Settings > Branches)
- Required status check: the "test" job from backend-tests.yml must pass before a PR can be merged - verified working by intentionally breaking a test and confirming the merge button was blocked
- Required approvals is currently set to 0, since this is a solo project - this should be raised to 1+ once a second contributor (human or agent) is opening PRs, so changes get a real review gate before merging
- "Do not allow bypassing the above settings" is enabled so even repo admins cannot push directly to main

### Planned: Merge Permission Tiers
- Currently solo, so there is no restriction on who can use the "Merge without waiting for requirements to be met (bypass rules)" override on a failing required check
- Once a second contributor (human or agent) is added to the repo, restrict this bypass ability to lead-level/admin roles only via the branch protection rule's allowed-bypass list, so only a designated lead can force a merge past a failing check
- Regular contributors should only be able to merge once required checks pass normally

### Planned: Slack Deploy Notifications
- Once real deployment (Render for backend, Vercel for frontend) is wired up, add a Slack notification that fires when a new build/deploy succeeds on main
- Both Render and Vercel support native Slack integrations for deploy status - this is the simplest path (no custom code needed)
- Goal: get a Slack message whenever a merge to main results in a new live build, so it is immediately visible when a change has shipped

## Standard PR Workflow

1. git checkout -b type/short-description (e.g. feature/job-posting-endpoints, fix/bug-name, docs/update-readme)
2. Make changes, commit, push: git push -u origin type/short-description
3. Open a pull request on GitHub - the Backend Tests check runs automatically
4. Once the check passes, merge the PR (with 0 required approvals currently, since solo)
5. Clean up locally: git checkout main && git pull && git branch -d type/short-description

## Authentication (Built)

Real authentication is live for candidates: bcrypt-style password hashing (via bcryptjs), JWT-based sessions, verified on protected routes.

- Password field (`passwordHash`, required) added to the Candidate model
- `POST /candidates/register` and `POST /candidates/login` replace the old email-lookup flow
- `PUT /candidates/{id}` and `PUT /candidates/{id}/password` require a valid `Authorization: Bearer <token>` header, and check that the token's candidate ID matches the record being modified
- Login and register both return a candidate object (with `passwordHash` stripped out) and a token
- Frontend: the login page is now a Log In / Sign Up toggle; the Account page has a real change-password form requiring the current password
- Used bcryptjs instead of bcrypt - bcrypt needs a native compile step (node-gyp-build) that can silently fail to run on install, which is a real risk on a build server like Render. bcryptjs is pure JavaScript with the same API, nothing to compile.
- JWT_SECRET is required in all three environments: local .env, GitHub Actions secrets, and Render's environment variables. Missing it in any one causes login to fail (500 error) only in that environment - this cost real debugging time since local worked fine while CI failed.
- Employer authentication is not yet built - employers still use the old pattern. Same approach should be applied when that work is picked up.

### Future migration
Once Goyeni has real scale, revisit migrating to an enterprise IAM provider (e.g. Ping Identity) for SSO, MFA, and centralized identity management. Ping Identity has no meaningful free tier and is built for workforce/enterprise identity management, not a natural fit for an early-stage consumer app - building in-house now, with a clear migration path later, is the right sequencing.

## Employment History (Built)

Candidates can add work experience entries directly on their profile - title, employer, start/end dates, city/state, description - shown as a read-only list (styled similar to LinkedIn/Dice) with an Edit toggle that reveals an editable list.

- New `WorkExperience` model, one-to-many from Candidate
- `endDate` is nullable - a blank end date means "currently working here," rendered as "Present," rather than a separate checkbox
- Its own route file (`workExperience.ts`), mounted at `/candidates` alongside the existing candidates router, so the full paths read as `/candidates/{candidateId}/experience` - ownership is checked the same way as every other protected route, by comparing the token's candidate ID to the record being touched
- `GET /candidates/{id}` includes the experience list automatically, ordered most-recent-first
- Frontend uses `react-datepicker` in month/year mode for the date fields, not the native `<input type="month">` - the native browser picker has a real UX flaw (no visible year-navigation arrows; you have to know to click the year text itself to get a year-selection grid), so a proper library was worth the small dependency
- Deleting an entry is immediate (calls the DELETE endpoint right away); adding or editing entries is batched and only persists on Save - either the section's own "Save Experience" button, or the main "Save Profile" button, both of which call the same underlying save function
- Planned for Sprint 3: a "View As Employer" toggle and the actual employer-facing view, so candidates can preview what a recruiter sees before it's live