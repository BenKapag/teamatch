INSERT INTO games (name)
VALUES
  ('Valorant'),
  ('Counter-Strike 2'),
  ('League of Legends'),
  ('Fortnite'),
  ('Apex Legends')
ON CONFLICT (name) DO NOTHING;