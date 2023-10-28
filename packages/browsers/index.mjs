import { default as puppeteerCore } from "puppeteer-core";
import { default as chromium } from "@sparticuz/chromium";
import { chromium as playwrightCore } from "playwright-core";

export const puppeteer = {
  /**
     * Launch a new Puppeteer Headless Browser
     *
     * After launching the browser, you can start new pages and perform browser actions
     *
     * @param opts = {}
     * @returns browser
     */
  async launch(opts = {}) {
    const browser = await puppeteerCore.launch({
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      defaultViewport: chromium.defaultViewport,
      cacheDirectory: "/tmp",
      args: [
        ...chromium.args,
        "--hide-scrollbars",
        "--disable-web-security",
      ],
      ...opts,
    });

    return browser;
  },
  /**
     * Alias for launch()
     *
     * After launching the browser, you can start new pages and perform browser actions
     *
     * @param opts = {}
     * @returns browser
     */
  browser(opts = {}) {
    return this.launch(opts);
  },
  /**
     * New Page
     *
     * Creates a new web brower page.
     *
     * This returns both the page and the browser instance so the browser instance can be closed.
     *
     * @returns { page, browser }
     */
  async newPage() {
    const browser = this.launch();
    const page = await browser.newPage();

    return {
      page,
      browser,
    };
  },
  /**
     * Goto URL
     *
     * Shorthand method to go directly to a page
     *
     * @returns { page, browser }
     */
  async goto() {
    const {
      page, browser,
    } = this.newPage();

    return {
      page,
      browser,
    };
  },
};

export const playwright = {
  /**
     * Launch a new Puppeteer Headless Browser
     *
     * After launching the browser, you can start new pages and perform browser actions
     *
     * @param opts = {}
     * @returns browser
     */
  async launch(opts = {}) {
    const browser = await playwrightCore.launch({
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
      args: [
        ...chromium.args,
        "--hide-scrollbars",
        "--disable-web-security",
      ],
      ...opts,
    });

    return browser;
  },
  /**
     * Alias for launch()
     *
     * After launching the browser, you can start new pages and perform browser actions
     *
     * @param opts = {}
     * @returns browser
     */
  browser(opts = {}) {
    return this.launch(opts);
  },
  /**
     * New Page
     *
     * Creates a new web brower page.
     *
     * This returns both the page and the browser instance so the browser instance can be closed.
     *
     * @returns { page, browser }
     */
  async newPage() {
    const browser = this.launch();
    const page = await browser.newPage();

    return {
      page,
      browser,
    };
  },
  /**
     * Goto URL
     *
     * Shorthand method to go directly to a page
     *
     * @returns { page, browser }
     */
  async goto() {
    const {
      page, browser,
    } = this.newPage();

    return {
      page,
      browser,
    };
  },
};
