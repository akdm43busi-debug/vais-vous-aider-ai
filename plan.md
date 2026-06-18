# Implementation Plan - 90-Day Free Trial & Subscription System

Implementation of a professional subscription system for AKDM ASSOCIATION, including a 90-day free trial for new associations, dashboard tracking, expiration alerts, blocking of new data entry after trial ends, and a Super Admin dashboard for platform-wide metrics.

## Scope Summary
- **90-Day Free Trial:** Automatic assignment of "Essai Gratuit" to new associations.
- **Trial Tracking:** Dashboard display of remaining days with a progress bar.
- **Expiration Logic:**
    - Block data creation (e.g., adding members, recording payments) after expiration.
    - Preserve existing data.
    - Redirect to subscription selection.
- **Subscription Plans:**
    - Découverte: up to 50 members (1500 FCFA/month).
    - Standard: up to 500 members (5000 FCFA/month).
- **Payment Integration Stubs:** Support for Orange, MTN, Moov, Wave.
- **Alert System:** Notifications 7, 3, and 1 day before expiration.
- **Super Admin Dashboard:** View total associations, trials, active/expired statuses, and revenue/commissions.

## Auth & RLS model
**Auth in scope:** no (Using existing local storage based auth logic).
**Model:** no_auth_controlled_write (Simulated backend/storage in `localStorage`).
**RLS strategy:** N/A (Client-side persistence only as per user opt-out).
**Frontend implication:** UI banners and modal blocks when trial expires.

## Migration baseline
**Local migrations in project:** none (Using `localStorage`).
**User confirmed proceed on connected DB:** not_applicable

## Affected Areas
- `src/lib/types.ts`: Update `Association` and `User` types to include subscription details.
- `src/lib/store.ts`: Add logic for trial calculation, subscription status, and mock Super Admin data.
- `src/pages/Dashboard.tsx`: Add the trial countdown and progress bar.
- `src/pages/Auth.tsx`: Ensure new associations get the 90-day trial metadata.
- `src/pages/Subscriptions.tsx`: **New file** for choosing plans and payment methods.
- `src/pages/SuperAdmin.tsx`: **New file** for platform-wide metrics.
- `src/components/Layout.tsx`: Add Super Admin link for specific roles and global notifications.

## Phases

### Phase 1: Data Model & Store Updates
- Update `src/lib/types.ts`:
    - `SubscriptionStatus`: 'trial' | 'active' | 'expired'
    - `SubscriptionPlan`: 'trial' | 'decouverte' | 'standard'
    - Add `subscription` object to `Association` (plan, startDate, endDate, status).
- Update `src/lib/store.ts`:
    - Logic to calculate remaining days.
    - Function `isSubscriptionActive()` to be used across the app to block writes.
    - Mock data for Super Admin dashboard.

### Phase 2: Trial Tracking (Dashboard)
- Modify `src/pages/Dashboard.tsx`:
    - Add a `Card` displaying "Essai gratuit : XX jours restants".
    - Implement a `Progress` bar reflecting the elapsed time in the 90-day window.
    - Show welcome message for new users.

### Phase 3: Subscription & Payment UI
- Create `src/pages/Subscriptions.tsx`:
    - Display "Découverte" and "Standard" plans.
    - Implement mobile money payment selection (Orange, MTN, Moov, Wave).
    - Logic for upgrading the subscription in `localStorage`.

### Phase 4: Expiration & Blocking Logic
- Implement global "Trial Expired" banner/redirect.
- Update creation forms (Members, Contributions, Meetings) to check `isSubscriptionActive()` and show an alert/block submission if expired.
- Implement expiration alerts (7, 3, 1 days) using the `sonner` toast system on login.

### Phase 5: Super Admin Dashboard
- Create `src/pages/SuperAdmin.tsx`.
- Implement metrics for:
    - Total associations.
    - Active vs Expired counts.
    - Revenue/Commission summary.
- Add route in `src/App.tsx`.
- Update `src/components/Layout.tsx` to show the "Super Admin" link (only for 'SUPER_ADMIN' role).

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Implement the entire subscription logic, dashboards, and blocking mechanisms.

**Per-agent instructions:**
### 1. frontend_engineer
- **Phases:** 1, 2, 3, 4, 5
- **Scope:** Implement the 90-day trial system and subscription management.
- **Files:**
    - `src/lib/types.ts` (Update types)
    - `src/lib/store.ts` (Update storage logic)
    - `src/pages/Dashboard.tsx` (Add trial counter)
    - `src/pages/Subscriptions.tsx` (New - Plan selection)
    - `src/pages/SuperAdmin.tsx` (New - Platform metrics)
    - `src/App.tsx` (Routing)
    - `src/components/Layout.tsx` (Navigation & Alerts)
- **Acceptance criteria:**
    - New associations start with 90 days.
    - Dashboard shows remaining days and a progress bar.
    - App prevents adding new data (members/contributions) if trial is expired.
    - User is redirected to or prompted with the subscription page when expired.
    - Super Admin dashboard is accessible and shows correct (mocked) global data.
    - Payment logos/options for Orange, MTN, Moov, Wave are visible in subscription flow.
