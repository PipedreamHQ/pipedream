// Table for Chromium <> Puppeteer version support here: https://pptr.dev/chromium-support
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// @sparticuz/chromium no longer exports a default viewport; this is the one it used to provide.
const DEFAULT_VIEWPORT = {
  deviceScaleFactor: 1,
  hasTouch: false,
  height: 1080,
  isLandscape: true,
  isMobile: false,
  width: 1920,
};

export default {
  type: "app",
  app: "puppeteer",
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
      const browser = await puppeteer.launch({
        executablePath: await chromium.executablePath(),
        headless: "shell",
        cacheDirectory: "/tmp",
        acceptInsecureCerts: true,
        defaultViewport: DEFAULT_VIEWPORT,
        args: puppeteer.defaultArgs({
          args: [
            ...chromium.args,
            "--hide-scrollbars",
            "--disable-web-security",
            "--font-render-hinting=none",
          ],
          headless: "shell",
        }),
        protocolTimeout: 240000,
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
  },
};
