// legacy_hash_id: a_wdijKn
import asana from "../../asana.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "asana-delete-task",
  name: "Delete Task",
  description: "Delete a task",
  version: "0.0.1",
  type: "action",
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "Gid of a workspace.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
      optional: true,
    },
    project: {
      label: "Project",
      type: "string",
      propDefinition: [
        asana,
        "projects",
      ],
      optional: true,
    },
    task_gid: {
      label: "Task GID",
      description: "The ID of the task to delete.",
      type: "string",
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          projects: c.project,
        }),
      ],
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "delete",
      url: `${this.asana._apiUrl()}/tasks/${this.task_gid}`,
      headers: this.asana._headers(),
    });
  },
};
