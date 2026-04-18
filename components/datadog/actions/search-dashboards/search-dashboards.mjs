import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-search-dashboards",
  name: "Search Dashboards",
  description:
    "List and search Datadog dashboards. Returns"
    + " dashboard IDs, titles, metadata, and a"
    + " ready-to-use `dashboard_url` for each result."
    + " Use alongside **Search Services** to find"
    + " dashboards related to a specific service."
    + " [See the docs](https://docs.datadoghq.com/api/"
    + "latest/dashboards/#get-all-dashboards)",
  version: "1.0.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    datadog,
    filterShared: {
      type: "boolean",
      label: "Shared Only",
      description:
        "If true, only return dashboards that are shared.",
      optional: true,
    },
    count: {
      type: "integer",
      label: "Count",
      description: "Max dashboards to return.",
      optional: true,
    },
    start: {
      type: "integer",
      label: "Start",
      description: "Offset for pagination.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.filterShared !== undefined) {
      params.filter_shared = this.filterShared;
    }
    if (this.count !== undefined) params.count = this.count;
    if (this.start !== undefined) params.start = this.start;

    const response = await this.datadog.listDashboards({
      $,
      params,
    });

    const region = this.datadog._region();
    if (Array.isArray(response?.dashboards)) {
      response.dashboards = response.dashboards.map((d) => ({
        ...d,
        dashboard_url: `https://app.${region}/dashboard/${d.id}`,
      }));
    }

    const count = response?.dashboards?.length ?? 0;
    $.export(
      "$summary",
      `Found ${count} dashboard${count === 1
        ? ""
        : "s"}`,
    );

    return response;
  },
};
