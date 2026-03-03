# System Flow & Visual Architecture

## 1. High-Level Architecture
How the pieces talk to each other.

```mermaid
graph TD
    subgraph "Frontend (React)"
        StudentUI[Student Dashboard]
        AdminUI[Admin Dashboard]
    end

    subgraph "Backend (Node.js/Express)"
        API[API Server]
        Auth[Auth Service]
        Webhook[Webhook Receiver]
    end

    subgraph "Database (PostgreSQL)"
        DB[(Users & Progress)]
    end

    subgraph "Automation (N8n)"
        N8nEngine[N8n Workflow Engine]
        Cron[Scheduler]
        EmailNode[Email Sender]
    end

    subgraph "External World"
        StudentEmail[Student Email Inbox]
        SendGrid[SendGrid / SMTP]
        YouTube[YouTube API]
    end

    %% Connections
    StudentUI <--> API
    AdminUI <--> API
    API <--> DB
    
    AdminUI -- "Trigger Campaign" --> API
    API -- "Start Campaign" --> N8nEngine
    
    Cron --> N8nEngine
    N8nEngine -- "Send Emails" --> SendGrid
    SendGrid --> StudentEmail
    
    StudentEmail -- "User Clicks Link" --> Webhook
    Webhook --> DB
```

---

## 2. Student Learning Journey (The "Good" Path)
How a student raises their security score.

```mermaid
sequenceDiagram
    actor Student
    participant UI as React Frontend
    participant API as Backend API
    participant DB as Database
    participant UT as YouTube Embed

    Student->>UI: Log In
    UI->>API: Get Profile
    API->>DB: Fetch Risk Score (e.g. 60%)
    DB-->>UI: Return Score

    Student->>UI: Select "Module 1: Passwords"
    UI->>UT: Play Video
    Note over UI,UT: "Take Quiz" button is DISABLED

    UT-->>UI: Video Ended Event
    UI->>Student: Enable "Take Quiz" Button

    Student->>UI: Submit Answers (1. A, 2. B, 3. A)
    UI->>API: POST /module/complete
    API->>DB: Verify Answers & Update Score (+10%)
    DB-->>UI: Success! New Score: 70%
```

---

## 3. The Phishing Simulation Loop (The "Trap")
How N8n tricks the student and we catch them.

```mermaid
sequenceDiagram
    actor Admin
    participant N8n as N8n "Robot"
    participant Email as SendGrid
    actor Victim as Student
    participant FailPage as Teachable Moment Page
    participant System as Backend/DB

    Admin->>N8n: Trigger "iPhone Giveaway" Campaign
    N8n->>Email: Send spoofed email from "terapiaregresion.online"
    Email->>Victim: Email arrives: "Click to claim iPhone!"
    
    Note right of Victim: The Trap 🪤
    
    alt Student Ignores
        Victim->>Victim: Deletes Email
        Note right of Victim: User Safe (Nothing happens)
    else Student Clicks
        Victim->>System: CLICKS LINK (webhook.com/track/user_123)
        System->>System: Record "FAILED_ATTEMPT" in DB
        System->>System: Risk Score -20%
        System->>FailPage: Redirect User
        FailPage->>Victim: Show "You've been hacked! Here's why..."
    end
```
