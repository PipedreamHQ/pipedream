import scraptio from "../../scraptio.app.mjs";

export default {
  key: "scraptio-scrape-url",
  name: "Scrape URL",
  description: "Scrape the provided URL. [See the documentation](https://scraptio.notion.site/how-to-use-scraptio-with-rest-api-caf0b6d5c6e342cd9a3ac9062ab1ae6d)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    scraptio,
    url: {
      type: "string",
      label: "URL to Scrape",
      description: "The complete URL of the website you want to scrape.",
    },
    filters: {
      type: "string[]",
      label: "Filters",
      description: "A list of selectors to filter the HTML elements you want to scrape. e.g. [\"#id\", \".class\", \"<html>\"]",
      optional: true,
    },
    matchAll: {
      type: "boolean",
      label: "Match All Filters",
      description: "Indicates if the element must match all provided filters.",
      default: false,
    },
  },
  async run({ $ }) {
    const response = await this.scraptio.scrape({
      data: {
        url: this.url,
        filters: this.filters,
        match_all: this.matchAll || false,
      },
    });

    $.export("$summary", `Scraped URL: ${this.url}`);
    return response;
  },
};
