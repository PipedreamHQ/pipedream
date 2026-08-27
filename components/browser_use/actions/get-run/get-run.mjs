import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-get-run",
  name: "Get V4 Run",
  description:
    "Retrieve status, result, cost, and session details for a Browser Use V4 run. Select a run, or use the Run ID returned by Create V4 Run or List V4 Runs. [See the documentation](https://api.browser-use.com/api/v4/openapi.json)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    browserUse,
    runId: {
      propDefinition: [
        browserUse,
        "runId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.browserUse.getRun({
      $,
      runId: this.runId,
    });

    $.export(
      "$summary",
      `Retrieved V4 run ${response.id} with status ${response.status}`,
    );
    return response;
  },
};
