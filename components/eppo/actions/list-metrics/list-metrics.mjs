import app from "../../eppo.app.mjs";

export default {
  key: "eppo-list-metrics",
  name: "List Metrics",
  description:
    "Retrieve all metrics defined in Eppo, including their names, IDs, descriptions, and minimum detectable effects."
    + " Use this tool to discover available metrics or find metric IDs needed when creating an experiment with **Create Experiment**."
    + " Filter by `entityId` to scope results to a specific entity type, or by `name` to find metrics by partial name match."
    + " Set `includeExperiments` to `true` to include associated experiments in the response (requires `limit` ≤ 10)."
    + " Supports pagination via `limit` and `offset`."
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
    entityId: {
      propDefinition: [
        app,
        "entityId",
      ],
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "Will return only metrics with a name that contains this value",
      optional: true,
    },
    includeExperiments: {
      type: "boolean",
      label: "Include Experiments",
      description: "Will return all experiments associated with the metrics (requires limit to be 10 or less)",
      optional: true,
    },
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
    },
    offset: {
      propDefinition: [
        app,
        "offset",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.listMetrics({
      $,
      params: {
        entity_id: this.entityId,
        name: this.name,
        includeExperiments: this.includeExperiments,
        limit: this.limit,
        offset: this.offset,
      },
    });
    const metrics = response?.metrics ?? response ?? [];
    $.export("$summary", `Retrieved ${metrics.length} metric(s)`);
    return metrics;
  },
};
