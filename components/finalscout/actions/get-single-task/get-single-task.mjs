import finalscout from "../../finalscout.app.mjs";

export default {
  key: "finalscout-get-single-task",
  name: "Get Single Task",
  description: "Get the task status for any Single Find task. [See the documentation](https://finalscout.com/public/doc/api.html#tag/Single-Find/paths/~1v1~1find~1single~1status/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    finalscout,
    id: {
      type: "string",
      label: "Task ID",
      description: "The ID of the task to get the status for",
    },
  },
  async run({ $ }) {
    const response = await this.finalscout.getSingleTask({
      $,
      params: {
        id: this.id,
      },
    });
    $.export("$summary", `Successfully retrieved status for task with ID: ${this.id}`);
    return response;
  },
};
