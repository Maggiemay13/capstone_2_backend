\echo 'Delete and recreate jobly db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE mindful_moment;
CREATE DATABASE mindful_moment;
\connect mindful_moment

\i mindful_moment-schema.sql


\echo 'Delete and recreate mindful_moment_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE mindful_moment_test;
CREATE DATABASE mindful_moment_test;
\connect mindful_moment_test

\i mindful_moment-schema.sql
