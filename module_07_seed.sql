-- ================================================================
-- MODULE 7: PAYMENT & ESCROW SEED DATA
-- Corrected for SPM Centralized DB schema
-- Run AFTER the centralized DB schema has been created
-- ================================================================

BEGIN;

-- ============================================================
-- PREREQUISITE: Users (client=1, freelancer=2, admin=3)
-- ============================================================
INSERT INTO users (id, email, password_hash, first_name, last_name, role, account_status)
VALUES
  (1, 'client@nfsvs.com',     'hash_client',     'Sara',     'Khan',      'client',     'active'),
  (2, 'freelancer@nfsvs.com', 'hash_freelancer',  'Muhammad', 'Ali',       'freelancer', 'active'),
  (3, 'admin@nfsvs.com',      'hash_admin',       'Admin',    'User',      'admin',      'active')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- PREREQUISITE: Marketplace category, job, bid, project, milestones
-- ============================================================
INSERT INTO marketplace_categories (id, name, slug)
VALUES (1, 'Web Development', 'web-development')
ON CONFLICT (id) DO NOTHING;

INSERT INTO jobs (id, client_id, title, description, category_id, budget_min, budget_max, deadline)
VALUES (1, 1, 'E-Commerce Platform Redesign', 'Full redesign of e-commerce platform', 1, 2000, 5000, '2026-12-31')
ON CONFLICT (id) DO NOTHING;

INSERT INTO bids (id, job_id, freelancer_id, cover_letter, proposed_rate, estimated_days)
VALUES (1, 1, 2, 'I can deliver this project with quality', 3000, 90)
ON CONFLICT (id) DO NOTHING;

