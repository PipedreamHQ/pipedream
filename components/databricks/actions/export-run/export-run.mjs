import app from "../../databricks.app.mjs";

export default {
  key: "databricks-export-run",
  name: "Export Run",
  description: "Export and retrieve the job run task. [See the documentation](https://docs.databricks.com/api/workspace/jobs/exportrun)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
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
      app,
      runId,
      viewsToExport,
    } = this;

    const response = await app.exportRun({
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
