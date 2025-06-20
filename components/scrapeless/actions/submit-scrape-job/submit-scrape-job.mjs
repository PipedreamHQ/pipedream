import { ConfigurationError } from "@pipedream/platform";
import { ACTOR_OPTIONS } from "../../common/constants.mjs";
import { parseObject } from "../../common/utils.mjs";
import scrapeless from "../../scrapeless.app.mjs";

export default {
  key: "scrapeless-submit-scrape-job",
  name: "Submit Scrape Job",
  description: "Submit a new web scraping job with specified target URL and extraction rules. [See the documentation](https://apidocs.scrapeless.com/api-11949852)",
  version: "0.0.2",
  type: "action",
  props: {
    scrapeless,
    actor: {
      type: "string",
      label: "Actor",
      description: "The actor to use for the scrape job. This can be a specific user or a system account.",
      options: ACTOR_OPTIONS,
    },
    inputUrl: {
      type: "string",
      label: "Input URL",
      description: "Target URL to scrape. This is the URL of the web page you want to extract data from.",
      optional: true,
    },
    proxyCountry: {
      type: "string",
      label: "Proxy Country",
      description: "The country to route the request through. This can help in bypassing geo-restrictions.",
      optional: true,
    },
    additionalInput: {
      type: "object",
      label: "Additional Input",
      description: "Additional input parameters if you need to pass a specific configuration based on the actor. [See the documentation](https://apidocs.scrapeless.com/) for further details.",
      optional: true,
    },
    asyncMode: {
      type: "boolean",
      label: "Async Mode",
      description: "Whether to run the scrape job in asynchronous mode. If set to true, the job will be processed in the background.",
    },
  },
  async run({ $ }) {
    try {
      const data = {
        actor: this.actor,
        input: parseObject(this.additionalInput),
      };

      if (this.asyncMode) {
        data.async = this.asyncMode;
      }
      if (this.inputUrl) {
        data.input.url = this.inputUrl;
      }
      if (this.proxyCountry) {
        data.proxy = {
          country: this.proxyCountry,
        };
      }

      const response = await this.scrapeless.submitScrapeJob({
        $,
        data,
      });

      $.export("$summary", this.asyncMode
        ? `Successfully submitted scrape job with ID: ${response.taskId}`
        : "Successfully scraped the target configuration.");
      return response;
    } catch ({ response }) {
      throw new ConfigurationError(response.data.message);
    }
  },
};
