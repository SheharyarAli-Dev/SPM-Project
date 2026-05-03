-- Seed dataset for Module 7 (Payments & Escrow) for local dev.
-- IMPORTANT: This file populates the DB without modifying SPM_Centralized_Db.sql.
-- Safe to run multiple times (uses ON CONFLICT where possible).

BEGIN;

-- -------------------------------------------------------------------
-- 0) Minimal taxonomy required by jobs/projects
-- -------------------------------------------------------------------
INSERT INTO marketplace_categories (id, name, slug, description)
VALUES
  (1, 'Software Development', 'software-development', 'Seed category for Module 7 demo flows')
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('marketplace_categories', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM marketplace_categories), 1)
);

-- -------------------------------------------------------------------
-- 1) Users
-- NOTE: Module-7 backend uses a TEMP workaround where freelancer wallet
--       is stored under user_id = userId + 100000. Because wallets.user_id
--       has an FK to users(id), we create shadow users 100001/100002, etc.
-- -------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, first_name, last_name, role)
VALUES
  (1, 'client1@seed.local', 'seed-not-for-login', 'Casey', 'Client', 'freelancer'),
  (2, 'freelancer2@seed.local', 'seed-not-for-login', 'Frank', 'Freelancer', 'freelancer'),
  (10, 'admin10@seed.local', 'seed-not-for-login', 'Avery', 'Admin', 'admin'),
  (100001, 'wallet-persona-1@seed.internal', 'seed', 'Wallet', 'PersonaU1', 'freelancer'),
  (100002, 'wallet-persona-2@seed.internal', 'seed', 'Wallet', 'PersonaU2', 'freelancer')
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('users', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM users), 1)
);

INSERT INTO admin_profiles (user_id, role, is_active)
VALUES
  (10, 'dispute_moderator', TRUE)
ON CONFLICT (user_id) DO NOTHING;

-- -------------------------------------------------------------------
-- 2) Wallets (client/admin wallets use actual id; freelancer uses +100000)
-- -------------------------------------------------------------------
INSERT INTO wallets (user_id, available_balance, held_balance, reserved_balance, currency_code, wallet_status)
VALUES
  (1, 2500.0000, 0, 0, 'USD', 'active'),
  (2, 150.0000, 0, 0, 'USD', 'active'),
  (10, 0.0000, 0, 0, 'USD', 'active'),
  (100001, 900.0000, 0, 0, 'USD', 'active'),
  (100002, 75.0000, 0, 0, 'USD', 'active')
ON CONFLICT (user_id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('wallets', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM wallets), 1)
);

-- -------------------------------------------------------------------
-- 3) Payment methods
-- -------------------------------------------------------------------
INSERT INTO payment_methods (
  id,
  user_id,
  method_type,
  provider_name,
  account_title,
  account_number_masked,
  iban_or_wallet_id,
  country_code,
  is_verified,
  is_default
)
VALUES
  (1, 1, 'card', 'VISA', 'Casey Client', '**** **** **** 4242', 'tok_seed_visa_4242', 'US', TRUE, TRUE),
  (2, 2, 'bank', 'Chase', 'Frank Freelancer', '****5678', 'US00SEED0000000000005678', 'US', TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('payment_methods', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM payment_methods), 1)
);

-- -------------------------------------------------------------------
-- 4) Currency rates
-- -------------------------------------------------------------------
INSERT INTO currency_rates (id, base_currency, target_currency, exchange_rate, source_api, fetched_at, is_active)
VALUES
  (1, 'USD', 'USD', 1.00000000, 'seed', NOW(), TRUE),
  (2, 'EUR', 'USD', 1.09000000, 'seed', NOW(), TRUE),
  (3, 'PKR', 'USD', 0.00360000, 'seed', NOW(), TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('currency_rates', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM currency_rates), 1)
);

