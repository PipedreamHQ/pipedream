import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-google-ads-search-volume",
  name: "Get Google Ads Search Volume",
  description: "Retrieve search volume data for specified keywords from Google Ads. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/google_ads/search_volume/live/?bash)",
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
    const response = await this.dataforseo.getGoogleAdsSearchVolume({
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

    $.export("$summary", "Successfully retrieved Google Ads search volume data.");
    return response;
  },
};
