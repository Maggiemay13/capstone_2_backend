"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Journal {
  static async getAllByUsername(username) {
    const journalRes = await db.query(
      `SELECT *
       FROM journal
       WHERE username = $1`,
      [username]
    );

    const journals = journalRes.rows;

    return journals;
  }

  static async getById(id) {
    const result = await db.query("SELECT * FROM journal WHERE id = $1", [id]);

    const journal = result.rows[0];

    if (!journal) {
      throw new NotFoundError(`Journal entry with ID ${id} not found.`);
    }

    return journal;
  }

  /** Create a journal_entry (from data), update db, return new journal_entry data.
   *
   * data should be { username, journal_entry, journal_date, activity_name  }
   *
   * Returns {username, journal_entry, journal_date, activity_name }
   **/

  static async create(data) {
    const result = await db.query(
      `INSERT INTO journal (username,
       journal_entry, 
       journal_date, 
       activity_name)
           VALUES ($1, $2, $3, $4)
           RETURNING username, journal_entry, journal_date, activity_name`,
      [data.username, data.journal_entry, data.journal_date, data.activity_name]
    );
    let journal = result.rows[0];

    return journal;
  }

  /** Given a username, return data about the user's journal.
   *
   * Returns { username, journal }

   *
   * Throws NotFoundError if not found.
   **/

  static async get(user) {
    const journalRes = await db.query(
      `SELECT *
           FROM journal
           WHERE username = $1`,
      [user]
    );

    const journal = journalRes.rows[0];

    if (!journal)
      throw new NotFoundError(
        `No journal entries found for: ${user}'s journal`
      );

    return journal;
  }

  static async get(id) {
    const journalRes = await db.query(
      `SELECT *
           FROM journal
           WHERE  id = $1`,
      [id]
    );

    const journal = journalRes.rows[0];

    if (!journal)
      throw new NotFoundError(
        `No journal entries found for: ${user}'s journal`
      );

    return journal;
  }

  /** Update journal data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: { journal_entry, journal_date, activity_name}
   *
   * Returns {username,journal_entry, journal_date, activity_name}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);
    const querySql = `UPDATE journal
                        SET ${setCols}
                        WHERE id = ${idVarIdx}
                        RETURNING id, username, journal_entry, journal_date, activity_name`;
    const result = await db.query(querySql, [...values, id]);
    const journal = result.rows[0];

    if (!journal) throw new NotFoundError(`No journal found for: ${id}`);

    return journal;
  }

  /** Delete given journal from database; returns undefined.
   *
   * Throws NotFoundError if journal not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM journal
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const journal = result.rows[0];

    if (!journal) throw new NotFoundError(`No journal for: ${id}`);
  }
}

module.exports = Journal;
