import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-app-store-search",
  name: "Get App Store Search",
  description: "Search iOS App Store apps by keywords for app store optimization (ASO) analysis. [See the documentation](https://docs.dataforseo.com/v3/app_data/apple/app_searches/live/?bash)",
  version: "0.0.1",
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
    const response = await this.dataforseo.getAppStoreSearch({
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

    $.export("$summary", `Successfully searched App Store for "${this.keyword}".`);
    return response;
  },
};
