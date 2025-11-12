import brightData from "../../bright_data.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "bright_data-scrape-website",
  name: "Scrape Website",
  description: "Scrape a website and return the HTML. [See the documentation](https://docs.brightdata.com/api-reference/web-scraper-api/synchronous-requests)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    brightData,
    datasetId: {
      propDefinition: [
        brightData,
        "datasetId",
      ],
    },
    url: {
      propDefinition: [
        brightData,
        "url",
      ],
      description: "The URL of the website to scrape",
    },
  },
  async run({ $ }) {
    try {
      const data = await this.brightData.scrapeWebsite({
        $,
        params: {
          dataset_id: this.datasetId,
        },
        data: {
          input: [
            {
              url: this.url,
            },
          ],
        },
      });

      $.export("$summary", `Scraped website ${this.url}`);
      return data;
    } catch (error) {
      const errors = (JSON.parse(error.message)).errors;
      throw new ConfigurationError(errors.map((e) => e.join(" - ")).join(" | "));
    }
  },
};
