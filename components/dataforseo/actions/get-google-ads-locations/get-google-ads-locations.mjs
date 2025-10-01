import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-google-ads-locations",
  name: "Get Google Ads Locations",
  description: "Retrieve a list of available locations supported by the Google Ads API, which can be used to specify geographic targeting in your requests. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/google_ads/locations/?bash)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    countryCode: {
      type: "string",
      label: "Country Code",
      description: "The country code to get locations for. Ex: `US`",
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getGoogleAdsLocations({
      $,
      countryCode: this.countryCode,
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully retrieved Google Ads locations");
    return response;
  },
};
