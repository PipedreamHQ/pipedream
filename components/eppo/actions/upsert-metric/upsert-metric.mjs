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
    const metricId = this.metricId
      ? parseInt(String(this.metricId).trim(), 10)
      : undefined;
    const entityId = this.entityId
      ? parseInt(String(this.entityId).trim(), 10)
      : undefined;

    if (!metricId && !entityId) {
      throw new Error("Entity ID is required when creating a new metric. Use List Metrics to find the entity_id from an existing metric.");
    }

    const mde = this.minimumDetectableEffect
      ? parseFloat(String(this.minimumDetectableEffect).trim())
      : undefined;
    if (mde !== undefined && !Number.isFinite(mde)) {
      throw new Error(`Invalid minimumDetectableEffect: "${this.minimumDetectableEffect}" is not a valid number.`);
    }

    if (metricId !== undefined && !Number.isFinite(metricId)) {
      throw new Error(`Invalid metricId: "${this.metricId}" is not a valid integer.`);
    }
    if (entityId !== undefined && !Number.isFinite(entityId)) {
      throw new Error(`Invalid entityId: "${this.entityId}" is not a valid integer.`);
    }

    const data = {
      name: this.name,
      description: this.description,
      display_style: this.displayStyle ?? "decimal",
      minimum_detectable_effect: mde,
    };

    if (entityId) {
      data.entity_id = entityId;
    }

    let response;
    if (metricId) {
      response = await this.app.updateMetric({
        $,
        metricId,
        data,
      });
      $.export("$summary", `Updated metric ${metricId}: ${response?.name ?? this.name}`);
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
