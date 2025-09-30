import app from "../../parsehub.app.mjs";

export default {
  key: "parsehub-cancel-run",
  name: "Cancel Run",
  description: "Cancels a run and changes its status to cancelled. [See the documentation](https://www.parsehub.com/docs/ref/api/v2/#cancel-a-run)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    runToken: {
      propDefinition: [
        app,
        "runToken",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.cancelRun({
      $,
      runToken: this.runToken,
    });
    $.export("$summary", "Successfully cancelled the run with token: " + this.runToken);
    return response;
  },
};
