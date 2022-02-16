// legacy_hash_id: a_l0iLdL
import { axios } from "@pipedream/platform";

export default {
  key: "asana-create-task-comment",
  name: "Create Task Comment",
  description: "Create a comment on a task",
  version: "0.1.1",
  type: "action",
  props: {
    asana: {
      type: "app",
      app: "asana",
    },
    task_gid: {
      type: "string",
    },
    text: {
      type: "string",
    },
  },
  async run({ $ }) {

    return await axios($, {
      method: "post",
      url: `https://app.asana.com/api/1.0/tasks/${this.task_gid}/stories`,
      headers: {
        "Authorization": `Bearer ${this.asana.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      data: {
        data: {
          task: this.task_gid,
          text: this.text,
        },
      },
    });
  },
};
