# Implementation Plan - Dashboard & Branding

## Goal
Apply "NODYT" branding (Logo + Green/Black Cyber aesthetic) to the Login page and create the initial Student Dashboard.

## Proposed Changes

### Frontend
#### [MODIFY] [LoginPage.tsx](file:///C:/Users/csarm/Downloads/proyectos/Cybersecurity/client/src/pages/LoginPage.tsx)
- Replace generic Shield icon with `nodyt-logo.png`.
- Update color scheme to NODYT brand (Green/Black).
- Change text "CyberGuard Platform" to "NodytCurity".

#### [NEW] [DashboardPage.tsx](file:///C:/Users/csarm/Downloads/proyectos/Cybersecurity/client/src/pages/DashboardPage.tsx)
- Create new component `DashboardPage`.
- Implement Layout: Sidebar (Navigation) + Main Content.
- **Widgets**:
    - **Risk Score**: Circular progress bar (starts at 50%).
    - **Pending Modules**: List of training cards (e.g., "Phishing Basics").
- **Branding**: Use NODYT logo in Header/Sidebar.

#### [MODIFY] [App.tsx](file:///C:/Users/csarm/Downloads/proyectos/Cybersecurity/client/src/App.tsx)
- Add route `/dashboard` pointing to `DashboardPage`.
- Protect route with `PrivateRoute` wrapper (check for token).

## Verification Plan
### Manual Verification
1.  **Login UI**:
    - Go to `http://localhost:5173/login`.
    - Verify Logo is displayed.
    - Verify Button is Green (NODYT style).
2.  **Dashboard Access**:
    - Log in with `admin@cyber.edu` / `password123`.
    - Verify redirection to `/dashboard`.
    - data is displayed (dummy data for now).
