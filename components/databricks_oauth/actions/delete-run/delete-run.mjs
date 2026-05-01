import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-delete-run",
  name: "Delete Run",
  description: "Delete a non-active run. Returns an error if the run is active. [See the documentation](https://docs.databricks.com/api/workspace/jobs/deleterun)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    databricks_oauth,
    runId: {
      propDefinition: [
        databricks_oauth,
        "runId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.databricks_oauth.deleteRun({
      data: {
        run_id: this.runId,
      },
      $,
    });

    $.export("$summary", `Successfully deleted run with ID ${this.runId}.`);

    return response || {};
  },
};
