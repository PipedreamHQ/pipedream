import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-google-play-search",
  name: "Get Google Play Search",
  description: "Search Google Play Store apps by keywords for app store optimization (ASO) analysis. [See the documentation](https://docs.dataforseo.com/v3/app_data/google/app_searches/task_post/?bash)",
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
  },
  async run({ $ }) {
    const response = await this.dataforseo.getGooglePlaySearch({
      $,
      data: [
        {
          keyword: this.keyword,
          location_code: this.locationCode,
          language_code: this.languageCode,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000 && response.tasks[0].status_code !== 20100) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", `Successfully searched Google Play Store for "${this.keyword}".`);
    return response;
  },
};
