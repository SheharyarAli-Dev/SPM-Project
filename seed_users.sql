-- ===================================================================
-- SEED DATA: Users & Profiles for Payment & Escrow Module (Module 7)
-- Run this against the centralized database AFTER the schema is created.
-- ===================================================================
-- NOTE: display_name is a GENERATED column (first_name || ' ' || last_name),
--       so we must NOT include it in the INSERT.
-- ===================================================================

-- ─── Users ─────────────────────────────────────────────────────────────────────
-- ID 1: Freelancer
INSERT INTO users (id, email, password_hash, first_name, last_name, role, account_status, is_email_verified, is_identity_verified, phone_number, country)
VALUES (1, 'ali.khan@example.com', '$2b$10$dummyhashfreelancer1234567890abcdef', 'Ali', 'Khan', 'freelancer', 'active', TRUE, TRUE, '+92-300-1234567', 'Pakistan')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  account_status = EXCLUDED.account_status,
  is_email_verified = EXCLUDED.is_email_verified,
  is_identity_verified = EXCLUDED.is_identity_verified,
  phone_number = EXCLUDED.phone_number,
  country = EXCLUDED.country,
  updated_at = CURRENT_TIMESTAMP;

-- ID 2: Client
INSERT INTO users (id, email, password_hash, first_name, last_name, role, account_status, is_email_verified, is_identity_verified, phone_number, country)
VALUES (2, 'sara.ahmed@example.com', '$2b$10$dummyhashclient1234567890abcdefgh', 'Sara', 'Ahmed', 'client', 'active', TRUE, TRUE, '+92-321-9876543', 'Pakistan')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  account_status = EXCLUDED.account_status,
  is_email_verified = EXCLUDED.is_email_verified,
  is_identity_verified = EXCLUDED.is_identity_verified,
  phone_number = EXCLUDED.phone_number,
  country = EXCLUDED.country,
  updated_at = CURRENT_TIMESTAMP;

-- ID 3: Admin
INSERT INTO users (id, email, password_hash, first_name, last_name, role, account_status, is_email_verified, is_identity_verified, phone_number, country)
VALUES (3, 'admin@nfsvp.gov.pk', '$2b$10$dummyhashadmin1234567890abcdefghij', 'Usman', 'Malik', 'admin', 'active', TRUE, TRUE, '+92-333-5551234', 'Pakistan')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  account_status = EXCLUDED.account_status,
  is_email_verified = EXCLUDED.is_email_verified,
  is_identity_verified = EXCLUDED.is_identity_verified,
  phone_number = EXCLUDED.phone_number,
  country = EXCLUDED.country,
  updated_at = CURRENT_TIMESTAMP;

-- ID 4: Second Freelancer
INSERT INTO users (id, email, password_hash, first_name, last_name, role, account_status, is_email_verified, is_identity_verified, phone_number, country)
VALUES (4, 'fatima.noor@example.com', '$2b$10$dummyhashfreelancer2abcdefghijk', 'Fatima', 'Noor', 'freelancer', 'active', TRUE, FALSE, '+92-345-6789012', 'Pakistan')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  account_status = EXCLUDED.account_status,
  is_email_verified = EXCLUDED.is_email_verified,
  is_identity_verified = EXCLUDED.is_identity_verified,
  phone_number = EXCLUDED.phone_number,
  country = EXCLUDED.country,
  updated_at = CURRENT_TIMESTAMP;

-- ID 5: Second Client
INSERT INTO users (id, email, password_hash, first_name, last_name, role, account_status, is_email_verified, is_identity_verified, phone_number, country)
VALUES (5, 'bilal.hassan@example.com', '$2b$10$dummyhashclient2abcdefghijklmno', 'Bilal', 'Hassan', 'client', 'active', TRUE, TRUE, '+92-312-3456789', 'Pakistan')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  role = EXCLUDED.role,
  account_status = EXCLUDED.account_status,
  is_email_verified = EXCLUDED.is_email_verified,
  is_identity_verified = EXCLUDED.is_identity_verified,
  phone_number = EXCLUDED.phone_number,
  country = EXCLUDED.country,
  updated_at = CURRENT_TIMESTAMP;

-- Reset the sequence so the next auto-generated ID starts after our seed data
SELECT setval('users_id_seq', GREATEST((SELECT MAX(id) FROM users), 5));

