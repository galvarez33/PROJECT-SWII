const axios = require('axios');
const { URLMatcher } = require('./matchers');

/**
 * Function to use API to look for target URLs using Scraping Ant's API.
 * 
 * @param {Array<String>} keywords Keywords to query using Scraping Ant.
 * @returns {Promise<Array<String>>} List of pasteBin URLs to scrape using selenium.
 */
async function getTargetUrls(keywords) {
  const pasteBinUrls = [];
  keywords.forEach(async (keyword) => {
    const pageSource = await makeAPIRequest(keyword);
    const extractedUrls = extractPastBinUrls(pageSource);

    pasteBinUrls.push(extractedUrls);
  });

  return pasteBinUrls;
}

/**
 * Function that gets PastBins landing page using Scraping Ants.
 * 
 * @param {String} keyword Keyword to use in request
 * @returns {Promise<String>} html source of PastBins page for requested query.
 */
async function makeAPIRequest(keyword) {
  // Build google query -> format keyword to replace spaces with +
  const formatedKeyword = `"${keyword.replace(' ', '+')}"`;""
  const googleQuery = `https://www.google.com/search?q=site:pastebin.com+${formatedKeyword}`;
  const encodedQuery = encodeURIComponent(googleQuery);

  try {
    // Make API request
    const response = await axios.get(process.env.SCRAPING_ANT_URI, {
      params: {
        url: encodedQuery,
        "x-api-key": process.env.SCRAPING_ANT_KEY
      }
    });

    // Return request body
    response.data;
  } catch {
    return '';
  }
}

/**
 * Function that extracts all PastBin URLs from a document. 
 * 
 * @param {String} pageSource HTML source to extract pasteBin URLs from.
 */
function extractPastBinUrls(pageSource) {
  // Get urls from document
  const matcher = new URLMatcher();
  const urls = matcher.getMatches(pageSource);

  // Filter out non-pastebin urls
  urls.filter(url => url.includes('pastebin.com/'));
}

module.exports = getTargetUrls;
