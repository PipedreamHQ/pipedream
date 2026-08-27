import browserUse from "../../browser_use.app.mjs";

export default {
  key: "browser_use-cancel-run",
  name: "Cancel V4 Run",
  description:
    "Cancel an in-flight Browser Use V4 run by its Run ID. Terminal runs are returned unchanged; cancellation stops later model calls and further run billing. [See the documentation](https://api.browser-use.com/api/v4/openapi.json)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
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
    const response = await this.browserUse.cancelRun({
      $,
      runId: this.runId,
    });

    $.export("$summary", `Cancelled V4 run ${this.runId}`);
    return response;
  },
};
