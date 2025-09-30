import browserless from "../../browserless.app.mjs";

export default {
  key: "browserless-scrape-url",
  name: "Scrape URL",
  description: "Scrape content from a page. [See the documentation](https://www.browserless.io/docs/scrape).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    browserless,
    url: {
      type: "string",
      label: "URL",
      description: "The URL to scrape content from.",
    },
    selectors: {
      type: "string[]",
      label: "Selectors",
      description: "The HTML tag selectors to extract.",
      default: [
        "body",
      ],
    },
  },
  async run({ $ }) {
    if (typeof this.selectors === "string") {
      this.selectors = JSON.parse(this.selectors);
    }
    const response = await this.browserless.scrape({
      $,
      data: {
        url: this.url,
        elements: this.selectors?.map((selector) => ({
          selector,
        })),
      },
    });
    $.export("$summary", `Successfully scraped content from ${this.url}`);
    return response;
  },
};
