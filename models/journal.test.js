// journalEntries.test.js
const { NotFoundError, BadRequestError } = require("../expressError.js");

const Journal = require("./journal.js");
const db = require("../db.js");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("Journal", () => {
  describe("create", () => {
    test("creates a new journal entry", async () => {
      const data = {
        username: "testuser",
        journal_entry: "Test entry",
        journal_date: "2023-01-01",
        activity_name: "walking",
      };

      const journal = await Journal.create(data);

      expect(journal).toEqual(expect.objectContaining(data));
    });
  });

  describe("get", () => {
    test("gets a user's journal entry", async () => {
      const initialData = {
        username: "testuser",
        journal_entry: "Test entry",
        journal_date: "2023-01-01",
        activity_name: "walking",
      };

      // Insert initial data into the testing database
      await db.query(
        "INSERT INTO journal (username, journal_entry, journal_date, activity_name) VALUES ($1, $2, $3, $4)",
        [
          initialData.username,
          initialData.journal_entry,
          initialData.journal_date,
          initialData.activity_name,
        ]
      );

      const journal = await Journal.get("testuser");

      expect(journal).toEqual(expect.objectContaining(initialData));
    });

    test("throws NotFoundError if user's journal entry is not found", async () => {
      await expect(Journal.get("nonexistentuser")).rejects.toThrowError(
        "No journal entries found for: nonexistentuser's journal"
      );
    });
  });
});
