import { ConfigurationError } from "@pipedream/platform";
import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-google-ads-status",
  name: "Get Google Ads Status",
  description: "Check the status of Google Ads data updates, indicating whether the keyword data has been refreshed for the previous month. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/google_ads/status/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    dataforseo,
  },
  async run({ $ }) {
    const response = await this.dataforseo.getGoogleAdsStatus({
      $,
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully retrieved Google Ads status");
    return response;
  },
};
