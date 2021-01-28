BEGIN;

TRUNCATE
  "word",
  "language",
  "user";

INSERT INTO "user" ("id", "username", "name", "password")
VALUES
  (
    1,
    'admin',
    'Dunder Mifflin Admin',
    -- password = "pass"
    '$2a$10$fCWkaGbt7ZErxaxclioLteLUgg4Q3Rp09WW0s/wSLxDKYsaGYUpjG'
  );

INSERT INTO "language" ("id", "name", "user_id")
VALUES
  (1, 'German', 1);

INSERT INTO "word" ("id", "language_id", "original", "translation", "next")
VALUES
  (1, 1, 'die Schlange', 'snake', 2),
  (2, 1, 'die Höhenangst', 'fear of heights', 3),
  (3, 1, 'die Lebensfreude', 'joy of life', 4),
  (4, 1, 'dämpfen', 'to curb or lessen', 5),
  (5, 1, 'der Aberglaube', 'superstitious', 6),
  (6, 1, 'auftauchen', 'to emerge', 7),
  (7, 1, 'die Aufgabe', 'task', 8),
  (8, 1, 'das Vergnügen', 'pleasure', null);

UPDATE "language" SET head = 1 WHERE id = 1;

-- because we explicitly set the id fields
-- update the sequencer for future automatic id setting
SELECT setval('word_id_seq', (SELECT MAX(id) from "word"));
SELECT setval('language_id_seq', (SELECT MAX(id) from "language"));
SELECT setval('user_id_seq', (SELECT MAX(id) from "user"));

SET CLIENT_ENCODING TO 'UTF8';

COMMIT;
