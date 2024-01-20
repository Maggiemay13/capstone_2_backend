"use strict";

const express = require("express");
const { getZenQuote } = require("../helpers/APIs");
const router = new express.Router();


router.get("/", async function (req, res, next) {
  try {
    const response = await getZenQuote();
    res.json(response);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
