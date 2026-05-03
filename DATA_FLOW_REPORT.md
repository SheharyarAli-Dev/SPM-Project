# DATA FLOW REPORT — Payment & Escrow Management Module (Module 7)

> **Generated:** Auto-audit from full codebase read  
> **Backend:** NestJS 11 + TypeORM 0.3 + PostgreSQL  
> **Frontend:** Next.js 16 + React 19  
> **Backend Port:** 3001 | **Frontend Port:** 3000

---

## Table of Contents

1. [Inbound Data (API Endpoints)](#1-inbound-data-api-endpoints)
2. [Outbound Data (External API Calls)](#2-outbound-data-external-api-calls)
3. [Database Tables & Schema](#3-database-tables--schema)
4. [Frontend API Calls](#4-frontend-api-calls)
5. [Notification & Event Outputs](#5-notification--event-outputs)
6. [Data Type Inventory](#6-data-type-inventory)
7. [Issues & Recommendations](#7-issues--recommendations)

---

## 1. Inbound Data (API Endpoints)

### 1.1 Escrow — `EscrowController` (`/escrow`)

| # | Method | Route | Body / Params | Guard | Service Method | Response | Status Codes |
|---|--------|-------|---------------|-------|----------------|----------|-------------|
| 1 | `GET` | `/escrow` | — | — | `findAll()` | `Escrow[]` | 200 |
| 2 | `GET` | `/escrow/:id` | `id: string` (param) | — | `findOne(+id)` | `Escrow` | 200, 404 |
| 3 | `GET` | `/escrow/project/:projectId` | `projectId: string` (param) | — | `findByProject(+projectId)` | `Escrow[]` | 200 |
| 4 | `POST` | `/escrow` | `{ project_id: number, client_user_id: number, freelancer_user_id: number, currency_code: string, total_amount: number }` | `OwnershipGuard` | `create(body)` | `Escrow` | 201, 403 |
| 5 | `POST` | `/escrow/:id/fund` | `{ amount: number }` + `x-user-id` header | `OwnershipGuard` | `fund(+id, body.amount)` | `Escrow` | 200, 403, 404 |
| 6 | `POST` | `/escrow/:id/freeze` | — + `x-user-id` header | `OwnershipGuard` | `freeze(+id)` | `Escrow` | 200, 403, 404 |
| 7 | `POST` | `/escrow/:id/close` | — + `x-user-id` header | `OwnershipGuard` | `close(+id)` | `Escrow` | 200, 403, 404 |

**Implementation Notes:**
- `fund()` adds `body.amount` to `funded_amount`, sets status to `'active'` and `funded_at` to `new Date()`.
- `freeze()` sets `escrow_status` to `'frozen'`.
- `close()` sets `escrow_status` to `'completed'` and `closed_at` to `new Date()`.
- Guard validates `x-user-id` header but service-level ownership check only verifies the user exists in body for create; fund/freeze/close find by ID only.

---

### 1.2 Transactions — `TransactionsController` (`/transactions`)

| # | Method | Route | Body / Params | Guard | Service Method | Response | Status Codes |
|---|--------|-------|---------------|-------|----------------|----------|-------------|
| 1 | `GET` | `/transactions` | `wallet_id: string` (query) | — | `findAll(+wallet_id)` | `Transaction[]` | 200 |
| 2 | `GET` | `/transactions/:id` | `id: string` (param) | — | `findOne(+id)` | `Transaction` | 200, 404 |

**Implementation Notes:**
- `findAll()` filters by `wallet_id` query param.
- No POST endpoint exists — transactions are read-only from the API. ⚠️ *No way to create transactions via REST.*

---

### 1.3 Wallets — `WalletsController` (`/wallets`)

| # | Method | Route | Body / Params | Guard | Service Method | Response | Status Codes |
|---|--------|-------|---------------|-------|----------------|----------|-------------|
| 1 | `GET` | `/wallets/user/:userId` | `userId: string` (param) + `x-user-id` header | `OwnershipGuard` | `findByUser(+userId)` | `Wallet` | 200, 403, 404 |
| 2 | `POST` | `/wallets/fund` | `{ user_id: number, amount: number }` + `x-user-id` header | `OwnershipGuard` | `fund(body)` | `Wallet` | 200, 403, 404 |

**Implementation Notes:**
- `fund()` finds wallet by `user_id`, adds `amount` to `available_balance`, saves.
- No wallet creation endpoint — wallets must be pre-seeded in DB.

---

### 1.4 Milestone Payments — `MilestonePaymentsController` (`/milestone-payments`)

| # | Method | Route | Body / Params | Guard | Service Method | Response | Status Codes |
|---|--------|-------|---------------|-------|----------------|----------|-------------|
| 1 | `GET` | `/milestone-payments` | `escrow_id: string` (query) | — | `findAll(+escrow_id)` | `MilestonePayment[]` | 200 |
| 2 | `GET` | `/milestone-payments/:id` | `id: string` (param) | — | `findOne(+id)` | `MilestonePayment` | 200, 404 |
| 3 | `POST` | `/milestone-payments` | `{ escrow_id: number, milestone_id: number, title: string, amount: number, due_date?: string }` + `x-user-id` | `OwnershipGuard` | `create(body)` | `MilestonePayment` | 201, 403 |
| 4 | `PATCH` | `/milestone-payments/:id/approve` | — + `x-user-id` | `OwnershipGuard` | `approve(+id)` | `MilestonePayment` | 200, 403, 404 |
| 5 | `PATCH` | `/milestone-payments/:id/reject` | — + `x-user-id` | `OwnershipGuard` | `reject(+id)` | `MilestonePayment` | 200, 403, 404 |
| 6 | `PATCH` | `/milestone-payments/:id/release` | — + `x-user-id` | `OwnershipGuard` | `release(+id)` | `MilestonePayment` | 200, 403, 404 |

**Implementation Notes:**
- `approve()` sets `approval_status = 'approved'`, `approved_at = new Date()`.
- `reject()` sets `approval_status = 'rejected'`.
- `release()` sets `release_status = 'released'`, `released_at = new Date()`.

---

### 1.5 Invoices — `InvoicesController` (`/invoices`)

| # | Method | Route | Body / Params | Guard | Service Method | Response | Status Codes |
|---|--------|-------|---------------|-------|----------------|----------|-------------|
| 1 | `GET` | `/invoices` | `user_id: string` (query) | — | `findAll(+user_id)` | `Invoice[]` | 200 |
| 2 | `GET` | `/invoices/:id` | `id: string` (param) | — | `findOne(+id)` | `Invoice` | 200, 404 |
| 3 | `POST` | `/invoices` | `{ milestone_payment_id: number, project_id: number, client_user_id: number, freelancer_user_id: number, gross_amount: number, currency_code: string, invoice_pdf_url?: string }` | — | `create(body)` | `Invoice` | 201 |

**Implementation Notes:**
- `findAll()` filters by `client_user_id` OR `freelancer_user_id` matching `user_id`.
- `create()` auto-calculates: `platform_fee = gross_amount * 0.05`, `tax_amount = gross_amount * 0.03`, `net_amount = gross_amount - platform_fee - tax_amount`.
- `invoice_number` auto-generated: `INV-${Date.now()}`.
- ⚠️ No `OwnershipGuard` on create — any caller can create invoices.

---

### 1.6 Refunds — `RefundsController` (`/refunds`)

| # | Method | Route | Body / Params | Guard | Service Method | Response | Status Codes |
|---|--------|-------|---------------|-------|----------------|----------|-------------|
| 1 | `GET` | `/refunds` | — | — | `findAll()` | `Refund[]` | 200 |
| 2 | `GET` | `/refunds/:id` | `id: string` (param) | — | `findOne(+id)` | `Refund` | 200, 404 |
| 3 | `POST` | `/refunds` | `{ transaction_id: number, escrow_id: number, milestone_payment_id?: number, requested_by: number, reason: string, refund_amount: number }` + `x-user-id` | `OwnershipGuard` | `create(body, +userId)` | `Refund` | 201, 403 |
| 4 | `PATCH` | `/refunds/:id/approve` | `{ admin_id: number }` + `x-user-id` | `OwnershipGuard` | `approve(+id, body.admin_id)` | `Refund` | 200, 403, 404 |
| 5 | `PATCH` | `/refunds/:id/reject` | `{ admin_id: number }` + `x-user-id` | `OwnershipGuard` | `reject(+id, body.admin_id)` | `Refund` | 200, 403, 404 |

**Implementation Notes:**
- `create()` verifies `requested_by === requesting_user_id` from header.
- `approve()` sets `status = 'approved'`, `approved_by_admin`, `resolved_at`.
- `reject()` sets `status = 'rejected'`, `approved_by_admin`, `resolved_at`.

---

### 1.7 Currency — `CurrencyController` (`/currency`)

| # | Method | Route | Body / Params | Guard | Service Method | Response | Status Codes |
|---|--------|-------|---------------|-------|----------------|----------|-------------|
| 1 | `GET` | `/currency` | — | — | `findAll()` | `CurrencyRate[]` | 200 |
| 2 | `GET` | `/currency/rate` | `base: string, target: string` (query) | — | `findRate(base, target)` | `CurrencyRate` | 200, 404 |
| 3 | `POST` | `/currency` | `{ base_currency: string, target_currency: string, exchange_rate: number, source_api: string }` | — | `create(body)` | `CurrencyRate` | 201 |

**Implementation Notes:**
- `findAll()` returns only active rates (`is_active = true`).
- ⚠️ No guard on create — any user can create currency rates.

---

### 1.8 Notifications — `NotificationsController` (`/notifications`)

| # | Method | Route | Body / Params | Guard | Service Method | Response | Status Codes |
|---|--------|-------|---------------|-------|----------------|----------|-------------|
| 1 | `GET` | `/notifications` | `recipient_id: string` (query) | — | `findAll(+recipient_id)` | `Notification[]` | 200 |
| 2 | `GET` | `/notifications/:id` | `id: string` (param) | — | `findOne(+id)` | `Notification` | 200, 404 |
| 3 | `POST` | `/notifications` | `{ transaction_id?: number, withdrawal_id?: number, refund_id?: number, recipient_id: number, notification_type: string, title: string, message: string, channel?: string }` | — | `create(body)` | `Notification` | 201 |
| 4 | `PATCH` | `/notifications/:id/read` | — | — | `markRead(+id)` | `Notification` | 200, 404 |

**Implementation Notes:**
- `markRead()` sets `status = 'read'`, `sent_at = new Date()`.
- ⚠️ No guards on any notification endpoint.

---

### 1.9 Payment Methods — `PaymentMethodsController` (`/payment-methods`)

| # | Method | Route | Body / Params | Guard | Service Method | Response | Status Codes |
|---|--------|-------|---------------|-------|----------------|----------|-------------|
| 1 | `GET` | `/payment-methods` | `user_id: string` (query) | — | `findAll(+user_id)` | `PaymentMethod[]` | 200 |
| 2 | `POST` | `/payment-methods` | `{ user_id: number, method_type: string, provider_name: string, account_title: string, account_number_masked: string, iban_or_wallet_id: string, country_code: string }` + `x-user-id` | `OwnershipGuard` | `create(body)` | `PaymentMethod` | 201, 403 |
| 3 | `PATCH` | `/payment-methods/:id/set-default` | `{ user_id: number }` + `x-user-id` | `OwnershipGuard` | `setDefault(+id, body.user_id)` | `PaymentMethod` | 200, 403, 404 |
| 4 | `DELETE` | `/payment-methods/:id` | `id: string` (param) | — | `remove(+id)` | `UpdateResult` | 200, 404 |

**Implementation Notes:**
- `findAll()` returns non-deleted methods (`deleted_at IS NULL`).
- `setDefault()` unsets all defaults for user, then sets target.
- `remove()` is soft-delete (`deleted_at = new Date()`).
- ⚠️ No guard on DELETE — any caller can soft-delete any method.

---

### 1.10 Withdrawals — `WithdrawalsController` (`/withdrawals`)

| # | Method | Route | Body / Params | Guard | Service Method | Response | Status Codes |
|---|--------|-------|---------------|-------|----------------|----------|-------------|
| 1 | `GET` | `/withdrawals` | — | — | `findAll()` | `Withdrawal[]` | 200 |
| 2 | `GET` | `/withdrawals/:id` | `id: string` (param) | — | `findOne(+id)` | `Withdrawal` | 200, 404 |
| 3 | `POST` | `/withdrawals` | `{ amount: number, payment_method_id: number, wallet_id: number, currency_code?: string }` + `x-user-id` | `OwnershipGuard` | `create(body, +userId)` | `Withdrawal` | 201, 403 |
| 4 | `PATCH` | `/withdrawals/:id/approve` | — + `x-user-id` | `OwnershipGuard` | `approve(+id)` | `Withdrawal` | 200, 403, 404 |
| 5 | `PATCH` | `/withdrawals/:id/reject` | `{ admin_note: string }` + `x-user-id` | `OwnershipGuard` | `reject(+id, body.admin_note)` | `Withdrawal` | 200, 403, 404 |

**Implementation Notes:**
- `create()` calculates `processing_fee = amount * 0.02`, `net_amount = amount - fee`, defaults `currency_code = 'USD'`.
- `approve()` sets `status = 'completed'`, `processed_at`.
- `reject()` sets `status = 'rejected'`, `admin_note`, `processed_at`.
- ⚠️ No admin role check — guard only validates `x-user-id` exists, not that user is admin.

---

### 1.11 OwnershipGuard — Shared

- **Location:** `src/common/guards/ownership.guard.ts`
- **Mechanism:** Reads `x-user-id` header, parses to integer, attaches as `request.user_id`.
- **Failure:** Throws `ForbiddenException('x-user-id header is required')` if header is missing or non-numeric.
- ⚠️ **Does NOT verify user role, user existence in DB, or actual ownership of the resource.**

---

## 2. Outbound Data (External API Calls)

**The backend makes NO outbound HTTP calls.** There are:
- No third-party payment gateway integrations (Stripe, PayPal, etc.)
- No external currency rate API fetches (rates are manually created via POST)
- No email/SMS sending services
- No webhook dispatches

All data stays within the PostgreSQL database boundary.

---

## 3. Database Tables & Schema

### 3.1 Module 7 SQL Tables (from `SPM_Centralized_Db.sql`)

#### `wallets`
| Column | SQL Type | Constraints | Default |
|--------|----------|-------------|---------|
| `id` | `SERIAL` | `PRIMARY KEY` | auto |
| `uuid` | `UUID` | `UNIQUE NOT NULL` | `gen_random_uuid()` |
| `user_id` | `INTEGER` | `UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE` | — |
| `currency_code` | `VARCHAR(10)` | `NOT NULL` | `'USD'` |
| `available_balance` | `DECIMAL(18,4)` | `NOT NULL CHECK (>= 0)` | `0` |
| `held_balance` | `DECIMAL(18,4)` | `NOT NULL CHECK (>= 0)` | `0` |
| `reserved_balance` | `DECIMAL(18,4)` | `NOT NULL CHECK (>= 0)` | `0` |
| `wallet_status` | `VARCHAR(20)` | `NOT NULL CHECK IN ('active','frozen','closed')` | `'active'` |
| `created_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |

#### `payment_methods`
| Column | SQL Type | Constraints | Default |
|--------|----------|-------------|---------|
| `id` | `SERIAL` | `PRIMARY KEY` | auto |
| `uuid` | `UUID` | `UNIQUE NOT NULL` | `gen_random_uuid()` |
| `user_id` | `INTEGER` | `NOT NULL REFERENCES users(id) ON DELETE CASCADE` | — |
| `method_type` | `VARCHAR(20)` | `NOT NULL CHECK IN ('bank','digital_wallet','card')` | — |
| `provider_name` | `VARCHAR(100)` | `NOT NULL` | — |
| `account_title` | `VARCHAR(200)` | `NOT NULL` | — |
| `account_number_masked` | `VARCHAR(50)` | `NOT NULL` | — |
| `iban_or_wallet_id` | `TEXT` | `NOT NULL` | — |
| `country_code` | `CHAR(2)` | `NOT NULL` | — |
| `is_verified` | `BOOLEAN` | `NOT NULL` | `FALSE` |
| `is_default` | `BOOLEAN` | `NOT NULL` | `FALSE` |
| `created_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |
| `deleted_at` | `TIMESTAMP` | nullable | — |

#### `currency_rates`
| Column | SQL Type | Constraints | Default |
|--------|----------|-------------|---------|
| `id` | `SERIAL` | `PRIMARY KEY` | auto |
| `base_currency` | `CHAR(3)` | `NOT NULL` | — |
| `target_currency` | `CHAR(3)` | `NOT NULL` | `'USD'` |
| `exchange_rate` | `DECIMAL(18,8)` | `NOT NULL CHECK (> 0)` | — |
| `source_api` | `VARCHAR(100)` | `NOT NULL` | — |
| `fetched_at` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` |
| `is_active` | `BOOLEAN` | `NOT NULL` | `TRUE` |
| **UNIQUE** | `(base_currency, target_currency, fetched_at)` | | |

#### `escrow_accounts`
| Column | SQL Type | Constraints | Default |
|--------|----------|-------------|---------|
| `id` | `SERIAL` | `PRIMARY KEY` | auto |
| `uuid` | `UUID` | `UNIQUE NOT NULL` | `gen_random_uuid()` |
| `project_id` | `INTEGER` | `UNIQUE NOT NULL REFERENCES projects(id) ON DELETE CASCADE` | — |
| `client_user_id` | `INTEGER` | `NOT NULL REFERENCES users(id)` | — |
| `freelancer_user_id` | `INTEGER` | `NOT NULL REFERENCES users(id)` | — |
| `currency_code` | `VARCHAR(10)` | `NOT NULL` | — |
| `total_amount` | `DECIMAL(18,4)` | `NOT NULL CHECK (> 0)` | — |
| `funded_amount` | `DECIMAL(18,4)` | `NOT NULL CHECK (>= 0)` | `0` |
| `released_amount` | `DECIMAL(18,4)` | `NOT NULL CHECK (>= 0)` | `0` |
| `refunded_amount` | `DECIMAL(18,4)` | `NOT NULL CHECK (>= 0)` | `0` |
| `escrow_status` | `escrow_status` ENUM | `NOT NULL` | `'pending'` |
| `funded_at` | `TIMESTAMP` | nullable | — |
| `closed_at` | `TIMESTAMP` | nullable | — |
| `created_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |

#### `milestone_payments`
| Column | SQL Type | Constraints | Default |
|--------|----------|-------------|---------|
| `id` | `SERIAL` | `PRIMARY KEY` | auto |
| `uuid` | `UUID` | `UNIQUE NOT NULL` | `gen_random_uuid()` |
| `escrow_id` | `INTEGER` | `NOT NULL REFERENCES escrow_accounts(id) ON DELETE CASCADE` | — |
| `milestone_id` | `INTEGER` | `UNIQUE NOT NULL REFERENCES project_milestones(id) ON DELETE CASCADE` | — |
| `title` | `VARCHAR(200)` | `NOT NULL` | — |
| `amount` | `DECIMAL(18,4)` | `NOT NULL CHECK (> 0)` | — |
| `due_date` | `DATE` | nullable | — |
| `approval_status` | `VARCHAR(20)` | `NOT NULL CHECK IN ('pending','approved','rejected')` | `'pending'` |
| `release_status` | `VARCHAR(20)` | `NOT NULL CHECK IN ('not_released','released','refunded')` | `'not_released'` |
| `approved_at` | `TIMESTAMP` | nullable | — |
| `released_at` | `TIMESTAMP` | nullable | — |
| `created_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |
| `updated_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |

#### `invoices`
| Column | SQL Type | Constraints | Default |
|--------|----------|-------------|---------|
| `id` | `SERIAL` | `PRIMARY KEY` | auto |
| `uuid` | `UUID` | `UNIQUE NOT NULL` | `gen_random_uuid()` |
| `invoice_number` | `VARCHAR(50)` | `UNIQUE NOT NULL` | — |
| `milestone_payment_id` | `INTEGER` | `UNIQUE NOT NULL REFERENCES milestone_payments(id) ON DELETE CASCADE` | — |
| `project_id` | `INTEGER` | `NOT NULL REFERENCES projects(id)` | — |
| `client_user_id` | `INTEGER` | `NOT NULL REFERENCES users(id)` | — |
| `freelancer_user_id` | `INTEGER` | `NOT NULL REFERENCES users(id)` | — |
| `gross_amount` | `DECIMAL(18,4)` | `NOT NULL` | — |
| `platform_fee` | `DECIMAL(18,4)` | `NOT NULL` | `0` |
| `tax_amount` | `DECIMAL(18,4)` | `NOT NULL` | `0` |
| `net_amount` | `DECIMAL(18,4)` | `NOT NULL` | — |
| `currency_code` | `VARCHAR(10)` | `NOT NULL` | — |
| `invoice_pdf_url` | `VARCHAR(500)` | nullable | — |
| `generated_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |
| **CHECK** | `net_amount = gross_amount - platform_fee - tax_amount` | | |

#### `transactions`
| Column | SQL Type | Constraints | Default |
|--------|----------|-------------|---------|
| `id` | `SERIAL` | `PRIMARY KEY` | auto |
| `uuid` | `UUID` | `UNIQUE NOT NULL` | `gen_random_uuid()` |
| `wallet_id` | `INTEGER` | `NOT NULL REFERENCES wallets(id)` | — |
| `escrow_id` | `INTEGER` | `REFERENCES escrow_accounts(id)` | nullable |
| `invoice_id` | `INTEGER` | `REFERENCES invoices(id)` | nullable |
| `rate_id` | `INTEGER` | `REFERENCES currency_rates(id)` | nullable |
| `sender_user_id` | `INTEGER` | `REFERENCES users(id)` | nullable |
| `receiver_user_id` | `INTEGER` | `REFERENCES users(id)` | nullable |
| `transaction_type` | `VARCHAR(30)` | `NOT NULL` | — |
| `amount` | `DECIMAL(18,4)` | `NOT NULL CHECK (> 0)` | — |
| `currency_code` | `VARCHAR(10)` | `NOT NULL` | — |
| `status` | `VARCHAR(20)` | `NOT NULL CHECK IN ('pending','completed','failed','reversed')` | `'pending'` |
| `reference_no` | `VARCHAR(200)` | nullable | — |
| `description` | `VARCHAR(500)` | nullable | — |
| `created_at` | `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` |
| `processed_at` | `TIMESTAMP` | nullable | — |

#### `withdrawal_requests`
| Column | SQL Type | Constraints | Default |
|--------|----------|-------------|---------|
| `id` | `SERIAL` | `PRIMARY KEY` | auto |
| `uuid` | `UUID` | `UNIQUE NOT NULL` | `gen_random_uuid()` |
| `user_id` | `INTEGER` | `NOT NULL REFERENCES users(id)` | — |
| `wallet_id` | `INTEGER` | `NOT NULL REFERENCES wallets(id)` | — |
| `payment_method_id` | `INTEGER` | `NOT NULL REFERENCES payment_methods(id)` | — |
| `transaction_id` | `INTEGER` | `UNIQUE REFERENCES transactions(id)` | nullable |
| `amount` | `DECIMAL(18,4)` | `NOT NULL CHECK (> 0)` | — |
| `processing_fee` | `DECIMAL(18,4)` | `NOT NULL` | `0` |
| `net_amount` | `DECIMAL(18,4)` | `NOT NULL CHECK (> 0)` | — |
| `currency_code` | `VARCHAR(10)` | `NOT NULL` | — |
| `status` | `VARCHAR(20)` | `NOT NULL` | `'pending'` |
| `requested_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |
| `processed_at` | `TIMESTAMP` | nullable | — |
| `admin_note` | `TEXT` | nullable | — |

#### `refund_requests`
| Column | SQL Type | Constraints | Default |
|--------|----------|-------------|---------|
| `id` | `SERIAL` | `PRIMARY KEY` | auto |
| `uuid` | `UUID` | `UNIQUE NOT NULL` | `gen_random_uuid()` |
| `transaction_id` | `INTEGER` | `NOT NULL REFERENCES transactions(id)` | — |
| `escrow_id` | `INTEGER` | `NOT NULL REFERENCES escrow_accounts(id)` | — |
| `milestone_payment_id` | `INTEGER` | `REFERENCES milestone_payments(id)` | nullable |
| `requested_by` | `INTEGER` | `NOT NULL REFERENCES users(id)` | — |
| `approved_by_admin` | `INTEGER` | `REFERENCES users(id)` | nullable |
| `reason` | `TEXT` | `NOT NULL` | — |
| `refund_amount` | `DECIMAL(18,4)` | `NOT NULL CHECK (> 0)` | — |
| `status` | `VARCHAR(20)` | `NOT NULL` | `'pending'` |
| `created_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |
| `resolved_at` | `TIMESTAMP` | nullable | — |

#### `platform_fee_logs`
| Column | SQL Type | Constraints | Default |
|--------|----------|-------------|---------|
| `id` | `SERIAL` | `PRIMARY KEY` | auto |
| `uuid` | `UUID` | `UNIQUE NOT NULL` | `gen_random_uuid()` |
| `transaction_id` | `INTEGER` | `NOT NULL REFERENCES transactions(id)` | — |
| `project_id` | `INTEGER` | `NOT NULL REFERENCES projects(id)` | — |
| `fee_type` | `VARCHAR(20)` | `NOT NULL` | — |
| `fee_percentage` | `DECIMAL(5,4)` | `NOT NULL` | — |
| `fee_amount` | `DECIMAL(18,4)` | `NOT NULL CHECK (> 0)` | — |
| `currency_code` | `VARCHAR(10)` | `NOT NULL` | — |
| `created_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |

> ⚠️ **`platform_fee_logs` has NO corresponding entity, controller, or service in the backend.** It exists only in SQL.

#### `payment_notifications`
| Column | SQL Type | Constraints | Default |
|--------|----------|-------------|---------|
| `id` | `SERIAL` | `PRIMARY KEY` | auto |
| `uuid` | `UUID` | `UNIQUE NOT NULL` | `gen_random_uuid()` |
| `transaction_id` | `INTEGER` | `REFERENCES transactions(id)` | nullable |
| `withdrawal_id` | `INTEGER` | `REFERENCES withdrawal_requests(id)` | nullable |
| `refund_id` | `INTEGER` | `REFERENCES refund_requests(id)` | nullable |
| `recipient_id` | `INTEGER` | `NOT NULL REFERENCES users(id)` | — |
| `notification_type` | `VARCHAR(50)` | `NOT NULL` | — |
| `title` | `VARCHAR(255)` | `NOT NULL` | — |
| `message` | `TEXT` | `NOT NULL` | — |
| `channel` | `VARCHAR(20)` | — | `'in_app'` |
| `status` | `VARCHAR(20)` | — | `'pending'` |
| `sent_at` | `TIMESTAMP` | nullable | — |
| `created_at` | `TIMESTAMP` | — | `CURRENT_TIMESTAMP` |

### 3.2 Entity ↔ SQL Discrepancies

| Entity Class | Table in Entity Decorator | SQL Table Name | Match? | Notes |
|-------------|--------------------------|----------------|--------|-------|
| `Escrow` | `escrow_accounts` | `escrow_accounts` | ✅ | |
| `Transaction` | `transactions` | `transactions` | ✅ | Entity missing `rate_id` column that SQL has |
| `Wallet` | `wallets` | `wallets` | ✅ | Entity missing `uuid` column |
| `MilestonePayment` | `milestone_payments` | `milestone_payments` | ✅ | |
| `Invoice` | `invoices` | `invoices` | ✅ | Entity missing `uuid` column |
| `Refund` | `refund_requests` | `refund_requests` | ✅ | |
| `CurrencyRate` | `currency_rates` | `currency_rates` | ✅ | |
| `Notification` | `payment_notifications` | `payment_notifications` | ✅ | |
| `PaymentMethod` | `payment_methods` | `payment_methods` | ✅ | Entity missing `uuid` column |
| `Withdrawal` | `withdrawal_requests` | `withdrawal_requests` | ✅ | Entity missing `uuid` column |
| — | — | `platform_fee_logs` | ❌ | **No entity exists** |

### 3.3 Indexes (Module 7)

```sql
CREATE INDEX idx_wallets_user ON wallets(user_id);
CREATE INDEX idx_escrow_project ON escrow_accounts(project_id);
CREATE INDEX idx_escrow_status ON escrow_accounts(escrow_status);
CREATE INDEX idx_transactions_wallet ON transactions(wallet_id);
CREATE INDEX idx_transactions_created ON transactions(created_at);
CREATE INDEX idx_transactions_uuid ON transactions(uuid);
```

---

## 4. Frontend API Calls

### 4.1 API Service (`src/services/api.js`)

Base URL: `http://localhost:3001`

All calls use `fetch()` with `Content-Type: application/json`. The `x-user-id` header is attached when `userId` is provided.

#### `walletAPI`
| Function | Method | Endpoint | Body | Used In |
|----------|--------|----------|------|---------|
| `getByUser(userId)` | GET | `/wallets/user/${userId}` | — | Dashboard, Wallet, Withdrawals, Client Dashboard |
| `fund(userId, amount)` | POST | `/wallets/fund` | `{ user_id, amount }` | Wallet page |
| `tryGetByUser(userId)` | GET | `/wallets/user/${userId}` | — (catches 404→null) | Dashboard, Transactions, Withdrawals, Client |

#### `paymentMethodsAPI`
| Function | Method | Endpoint | Body | Used In |
|----------|--------|----------|------|---------|
| `getAll(userId)` | GET | `/payment-methods?user_id=${userId}` | — | Wallet, Withdrawals |
| `create(userId, data)` | POST | `/payment-methods` | `{ ...data, user_id }` | Wallet page |
| `setDefault(id, userId)` | PATCH | `/payment-methods/${id}/set-default` | `{ user_id }` | Wallet page |
| `delete(id)` | DELETE | `/payment-methods/${id}` | — | Wallet page |

#### `withdrawalsAPI`
| Function | Method | Endpoint | Body | Used In |
|----------|--------|----------|------|---------|
| `getAll()` | GET | `/withdrawals` | — | Admin Dashboard, Admin Withdrawals, Withdrawals |
| `getOne(id)` | GET | `/withdrawals/${id}` | — | (unused in frontend) |
| `create(userId, data)` | POST | `/withdrawals` | `data` | Withdrawals page |
| `approve(id, userId)` | PATCH | `/withdrawals/${id}/approve` | — | Admin Withdrawals |
| `reject(id, userId, note)` | PATCH | `/withdrawals/${id}/reject` | `{ admin_note }` | Admin Withdrawals |

#### `transactionsAPI`
| Function | Method | Endpoint | Body | Used In |
|----------|--------|----------|------|---------|
| `getAll(walletId)` | GET | `/transactions?wallet_id=${walletId}` | — | Dashboard, Transactions |
| `getOne(id)` | GET | `/transactions/${id}` | — | (unused in frontend) |

#### `escrowAPI`
| Function | Method | Endpoint | Body | Used In |
|----------|--------|----------|------|---------|
| `getAll()` | GET | `/escrow` | — | Dashboard, Escrow, Milestones, Client |
| `getOne(id)` | GET | `/escrow/${id}` | — | (unused in frontend) |
| `getByProject(projectId)` | GET | `/escrow/project/${projectId}` | — | (unused in frontend) |
| `create(userId, data)` | POST | `/escrow` | `data` | Escrow page |
| `fund(id, userId, amount)` | POST | `/escrow/${id}/fund` | `{ amount }` | Escrow page |
| `freeze(id, userId)` | POST | `/escrow/${id}/freeze` | — | Escrow page |
| `close(id, userId)` | POST | `/escrow/${id}/close` | — | Escrow page |

#### `milestonePaymentsAPI`
| Function | Method | Endpoint | Body | Used In |
|----------|--------|----------|------|---------|
| `getAll(escrowId)` | GET | `/milestone-payments?escrow_id=${escrowId}` | — | Milestones, Client Dashboard |
| `getOne(id)` | GET | `/milestone-payments/${id}` | — | (unused in frontend) |
| `create(userId, data)` | POST | `/milestone-payments` | `data` | Milestones page |
| `approve(id, userId)` | PATCH | `/milestone-payments/${id}/approve` | — | Milestones page |
| `reject(id, userId)` | PATCH | `/milestone-payments/${id}/reject` | — | Milestones page |
| `release(id, userId)` | PATCH | `/milestone-payments/${id}/release` | — | Milestones page |

#### `invoicesAPI`
| Function | Method | Endpoint | Body | Used In |
|----------|--------|----------|------|---------|
| `getAll(userId)` | GET | `/invoices?user_id=${userId}` | — | Invoices, Client Dashboard |
| `getOne(id)` | GET | `/invoices/${id}` | — | (unused in frontend) |
| `create(data)` | POST | `/invoices` | `data` | (unused in frontend) |

#### `refundsAPI`
| Function | Method | Endpoint | Body | Used In |
|----------|--------|----------|------|---------|
| `getAll()` | GET | `/refunds` | — | Admin Dashboard, Admin Refunds, Refunds |
| `getOne(id)` | GET | `/refunds/${id}` | — | (unused in frontend) |
| `create(userId, data)` | POST | `/refunds` | `data` | Refunds page |
| `approve(id, userId)` | PATCH | `/refunds/${id}/approve` | `{ admin_id }` | Admin Refunds |
| `reject(id, userId)` | PATCH | `/refunds/${id}/reject` | `{ admin_id }` | Admin Refunds |

#### `currencyAPI`
| Function | Method | Endpoint | Body | Used In |
|----------|--------|----------|------|---------|
| `getAll()` | GET | `/currency` | — | Wallet, Admin Currency |
| `getRate(base, target)` | GET | `/currency/rate?base=${base}&target=${target}` | — | (unused in frontend) |
| `create(userId, data)` | POST | `/currency` | `data` | Admin Currency page |

#### `notificationsAPI`
| Function | Method | Endpoint | Body | Used In |
|----------|--------|----------|------|---------|
| `getAll(userId)` | GET | `/notifications?recipient_id=${userId}` | — | Notifications page |
| `markRead(id)` | PATCH | `/notifications/${id}/read` | — | Notifications page |

### 4.2 Frontend Pages Summary

| Page Path | Component | API Calls | Role Restriction |
|-----------|-----------|-----------|-----------------|
| `/` | `Home` | — | — (role selector) |
| `/dashboard` | `DashboardPage` | wallet, escrow, transactions | Freelancer (default) |
| `/dashboard/wallet` | `WalletPage` | wallet, paymentMethods, currency | Any |
| `/dashboard/escrow` | `EscrowPage` | escrow | Client (create/fund/freeze/close) |
| `/dashboard/milestones` | `MilestonesPage` | escrow, milestonePayments | Client (create/approve/reject/release) |
| `/dashboard/invoices` | `InvoicesPage` | invoices | Any |
| `/dashboard/transactions` | `TransactionsPage` | wallet, transactions | Any |
| `/dashboard/notifications` | `NotificationsPage` | notifications | Any |
| `/dashboard/withdrawals` | `WithdrawalsPage` | wallet, paymentMethods, withdrawals | Freelancer/Client (not admin) |
| `/dashboard/refunds` | `RefundsPage` | refunds | Freelancer/Client |
| `/admin` | `AdminDashboard` | withdrawals, refunds | Admin |
| `/admin/withdrawals` | `AdminWithdrawalsPage` | withdrawals | Admin |
| `/admin/refunds` | `AdminRefundsPage` | refunds | Admin |
| `/admin/currency` | `AdminCurrencyPage` | currency | Admin |
| `/client` | `ClientDashboard` | wallet, escrow, invoices, milestonePayments | Client |
| `/client/escrow` | `ClientEscrowPage` | (reuses EscrowPage) | Client |

### 4.3 Session Management

- **Storage:** `localStorage` key `nfsvs_session_v1`
- **Schema:** `{ role: 'freelancer' | 'client' | 'admin', userId: number }`
- **Default:** `{ role: 'freelancer', userId: 1 }`
- **No JWT/token authentication** — session is purely client-side role simulation.

---

## 5. Notification & Event Outputs

### 5.1 Notification Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `transaction_id` | `number` (nullable) | Link to triggering transaction |
| `withdrawal_id` | `number` (nullable) | Link to triggering withdrawal |
| `refund_id` | `number` (nullable) | Link to triggering refund |
| `recipient_id` | `number` | User to receive notification |
| `notification_type` | `string` | E.g. `'payment_received'`, `'withdrawal_approved'` |
| `title` | `string` | Notification title |
| `message` | `string` | Notification body |
| `channel` | `string` | Default `'in_app'` |
| `status` | `string` | `'pending'` or `'read'` |

### 5.2 Event Triggers

⚠️ **No automatic notification creation exists.** The backend does NOT emit events or auto-create notifications when:
- An escrow is funded/frozen/closed
- A milestone is approved/rejected/released
- A withdrawal is approved/rejected
- A refund is approved/rejected
- An invoice is generated

Notifications must be manually created via `POST /notifications`. The frontend does NOT call this endpoint anywhere — it only reads and marks as read.

### 5.3 Missing Event-Driven Architecture

There are no:
- EventEmitter patterns
- Message queues (RabbitMQ, Kafka)
- WebSocket gateways
- Server-Sent Events
- Cron jobs

---

## 6. Data Type Inventory

### 6.1 TypeORM Entity Types vs SQL Types

| Entity Field Pattern | TypeORM Type | PostgreSQL Type | Notes |
|---------------------|-------------|-----------------|-------|
| `id` | `number` (PrimaryGeneratedColumn) | `SERIAL` | ✅ |
| `*_amount`, `*_balance`, `*_fee`, `*_rate` | `number` (Column 'decimal') | `DECIMAL(18,4)` or `DECIMAL(18,8)` | ⚠️ TypeORM returns strings for decimal; parsed with `parseFloat` in frontend |
| `*_status`, `*_type`, `*_code` | `string` | `VARCHAR(n)` or ENUM | ✅ |
| `*_at` | `Date` | `TIMESTAMP` | ✅ |
| `is_*` | `boolean` | `BOOLEAN` | ✅ |
| `uuid` | — | `UUID` | ⚠️ Missing from most entities |

### 6.2 Missing Columns in Entities vs SQL

| Entity | Missing from Entity (present in SQL) |
|--------|--------------------------------------|
| `Wallet` | `uuid` |
| `PaymentMethod` | `uuid` |
| `Transaction` | `uuid`, `rate_id` |
| `Escrow` | `uuid` |
| `MilestonePayment` | `uuid` |
| `Invoice` | `uuid` |
| `Refund` | `uuid` |
| `CurrencyRate` | (none — has no uuid in SQL either) |
| `Notification` | `uuid` |
| `Withdrawal` | `uuid` |

---

## 7. Issues & Recommendations

### 7.1 Security Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 1 | **CRITICAL** | No JWT/session-based authentication. `x-user-id` header is trivially spoofable. | `OwnershipGuard` |
| 2 | **CRITICAL** | No admin role verification on admin-only endpoints (approve/reject withdrawals, refunds). | All controllers |
| 3 | **HIGH** | Invoice creation has no guard — any user can create invoices for any project. | `InvoicesController.create()` |
| 4 | **HIGH** | Currency rate creation has no guard — any user can manipulate exchange rates. | `CurrencyController.create()` |
| 5 | **HIGH** | Payment method DELETE has no guard — any user can soft-delete any payment method. | `PaymentMethodsController.remove()` |
| 6 | **HIGH** | Notification creation has no guard — any user can create fake notifications for any recipient. | `NotificationsController.create()` |
| 7 | **MEDIUM** | `GET /withdrawals` and `GET /refunds` return ALL records to any caller — no filtering by user. | Controllers |

### 7.2 Data Integrity Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 1 | **HIGH** | Escrow funding does not deduct from wallet balance. | `EscrowService.fund()` |
| 2 | **HIGH** | Milestone release does not create a transaction or update wallet/escrow balances. | `MilestonePaymentsService.release()` |
| 3 | **HIGH** | Withdrawal approval does not deduct from wallet or create a transaction. | `WithdrawalsService.approve()` |
| 4 | **HIGH** | Refund approval does not credit wallet, create transaction, or update escrow. | `RefundsService.approve()` |
| 5 | **HIGH** | No transaction creation endpoint — `transactions` table is read-only. | `TransactionsController` |
| 6 | **MEDIUM** | Invoice `net_amount` check constraint in SQL may fail if backend calculation differs from SQL formula. | `InvoicesService.create()` |
| 7 | **MEDIUM** | Entities missing `uuid` columns that SQL schema defines as `NOT NULL DEFAULT gen_random_uuid()`. | All entities |
| 8 | **LOW** | `platform_fee_logs` SQL table has no corresponding backend code. | SQL schema |

### 7.3 Validation Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 1 | **HIGH** | No DTO classes or `class-validator` decorators anywhere. All body types are inline TypeScript interfaces in controllers. | All controllers |
| 2 | **HIGH** | No `ValidationPipe` configured in `main.ts`. | `src/main.ts` |
| 3 | **MEDIUM** | No input length/range validation (e.g., negative amounts, empty strings). | All services |
| 4 | **MEDIUM** | `escrow_status` uses free-form string in entity but ENUM in SQL — mismatch risk. | `Escrow` entity |

### 7.4 Architectural Issues

| # | Severity | Issue | Location |
|---|----------|-------|----------|
| 1 | **HIGH** | No cross-module service injection — modules are fully isolated with no inter-service communication. | All modules |
| 2 | **HIGH** | No event/notification system — state changes don't trigger notifications. | All services |
| 3 | **MEDIUM** | No pagination on any list endpoint. | All controllers |
| 4 | **MEDIUM** | No error response standardization — raw NestJS exceptions exposed. | All controllers |
| 5 | **LOW** | No logging middleware or request tracing. | `main.ts` |
| 6 | **LOW** | CORS hardcoded to `http://localhost:3000`. | `main.ts` |

---

*End of Data Flow Report*
