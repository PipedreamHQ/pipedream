import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-google-ads-ad-traffic-by-keyword",
  name: "Get Google Ads Ad Traffic By Keyword",
  description: "Retrieve estimates for impressions, clicks, and cost-per-click for specified keywords, aiding in assessing keyword demand. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/google_ads/ad_traffic_by_keywords/live/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    dataforseo,
    keywords: {
      propDefinition: [
        dataforseo,
        "keywords",
      ],
    },
    bid: {
      type: "integer",
      label: "Bid",
      description: "The maximum custom bid",
    },
    match: {
      type: "string",
      label: "Match",
      description: "The keywords match type",
      options: [
        "exact",
        "broad",
        "phrase",
      ],
    },
    locationCode: {
      propDefinition: [
        dataforseo,
        "locationCode",
      ],
      optional: true,
    },
    languageCode: {
      propDefinition: [
        dataforseo,
        "languageCode",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getGoogleAdsAdTrafficByKeywords({
      $,
      data: [
        {
          keywords: this.keywords,
          bid: this.bid,
          match: this.match,
          location_code: this.locationCode,
          language_code: this.languageCode,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully retrieved Google Ads ad traffic by keyword.");
    return response;
  },
};
