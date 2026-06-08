import app from "../../eppo.app.mjs";

export default {
  key: "eppo-upsert-metric",
  name: "Upsert Metric",
  description:
    "Create or update a metric in Eppo. Omit `metricId` to create a new metric; provide `metricId` to update an existing one."
    + " Use this when the user wants to define a new KPI/metric or update the definition of an existing metric."
    + " Use **List Metrics** to find the numeric `metricId` for an update and to look up the `entityId` from existing metrics."
    + " `entityId` is required for new metrics — find it in the `entity_id` field of any existing metric returned by **List Metrics**."
    + " The `minimumDetectableEffect` is a decimal representing the smallest meaningful relative change (e.g. `0.05` for 5%)."
    + " [See the documentation](https://eppo.cloud/api/docs#/Metrics/createMetric)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    metricId: {
      type: "integer",
      label: "Metric ID",
      description: "The numeric ID of an existing metric to update. Omit this field to create a new metric. Use **List Metrics** to discover metric IDs.",
      optional: true,
    },
    entityId: {
      type: "integer",
      label: "Entity ID",
      description: "Required when creating a new metric. The numeric entity type ID this metric measures (e.g. user, session). Use **List Metrics** to find the `entity_id` from any existing metric — all metrics in the same workspace typically share the same entity ID.",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The display name for the metric.",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A description of what this metric measures.",
      optional: true,
    },
    displayStyle: {
      type: "string",
      label: "Display Style",
      description: "How to display the metric value. Use `decimal` for most metrics. Valid values: `decimal`, `percent`, `currency`. Defaults to `decimal` if omitted.",
      optional: true,
    },
    minimumDetectableEffect: {
      type: "string",
      label: "Minimum Detectable Effect",
      description: "The smallest relative change considered meaningful, as a decimal. Example: `0.05` for 5%. Used to calculate required sample sizes.",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      name: this.name,
      description: this.description,
      display_style: this.displayStyle ?? "decimal",
      minimum_detectable_effect: this.minimumDetectableEffect
        ? parseFloat(this.minimumDetectableEffect)
        : undefined,
    };

    if (this.entityId) {
      data.entity_id = this.entityId;
    }

    let response;
    if (this.metricId) {
      response = await this.app.updateMetric({
        $,
        metricId: this.metricId,
        data,
      });
      $.export("$summary", `Updated metric ${this.metricId}: ${response?.name ?? this.name}`);
    } else {
      response = await this.app.createMetric({
        $,
        data,
      });
      $.export("$summary", `Created metric ${response?.id}: ${response?.name ?? this.name}`);
    }
    return response;
  },
};
