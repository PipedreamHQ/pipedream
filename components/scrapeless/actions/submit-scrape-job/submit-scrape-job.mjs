import scrapeless from "../../scrapeless.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "scrapeless-submit-scrape-job",
  name: "Submit Scrape Job",
  description: "Submit a new web scraping job with specified target URL and extraction rules. [See the documentation](https://apidocs.scrapeless.com/api-11949852)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    scrapeless,
    targetUrl: {
      propDefinition: [
        scrapeless,
        "targetUrl",
      ],
    },
    selectors: {
      propDefinition: [
        scrapeless,
        "selectors",
      ],
    },
    proxyCountry: {
      type: "string",
      label: "Proxy Country",
      description: "The country to route the request through",
      default: "US",
      optional: true,
    },
    asyncMode: {
      type: "boolean",
      label: "Async Mode",
      description: "If true, the task will be executed asynchronously. If false, the task will be executed synchronously.",
      default: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.scrapeless.submitScrapeJob({
      targetUrl: this.targetUrl,
      selectors: this.selectors,
      proxyCountry: this.proxyCountry,
      async: this.asyncMode,
    });

    $.export("$summary", `Successfully submitted scrape job with ID: ${response.jobId}`);
    return response;
  },
};