INSERT INTO projects (id, job_id, bid_id, client_id, freelancer_id, title, description, agreed_amount, start_date, deadline, status, is_milestone_based)
VALUES (1, 1, 1, 1, 2, 'E-Commerce Platform Redesign', 'Full redesign of e-commerce platform', 3000.0000, '2026-02-01', '2026-12-31', 'in_progress', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO project_milestones (id, project_id, title, description, amount, due_date, sort_order, status)
VALUES
  (1, 1, 'UI/UX Wireframes',      'Design all wireframes and mockups',       1000.0000, '2026-02-28', 1, 'approved'),
  (2, 1, 'Backend API – Phase 1', 'Develop core backend APIs',               1000.0000, '2026-03-31', 2, 'approved'),
  (3, 1, 'Final QA & Deployment', 'QA testing and production deployment',    1000.0000, '2026-04-30', 3, 'pending')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 1. WALLETS
-- ============================================================
INSERT INTO wallets (id, user_id, currency_code, available_balance, held_balance, reserved_balance, wallet_status, created_at, updated_at)
VALUES
  (1, 1, 'USD', 5000.0000, 3000.0000,    0.0000, 'active', '2026-01-10 09:00:00', '2026-04-20 14:30:00'),
  (2, 2, 'USD', 1200.0000,    0.0000,  500.0000, 'active', '2026-01-11 10:00:00', '2026-04-21 11:00:00'),
  (3, 3, 'USD',    0.0000,    0.0000,    0.0000, 'frozen', '2026-01-12 08:00:00', '2026-01-12 08:00:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. PAYMENT METHODS
-- ============================================================
INSERT INTO payment_methods (id, user_id, method_type, provider_name, account_title, account_number_masked, iban_or_wallet_id, country_code, is_verified, is_default, created_at, updated_at)
VALUES
  (1, 2, 'digital_wallet', 'JazzCash',    'Muhammad Ali', '****3456', 'jc_92003456789',              'PK', TRUE,  TRUE,  '2026-01-15 10:00:00', '2026-02-01 09:00:00'),
  (2, 2, 'digital_wallet', 'EasyPaisa',   'Muhammad Ali', '****7890', 'ep_03007890123',              'PK', TRUE,  FALSE, '2026-01-15 10:30:00', '2026-02-01 09:10:00'),
  (3, 2, 'digital_wallet', 'Payoneer',    'Muhammad Ali', '****0042', 'pyr_user42@example.com',      'PK', TRUE,  FALSE, '2026-01-16 11:00:00', '2026-02-05 08:00:00'),
  (4, 2, 'bank',           'Bank Alfalah','Muhammad Ali', '****8821', 'PK36ALFA0011000123456788821', 'PK', TRUE,  FALSE, '2026-01-17 12:00:00', '2026-02-06 10:00:00'),
  (5, 1, 'card',           'Stripe',      'Sara Khan',    '****4242', 'stripe_tok_4242424242424242',  'US', TRUE,  TRUE,  '2026-01-18 09:00:00', '2026-03-01 07:30:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. CURRENCY RATES
-- ============================================================
INSERT INTO currency_rates (id, base_currency, target_currency, exchange_rate, source_api, fetched_at, is_active)
VALUES
  (1, 'PKR', 'USD', 0.00358400, 'ExchangeRate-API', '2026-04-18 00:00:00', FALSE),
  (2, 'PKR', 'USD', 0.00359100, 'ExchangeRate-API', '2026-04-20 00:00:00', TRUE),
  (3, 'EUR', 'USD', 1.08450000, 'ExchangeRate-API', '2026-04-20 00:00:00', TRUE),
  (4, 'GBP', 'USD', 1.26720000, 'ExchangeRate-API', '2026-04-20 00:00:00', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 4. ESCROW ACCOUNTS
-- ============================================================
INSERT INTO escrow_accounts (id, project_id, client_user_id, freelancer_user_id, currency_code, total_amount, funded_amount, released_amount, refunded_amount, escrow_status, created_at, funded_at, closed_at, updated_at)
VALUES
  (1, 1, 1, 2, 'USD', 3000.0000, 3000.0000, 1000.0000, 0.0000, 'partial', '2026-02-01 10:00:00', '2026-02-01 10:15:00', NULL, '2026-04-15 12:00:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. MILESTONE PAYMENTS
-- ============================================================
INSERT INTO milestone_payments (id, escrow_id, milestone_id, title, amount, due_date, approval_status, release_status, approved_at, released_at, created_at, updated_at)
VALUES
  (1, 1, 1, 'UI/UX Wireframes',      1000.0000, '2026-02-28', 'approved', 'released',     '2026-03-01 14:00:00', '2026-03-02 09:00:00', '2026-02-01 10:30:00', '2026-03-02 09:00:00'),
  (2, 1, 2, 'Backend API – Phase 1', 1000.0000, '2026-03-31', 'approved', 'not_released', '2026-04-01 10:00:00', NULL,                  '2026-02-01 10:35:00', '2026-04-01 10:00:00'),
  (3, 1, 3, 'Final QA & Deployment', 1000.0000, '2026-04-30', 'pending',  'not_released', NULL,                  NULL,                  '2026-02-01 10:40:00', '2026-02-01 10:40:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. INVOICES
-- ============================================================
INSERT INTO invoices (id, invoice_number, milestone_payment_id, project_id, client_user_id, freelancer_user_id, gross_amount, platform_fee, tax_amount, net_amount, currency_code, invoice_pdf_url, generated_at)
VALUES
  (1, 'INV-2026-00001', 1, 1, 1, 2, 1000.0000, 50.0000, 0.0000, 950.0000, 'USD', 'storage/invoices/INV-2026-00001.pdf', '2026-03-02 09:05:00'),
  (2, 'INV-2026-00002', 2, 1, 1, 2, 1000.0000, 50.0000, 0.0000, 950.0000, 'USD', NULL,                                  '2026-04-01 10:10:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 7. TRANSACTIONS
-- ============================================================
INSERT INTO transactions (id, wallet_id, escrow_id, invoice_id, rate_id, sender_user_id, receiver_user_id, transaction_type, amount, currency_code, status, reference_no, description, created_at, processed_at)
VALUES
  (1, 1, NULL, NULL, NULL, NULL, 1, 'deposit',          8000.0000, 'USD', 'completed', 'STRIPE-CH-8A2F3D4E5B',    'Client wallet top-up via Stripe',                              '2026-02-01 09:00:00', '2026-02-01 09:02:00'),
  (2, 1, 1,    NULL, NULL, 1,    NULL, 'escrow_funding', 3000.0000, 'USD', 'completed', 'ESC-FUND-20260201-001',   'Escrow funded for Project 1',                                  '2026-02-01 10:15:00', '2026-02-01 10:16:00'),
  (3, 2, 1,    1,    NULL, 2,    NULL, 'fee_deduction',    50.0000, 'USD', 'completed', 'FEE-20260302-001',        'Platform commission 5% on Milestone 1 release',                '2026-03-02 09:00:00', '2026-03-02 09:01:00'),
  (4, 2, 1,    1,    NULL, NULL, 2,    'milestone_release',950.0000,'USD', 'completed', 'REL-20260302-001',        'Milestone 1 payment released to freelancer',                   '2026-03-02 09:01:00', '2026-03-02 09:02:00'),
  (5, 2, NULL, NULL, NULL, 2,    NULL, 'withdrawal',      500.0000, 'USD', 'completed', 'WDR-20260310-001',        'Freelancer withdrawal to JazzCash',                            '2026-03-10 11:00:00', '2026-03-10 11:45:00'),
  (6, 1, 1,    NULL, NULL, NULL, 1,    'refund',          200.0000, 'USD', 'completed', 'REF-20260415-001',        'Partial refund to client per dispute resolution DIS-2026-007', '2026-04-15 13:00:00', '2026-04-15 13:05:00'),
  (7, 2, 1,    1,    NULL, NULL, NULL, 'reversal',         50.0000, 'USD', 'completed', 'REV-20260302-001',        'Reversal of erroneous duplicate fee_deduction',                '2026-03-02 09:30:00', '2026-03-02 09:31:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 8. WITHDRAWAL REQUESTS
-- ============================================================
INSERT INTO withdrawal_requests (id, user_id, wallet_id, payment_method_id, transaction_id, amount, processing_fee, net_amount, currency_code, status, requested_at, processed_at, admin_note)
VALUES
  (1, 2, 2, 1, 5,    500.0000, 5.0000, 495.0000, 'USD', 'completed', '2026-03-10 11:00:00', '2026-03-10 11:45:00', 'Processed successfully via JazzCash'),
  (2, 2, 2, 3, NULL, 300.0000, 3.0000, 297.0000, 'USD', 'pending',   '2026-04-22 10:00:00', NULL,                  NULL),
  (3, 2, 2, 4, NULL, 150.0000, 1.5000, 148.5000, 'USD', 'rejected',  '2026-03-20 09:00:00', '2026-03-21 08:00:00', 'Bank account IBAN could not be verified')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 9. REFUND REQUESTS
-- ============================================================
INSERT INTO refund_requests (id, transaction_id, escrow_id, milestone_payment_id, requested_by, approved_by_admin, reason, refund_amount, status, created_at, resolved_at)
VALUES
  (1, 6, 1, NULL, 1, 3, 'Dispute resolved in client favour: freelancer delivered incomplete work on Milestone 3.',          200.0000,  'pending',  '2026-04-14 16:00:00', '2026-04-15 13:05:00'),
  (2, 2, 1, 3,    1, 3, 'Client requested refund for Milestone 3 after project scope reduction.',                          1000.0000, 'pending',  '2026-04-20 09:00:00', NULL),
  (3, 2, 1, 2,    1, NULL,'Client claims Milestone 2 deliverable did not meet acceptance criteria. Pending admin review.', 500.0000,  'pending',  '2026-04-21 11:00:00', NULL)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 10. PLATFORM FEE LOGS
-- ============================================================
INSERT INTO platform_fee_logs (id, transaction_id, project_id, fee_type, fee_percentage, fee_amount, currency_code, created_at)
VALUES
  (1, 3, 1, 'platform_commission', 0.0500, 50.0000, 'USD', '2026-03-02 09:01:00'),
  (2, 5, 1, 'withdrawal_fee',      0.0100,  5.0000, 'USD', '2026-03-10 11:00:00'),
  (3, 6, 1, 'platform_commission', 0.0500, 10.0000, 'USD', '2026-04-15 13:00:00')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 11. PAYMENT NOTIFICATIONS
-- ============================================================
INSERT INTO payment_notifications (id, transaction_id, withdrawal_id, refund_id, recipient_id, notification_type, title, message, channel, status, sent_at, created_at)
VALUES
  (1, 2,    NULL, NULL, 1, 'escrow_funded',       'Escrow Funded Successfully',          'Your payment of $3,000.00 has been locked in escrow for Project 1.',                                        'email', 'sent', '2026-02-01 10:16:00', '2026-02-01 10:16:00'),
  (2, 2,    NULL, NULL, 2, 'escrow_funded',       'Project Escrow is Ready',             'The client has funded the escrow for Project 1 with $3,000.00. You may begin work.',                        'in_app','sent', '2026-02-01 10:17:00', '2026-02-01 10:17:00'),
  (3, NULL, NULL, NULL, 2, 'milestone_approved',  'Milestone Approved – Payment Incoming','The client has approved your submission for UI/UX Wireframes. Your payment of $950.00 will be released.', 'in_app','sent', '2026-03-01 14:05:00', '2026-03-01 14:05:00'),
  (4, 4,    NULL, NULL, 2, 'payment_released',    'Payment Released to Your Wallet',     'You have received $950.00 for completing milestone UI/UX Wireframes on Project 1.',                         'in_app','sent', '2026-03-02 09:02:00', '2026-03-02 09:02:00'),
  (5, 4,    NULL, NULL, 1, 'invoice_ready',       'Invoice Ready – INV-2026-00001',      'Invoice INV-2026-00001 for $1,000.00 has been generated for Milestone 1.',                                  'email', 'sent', '2026-03-02 09:05:00', '2026-03-02 09:05:00'),
  (6, 5,    1,    NULL, 2, 'withdrawal_approved', 'Withdrawal Approved – $495.00 Sent',  'Your withdrawal of $495.00 to your JazzCash account has been processed successfully.',                       'in_app','sent', '2026-03-10 11:46:00', '2026-03-10 11:46:00'),
  (7, 1,    NULL, NULL, 1, 'payment_received',    'Wallet Top-Up Successful',            'Your wallet has been credited with $8,000.00 via Stripe.',                                                   'email', 'sent', '2026-02-01 09:02:00', '2026-02-01 09:02:00'),
  (8, 6,    NULL, 1,    1, 'refund_processed',    'Refund Processed – $200.00 Returned', 'A refund of $200.00 has been credited to your wallet following dispute resolution.',                         'in_app','pending',NULL,                '2026-04-15 13:06:00'),
  (9, NULL, 3,    NULL, 2, 'withdrawal_rejected', 'Withdrawal Request Rejected',         'Your withdrawal of $150.00 to Bank Alfalah was rejected. IBAN could not be verified.',                      'email', 'pending',NULL,               '2026-03-21 08:01:00')
ON CONFLICT (id) DO NOTHING;

-- Reset sequences so new inserts don't conflict
SELECT setval('wallets_id_seq',              (SELECT MAX(id) FROM wallets));
SELECT setval('payment_methods_id_seq',      (SELECT MAX(id) FROM payment_methods));
SELECT setval('currency_rates_id_seq',       (SELECT MAX(id) FROM currency_rates));
SELECT setval('escrow_accounts_id_seq',      (SELECT MAX(id) FROM escrow_accounts));
SELECT setval('milestone_payments_id_seq',   (SELECT MAX(id) FROM milestone_payments));
SELECT setval('invoices_id_seq',             (SELECT MAX(id) FROM invoices));
SELECT setval('transactions_id_seq',         (SELECT MAX(id) FROM transactions));
SELECT setval('withdrawal_requests_id_seq',  (SELECT MAX(id) FROM withdrawal_requests));
SELECT setval('refund_requests_id_seq',      (SELECT MAX(id) FROM refund_requests));
SELECT setval('platform_fee_logs_id_seq',    (SELECT MAX(id) FROM platform_fee_logs));
SELECT setval('payment_notifications_id_seq',(SELECT MAX(id) FROM payment_notifications));

COMMIT;