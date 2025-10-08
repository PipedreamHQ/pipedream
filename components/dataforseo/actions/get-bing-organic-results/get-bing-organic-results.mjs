import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-bing-organic-results",
  name: "Get Bing Organic Results",
  description: "Retrieve Bing organic search results for specified keywords. [See the documentation](https://docs.dataforseo.com/v3/serp/bing/organic/live/regular/?bash)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    keyword: {
      type: "string",
      label: "Keyword",
      description: "The keyword to search for",
    },
    locationCode: {
      propDefinition: [
        dataforseo,
        "locationCode",
      ],
    },
    languageCode: {
      propDefinition: [
        dataforseo,
        "languageCode",
      ],
    },
    depth: {
      type: "integer",
      label: "Depth",
      description: "The parsing depth. Default: 100",
      max: 700,
      optional: true,
    },
    maxCrawlPages: {
      type: "integer",
      label: "Max Crawl Pages",
      description: "The page crawl limit",
      max: 100,
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getBingOrganicResults({
      $,
      data: [
        {
          keyword: this.keyword,
          location_code: this.locationCode,
          language_code: this.languageCode,
          depth: this.depth,
          max_crawl_pages: this.maxCrawlPages,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", `Successfully retrieved Bing organic results for "${this.keyword}".`);
    return response;
  },
};
