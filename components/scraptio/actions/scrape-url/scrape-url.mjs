import scraptio from "../../scraptio.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "scraptio-scrape-url",
  name: "Scrape URL",
  description: "Scrape the provided URL using Scraptio. [See the documentation](https://scraptio.notion.site/how-to-use-scraptio-with-rest-api-caf0b6d5c6e342cd9a3ac9062ab1ae6d)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    scraptio,
    url: {
      propDefinition: [
        scraptio,
        "url",
      ],
    },
    filters: {
      propDefinition: [
        scraptio,
        "filters",
      ],
    },
    matchAll: {
      propDefinition: [
        scraptio,
        "matchAll",
      ],
    },
    apiKey: {
      propDefinition: [
        scraptio,
        "apiKey",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.scraptio.scrape({
      url: this.url,
      filters: this.filters,
      matchAll: this.matchAll,
    });

    $.export("$summary", `Scraped URL: ${this.url}`);
    return response;
  },
};
