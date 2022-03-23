// legacy_hash_id: a_K5i2Gr
import asana from "../../asana.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "asana-find-task-by-id",
  name: "Find Task by ID",
  description: "Searches for a task by id. Returns the complete task record for a single task.",
  version: "0.2.1",
  type: "action",
  props: {
    asana,
    task_gid: {
      label: "Task GID",
      description: "The ID of the task to find.",
      type: "string",
    },
  },
  async run({ $ }) {
    return await axios($, {
      url: `${this.asana._apiUrl()}/tasks/${this.task_gid}`,
      headers: this.asana._headers(),
    });
  },
};
