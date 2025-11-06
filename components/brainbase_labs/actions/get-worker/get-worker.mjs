import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase_labs-get-worker",
  name: "Get Worker",
  description:
    "Get a single worker by ID. [See the documentation](https://docs.usebrainbase.com)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
    readOnlyHint: true,
  },
  props: {
    app,
    workerId: {
      propDefinition: [app, "workerId"],
    },
  },
  async run({ $ }) {
    const response = await this.app.getWorker({
      $,
      workerId: this.workerId,
    });

    $.export(
      "$summary",
      `Successfully retrieved worker with ID ${this.workerId}`
    );
    return response;
  },
};
