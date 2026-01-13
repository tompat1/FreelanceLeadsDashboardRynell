CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  company TEXT,
  email TEXT,
  stage TEXT,
  last_touchpoint TEXT,
  next_action TEXT,
  created_at TEXT NOT NULL
);
