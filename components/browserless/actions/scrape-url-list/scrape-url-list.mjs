import browserless from "../../browserless.app.mjs";

export default {
  key: "browserless-scrape-url-list",
  name: "Scrape URL List",
  description: "Scrape content from a list of pages. [See the documentation](https://www.browserless.io/docs/scrape).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserless,
    urls: {
      type: "string[]",
      label: "URLs",
      description: "The list of URLs to scrape content from.",
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
    if (typeof this.urls === "string") {
      this.urls = JSON.parse(this.urls);
    }

    const result = {};

    for (const url of this.urls) {
      const response = await this.browserless.scrape({
        $,
        data: {
          url,
          elements: this.selectors?.map((selector) => ({
            selector,
          })),
        },
      });
      result[url] = response.data[0].results[0].text;
    }

    return result;
  },
};
