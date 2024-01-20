"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");

const ActivitiesCalendar = require("../models/activitiesCalendar");
const activititesNew = require("../schemas/activitiesNew.json");
const activitiesUpdate = require("../schemas/activitiesUpdate.json");

const router = express.Router();

/** GET /[username]/activities => { user.activities }
 *
 * Returns  activities: [{ id, username, activity_name, activity_description},{...}] 

 * Authorization required: admin or same user-as-:username
 **/

router.get(
  "/:username/activities",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const activities = await ActivitiesCalendar.findAll({
        username: req.params.username,
      });

      return res.json({ activities });
    } catch (err) {
      return next(err);
    }
  }
);

/** GET /[username]/activities/[id] => {.activities }
   *
   * Returns  activities: { id, username, activity_name,activity_description}
  
   * Authorization required: admin or same user-as-:username
   **/

router.get(
  "/:username/activities/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const activities = await ActivitiesCalendar.get(req.params.id);
      if (!activities) {
        // Assuming findAll returns an empty array if no records are found
        return res
          .status(404)
          .json({ error: "User not found or no activity history" });
      }
      return res.json({ activities });
    } catch (err) {
      return next(err);
    }
  }
);

/** POST /[username]/activities => { activities: { id, username, activity_name,activity_description} }
   *
   * Returns activities: { id, username, activity_name,activity_description},{...}] 
  
   * Authorization required: admin or same user-as-:username
   **/

router.post(
  "/:username/activities/add",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const {
        activity_name,
        activity_description,
        repeat_frequency,
        start_time,
        start_date,
      } = req.body;
      const username = req.params.username;
      const validator = jsonschema.validate(
        {
          username,
          activity_name,
          activity_description,
          repeat_frequency,
          start_time,
          start_date,
        },
        activititesNew
      );
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const activites = await ActivitiesCalendar.create(
        {
          username,
          activity_name,
          activity_description,
          repeat_frequency,
          start_time,
          start_date,
        },
        activititesNew
      );
      return res.status(201).json({ activites });
    } catch (err) {
      return next(err);
    }
  }
);
/** POST /[username]/activities/:id => { status,start_date, stop_date} 
   *
   * Returns  activities: { id, username, drug_name,status,start_date, stop_date},{...}] 
  
   * Authorization required: admin or same user-as-:username
   **/
router.put(
  "/:username/activities/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { activity_name, activity_description } = req.body;
      const { username, id } = req.params;

      const validator = jsonschema.validate(
        { activity_name, activity_description },
        activitiesUpdate
      );
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const activites = await ActivitiesCalendar.update(id, {
        activity_name: activity_name,
        activity_description: activity_description,
      });
      return res.status(201).json({ activites });
    } catch (err) {
      return next(err);
    }
  }
);

router.delete(
  "/:username/activites/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, id } = req.params;
      await ActivitiesCalendar.remove(id);
      return res.json({ deleted: id });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
