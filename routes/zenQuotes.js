router.get("/", async function (req, res, next) {
  try {
    const response = await getZenQuote();
    res.json(response);
  } catch (err) {
    next(err);
  }
});
