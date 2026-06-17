import app from "../../eppo.app.mjs";

export default {
  key: "eppo-list-experiments",
  name: "List Experiments",
  description:
    "Retrieve all experiments in Eppo with their name, key, status, entity ID, and assignment source ID."
    + " Use this to discover experiment IDs for **Get Experiment Results**, or find `entity_id` values needed to create new experiments."
    + " Filter by `type` (`all`, `experiments`, or `holdouts`), `experimentKey`, `entityId`, `tagNames`, `isDeleted`, `updatedSince`, or `createdSince` to narrow results."
    + " Set `withCalculatedMetrics` or `withFullCupedData` to include additional metric data in the response."
    + " [See the documentation](https://eppo.cloud/api/docs#/Experiments/getExperiments)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    experimentKey: {
      type: "string",
      label: "Experiment Key",
      description: "Filter experiments by experiment key",
      optional: true,
    },
    entityId: {
      propDefinition: [
        app,
        "entityId",
      ],
      optional: true,
    },
    type: {
      type: "string",
      label: "Type",
      description: "Filter experiments by type. Accepted values are: all, experiments, holdouts",
      options: [
        "all",
        "experiments",
        "holdouts",
      ],
      optional: true,
    },
    withCalculatedMetrics: {
      propDefinition: [
        app,
        "withCalculatedMetrics",
      ],
    },
    withFullCupedData: {
      propDefinition: [
        app,
        "withFullCupedData",
      ],
    },
    isDeleted: {
      type: "boolean",
      label: "Is Deleted",
      description: "Filter experiments by deleted status. Accepted values are: true, false",
      optional: true,
    },
    tagNames: {
      type: "string[]",
      label: "Tag Names",
      description: "Filter experiments by tag names",
      optional: true,
    },
    updatedSince: {
      type: "string",
      label: "Updated Since",
      description: "Filter experiments updated after this date (ISO 8601 format in UTC, e.g., 2024-01-01T00:00:00Z or 2024-01-01)",
      optional: true,
    },
    createdSince: {
      type: "string",
      label: "Created Since",
      description: "Filter experiments created after this date (ISO 8601 format in UTC, e.g., 2024-01-01T00:00:00Z or 2024-01-01)",
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
    const response = await this.app.listExperiments({
      $,
      params: {
        experiment_key: this.experimentKey,
        entity_id: this.entityId,
        type: this.type,
        with_calculated_metrics: this.withCalculatedMetrics,
        with_full_cuped_data: this.withFullCupedData,
        is_deleted: this.isDeleted,
        updated_since: this.updatedSince,
        created_since: this.createdSince,
        tags: this.tagNames,
        limit: this.limit,
        offset: this.offset,
      },
    });
    const experiments = response?.experiments ?? response ?? [];
    $.export("$summary", `Retrieved ${experiments.length} experiment(s)`);
    return experiments;
  },
};
