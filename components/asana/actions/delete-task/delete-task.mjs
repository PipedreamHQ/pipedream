import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-delete-task",
  name: "Delete Task",
  description: "Deletes a specific and existing task. [See the documentation](https://developers.asana.com/docs/delete-a-task)",
  version: "0.0.13",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    task_gid: {
      label: "Task GID",
      description: "The ID of the task to delete.",
      type: "string",
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          project: c.project,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.asana._makeRequest({
      path: `tasks/${this.task_gid}`,
      method: "delete",
      $,
    });

    $.export("$summary", "Successfully deleted task");

    return response;
  },
};
