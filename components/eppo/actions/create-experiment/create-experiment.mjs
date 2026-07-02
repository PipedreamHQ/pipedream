import app from "../../eppo.app.mjs";

export default {
  key: "eppo-create-experiment",
  name: "Create Experiment",
  description:
    "Create a new experiment analysis in Eppo. Use **List Experiments** first to find valid `entityId` and `assignmentSourceId` values — these numeric IDs are not available separately and must be copied from an existing experiment."
    + " Use **List Metrics** to find metric IDs to attach to the experiment."
    + " `experimentKey` must be a unique slug matching the assignment logging key in your codebase."
    + " IMPORTANT: `variations` is a JSON array where each object requires `variant_key`, `is_active`, and `is_control` fields. Exactly one variation must have `is_control: true`."
    + " Example variations: `[{\"variant_key\": \"control\", \"name\": \"Control\", \"is_active\": true, \"is_control\": true}, {\"variant_key\": \"treatment\", \"name\": \"Treatment\", \"is_active\": true, \"is_control\": false}]`."
    + " IMPORTANT: `metrics` is a JSON array of objects with `metric_id` (integer) and `is_primary` (boolean) fields. Exactly one metric must have `is_primary: true`."
    + " Example metrics: `[{\"metric_id\": 333870, \"is_primary\": true}]`."
    + " Dates must be ISO 8601 format: `2024-01-01T00:00:00Z`."
    + " [See the documentation](https://eppo.cloud/api/docs#/Experiments/createExperiment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "A human-readable display name for the experiment.",
    },
    experimentKey: {
      type: "string",
      label: "Experiment Key",
      description: "A unique slug that matches the assignment logging key in your codebase (e.g. `welcome-banner-test`).",
    },
    entityId: {
      type: "integer",
      label: "Entity ID",
      description: "The numeric ID of the entity type being randomized (e.g. user, session). Use **List Experiments** to find this value from an existing experiment's `entity_id` field.",
    },
    assignmentSourceId: {
      type: "integer",
      label: "Assignment Source ID",
      description: "The numeric ID of the assignment source (logging integration). Use **List Experiments** to find this value from an existing experiment's `assignment_source_id` field.",
    },
    metrics: {
      type: "string",
      label: "Metrics",
      description: "JSON array of metric objects. Each requires `metric_id` (integer) and `is_primary` (boolean). Exactly one metric must have `is_primary: true`. Use **List Metrics** to find IDs."
        + " Example: `[{\"metric_id\": 333870, \"is_primary\": true}, {\"metric_id\": 333871, \"is_primary\": false}]`.",
    },
    variations: {
      type: "string",
      label: "Variations",
      description: "JSON array of variation objects. Each requires `variant_key` (slug), `is_active` (boolean), and `is_control` (boolean). Exactly one variation must have `is_control: true`. Do NOT use `key` — use `variant_key`."
        + " Example: `[{\"variant_key\": \"control\", \"name\": \"Control\", \"is_active\": true, \"is_control\": true}, {\"variant_key\": \"treatment\", \"name\": \"Treatment\", \"is_active\": true, \"is_control\": false}]`.",
    },
    assignmentsStartDate: {
      type: "string",
      label: "Assignments Start Date",
      description: "ISO 8601 date-time for when assignment logging began. Example: `2024-01-01T00:00:00Z`.",
      optional: true,
    },
    assignmentsEndDate: {
      type: "string",
      label: "Assignments End Date",
      description: "ISO 8601 date-time for when assignment logging ended. Omit for ongoing experiments.",
      optional: true,
    },
  },
  async run({ $ }) {
    const metrics = JSON.parse(this.metrics);
    const variations = JSON.parse(this.variations);
    const response = await this.app.createExperiment({
      $,
      data: {
        name: this.name,
        experiment_key: this.experimentKey,
        entity_id: this.entityId,
        assignment_source_id: this.assignmentSourceId,
        metrics,
        variations,
        assignments_start_date: this.assignmentsStartDate,
        assignments_end_date: this.assignmentsEndDate,
      },
    });
    $.export("$summary", `Created experiment ${response?.id}: ${response?.name ?? this.name}`);
    return response;
  },
};
