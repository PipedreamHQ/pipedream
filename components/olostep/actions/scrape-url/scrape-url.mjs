import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-scrape-url",
  name: "Scrape URL",
  description: "Scrape a single web page and return its content as Markdown, HTML or plain text, with JavaScript rendering. Use it when you already know the page URL; use **Search Web** to find pages first, or **Start Batch** for many URLs at once. [See the documentation](https://docs.olostep.com/api-reference/scrapes/create)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    olostep,
    url: {
      propDefinition: [
        olostep,
        "url",
      ],
    },
    formats: {
      type: "string[]",
      label: "Formats",
      description: "Formats to return the content in, e.g. `[\"markdown\", \"html\"]`. Defaults to `[\"markdown\"]`.",
      options: [
        "markdown",
        "html",
        "text",
      ],
      optional: true,
      default: [
        "markdown",
      ],
    },
    country: {
      propDefinition: [
        olostep,
        "country",
      ],
    },
    waitBeforeScraping: {
      type: "integer",
      label: "Wait Before Scraping",
      description: "Milliseconds to wait for the page to load before scraping, e.g. `2000`",
      optional: true,
    },
    removeImages: {
      type: "boolean",
      label: "Remove Images",
      description: "Whether to remove images from the content, e.g. `true`",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.olostep.scrapeUrl({
      $,
      data: {
        url_to_scrape: this.url,
        formats: this.formats,
        country: this.country,
        wait_before_scraping: this.waitBeforeScraping,
        remove_images: this.removeImages,
      },
    });
    $.export("$summary", `Successfully scraped ${this.url}`);
    return response;
  },
};
