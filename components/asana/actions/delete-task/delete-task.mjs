import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-delete-task",
  name: "Delete Task",
  description: "Permanently deletes an Asana task. This action is irreversible — the task, its subtasks, comments, and attachments are removed and cannot be recovered. Use **Find Task by ID** to confirm the task GID before deleting. Returns an empty data object `{}` on success. Example: call with `task_gid: '1202345678901234'` → returns `{}`. [See the documentation](https://developers.asana.com/docs/delete-a-task)",
  version: "0.0.17",
  ai: "optimized",
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
