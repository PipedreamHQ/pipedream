import playwright from "../../playwright.app.mjs";

export default {
  key: "playwright-page-pdf",
  name: "Page PDF",
  description: "Generates a pdf of the page and store it on /tmp directory. [See the documentation](https://playwright.dev/docs/api/class-page#page-pdf)",
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
      description: "The PDF file name with extension, e.g. `page.pdf`. it will be stored on `/tmp` directory.",
      default: "page.pdf",
    },
    emulateMedia: {
      type: "boolean",
      label: "Emulate Media",
      description: "Set `true` to generate a pdf with screen media.",
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
    });
    await page.goto(this.url);
    if (this.emulateMedia) {
      await page.emulateMedia({
        media: "screen",
      });
    }
    const opts = {
      path: `/tmp/${this.filename}`,
      width: this.viewportWidth || 1280,
      height: this.viewportHeight || 720,
    };
    await page.pdf(opts);
    await browser.close();

    $.export("$summary", `Successfully generated a PDF file from ${this.url}`);

    return opts;
  },
};
