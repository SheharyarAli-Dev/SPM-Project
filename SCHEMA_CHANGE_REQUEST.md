# Schema Change Request — Wallet Role Separation

## Requested By
Payment & Escrow Management Module Team (Module 7)

## Problem
The `wallets` table currently has no role column. Users with the same numeric
`user_id` but different roles (client vs freelancer) share the same wallet record.
This causes balance changes for one role to affect the other.

### Current Schema
```sql
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,          -- no role distinction
    currency_code VARCHAR(10) DEFAULT 'USD' NOT NULL,
    available_balance DECIMAL(18,4) DEFAULT 0 NOT NULL,
    held_balance DECIMAL(18,4) DEFAULT 0 NOT NULL,
    reserved_balance DECIMAL(18,4) DEFAULT 0 NOT NULL,
    wallet_status VARCHAR(20) DEFAULT 'active' NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Requested Change
Add the following column to the `wallets` table and update the unique constraint:

```sql
-- Step 1: Add user_role column
ALTER TABLE wallets ADD COLUMN user_role VARCHAR(20) NOT NULL DEFAULT 'freelancer';

-- Step 2: Drop existing unique constraint on user_id (if any)
ALTER TABLE wallets DROP CONSTRAINT IF EXISTS wallets_user_id_key;

-- Step 3: Create composite unique index on user_id + user_role
CREATE UNIQUE INDEX wallets_user_id_role_unique ON wallets(user_id, user_role);
```

## Impact
- This module's wallet lookup logic will be updated to filter by
  `user_id + user_role` instead of `user_id` alone
- No other module's tables are affected
- Existing wallet records will default to `'freelancer'` role
- A new wallet row will need to be created for each existing user_id
  that also operates as a client

## Temporary Workaround (until schema change is approved)
See `TEMP_WORKAROUND.md` for the interim solution currently in use.
