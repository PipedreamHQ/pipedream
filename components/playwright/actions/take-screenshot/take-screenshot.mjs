import playwright from "../../playwright.app.mjs";

export default {
  key: "playwright-take-screenshot",
  name: "Take Screenshot",
  description: "Store a new screenshot file on /tmp directory. [See the documentation](https://playwright.dev/docs/screenshots)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    playwright,
    url: {
      type: "string",
      label: "URL",
      description: "The URL of the page.",
    },
    filename: {
      type: "string",
      label: "File Name",
      description: "The screenshot file name with extension, e.g. `screenshot.png`. it will be stored on `/tmp` directory.",
      default: "screenshot.png",
    },
    colorScheme: {
      type: "string",
      label: "Color Scheme",
      description: "The user color scheme preferences",
      options: [
        "no-preference",
        "light",
        "dark",
      ],
      default: "no-preference",
    },
    fullPage: {
      type: "boolean",
      label: "Full Page",
      description: "When true, takes a screenshot of the full page.",
      default: false,
    },
    viewportWidth: {
      type: "integer",
      label: "Viewport Width",
      description: "The width of viewport. default: `1280`",
      optional: true,
    },
    viewportHeight: {
      type: "integer",
      label: "Viewport Height",
      description: "The height of viewport. default: `720`",
      optional: true,
    },
  },
  async run({ $ }) {
    const browser = await this.playwright.launch();
    const page = await browser.newPage({
      viewport: {
        width: this.viewportWidth || 1280,
        height: this.viewportHeight || 720,
      },
      colorScheme: this.colorScheme,
    });
    await page.goto(this.url);
    const opts = {
      path: `/tmp/${this.filename}`,
      fullPage: this.fullPage,
    };
    await page.screenshot(opts);
    await browser.close();

    $.export("$summary", `Successfully captured screenshot from ${this.url}`);

    return opts;
  },
};
