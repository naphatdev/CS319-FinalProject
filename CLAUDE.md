# CS319 Final Project: Community Issue Reporting ("แจ้งปัญหาชุมชน")

## Teaching mode (read first)

The student is learning to build this project themselves. The course rules allow AI chat to explain each part, but do NOT allow an AI agent to edit or write the code for them.

- Do not create or edit project code files for the student. Explain, review what they paste, point out bugs, and answer questions.
- Teach step by step: tell them which file to create, what to type, and why. Wait for them to report back before moving on.
- The student is Thai. Reply in Thai unless asked otherwise.
- Terminology: keep technical terms, commands and paths exact.
- Editing this CLAUDE.md or other documentation is fine.

## Assignment summary

- Group of 3 to 5 students (this group has 3). Topic: web app with community and social impact.
- Phase 1 (due 2026-11-23 23:59): about 50% of the system. Frontend, Backend and online Database must run together. Main pages fetch real data from a REST API with TanStack Query, routing with React Router v7, DB models and seed data, slide deck, live demo. Be ready to run and explain code in class.
- Final: full CRUD, zero-refresh UI, video presentation where every member explains their own part.
- Submit: `final_phase1_<student id>.zip` (no `node_modules`, no `dist`), screenshots of every page, DB schema image, slides, Git link (optional), website link (optional).
- Grading rubric (20 points): video/demo 3.5, completeness 3.5, state management 2.5, API and DB 2.5, TypeScript 2.0, structure 2.0, UI/UX 2.0, code quality and features 2.0.
- Source PDFs are in this folder: `Assignment Final project.pdf` and `FinalProject สัดส่วนคะแนน 20 คะแนน.pdf`.

## Tech stack (required)

- Frontend (`client/`): Vite, React, TypeScript, React Router v7, Zustand (client/UI state only), TanStack Query (server cache), Tailwind CSS + DaisyUI.
- Backend (`server/`): Node, Express, TypeScript, cors, dotenv, `express.json()`.
- Database: PostgreSQL on Supabase, accessed through Prisma ORM (schema, Prisma Migrate, type-safe client, PK, FK, `@@unique`).
- Seed: `prisma/seed.ts` with at least 40 records.
- No `any`, no `@ts-ignore`. Zustand must not duplicate DB data.

## Project idea

Community problem reports (power outage, broken roads, flooding, garbage). Users can register and log in, report a problem, vote once per report (toggle), and bookmark. Admins can change report status and delete reports.

Models: `User` (role USER or ADMIN), `Category`, `Report` (status PENDING, IN_PROGRESS, RESOLVED; severity LOW, MEDIUM, HIGH), `Vote` with `@@unique([userId, reportId])`.

## Folders

- `client/` and `server/` (project root): a complete working reference version, written earlier with AI help. Use it only to compare against or to explain concepts. It is not the student's own work.
- `my-project/`: the student's own build, started from scratch. Teaching happens here.

Reference version layout:

- `server/prisma/` (`schema.prisma`, `seed.ts`, `migrations/`), `server/src/` (`routes`, `controllers`, `validators`, `middleware`, `lib`, `types`)
- `client/src/` (`api` for http and queries, `components`, `pages`, `stores`, `types`)

## How to run (reference version)

1. `server/.env` (not in git; copy from `server/.env.example`) needs `DATABASE_URL` (Supabase pooler, port 6543, `?pgbouncer=true`), `DIRECT_URL` (session pooler, port 5432), `JWT_SECRET`, `PORT=4000`, `CLIENT_ORIGIN=http://localhost:5173`. The password is secret: never commit it and never put it in chat.
2. In `server/`: `npm install`, `npx prisma generate`, `npx prisma migrate dev`, `npm run seed`, `npm run dev` (API on http://localhost:4000/api).
3. In `client/`: `npm install`, `npm run dev` (http://localhost:5173, Vite proxies `/api` to port 4000).
4. Test accounts created by the seed: admin `admin@example.com` / `admin1234`, user `somchai@example.com` / `password123`.

Notes: Prisma is pinned to v6 and React Router to v7 on purpose (the assignment requires v7). Running `npx prisma migrate reset` deletes all data in the shared Supabase DB, so ask the student first.

## Teaching progress (my-project)

Plan:

1. Set up `server/` (Express + TypeScript) with `/api/health`. In progress: the student ran `npm init`, installed packages, and has `package.json`; the next things to confirm are `tsconfig.json`, `src/index.ts` and `npm run dev`.
2. Prisma + Supabase: write `schema.prisma`, migrate.
3. Seed 40 records.
4. API: routes and controllers (read endpoints first).
5. Set up `client/` (Vite, React, Tailwind, DaisyUI).
6. Router + TanStack Query to fetch and display data.
7. Zustand (bookmarks and filters, persisted).
8. Auth, voting, report form, admin page.
9. Then: screenshots, schema image, slides, ZIP.

Update this section when a step is completed.
