const {Builder, Browser, By, Key, until} = require('selenium-webdriver');
const { Options } = require('selenium-webdriver/chrome');

(async function example() {
  // Hide window (headless mode -> faster)
  const options = new Options();
  options.addArguments('--headless');

  // Build webdriver
  const driver = await new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();

  try {
    // Go to url and print page source
    await driver.get('https://textbin.net/97ot3pwqqv');
    const source = await driver.getPageSource()
    console.log(source)
  } finally {
    // Close driver
    await driver.quit();
  }
})();
