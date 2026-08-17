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
       PORT=4000

   Note: both DATABASE_URL and DB_PASSWORD are currently required. DATABASE_URL is used by the Prisma CLI (migrate/push/generate). DB_PASSWORD is used directly by the app itself, since passing the full connection string to the PrismaPg adapter caused persistent authentication errors with our Render Postgres instance. The adapter is configured with individual connection fields (host, user, password, database) instead of a single connection string - see backend/src/index.ts.

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

## Postman

A Postman collection is maintained at backend/postman/Goyeni.postman_collection.json. Import this directly into Postman (drag and drop into the Import dialog, or File > Import). It includes a baseUrl collection variable (defaults to http://localhost:4000) and a candidateId variable that gets automatically populated by a post-response script on the Create Candidate request, so subsequent requests (Get by ID, Update, Disable, Enable) can chain off a freshly created test candidate.

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
