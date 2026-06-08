import app from "../../eppo.app.mjs";

export default {
  key: "eppo-list-experiments",
  name: "List Experiments",
  description:
    "Retrieve all experiments in Eppo with their name, key, status, entity ID, and assignment source ID."
    + " Use this to list experiments by status, discover experiment IDs for **Get Experiment Results**, or find `entity_id` and `assignment_source_id` values needed to create new experiments with **Create Experiment**."
    + " Filter by `status` (e.g. `running`, `stopped`, `analysis_complete`) to narrow results."
    + " Set `includeResults` to also return metric results and key takeaways in the response."
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
    status: {
      type: "string",
      label: "Status",
      description: "Filter experiments by status. Common values: `running`, `stopped`, `analysis_complete`, `draft`. Omit to return experiments with any status.",
      optional: true,
    },
    includeArchived: {
      type: "boolean",
      label: "Include Archived",
      description: "Set to `true` to include archived experiments. Defaults to `false`.",
      optional: true,
    },
    includeResults: {
      type: "boolean",
      label: "Include Results",
      description: "Set to `true` to include metric results and key takeaways for each experiment. Defaults to `false`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.app.listExperiments({
      $,
      status: this.status,
      includeArchived: this.includeArchived,
      includeResults: this.includeResults,
    });
    const experiments = response?.experiments ?? response ?? [];
    $.export("$summary", `Retrieved ${experiments.length} experiment(s)`);
    return experiments;
  },
};
