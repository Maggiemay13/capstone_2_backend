const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config.js");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM journal");
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");

  await db.query(`
    INSERT INTO journal ( username,activity_name,journal_entry, journal_date)
    VALUES ('U1','Walk','10 min walk was great', '2024-01-14'),
           ('U2','Meditate','almost fell asleep', '2024-01-14')
           `);

  await db.query(
    `
        INSERT INTO users(username,
                          password,
                          )
        VALUES ('u1', $1),
               ('u2', $2)
        RETURNING username`,

    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};
