-- This file will be executed automatically by Spring Boot on startup.
-- It inserts the necessary roles if they don't already exist.

INSERT INTO roles(name) VALUES('USER') ON CONFLICT (name) DO NOTHING;
INSERT INTO roles(name) VALUES('ADMIN') ON CONFLICT (name) DO NOTHING;
