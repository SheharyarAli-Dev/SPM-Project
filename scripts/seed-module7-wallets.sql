-- Minimal seed for Module 7 local dev: users required by wallets FK + wallet rows.
-- Freelancer wallets use user_id = platform_user_id + 100000 (see wallets.service.ts).

INSERT INTO users (id, email, password_hash, first_name, last_name, role) VALUES
  (1, 'demo-user-1@seed.local', 'seed-not-for-login', 'Demo', 'UserOne', 'freelancer'),
  (2, 'demo-user-2@seed.local', 'seed-not-for-login', 'Demo', 'UserTwo', 'freelancer'),
  (100001, 'wallet-persona-1@seed.internal', 'seed', 'Wallet', 'PersonaU1', 'freelancer'),
  (100002, 'wallet-persona-2@seed.internal', 'seed', 'Wallet', 'PersonaU2', 'freelancer')
ON CONFLICT (id) DO NOTHING;

SELECT setval(
  pg_get_serial_sequence('users', 'id'),
  GREATEST((SELECT COALESCE(MAX(id), 1) FROM users), 1)
);

INSERT INTO wallets (user_id, available_balance, held_balance, reserved_balance, currency_code, wallet_status) VALUES
  (1, 1000.0000, 0, 0, 'USD', 'active'),
  (2, 500.0000, 0, 0, 'USD', 'active'),
  (100001, 250.0000, 0, 0, 'USD', 'active'),
  (100002, 100.0000, 0, 0, 'USD', 'active')
ON CONFLICT (user_id) DO NOTHING;
