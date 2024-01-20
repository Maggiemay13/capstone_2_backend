const axios = require("axios");
const { BadRequestError } = require("../expressError");

async function getZenQuote() {
  try {
    const response = await axios.get("https://zenquotes.io/api/random/");
    const { q, a } = response.data[0];
    return { quote: q, author: a };
  } catch (error) {
    console.error("Error fetching Zen quotes:", error.message);
    throw new BadRequestError("Error fetching Zen quotes");
  }
}

module.exports = {
  getZenQuote,
};
