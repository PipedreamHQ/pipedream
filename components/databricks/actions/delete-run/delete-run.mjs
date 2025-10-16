import app from "../../databricks.app.mjs";

export default {
  key: "databricks-delete-run",
  name: "Delete Run",
  description: "Delete a non-active run. Returns an error if the run is active. [See the documentation](https://docs.databricks.com/api/workspace/jobs/deleterun)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    runId: {
      propDefinition: [
        app,
        "runId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteRun({
      data: {
        run_id: this.runId,
      },
      $,
    });

    $.export("$summary", `Successfully deleted run with ID ${this.runId}.`);

    return response || {};
  },
};
