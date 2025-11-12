import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-google-ads-languages",
  name: "Get Google Ads Languages",
  description: "Retrieve a list of languages supported by the Google Ads API, allowing you to specify language targeting in your requests. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/google_ads/languages/?bash)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
  },
  async run({ $ }) {
    const response = await this.dataforseo.getGoogleAdsLanguages({
      $,
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully retrieved Google Ads languages.");
    return response;
  },
};
