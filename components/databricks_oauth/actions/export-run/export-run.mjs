import databricks_oauth from "../../databricks_oauth.app.mjs";

export default {
  key: "databricks_oauth-export-run",
  name: "Export Run",
  description: "Export and retrieve the job run task. [See the documentation](https://docs.databricks.com/api/workspace/jobs/exportrun)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
    viewsToExport: {
      type: "string",
      label: "Views to Export",
      description: "Which views to export. Defaults to `CODE`",
      optional: true,
      options: [
        "CODE",
        "DASHBOARDS",
        "ALL",
      ],
    },
  },
  async run({ $ }) {
    const {
      databricks_oauth,
      runId,
      viewsToExport,
    } = this;

    const response = await databricks_oauth.exportRun({
      $,
      params: {
        run_id: runId,
        views_to_export: viewsToExport,
      },
    });

    $.export("$summary", `Successfully exported run with ID \`${runId}\`.`);

    return response;
  },
};
