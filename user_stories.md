# User Stories: Cybersecurity Awareness Training Platform

> [!NOTE]
> **Domain Configuration**: The phishing simulation engine will use `terapiaregresion.online` as the sender domain to protect the main institutional reputation.

## 1. Roles & Actors
*   **Student**: End-user who needs to be trained. Accesses the portal to learn and receives simulation emails.
*   **Administrator**: IT Security Staff. Manages content, launches N8n campaigns, and views vulnerability reports.
*   **System (N8n)**: Automated actor that executes campaigns and tracks clicks.

---

## 2. Epics & Stories

### Epic 1: Authentication & Profile (The Gatekeeper)
*Ref: Security Core*

*   **US-1.1**: As a **Student**, I want to log in using my University credentials (mocked or real) so that my progress is tracked individually.
    *   *Acceptance Criteria*:
        *   Login page accepts Email/Password.
        *   Authentication token (JWT) is generated upon success.
        *   Redirects to Dashboard.
*   **US-1.2**: As an **Admin**, I want a separate login permission so that I can access the configuration panel.

### Epic 2: Student Dashboard (The "Health Bar")
*Ref: Frontend/UX*

*   **US-2.1**: As a **Student**, I want to see my "Cyber Risk Score" (0-100%) prominently displayed so I know my vulnerability status.
    *   *Calculation*: Starts at 50%. Completing modules +10%. Clicking phishing links -20%.
*   **US-2.2**: As a **Student**, I want to see a list of "Mandatory Training" modules so I know what I need to complete next.
    *   *UI*: Cards with titles like "Phishing 101", "Password Security". Indicators for [Pending] / [Done].

### Epic 3: Training Modules (The "Classroom")
*Ref: Content Core*

*   **US-3.1**: As a **Student**, I want to watch an embedded educational video (YouTube) inside the platform.
    *   *Constraint*: The "Take Quiz" button must be disabled until the video finishes (YouTube API `onStateChange`).
*   **US-3.2**: As a **Student**, I want to take a 3-question quiz after the video to verify my understanding.
    *   *Acceptance Criteria*: Must score 3/3 to pass. If failed, must retry the quiz.
*   **US-3.3**: As a **System**, I want to lock the module as "Completed" immediately after passing the quiz.

### Epic 4: Phishing Simulation (The "Robot" - N8n)
*Ref: N8n Automation*

*   **US-4.1**: As an **Admin**, I want to trigger a "Campaign" from N8n that sends emails to all registered students using the domain `terapiaregresion.online`.
*   **US-4.2**: As a **System**, when a student clicks the link in a fake email, I want to record the event in the database using a unique ID.
    *   *Flow*: Click -> Webhook -> DB Update (`phishing_fail_count + 1`).
*   **US-4.3**: As a **Student**, if I click a phishing link, I want to be taken to a "Teachable Moment" page that explains what happened, instead of a malicious site.

### Epic 5: Analytics (The "Gradebook")
*Ref: ERP/Reporting*

*   **US-5.1**: As an **Admin**, I want to see a leaderboard or chart showing "Most Vulnerable Departments".
*   **US-5.2**: As an **Admin**, I want to export a list of students who haven't completed the mandatory training.

---

## 3. Data Entities (ERP Developer Style)

To support these stories, we will need the following database schema structure (simplified for MVP):

### `Users`
*   `id` (UUID)
*   `email` (String)
*   `role` (Enum: STUDENT, ADMIN)
*   `risk_score` (Integer)
*   `department` (String)

### `Modules`
*   `id` (UUID)
*   `title` (String)
*   `video_url` (String)
*   `quiz_data` (JSON) - Contains questions and correct answers.

### `Progress`
*   `user_id` (FK)
*   `module_id` (FK)
*   `status` (Enum: PENDING, COMPLETED)
*   `completed_at` (Timestamp)

### `PhishingEvents`
*   `id` (UUID)
*   `user_id` (FK)
*   `campaign_name` (String)
*   `clicked_at` (Timestamp)
