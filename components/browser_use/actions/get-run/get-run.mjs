import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-get-run",
  name: "Get V4 Run",
  description:
    "Get a Browser Use V4 run, including status, result, and cost. [See the API reference](https://api.browser-use.com/api/v4/openapi.json)",
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
