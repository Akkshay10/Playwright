const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');
const { chromium, webkit, firefox, devices } = require('playwright');

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async openBrowser(browserType = 'chromium', device = null) {
    const isHeadless = process.env.HEADLESS === 'true'; // Check if the browser should be headless
    let browserOptions = {};

    switch (browserType) {
      case 'webkit':
        if (device && devices[device]) {
          browserOptions = { ...devices[device] };
        }
        this.browser = await webkit.launch({ headless: isHeadless });
        break;
      case 'firefox':
        if (device && devices[device]) {
          browserOptions = { ...devices[device] };
        }
        this.browser = await firefox.launch({ headless: isHeadless });
        break;
      case 'chromium':
      default:
        if (device && devices[device]) {
          browserOptions = { ...devices[device] };
        }
        this.browser = await chromium.launch({ headless: isHeadless });
        break;
    }

    this.context = await this.browser.newContext(browserOptions);
    this.page = await this.context.newPage();
  }

  async closeBrowser() {
    const isTraceEnabled = process.env.ENABLE_TRACE === 'true';

    // Stop tracing and save the trace file if enabled
    if (isTraceEnabled) {
      await this.context.tracing.stop({ path: 'trace.zip' });
    }

    if (this.page) {
      await this.page.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }
}

setWorldConstructor(CustomWorld);
setDefaultTimeout(60 * 1000);
