"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const {
  ensureCorrectUserOrAdmin,
  ensureAdmin,
} = require("../middleware/auth.js");
const { BadRequestError } = require("../expressError.js");

const Journal = require("../models/journal.js");
const JournalNewSchema = require("../schemas/journalNew.json");
const JournalUpdateSchema = require("../schemas/journalUpdate.json");

const router = express.Router();

/** GET /[username]/journal => {journal}
 *
 * Returns  journal: { username, journal}

 * Authorization required: admin or same user-as-:username
 **/

router.get(
  "/:username/journal",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const journal = await Journal.getAllByUsername(req.params.username);

      return res.json({ journal });
    } catch (err) {
      return next(err);
    }
  }
);

// backend route for fetching a specific journal entry by ID
// Backend route for fetching a specific journal entry by ID
router.get("/:username/journal/:id", async function (req, res, next) {
  try {
    const id = req.params.id;

    // Assuming getById function expects the journal ID as a parameter
    const journal = await Journal.getById(id);

    return res.json({ journal });
  } catch (err) {
    return next(err);
  }
});

// /** POST /[username]/journal => { journal:{ id, username, journal_entry,journal_date,activity_name} }
//    *
//    * Returns  journal:{ id, username, journal_entry,journal_date,activity_name},{...}]

//    * Authorization required: admin or same user-as-:username
//    **/

router.post(
  "/:username/journal/add",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { journal_entry, activity_name, journal_date } = req.body;
      const username = req.params.username;

      // Validate the request data using jsonschema
      const validator = jsonschema.validate(
        { username, journal_entry, activity_name, journal_date },
        JournalNewSchema
      );

      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      // Create a new journal entry
      const journal = await Journal.create({
        username,
        journal_entry,
        activity_name,
        journal_date,
      });

      return res.status(201).json({ journal });
    } catch (err) {
      return next(err);
    }
  }
);

router.put(
  "/:username/journal/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, id } = req.params;
      const { journal_entry, journal_date, activity_name } = req.body;

      // Validate the request data
      const validator = jsonschema.validate(
        { journal_entry, journal_date, activity_name },
        JournalUpdateSchema
      );
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      // Update the journal entry
      const updatedJournal = await Journal.update(id, {
        journal_entry,
        journal_date,
        activity_name,
      });

      return res.status(201).json({ journal: updatedJournal });
    } catch (err) {
      return next(err);
    }
  }
);

// router.put(
//   "/:username/journal/:id",
//   ensureCorrectUserOrAdmin,
//   async function (req, res, next) {
//     try {
//       const { username, id } = req.params;
//       const { journal_entry } = req.body;

//       const validator = jsonschema.validate(
//         { journal_entry, journal_date, activity_name },
//         JournalUpdateSchema
//       );
//       if (!validator.valid) {
//         const errs = validator.errors.map((e) => e.stack);
//         throw new BadRequestError(errs);
//       }

//       const journal = await Journal.update(req.params.username, {
//         journal_entry,
//         journal_date,
//         activity_name,
//       });
//       return res.status(201).json({ journal });
//     } catch (err) {
//       return next(err);
//     }
//   }
// );

router.delete(
  "/:username/journal/:id",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const { username, id } = req.params;
      await Journal.remove(id);
      return res.json({ deleted: "Journal deleted" });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
