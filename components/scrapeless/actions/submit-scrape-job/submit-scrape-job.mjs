import { COUNTRY_OPTIONS } from "../../common/constants.mjs";
import { log } from "../../common/utils.mjs";
import scrapeless from "../../scrapeless.app.mjs";

export default {
  key: "scrapeless-submit-scrape-job",
  name: "Submit Scrape Job",
  description: "Submit a new web scraping job with specified target URL and extraction rules. [See the documentation](https://apidocs.scrapeless.com/api-11949852)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    scrapeless,
    actor: {
      type: "string",
      label: "Actor",
      default: "scraper.shopee",
      description: "The actor to use for the scrape job. This can be a specific user or a system account.",
    },
    inputUrl: {
      type: "string",
      label: "Input URL",
      description: "Target URL to scrape. This is the URL of the web page you want to extract data from.",
    },
    proxyCountry: {
      type: "string",
      label: "Proxy Country",
      description: "The country to route the request through. This can help in bypassing geo-restrictions.",
      default: "ANY",
      options: COUNTRY_OPTIONS.map((country) => ({
        label: country.label,
        value: country.value,
      })),
    },
    asyncMode: {
      type: "boolean",
      label: "Async Mode",
      default: true,
      description: "Whether to run the scrape job in asynchronous mode. If set to true, the job will be processed in the background.",
    },
  },
  async run({ $ }) {
    try {
      const data = {
        actor: this.actor,
        input: {
          url: this.inputUrl,
        },
        proxy: {
          country: this.proxyCountry,
        },
        async: this.asyncMode,
      };

      const response = await this.scrapeless.submitScrapeJob({
        $,
        data,
      });
      log(response);

      $.export("$summary", this.asyncMode
        ? `Successfully submitted scrape job with ID: ${response.taskId}`
        : "Successfully scraped the target configuration.");
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
