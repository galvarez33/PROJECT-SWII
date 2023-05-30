// Load environment variables
require('dotenv').config();

// Import libraries and helper functions
const getTargetUrls = require('./scripts/scraping_ant');
const scrapePasteBin = require('./scripts/pastebin');
const updateService = require('./scripts/scrapiffy_integration');

/**
 * Main function. Acts as entry point to the program.
 * 
 * @returns {Promise}
 */
async function main() {
  const pasteBinUrls = await getTargetUrls();
  const matches = await scrapePasteBin(pasteBinUrls);
  updateService(matches);
}

// Run main function
(async() => await main());