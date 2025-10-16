import app from "../../parsehub.app.mjs";

export default {
  key: "parsehub-delete-run",
  name: "Delete Run",
  description: "Cancels a run if running, and deletes the run and its data. [See the documentation](https://www.parsehub.com/docs/ref/api/v2/#delete-a-run)",
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
    const response = await this.app.deleteRun({
      $,
      runToken: this.runToken,
    });
    $.export("$summary", "Successfully deleted the run with token: " + this.runToken);
    return response;
  },
};
