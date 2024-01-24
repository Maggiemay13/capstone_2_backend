"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for Activities. */

class ActivitiesCalendar {
  /** Create a activity (from data), update db, return new activity data.
   *
   * data should be { username, activity_name, activity_description }
   *
   * Returns { id, username, activity_name, activity_description }
   **/

  static async create(data) {
    const result = await db.query(
      `INSERT INTO activities_calendar (
        username,
        activity_name,
        activity_description,
        repeat_frequency,
        start_time, 
        start_date
        )
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING id, username,activity_name, activity_description , repeat_frequency, start_time, start_date`,
      [
        data.username,
        data.activity_name,
        data.activity_description,
        data.repeat_frequency,
        data.start_time,
        data.start_date,
      ]
    );
    let activities = result.rows[0];

    return activities;
  }

  /** Find all activites history  related to username
   *

   * Returns[{id, username,activityName, activityDescription.]

   * */

  static async findAll({ username }) {
    const result = await db.query(
      `SELECT * FROM activities_calendar 
      WHERE username = $1`,
      [username]
    );
    return result.rows;
  }

  /** Given a activities id, return data about activities history.
   *
   * Returns [{id, username,activityName, activityDescription.}]

   *
   * Throws NotFoundError if not found.
   **/

  static async get(id) {
    const activityRes = await db.query(
      `SELECT * 
           FROM activities_calendar
           WHERE id = $1`,
      [id]
    );

    const activities = activityRes.rows[0];

    if (!activities) throw new NotFoundError(`No activity history: ${id}`);

    return activities;
  }

  /** Update activities data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain
   * all the fields; this only changes provided ones.
   *
   * Data can include: {id, username,activityName, activityDescription}
   *
   * Returns {id, activityName, activityDescription}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE activities_calendar
                      SET ${setCols} 
                      WHERE id = ${idVarIdx} 
                      RETURNING id,  
                                activity_name, 
                                activity_description `;
    const result = await db.query(querySql, [...values, id]);
    const activities = result.rows[0];

    if (!activities) throw new NotFoundError(`No activity history: ${id}`);

    return activities;
  }

  /** Delete given activity id from database; returns undefined.
   *
   * Throws NotFoundError if company not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
           FROM activities_calendar
           WHERE id = $1
           RETURNING id`,
      [id]
    );
    const activities = result.rows[0];

    if (!activities) throw new NotFoundError(`No activities history: ${id}`);
  }
}

module.exports = ActivitiesCalendar;
