# Tasks: Cybersecurity Awareness Training Platform

- [x] Phase 1: Project Scoping & Design <!-- id: 0 -->
    - [x] Create detailed WBS and estimates (`project_estimates.md`) <!-- id: 1 -->
    - [x] Define User Stories & Data Entities (`user_stories.md`) <!-- id: 21 -->
    - [x] Design System Flow & Architecture (`system_flow.md`) <!-- id: 37 -->
    - [x] Create Low-Fi UI Wireframes (Dashboard & Player) <!-- id: 22 -->

- [x] Phase 2: Environment & Infrastructure (The Foundation) <!-- id: 3 -->
    - [x] **Initialize Monorepo** (Frontend + Backend) <!-- id: 4 -->
    - [x] **Database Setup (ERP Standard)**: SQLite for Dev <!-- id: 5 -->
        - [x] Initialize Prisma ORM <!-- id: 39 -->
        - [x] Define `BaseEntity` (id, created_at, updated_at, is_deleted) <!-- id: 40 -->
        - [x] Create `AuditLog` table for security events <!-- id: 41 -->
    - [ ] **Email Infrastructure (Spoofing Setup)**: (Pending DNS access) <!-- id: 23 -->
        - [ ] Verify ownership of `terapiaregresion.online` <!-- id: 24 -->
        - [ ] Configure DNS Records (SPF, DKIM, DMARC) for SendGrid <!-- id: 26 -->

- [/] Phase 3: Backend Core Development (The Gradebook) <!-- id: 7 -->
    - [x] Implement Auth System (JWT + Role Based Access) <!-- id: 8 -->
    - [ ] Develop `TrainingService` (Modules, Progress tracking) <!-- id: 9 -->
    - [ ] Develop `PhishingService` (Webhook listener for N8n) <!-- id: 28 -->
    - [ ] Implement Secure Headers & Rate Limiting (Protección Básica) <!-- id: 42 -->

- [/] Phase 4: Frontend Development (The Classroom) <!-- id: 11 -->
    - [x] **Setup React + Vite + Tailwind** <!-- id: 43 -->
    - [ ] **Auth Pages**: Login UI (Premium Dark Mode) <!-- id: 45 -->
    - [ ] **Student Dashboard**: Risk Score Component & Module List <!-- id: 12 -->
    - [ ] **Module Player**: YouTube Embed + Quiz Logic <!-- id: 13 -->
    - [ ] **Admin Dashboard**: Campaign Trigger & Reporting Table <!-- id: 14 -->

- [ ] Phase 5: Phishing Simulation Engine (The Robot) <!-- id: 29 -->
    - [ ] **N8n Workflow 1: "The Bait"** (Schedule -> HTML Email -> Send) <!-- id: 30 -->
    - [ ] **N8n Workflow 2: "The Hook"** (Webhook Receiver -> Token Validate -> DB Update) <!-- id: 33 -->
    - [ ] Configure `terapiaregresion.online` assets (Tracking pixel / Redirect Page) <!-- id: 44 -->

- [ ] Phase 6: QA & Delivery <!-- id: 18 -->
    - [ ] Integration Test: Full phishing loop <!-- id: 16 -->
    - [ ] Security Audit: Data Privacy Check <!-- id: 17 -->
    - [ ] Deployment (VPS/Cloud) <!-- id: 19 -->
