import {
  CONVERSION_TIME_MODE_OPTIONS,
  INCLUDE_OPTIONS,
  SORT_DIRECTION_OPTIONS,
} from "../../common/constants.mjs";
import voluum from "../../voluum.app.mjs";

export default {
  key: "voluum-report-data",
  name: "Report Data",
  description: "Return standard report. [See the API documentation](https://developers.voluum.com/#!/Reports/get_report)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    voluum,
    from: {
      type: "string",
      label: "From (Start Date)",
      description: "Start of the report time range in ISO 8601 format (e.g., 2017-02-20T00:00:00Z)",
    },
    to: {
      type: "string",
      label: "To (End Date)",
      description: "End of the report time range in ISO 8601 format (e.g., 2017-02-21T00:00:00Z)",
      optional: true,
    },
    include: {
      type: "string",
      label: "Include",
      description: "Type of core entities to include",
      options: INCLUDE_OPTIONS,
      optional: true,
    },
    compareFrom: {
      type: "string",
      label: "Compare From",
      description: "Compare from date/time in ISO 8601 format (e.g., 2017-02-20T00:00:00Z)",
      optional: true,
    },
    compareTo: {
      type: "string",
      label: "Compare To",
      description: "Compare to date/time in ISO 8601 format (e.g., 2017-02-21T00:00:00Z)",
      optional: true,
    },
    workspaces: {
      type: "string[]",
      label: "Workspaces",
      description: "A list of workspace ids to filter by",
      optional: true,
    },
    conversionTimeMode: {
      type: "string",
      label: "Conversion Time Mode",
      description: "The mode to use for conversion time",
      options: CONVERSION_TIME_MODE_OPTIONS,
      optional: true,
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency, default value is USD",
      optional: true,
    },
    tz: {
      type: "string",
      label: "Timezone",
      description: "Timezone for the report (e.g., Etc/GMT, America/New_York)",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort column",
      optional: true,
    },
    direction: {
      type: "string",
      label: "Direction",
      description: "Sort direction",
      optional: true,
      options: SORT_DIRECTION_OPTIONS,
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of results to return",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = this.voluum.paginate({
      fn: this.voluum.reportData,
      maxResults: this.maxResults,
      itemsField: "rows",
      params: {
        from: this.from,
        to: this.to,
        groupBy: [
          "campaignId",
        ],
        include: this.include,
        compareFrom: this.compareFrom,
        compareTo: this.compareTo,
        workspaces: this.workspaces,
        conversionTimeMode: this.conversionTimeMode,
        currency: this.currency,
        tz: this.tz,
        sort: this.sort,
        direction: this.direction,
      },
    });

    const responseArray = [];
    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Successfully retrieved ${responseArray.length} result${responseArray.length !== 1
      ? "s"
      : ""}`);
    return responseArray;
  },
};

