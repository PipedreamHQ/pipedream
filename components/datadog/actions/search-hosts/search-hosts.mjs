import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-search-hosts",
  name: "Search Hosts",
  description:
    "Search monitored infrastructure hosts. Filter"
    + " by tag (`env:production`), name"
    + " (`host:web-01`), or partial match. Sort by"
    + " `cpu`, `iowait`, `load`, `status`, or `apps`."
    + " Host names from results can scope queries in"
    + " **Get Metric Data**"
    + " (e.g. `avg:system.cpu.user{host:web-01}`),"
    + " filter logs in **Search Logs**"
    + " (`host:web-01`), or filter metrics in"
    + " **Search Metrics**. Max 1000 results."
    + " [See the docs](https://docs.datadoghq.com/api/"
    + "latest/hosts/"
    + "#get-all-hosts-for-your-organization)",
  version: "1.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    datadog,
    region: {
      propDefinition: [
        datadog,
        "region",
      ],
    },
    filter: {
      type: "string",
      label: "Filter",
      description:
        "Filter hosts by name, alias, or tag."
        + " E.g. `env:production` or `host:web-01`.",
      optional: true,
    },
    sortField: {
      type: "string",
      label: "Sort Field",
      description: "Field to sort hosts by.",
      optional: true,
      options: [
        "status",
        "apps",
        "cpu",
        "iowait",
        "load",
      ],
    },
    sortDir: {
      type: "string",
      label: "Sort Direction",
      description: "Direction of sort.",
      optional: true,
      options: [
        "asc",
        "desc",
      ],
    },
    count: {
      type: "integer",
      label: "Count",
      description:
        "Number of hosts to return. Max `1000`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.filter) params.filter = this.filter;
    if (this.sortField) params.sort_field = this.sortField;
    if (this.sortDir) params.sort_dir = this.sortDir;
    if (this.count !== undefined) params.count = this.count;

    const response = await this.datadog.listHosts({
      $,
      params,
      region: this.region,
    });

    const count = response?.hostList?.length
      ?? response?.total_matching
      ?? 0;
    $.export(
      "$summary",
      `Found ${count} host${count === 1
        ? ""
        : "s"}`,
    );

    return response;
  },
};
