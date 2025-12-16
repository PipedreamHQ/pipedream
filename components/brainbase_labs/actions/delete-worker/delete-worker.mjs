import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase_labs-delete-worker",
  name: "Delete Worker",
  description: "Delete a worker. [See the documentation](https://docs.usebrainbase.com/api-reference/workers/delete-a-worker)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    workerId: {
      propDefinition: [
        app,
        "workerId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.deleteWorker({
      $,
      workerId: this.workerId,
    });

    $.export(
      "$summary",
      `Successfully deleted worker with ID ${this.workerId}`,
    );
    return response;
  },
};
