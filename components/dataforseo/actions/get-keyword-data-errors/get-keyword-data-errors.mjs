import { ConfigurationError } from "@pipedream/platform";
import dataforseo from "../../dataforseo.app.mjs";

export default {
  key: "dataforseo-get-keyword-data-errors",
  name: "Get Keyword Data Errors",
  description: "Retrieve information about the Keywords Data API tasks that returned an error within the past 7 days [See the documentation](https://docs.dataforseo.com/v3/keywords_data/errors/?bash)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dataforseo,
    dateTimeFrom: {
      type: "string",
      label: "Date Time From",
      description: "The start time for filtering results in the format \"yyyy-mm-dd hh-mm-ss +00:00\". Example: `2023-01-15 12:57:46 +00:00`. Allows filtering results by the datetime parameter within the range of the last 7 days.",
    },
    dateTimeTo: {
      type: "string",
      label: "Date Time To",
      description: "The finish time for filtering results in the format \"yyyy-mm-dd hh-mm-ss +00:00\". Example: `2023-01-15 12:57:46 +00:00`. Allows filtering results by the datetime parameter within the range of the last 7 days.",
    },
    limit: {
      propDefinition: [
        dataforseo,
        "limit",
      ],
    },
  },
  methods: {
    validateDateRange(dateTimeFrom, dateTimeTo) {
      const from = new Date(dateTimeFrom);
      const to = new Date(dateTimeTo);
      const now = new Date();

      if (isNaN(from) || isNaN(to)) {
        throw new ConfigurationError("Invalid date format. Use yyyy-mm-dd hh:mm:ss +00:00");
      }

      if (from >= to) {
        throw new ConfigurationError("DateTimeFrom must be before DateTimeTo");
      }

      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (from < sevenDaysAgo || from > now) {
        throw new ConfigurationError("DateTimeFrom must be within the last 7 days");
      }
      if (to < sevenDaysAgo || to > now) {
        throw new ConfigurationError("DateTimeTo must be within the last 7 days");
      }
    },
  },
  async run({ $ }) {
    this.validateDateRange(this.dateTimeFrom, this.dateTimeTo);

    const response = await this.dataforseo.getKeywordDataErrors({
      $,
      data: [
        {
          datetime_from: this.dateTimeFrom,
          datetime_to: this.dateTimeTo,
          limit: this.limit,
        },
      ],
    });

    if (response.status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.status_message}`);
    }

    if (response.tasks[0].status_code !== 20000) {
      throw new ConfigurationError(`Error: ${response.tasks[0].status_message}`);
    }

    $.export("$summary", "Successfully retrieved keyword data errors.");
    return response;
  },
};
