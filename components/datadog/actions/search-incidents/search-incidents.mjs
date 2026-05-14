import datadog from "../../datadog.app.mjs";

export default {
  key: "datadog-search-incidents",
  name: "Search Incidents",
  description:
    "Search Datadog incidents by state, severity, and"
    + " metadata. Query syntax: `state:active`,"
    + " `state:resolved`, `severity:SEV-1`. After"
    + " finding an incident, investigate with:"
    + " **Search Logs** for the incident time window,"
    + " **Get Metric Data** for relevant metrics,"
    + " **Search Events** for related monitor alerts,"
    + " and **Search Services** for ownership info."
    + " [See the docs](https://docs.datadoghq.com/api/"
    + "latest/incidents/#get-a-list-of-incidents)",
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
    query: {
      type: "string",
      label: "Query",
      description:
        "Search query to filter incidents."
        + " Supports field:value syntax."
        + " E.g. `state:active` or `severity:SEV-1`.",
      optional: true,
    },
    pageSize: {
      type: "integer",
      label: "Page Size",
      description:
        "Number of incidents per page. Default `10`.",
      optional: true,
    },
    pageOffset: {
      type: "integer",
      label: "Page Offset",
      description: "Offset for pagination.",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {};
    if (this.query) params["filter[query]"] = this.query;
    if (this.pageSize !== undefined) params["page[size]"] = this.pageSize;
    if (this.pageOffset !== undefined) params["page[offset]"] = this.pageOffset;

    const response = await this.datadog.listIncidents({
      $,
      params,
      region: this.region,
    });

    const count = response?.data?.length ?? 0;
    $.export(
      "$summary",
      `Found ${count} incident${count === 1
        ? ""
        : "s"}`,
    );

    return response;
  },
};
