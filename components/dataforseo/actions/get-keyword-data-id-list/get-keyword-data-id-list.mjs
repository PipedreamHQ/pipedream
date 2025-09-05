import dataforseo from "../../dataforseo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "dataforseo-get-keyword-data-id-list",
  name: "Get Keyword Data ID List",
  description: "Retrieve the list of IDs and metadata of the completed Keywords Data tasks during the specified period. [See the documentation](https://docs.dataforseo.com/v3/keywords_data/id_list/?bash)",
  version: "0.0.1",
  type: "action",
  props: {
    dataforseo,
    dateTimeFrom: {
      type: "string",
      label: "Date Time From",
      description: "The start time for filtering results in the format \"yyyy-mm-dd hh-mm-ss +00:00\". Example: `2023-01-15 12:57:46 +00:00`. If include_metadata is set to true, minimum value: a month before the current datetime. If include_metadata is set to false, minimum value: six months before the current datetime",
    },
    dateTimeTo: {
      type: "string",
      label: "Date Time To",
      description: "The finish time for filtering results in the format \"yyyy-mm-dd hh-mm-ss +00:00\". Example: `2023-01-15 12:57:46 +00:00`",
    },
    includeMetadata: {
      type: "boolean",
      label: "Include Metadata",
      description: "If set to `true`, the response will include the metadata of the completed tasks",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "The sort direction",
      options: [
        "asc",
        "desc",
      ],
      optional: true,
    },
    limit: {
      propDefinition: [
        dataforseo,
        "limit",
      ],
    },
  },
  methods: {
    validateDateRange(dateTimeFrom, dateTimeTo, includeMetadata) {
      const from = new Date(dateTimeFrom);
      const to = new Date(dateTimeTo);

      if (isNaN(from) || isNaN(to)) {
        throw new ConfigurationError("Invalid date format. Use yyyy-mm-dd hh:mm:ss +00:00");
      }

      if (from >= to) {
        throw new ConfigurationError("DateTimeFrom must be before DateTimeTo");
      }

      const monthsBack = includeMetadata
        ? 1
        : 6;
      const minDate = new Date();
      minDate.setMonth(minDate.getMonth() - monthsBack);

      if (from < minDate) {
        throw new ConfigurationError(`DateTimeFrom must not be earlier than ${monthsBack} month(s) ago`);
      }
    },
  },
  async run({ $ }) {
    this.validateDateRange(this.dateTimeFrom, this.dateTimeTo, this.includeMetadata);

    const response = await this.dataforseo.getKeywordDataIdList({
      $,
      data: [
        {
          datetime_from: this.dateTimeFrom,
          datetime_to: this.dateTimeTo,
          include_metadata: this.includeMetadata,
          sort: this.sort,
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

    $.export("$summary", "Successfully retrieved keyword data ID list.");
    return response;
  },
};
