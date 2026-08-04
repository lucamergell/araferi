# Firestore Security Specification & Invariants

## Data Invariants
1. Users collection (`/users/{userId}`):
   - Authenticated users can read user profiles.
   - Users can update their own user profile document.
   - Admins can update any user profile or player statistics.

2. Matches collection (`/matches/{matchId}`):
   - Any authenticated user can read matches.
   - Authenticated users can update matches to join/leave (modifying `joinedUserIds` array and `status`).
   - Admins can create, update, or cancel matches.

3. Payments collection (`/payments/{paymentId}`):
   - Users can read their own payment records, or admins can read all payment records.
   - Authenticated users can create payment records for their own match joins.
   - Admins can update payment records (e.g. status to Refunded).

## Dirty Dozen Payloads Test Matrix
All unauthorized attempts (spoofing user IDs, escalating admin role without permission, writing non-whitelisted fields) return PERMISSION_DENIED.