-- -------------------------------------------------------------------
-- 5) Job -> Bid -> Project (required for escrow)
-- -------------------------------------------------------------------
INSERT INTO jobs (
  id,
  client_id,
  title,
  description,
  category_id,
  budget_min,
  budget_max,
  deadline,
  status
)
VALUES
  (1, 1, 'Landing page + payments integration', 'Seed job for Module 7 escrow demo.', 1, 500.0000, 2500.0000, CURRENT_DATE + INTERVAL '30 days', 'open')
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('jobs', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM jobs), 1)
);

INSERT INTO bids (
  id,
  job_id,
  freelancer_id,
  cover_letter,
  proposed_rate,
  estimated_days,
  status
)
VALUES
  (1, 1, 2, 'I can deliver a clean UI and robust payment flows.', 2000.0000, 14, 'accepted')
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('bids', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM bids), 1)
);

INSERT INTO projects (
  id,
  job_id,
  bid_id,
  client_id,
  freelancer_id,
  title,
  description,
  agreed_amount,
  currency,
  status,
  start_date,
  deadline,
  is_milestone_based
)
VALUES
  (1, 1, 1, 1, 2, 'Module 7 Demo Project', 'Seed project for escrow & milestone payment flows.', 2000.0000, 'USD', 'in_progress', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('projects', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM projects), 1)
);

-- -------------------------------------------------------------------
-- 6) Milestones
-- -------------------------------------------------------------------
INSERT INTO project_milestones (
  id,
  project_id,
  title,
  description,
  amount,
  status,
  due_date,
  sort_order
)
VALUES
  (1, 1, 'Design + Wireframes', 'Deliver UI design and wireframes.', 800.0000, 'approved', CURRENT_DATE + INTERVAL '7 days', 1),
  (2, 1, 'Implementation + QA', 'Deliver working app + QA fixes.', 1200.0000, 'submitted', CURRENT_DATE + INTERVAL '21 days', 2)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('project_milestones', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM project_milestones), 1)
);

-- -------------------------------------------------------------------
-- 7) Escrow + milestone payments + invoices
-- -------------------------------------------------------------------
INSERT INTO escrow_accounts (
  id,
  project_id,
  client_user_id,
  freelancer_user_id,
  currency_code,
  total_amount,
  funded_amount,
  released_amount,
  refunded_amount,
  escrow_status,
  funded_at
)
VALUES
  (1, 1, 1, 100002, 'USD', 2000.0000, 2000.0000, 800.0000, 0.0000, 'active', NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('escrow_accounts', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM escrow_accounts), 1)
);

INSERT INTO milestone_payments (
  id,
  escrow_id,
  milestone_id,
  title,
  amount,
  due_date,
  approval_status,
  release_status,
  approved_at,
  released_at
)
VALUES
  (1, 1, 1, 'Design + Wireframes', 800.0000, CURRENT_DATE + INTERVAL '7 days', 'approved', 'released', NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),
  (2, 1, 2, 'Implementation + QA', 1200.0000, CURRENT_DATE + INTERVAL '21 days', 'pending', 'not_released', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('milestone_payments', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM milestone_payments), 1)
);

INSERT INTO invoices (
  id,
  invoice_number,
  milestone_payment_id,
  project_id,
  client_user_id,
  freelancer_user_id,
  gross_amount,
  platform_fee,
  tax_amount,
  net_amount,
  currency_code,
  invoice_pdf_url,
  generated_at
)
VALUES
  (1, 'INV-000001', 1, 1, 1, 2, 800.0000, 40.0000, 0.0000, 760.0000, 'USD', NULL, NOW() - INTERVAL '2 days'),
  (2, 'INV-000002', 2, 1, 1, 2, 1200.0000, 60.0000, 0.0000, 1140.0000, 'USD', NULL, NOW())
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('invoices', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM invoices), 1)
);

