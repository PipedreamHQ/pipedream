import app from "../../h_supertools_analytics_tool.app.mjs";

export default {
  key: "h_supertools_analytics_tool-retrieve-report-data",
  name: "Retrieve Report Data",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Fetch the analytics report data for a specified website. [See the documentation](https://analytics.h-supertools.com/developers/stats)",
  type: "action",
  props: {
    app,
    reportId: {
      propDefinition: [
        app,
        "reportId",
      ],
    },
    name: {
      propDefinition: [
        app,
        "name",
      ],
    },
    from: {
      propDefinition: [
        app,
        "from",
      ],
    },
    to: {
      propDefinition: [
        app,
        "to",
      ],
    },
    search: {
      type: "string",
      label: "Search",
      description: "The search query.",
      optional: true,
    },
    sortBy: {
      type: "string",
      label: "Sort By",
      description: "Sort by.",
      options: [
        "id",
        "domain",
      ],
      default: "domain",
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort. Use `asc` for Ascending or `desc` for Descending.",
      options: [
        "asc",
        "desc",
      ],
      default: "asc",
    },
  },
  async run({ $ }) {
    const {
      app,
      reportId,
      sortBy,
      ...params
    } = this;

    const items = app.paginate({
      fn: app.retrieveReportData,
      reportId,
      params: {
        ...params,
        sort_by: sortBy,
        per_page: 10,
      },
    });

    const response = [];

    for await (const item of items) {
      response.push(item);
    }

    const length = response.length;

    $.export("$summary", `${length} report data${length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return response;
  },
};
