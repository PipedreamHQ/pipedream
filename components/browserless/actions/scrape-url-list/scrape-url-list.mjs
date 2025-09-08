import browserless from "../../browserless.app.mjs";

export default {
  key: "browserless-scrape-url-list",
  name: "Scrape URL List",
  description: "Scrape content from a list of pages. [See the documentation](https://www.browserless.io/docs/scrape).",
  version: "0.0.2",
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
    const promises = [];

    for (const url of this.urls) {
      promises.push(this.browserless.scrape({
        $,
        data: {
          url,
          elements: this.selectors?.map((selector) => ({
            selector,
          })),
        },
      }));
    }

    const responses = await Promise.all(promises);
    for (let i = 0; i < promises.length; i++) {
      result[this.urls[i]] = responses[i].data[0].results[0].text;
    }

    return result;
  },
};