-- -------------------------------------------------------------------
-- 8) Transactions
-- Wallet IDs are stable because we seeded wallets first.
-- -------------------------------------------------------------------
INSERT INTO transactions (
  id,
  wallet_id,
  escrow_id,
  invoice_id,
  rate_id,
  sender_user_id,
  receiver_user_id,
  transaction_type,
  amount,
  currency_code,
  status,
  reference_no,
  description,
  created_at,
  processed_at
)
VALUES
  -- Escrow funded by client (wallet 1 belongs to user_id=1)
  (1, 1, 1, NULL, 1, 1, NULL, 'escrow_deposit', 2000.0000, 'USD', 'completed', 'REF-ESCROW-0001', 'Seed: fund escrow #1', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  -- Milestone payment released to freelancer (wallet 4 belongs to user_id=100002)
  (2, 4, 1, 1, 1, 1, 100002, 'milestone_payment', 800.0000, 'USD', 'completed', 'REF-MILESTONE-0001', 'Seed: release milestone #1', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  -- Withdrawal request (wallet 4, receiver is external so receiver_user_id NULL)
  (3, 4, NULL, NULL, 1, 100002, NULL, 'withdrawal', 50.0000, 'USD', 'pending', 'REF-WD-0001', 'Seed: withdrawal pending', NOW() - INTERVAL '1 days', NULL),
  -- Refund request (client wallet) - pending
  (4, 1, 1, NULL, 1, 1, NULL, 'refund', 100.0000, 'USD', 'pending', 'REF-RF-0001', 'Seed: refund pending', NOW() - INTERVAL '12 hours', NULL)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('transactions', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM transactions), 1)
);

-- -------------------------------------------------------------------
-- 9) Withdrawal & refund requests
-- -------------------------------------------------------------------
INSERT INTO withdrawal_requests (
  id,
  user_id,
  wallet_id,
  payment_method_id,
  transaction_id,
  amount,
  processing_fee,
  net_amount,
  currency_code,
  status,
  requested_at,
  processed_at,
  admin_note
)
VALUES
  (1, 100002, 4, 2, 3, 50.0000, 1.0000, 49.0000, 'USD', 'pending', NOW() - INTERVAL '1 days', NULL, NULL)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('withdrawal_requests', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM withdrawal_requests), 1)
);

INSERT INTO refund_requests (
  id,
  transaction_id,
  escrow_id,
  milestone_payment_id,
  requested_by,
  approved_by_admin,
  reason,
  refund_amount,
  status,
  created_at,
  resolved_at
)
VALUES
  (1, 4, 1, 2, 1, NULL, 'Seed: client requested refund for milestone #2 delay.', 100.0000, 'pending', NOW() - INTERVAL '12 hours', NULL)
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('refund_requests', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM refund_requests), 1)
);

-- -------------------------------------------------------------------
-- 10) Platform fee logs (optional but useful for dashboards)
-- -------------------------------------------------------------------
INSERT INTO platform_fee_logs (
  id,
  transaction_id,
  project_id,
  fee_type,
  fee_percentage,
  fee_amount,
  currency_code
)
VALUES
  (1, 2, 1, 'platform_fee', 0.0500, 40.0000, 'USD')
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('platform_fee_logs', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM platform_fee_logs), 1)
);

-- -------------------------------------------------------------------
-- 11) Payment notifications (the Module-7 backend uses this table)
-- -------------------------------------------------------------------
INSERT INTO payment_notifications (
  id,
  transaction_id,
  withdrawal_id,
  refund_id,
  recipient_id,
  notification_type,
  title,
  message,
  channel,
  status,
  sent_at,
  created_at
)
VALUES
  (1, 1, NULL, NULL, 1, 'escrow_funded', 'Escrow Funded', 'You funded escrow #1 with 2000 USD.', 'in_app', 'sent', NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  (2, 2, NULL, NULL, 100002, 'payment_received', 'Milestone Payment Released', '800 USD released for Design + Wireframes.', 'in_app', 'sent', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  (3, 3, 1, NULL, 100002, 'withdrawal_pending', 'Withdrawal Requested', 'Withdrawal of 50 USD is pending approval.', 'in_app', 'pending', NULL, NOW() - INTERVAL '1 days'),
  (4, 4, NULL, 1, 1, 'refund_requested', 'Refund Requested', 'Refund request of 100 USD created for escrow #1.', 'in_app', 'pending', NULL, NOW() - INTERVAL '12 hours')
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('payment_notifications', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM payment_notifications), 1)
);

COMMIT;

