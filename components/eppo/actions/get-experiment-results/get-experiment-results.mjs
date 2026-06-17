import app from "../../eppo.app.mjs";

export default {
  key: "eppo-get-experiment-results",
  name: "Get Experiment Results",
  description:
    "Retrieve full details and analysis results for a single experiment, including outcome, winning variant key, key takeaways, and per-metric results."
    + " Use this when the user asks about experiment performance, results, or analysis for a specific experiment."
    + " Use **List Experiments** first to find the numeric `experimentId` — Eppo uses integer IDs for experiment lookups."
    + " Set `allowDelete` to `true` to permit deletion of the experiment alongside retrieval."
    + " [See the documentation](https://eppo.cloud/api/docs#/Experiments/getExperiment)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    experimentId: {
      type: "integer",
      label: "Experiment ID",
      description: "The numeric ID of the experiment. Use **List Experiments** to discover experiment IDs.",
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
    allowDelete: {
      type: "boolean",
      label: "Allow Delete",
      description: "Whether to allow deletion of the experiment",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.getExperiment({
      $,
      experimentId: this.experimentId,
      params: {
        with_calculated_metrics: this.withCalculatedMetrics,
        with_full_cuped_data: this.withFullCupedData,
        allow_delete: this.allowDelete,
      },
    });
    $.export("$summary", `Retrieved results for experiment ${this.experimentId}: ${response?.name ?? ""}`);
    return response;
  },
};
