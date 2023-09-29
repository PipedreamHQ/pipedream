import { defineApp } from "@pipedream/types";
import { chromium as playwright } from "playwright-core@1.38.1"
import chromium from "@sparticuz/chromium@117"

export default defineApp({
  type: "app",
  app: "playwright",
  propDefinitions: {},
  methods: {
    /**
     * Launch a new Puppeteer Headless Browser
     * 
     * After launching the browser, you can start new pages and perform browser actions
     * 
     * @param opts = {}
     * @returns browser
     */
    async launch(opts = {}) {
      const browser = await playwright.launch({
        executablePath: await chromium.executablePath(),
        headless: true,
        ignoreHTTPSErrors: true,
        args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
        ...opts
      });

      return browser
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
      return this.launch(opts)
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
        page, browser
      }
    },
    /**
     * Goto URL
     * 
     * Shorthand method to go directly to a page
     * 
     * @returns { page, browser }
     */
    async goto() {
      const { page, browser } = this.newPage();

      return { page, browser }
    }
  },
});
