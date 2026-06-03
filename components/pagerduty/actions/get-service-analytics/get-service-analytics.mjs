import app from "../../pagerduty.app.mjs";

export default {
  key: "pagerduty-get-service-analytics",
  name: "Get Service Analytics",
  description:
    "Get incident volume and MTTR (mean time to resolve) metrics for one or more services over a time range."
    + " Use **List Services** to discover service IDs."
    + " Time params use ISO 8601 with explicit UTC offset, e.g. `2026-06-02T15:00:00-07:00`."
    + " [See the documentation](https://developer.pagerduty.com/api-reference/694e92fe4f943-get-aggregated-service-data)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    serviceIds: {
      type: "string[]",
      label: "Service IDs",
      description: "The IDs of the services to get analytics for (e.g., `[\"PABC123\",\"PDEF456\"]`). Use **List Services** to discover IDs.",
    },
    createdAtStart: {
      type: "string",
      label: "Created At Start",
      description: "Start of the analysis window (ISO 8601 with UTC offset, e.g. `2026-05-01T00:00:00-07:00`).",
      optional: true,
    },
    createdAtEnd: {
      type: "string",
      label: "Created At End",
      description: "End of the analysis window (ISO 8601 with UTC offset, e.g. `2026-05-31T23:59:59-07:00`).",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getServiceAnalytics({
      $,
      data: {
        filters: {
          service_ids: this.serviceIds,
          created_at_start: this.createdAtStart,
          created_at_end: this.createdAtEnd,
        },
      },
    });

    $.export("$summary", `Retrieved analytics for ${this.serviceIds.length} service(s)`);
    return response;
  },
};
