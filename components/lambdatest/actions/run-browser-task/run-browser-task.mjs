import fs from "fs";
import path from "path";
import { ConfigurationError } from "@pipedream/platform";
import app from "../../lambdatest.app.mjs";

export default {
  key: "lambdatest-run-browser-task",
  name: "Run Browser Task",
  description: "Open a URL in a cloud Chrome browser on TestMu AI Browser Cloud and return the page text, the page HTML or a screenshot. [See the documentation](https://www.testmuai.com/support/docs/puppeteer-testing/)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    app,
    url: {
      type: "string",
      label: "URL",
      description: "The page to open, e.g. `https://example.com`. `https://` is added if no scheme is given.",
    },
    task: {
      type: "string",
      label: "Task",
      description: "What to return from the page, e.g. `text`.",
      options: [
        {
          label: "Get page text",
          value: "text",
        },
        {
          label: "Get page HTML",
          value: "html",
        },
        {
          label: "Take a screenshot",
          value: "screenshot",
        },
      ],
      default: "text",
    },
    waitForSelector: {
      type: "string",
      label: "Wait For Selector",
      description: "A CSS selector to wait for before running the task, e.g. `#main`. Leave empty to run the task as soon as the page has loaded.",
      optional: true,
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      description: "Only used by **Take a screenshot**. Set to `true` to capture the whole scrollable page instead of the visible area.",
      default: false,
      optional: true,
    },
    downloadPath: {
      type: "string",
      label: "Download Path",
      description: "Only used by **Take a screenshot**. Saves the screenshot to the `/tmp` directory under this file name, e.g. `screenshot.png`. Leave empty to return the screenshot as base64 only.",
      optional: true,
    },
    buildName: {
      type: "string",
      label: "Build Name",
      description: "The build the session is grouped under on the TestMu AI dashboard, e.g. `Pipedream`.",
      default: "Pipedream",
      optional: true,
    },
    timeout: {
      type: "integer",
      label: "Timeout",
      description: "The maximum time in seconds to wait for the page to load, and for **Wait For Selector** if set, e.g. `60`.",
      default: 60,
      min: 1,
      optional: true,
    },
    syncDir: {
      type: "dir",
      accessMode: "write",
      sync: true,
    },
  },
  async run({ $ }) {
    const url = /^https?:\/\//i.test(this.url)
      ? this.url
      : `https://${this.url}`;
    const timeout = (this.timeout ?? 60) * 1000;

    // Validate the download path before opening a browser session, and keep it inside /tmp
    let filePath;
    if (this.task === "screenshot" && this.downloadPath) {
      filePath = path.posix.resolve("/tmp", this.downloadPath);
      if (!filePath.startsWith("/tmp/")) {
        throw new ConfigurationError("**Download Path** must be a file name inside the `/tmp` directory, e.g. `screenshot.png`.");
      }
    }

    const result = await this.app.withBrowserCloudPage({
      url,
      buildName: this.buildName,
      sessionName: `Run Browser Task: ${url}`,
      timeout,
    }, async (page) => {
      if (this.waitForSelector) {
        await page.waitForSelector(this.waitForSelector, {
          timeout,
        });
      }

      const output = {
        url: page.url(),
        title: await page.title(),
      };

      if (this.task === "html") {
        output.html = await page.content();
      } else if (this.task === "screenshot") {
        const screenshot = Buffer.from(await page.screenshot({
          fullPage: this.fullPage,
          type: "png",
        }));
        output.screenshot = screenshot.toString("base64");
        if (filePath) {
          fs.writeFileSync(filePath, screenshot);
          output.filePath = filePath;
        }
      } else {
        output.text = await page.evaluate(() => document.body.innerText);
      }

      return output;
    });

    $.export("$summary", `Successfully ran the ${this.task} task on ${result.url}`);

    return result;
  },
};
