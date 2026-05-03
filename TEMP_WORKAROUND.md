# Temporary Workaround — Wallet Role Separation

Until the schema change is approved and applied by the Integration Group,
the following temporary approach is in use.

## Approach: User ID Offset Strategy

Since the `wallets` table only supports lookup by `user_id`, and the platform
assigns the same numeric ID to both a client and freelancer persona, we
use an ID offset convention in the application layer:

- **Client** wallet is stored and looked up with `user_id = userId` (unchanged)
- **Freelancer** wallet is stored and looked up with `user_id = userId + 100000`

### Example
| Role       | Actual user_id | Effective wallet user_id |
|------------|---------------|--------------------------|
| client     | 1             | 1                        |
| freelancer | 1             | 100001                   |
| admin      | 1             | 1 (same as client)       |

### Implementation Details

**Backend (`wallets.service.ts`)**
- `getEffectiveUserId(userId, role)` applies the offset
- All wallet lookups and creations go through this helper
- The offset is `100000` to avoid collisions with real user IDs

**Backend (`wallets.controller.ts`)**
- `GET /wallets/user/:userId` now requires `?role=` query param or `x-user-role` header
- `POST /wallets/fund` now requires `role` in the body or `x-user-role` header

**Frontend (`api.js`)**
- All wallet API calls now include `role` query param and `x-user-role` header

## ⚠️ This is a TEMPORARY workaround only
The Integration Group must apply the schema change in `SCHEMA_CHANGE_REQUEST.md`
as soon as possible. Once the `user_role` column is added to the `wallets` table,
this offset logic should be removed and replaced with a proper column-based lookup.

## Services that look up wallets by user_id (all updated)
- `wallets.service.ts` — `findByUser`, `fund`
- `escrow.service.ts` — `fund()` line 86: `findOne(Wallet, { where: { user_id: escrow.client_user_id } })`
- `withdrawals.service.ts` — `approve()` line 75: `findOne(Wallet, { where: { user_id: withdrawal.user_id } })`
- `milestone-payments.service.ts` — `release()` line 84: `findOne(Wallet, { where: { user_id: escrow.freelancer_user_id } })`
- `refunds.service.ts` — `approve()` line 67: `findOne(Wallet, { where: { user_id: refund.requested_by } })`
