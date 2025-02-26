import scrapeninja from "../../scrapeninja.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "scrapeninja-non-js-scraping",
  name: "ScrapeNinja Non-JS Scraping",
  description: "Use ScrapeNinja's high-performance non-JS scraping endpoint. [See the documentation]()",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    scrapeninja: {
      type: "app",
      app: "scrapeninja",
    },
    url: {
      propDefinition: [
        scrapeninja,
        "url",
      ],
    },
    headers: {
      propDefinition: [
        scrapeninja,
        "headers",
      ],
      optional: true,
    },
    retrynum: {
      propDefinition: [
        scrapeninja,
        "retrynum",
      ],
      optional: true,
    },
    geo: {
      propDefinition: [
        scrapeninja,
        "geo",
      ],
      optional: true,
    },
    proxy: {
      propDefinition: [
        scrapeninja,
        "proxy",
      ],
      optional: true,
    },
    followredirects: {
      propDefinition: [
        scrapeninja,
        "followredirects",
      ],
      optional: true,
    },
    timeout: {
      propDefinition: [
        scrapeninja,
        "timeout",
      ],
      optional: true,
    },
    textnotexpected: {
      propDefinition: [
        scrapeninja,
        "textnotexpected",
      ],
      optional: true,
    },
    statusnotexpected: {
      propDefinition: [
        scrapeninja,
        "statusnotexpected",
      ],
      optional: true,
    },
    extractor: {
      propDefinition: [
        scrapeninja,
        "extractor",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.scrapeninja.scrapeNonJs();
    $.export("$summary", "Successfully scraped the URL");
    return response;
  },
};
