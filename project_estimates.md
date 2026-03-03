# Effort Estimation: Cybersecurity Awareness Training Platform

> [!NOTE]
> **Estimation Methodology**: Uses the **Bottom-Up** technique recommended by Kathy Schwalbe for greater accuracy, breaking down backlog tasks into specific activities. A range (Optimistic - Pessimistic) is included to handle uncertainty (Cone of Uncertainty).

## Executive Summary
- **Total Estimated Hours (Average)**: ~240 hours
- **Suggested Duration**: 8 Weeks (Part-time / Small team)
- **Confidence Level**: Medium (Requires prototype validation)

---

## Breakdown of Estimates (WBS)

### Phase 1: Planning & Definition (Weeks 1-2)
*Focus: Scope Clarity to avoid "Scope Creep".*

| Task | Hours (Range) | Justification & Subtasks |
| :--- | :--- | :--- |
| **User Stories Definition** | **12 - 16 h** | Stakeholder meetings, writing acceptance criteria (Gherkin/User Stories). Defining "Happy Path" and edge case flows. |
| **Sitemap & Wireframes** | **20 - 32 h** | Information architecture, Low-fidelity Wireframes (Figma/Sketch) for Dashboard, Player, and Admin. Feedback iteration. |
| **Environment Configuration** | **6 - 10 h** | Repository setup (Monorepo or separate), basic CI/CD, Linters setup (ESLint, Prettier), Docker setup for local DB. |
| **Phase 1 Total** | **38 - 58 h** | |

### Phase 2: Architecture & Backend (Weeks 3-4)
*Focus: Security & Scalability.*

| Task | Hours (Range) | Justification & Subtasks |
| :--- | :--- | :--- |
| **Database Design** | **10 - 14 h** | E-R Modeling (Users, Campaigns, Modules, Attempts). Defining indices for performance and foreign keys. |
| **Authentication (Auth0/JWT)** | **20 - 30 h** | Login, Registration, Password Recovery implementation. Security middleware and Roles (RBAC: Student vs Admin). |
| **Modules & Progress API** | **24 - 40 h** | REST/GraphQL Endpoints. Logic to track video/quiz progress (prevent skipping). Structure for secure media serving. |
| **Phase 2 Total** | **54 - 84 h** | |

### Phase 3: Frontend Development (Weeks 5-6)
*Focus: Usability (UX) and Visual Feedback.*

| Task | Hours (Range) | Justification & Subtasks |
| :--- | :--- | :--- |
| **Dashboard Interface** | **24 - 32 h** | Layout with Reusable Components. Progress charts (Chart.js/Recharts). Responsive Design. |
| **Module Player** | **30 - 45 h** | Complex state logic: Video tracking, Interactive Quiz, progression blocking, partial state saving. |
| **Admin Panel** | **25 - 35 h** | User CRUD, Phishing Campaign Creation (wizard UI), Aggregated reports visualization. |
| **Phase 3 Total** | **79 - 112 h** | |

### Phase 4: Phishing Simulation Engine (Weeks 7-8)
*Focus: Core Feature & Data Integrity.*

| Task | Hours (Range) | Justification & Subtasks |
| :--- | :--- | :--- |
| **Email Template System** | **12 - 18 h** | Simple editor or HTML template selection. Dynamic variable injection (e.g., Student Name). |
| **Tracking Script (The "Catch")** | **16 - 24 h** | Unique token generation per user/email. Lightweight endpoint to capture clicks. Redirection to "You've been hacked (Educational)" page. |
| **Data Integration** | **16 - 24 h** | Asynchronous event processing (Click -> DB -> Admin Notification). Real-time vulnerability calculation. |
| **Phase 4 Total** | **44 - 66 h** | |

---

## Risk Analysis & Contingency (Triple Constraint)

> [!WARNING]
> **Critical Risk: Data Privacy**
> Handling real emails and simulating attacks might be blocked by university spam filters or violate policies if "Allowlisting" is not performed.
> **Mitigation**: Add **20 hours** extra for SMTP relay configuration and regulatory compliance (GDPR/University Policies).

> [!IMPORTANT]
> **Management Recommendation**
> Total estimation is around **215 - 320 hours**.
> To meet the **Week 8** deadline, a pace of ~30-40 hours per week is required (1-2 Full-time people or 3-4 Part-time).
> If budget (resources) is limited, it is suggested to cut the **Admin Panel** (do it via scripts/direct DB initially) to save ~30 hours.

## Next Steps
1. Approve this estimation.
2. Select final stack (Recommendation: **React + Node.js/Express + PostgreSQL** for robustness and TS typing).
3. Start Phase 1: User Stories.
