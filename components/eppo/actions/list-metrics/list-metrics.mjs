import app from "../../eppo.app.mjs";

export default {
  key: "eppo-list-metrics",
  name: "List Metrics",
  description:
    "Retrieve all metrics defined in Eppo, including their names, IDs, descriptions, and minimum detectable effects."
    + " Use this tool to discover available metrics or find metric IDs needed when creating an experiment with **Create Experiment**."
    + " Set `certified` to `true` to return only certified/verified metrics."
    + " Supports pagination via `page` and `perPage`."
    + " [See the documentation](https://eppo.cloud/api/docs#/Metrics/getMetrics)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination. Defaults to 1.",
      optional: true,
    },
    perPage: {
      type: "integer",
      label: "Per Page",
      description: "Number of metrics to return per page. Defaults to the API default.",
      optional: true,
    },
    certified: {
      type: "boolean",
      label: "Certified Only",
      description: "Set to `true` to return only certified metrics. Omit to return all metrics.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listMetrics({
      $,
      page: this.page,
      perPage: this.perPage,
      certified: this.certified,
    });
    const metrics = response?.metrics ?? response ?? [];
    $.export("$summary", `Retrieved ${metrics.length} metric(s)`);
    return metrics;
  },
};
