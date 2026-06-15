import app from "../../eppo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

function parseJsonProp(value, label) {
  try {
    return JSON.parse(value);
  } catch {
    throw new ConfigurationError(`\`${label}\` must contain valid JSON`);
  }
}

export default {
  key: "eppo-upsert-metric",
  name: "Upsert Metric",
  description:
    "Create or update a metric in Eppo. Omit `metricId` to create a new metric; provide `metricId` to update an existing one."
    + " Use this when the user wants to define a new KPI/metric or update the definition of an existing metric."
    + " Use **List Metrics** to find the numeric `metricId` for an update and to look up the `entityId` from existing metrics."
    + " `entityId` is required — find it in the `entity_id` field of any existing metric returned by **List Metrics**."
    + " The `minimumDetectableEffect` is a decimal representing the smallest meaningful relative change (e.g. `0.05` for 5%)."
    + " Provide exactly one metric definition: `numerator` (standard or ratio metrics), `percentile`, or `funnelAggregation`."
    + " For ratio metrics, also provide `denominator`. Set `denominator` to the JSON literal `null` for non-ratio metrics."
    + " [See the documentation - Create Metric](https://eppo.cloud/api/docs#/Metrics/createMetric) and [See the documentation - Update Metric](https://eppo.cloud/api/docs#/Metrics/updateMetric)",
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
      description: "The numeric entity type ID this metric measures (e.g. user, session). Use **List Metrics** to find the `entity_id` from any existing metric — all metrics in the same workspace typically share the same entity ID.",
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
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of metric.",
      optional: true,
    },
    displayStyle: {
      type: "string",
      label: "Display Style",
      description: "Whether to format the metric as a percent in the Eppo UI. Valid values: `decimal` or `percent`.",
      options: [
        "decimal",
        "percent",
      ],
      default: "decimal",
    },
    minimumDetectableEffect: {
      type: "string",
      label: "Minimum Detectable Effect",
      description: "The smallest relative change considered meaningful, as a decimal. Example: `0.05` for 5%. Used to calculate required sample sizes.",
      default: "0.05",
    },
    numerator: {
      type: "string",
      label: "Numerator",
      description: "JSON object for the numerator aggregation. Required for standard and ratio metrics; omit or set to `null` for funnel and percentile metrics."
        + " Requires `metric_event_measure_id` and `operation`. Valid operations: `count`, `sum`, `countDistinct`, `timeTo`, `retention`, `conversion`, `threshold`, `countDistinctValue`, `lastValue`, `firstValue`."
        + " `filters` is an array of objects with `metric_event_dimension_id`, `operation` (`EQUALS` or `DOES_NOT_EQUAL`), and `values`."
        + " Set `retention_threshold_days` when operation is `retention`; set `conversion_threshold_days` when operation is `conversion`;"
        + " set `threshold_metric_settings` when operation is `threshold`."
        + " Example: `{\"metric_event_measure_id\": 123, \"operation\": \"count\", \"filters\": []}`.",
      optional: true,
    },
    denominator: {
      type: "string",
      label: "Denominator",
      description: "JSON object for the denominator aggregation on ratio metrics. Use the same shape as `numerator`. Set to the JSON literal `null` for non-ratio metrics."
        + " Example: `{\"metric_event_measure_id\": 456, \"operation\": \"count\", \"filters\": []}`.",
      optional: true,
    },
    percentile: {
      type: "string",
      label: "Percentile",
      description: "JSON object for percentile metrics. Requires `metric_event_measure_id`, `filters` (array), and `percentile_value` (0.01–0.99)."
        + " Example: `{\"metric_event_measure_id\": 123, \"filters\": [], \"percentile_value\": 0.95}`.",
      optional: true,
    },
    funnelAggregation: {
      type: "string",
      label: "Funnel Aggregation",
      description: "JSON object for funnel metrics. Requires `funnel_steps`, an ordered array of objects each with `metric_event_measure_id`."
        + " Optional fields: `conversion_time_from` (`experimentAssignment` or `firstEvent`), `conversion_time_value`, and `conversion_time_units` (`days`, `hours`, `minutes`, or `seconds`)."
        + " Example: `{\"funnel_steps\": [{\"metric_event_measure_id\": 123}, {\"metric_event_measure_id\": 456}], \"conversion_time_value\": 7, \"conversion_time_units\": \"days\"}`.",
      optional: true,
    },
    desiredChange: {
      type: "string",
      label: "Desired Change",
      description: "The desired direction of change. Use `increase` if higher values are better, or `decrease` if lower values are better. If omitted, the metric inherits the desired change from the underlying fact.",
      options: [
        "increase",
        "decrease",
      ],
      optional: true,
    },
    teamId: {
      type: "integer",
      label: "Team ID",
      description: "The numeric ID of the team to assign this metric to. Omit to leave the team assignment unchanged on update.",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.numerator && !this.denominator && !this.percentile && !this.funnelAggregation) {
      throw new ConfigurationError("At least one of `numerator`, `denominator`, `percentile`, or `funnelAggregation` must be provided.");
    }

    const data = {
      name: this.name,
      description: this.description,
      metric_display_style: this.displayStyle,
      minimum_detectable_effect: this.minimumDetectableEffect,
      entity_id: this.entityId,
      type: this.type,
      desired_change: this.desiredChange,
      team_id: this.teamId,
    };

    if (this.numerator !== undefined) {
      data.numerator = parseJsonProp(this.numerator, "Numerator");
    }
    if (this.denominator !== undefined) {
      data.denominator = parseJsonProp(this.denominator, "Denominator");
    }
    if (this.percentile !== undefined) {
      data.percentile = parseJsonProp(this.percentile, "Percentile");
    }
    if (this.funnelAggregation !== undefined) {
      data.funnel_aggregation = parseJsonProp(this.funnelAggregation, "Funnel Aggregation");
    }

    let response;
    if (this.metricId !== undefined) {
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
