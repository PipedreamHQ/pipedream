import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-google-ads-keywords-for-keywords",
  name: "Get Google Ads Keywords For Keywords",
  description: "Retrieve keywords related to specified terms, helping you discover new keyword opportunities. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/google_ads/keywords_for_keywords/live/?bash)",
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
    const response = await this.dataforseo.getGoogleAdsKeywordsForKeywords({
      $,
      data: [
        {
          keywords: this.keywords,
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

    $.export("$summary", "Successfully retrieved Google Ads keywords for keywords.");
    return response;
  },
};
