import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-historical-serp-data",
  name: "Get Historical SERP Data",
  description: "Get ranking history for keywords over time. [See the documentation](https://docs.dataforseo.com/v3/dataforseo_labs/google/historical_serps/live/?bash)",
  version: "0.0.3",
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
    dateFrom: {
      type: "string",
      label: "Date From",
      description: "Start date for historical data in YYYY-MM-DD format",
      optional: true,
    },
    dateTo: {
      type: "string",
      label: "Date To",
      description: "End date for historical data in YYYY-MM-DD format",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.dataforseo.getHistoricalSerpData({
      $,
      data: [
        {
          keyword: this.keyword,
          location_code: this.locationCode,
          language_code: this.languageCode,
          date_from: this.dateFrom,
          date_to: this.dateTo,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", `Successfully retrieved historical SERP data for "${this.keyword}".`);
    return response;
  },
};