-- ─── Profiles ──────────────────────────────────────────────────────────────────
INSERT INTO profiles (user_id, headline, bio, location, profile_image_url, hourly_rate, experience_years, availability_status, trust_score, tier_level, reputation_level, total_reviews, average_rating, skills, badges)
VALUES (1, 'Full-Stack Developer & UI Engineer', 'Experienced developer specializing in React, Node.js, and cloud architecture. Delivered 50+ projects on the platform.', 'Lahore, Pakistan', NULL, 45.0000, 6.5, 'available', 4.70, 'expert', 5, 34, 4.8, ARRAY['React', 'Node.js', 'PostgreSQL', 'AWS'], ARRAY['Top Rated', 'Rising Talent'])
ON CONFLICT (user_id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  profile_image_url = EXCLUDED.profile_image_url,
  hourly_rate = EXCLUDED.hourly_rate,
  experience_years = EXCLUDED.experience_years,
  availability_status = EXCLUDED.availability_status,
  trust_score = EXCLUDED.trust_score,
  tier_level = EXCLUDED.tier_level,
  reputation_level = EXCLUDED.reputation_level,
  total_reviews = EXCLUDED.total_reviews,
  average_rating = EXCLUDED.average_rating,
  skills = EXCLUDED.skills,
  badges = EXCLUDED.badges,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO profiles (user_id, headline, bio, location, profile_image_url, hourly_rate, experience_years, availability_status, trust_score, tier_level, reputation_level, total_reviews, average_rating, skills, badges)
VALUES (2, 'Tech Startup Founder', 'Running a SaaS company building tools for the Pakistan freelance ecosystem. Active client on the platform.', 'Islamabad, Pakistan', NULL, NULL, 8.0, 'available', 4.50, 'advanced', 4, 12, 4.5, ARRAY['Project Management', 'Business Strategy'], ARRAY['Verified Client'])
ON CONFLICT (user_id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  profile_image_url = EXCLUDED.profile_image_url,
  hourly_rate = EXCLUDED.hourly_rate,
  experience_years = EXCLUDED.experience_years,
  availability_status = EXCLUDED.availability_status,
  trust_score = EXCLUDED.trust_score,
  tier_level = EXCLUDED.tier_level,
  reputation_level = EXCLUDED.reputation_level,
  total_reviews = EXCLUDED.total_reviews,
  average_rating = EXCLUDED.average_rating,
  skills = EXCLUDED.skills,
  badges = EXCLUDED.badges,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO profiles (user_id, headline, bio, location, profile_image_url, hourly_rate, experience_years, availability_status, trust_score, tier_level, reputation_level, total_reviews, average_rating, skills, badges)
VALUES (3, 'Platform Administrator', 'Managing payments, escrow operations, and currency rates for the national platform.', 'Karachi, Pakistan', NULL, NULL, 10.0, 'available', 5.00, 'expert', 5, 0, 0.0, ARRAY['Administration', 'Finance'], ARRAY['Platform Admin'])
ON CONFLICT (user_id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  profile_image_url = EXCLUDED.profile_image_url,
  hourly_rate = EXCLUDED.hourly_rate,
  experience_years = EXCLUDED.experience_years,
  availability_status = EXCLUDED.availability_status,
  trust_score = EXCLUDED.trust_score,
  tier_level = EXCLUDED.tier_level,
  reputation_level = EXCLUDED.reputation_level,
  total_reviews = EXCLUDED.total_reviews,
  average_rating = EXCLUDED.average_rating,
  skills = EXCLUDED.skills,
  badges = EXCLUDED.badges,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO profiles (user_id, headline, bio, location, profile_image_url, hourly_rate, experience_years, availability_status, trust_score, tier_level, reputation_level, total_reviews, average_rating, skills, badges)
VALUES (4, 'Mobile App Developer', 'Flutter and React Native specialist. Building cross-platform apps for clients across Pakistan.', 'Karachi, Pakistan', NULL, 35.0000, 3.0, 'available', 3.80, 'intermediate', 3, 8, 4.2, ARRAY['Flutter', 'React Native', 'Firebase'], ARRAY['Rising Talent'])
ON CONFLICT (user_id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  profile_image_url = EXCLUDED.profile_image_url,
  hourly_rate = EXCLUDED.hourly_rate,
  experience_years = EXCLUDED.experience_years,
  availability_status = EXCLUDED.availability_status,
  trust_score = EXCLUDED.trust_score,
  tier_level = EXCLUDED.tier_level,
  reputation_level = EXCLUDED.reputation_level,
  total_reviews = EXCLUDED.total_reviews,
  average_rating = EXCLUDED.average_rating,
  skills = EXCLUDED.skills,
  badges = EXCLUDED.badges,
  updated_at = CURRENT_TIMESTAMP;

INSERT INTO profiles (user_id, headline, bio, location, profile_image_url, hourly_rate, experience_years, availability_status, trust_score, tier_level, reputation_level, total_reviews, average_rating, skills, badges)
VALUES (5, 'E-Commerce Business Owner', 'Operating multiple online stores. Frequently hires freelancers for design and development work.', 'Faisalabad, Pakistan', NULL, NULL, 5.0, 'available', 4.20, 'advanced', 3, 6, 4.0, ARRAY['E-Commerce', 'Digital Marketing'], ARRAY['Verified Client', 'Repeat Buyer'])
ON CONFLICT (user_id) DO UPDATE SET
  headline = EXCLUDED.headline,
  bio = EXCLUDED.bio,
  location = EXCLUDED.location,
  profile_image_url = EXCLUDED.profile_image_url,
  hourly_rate = EXCLUDED.hourly_rate,
  experience_years = EXCLUDED.experience_years,
  availability_status = EXCLUDED.availability_status,
  trust_score = EXCLUDED.trust_score,
  tier_level = EXCLUDED.tier_level,
  reputation_level = EXCLUDED.reputation_level,
  total_reviews = EXCLUDED.total_reviews,
  average_rating = EXCLUDED.average_rating,
  skills = EXCLUDED.skills,
  badges = EXCLUDED.badges,
  updated_at = CURRENT_TIMESTAMP;

-- ===================================================================
-- VERIFICATION: Run this to confirm the seed data
-- ===================================================================
-- SELECT u.id, u.display_name, u.email, u.role, u.account_status, u.country,
--        p.headline, p.trust_score, p.tier_level
-- FROM users u
-- LEFT JOIN profiles p ON p.user_id = u.id
-- WHERE u.id IN (1, 2, 3, 4, 5)
-- ORDER BY u.id;
-- ===================================================================
