import olostep from "../../olostep.app.mjs";

export default {
  key: "olostep-scrape-url",
  name: "Scrape URL",
  description: "Scrape a web page and get its content as Markdown, HTML, text or structured JSON, with JavaScript rendering. [See the documentation](https://docs.olostep.com/api-reference/scrapes/create)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
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
      description: "Formats to return the content in",
      options: [
        "markdown",
        "html",
        "text",
        "json",
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
      description: "Remove images from the content",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.olostep.scrape({
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
