import webscraping_ai from "../../webscraping_ai.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "webscraping_ai-scrape-website-html",
  name: "Scrape Website HTML",
  description: "Starts a new web scraping job with specified configurations. [See the documentation]():",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    webscraping_ai,
    targetUrl: {
      propDefinition: [
        "webscraping_ai",
        "targetUrl",
      ],
    },
    selectors: {
      propDefinition: [
        "webscraping_ai",
        "selectors",
      ],
      optional: true,
    },
    renderingMode: {
      propDefinition: [
        "webscraping_ai",
        "renderingMode",
      ],
      optional: true,
    },
    headers: {
      propDefinition: [
        "webscraping_ai",
        "headers",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.webscraping_ai.startScrapingJob();
    $.export("$summary", `Started scraping job for URL ${this.targetUrl}`);
    return response;
  },
};
