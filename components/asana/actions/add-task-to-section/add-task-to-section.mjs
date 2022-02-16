// legacy_hash_id: a_njiaY8
import { axios } from "@pipedream/platform";

export default {
  key: "asana-add-task-to-section",
  name: "Add Task To Section",
  description: "Add task to section",
  version: "0.1.1",
  type: "action",
  props: {
    asana: {
      type: "app",
      app: "asana",
    },
    section_gid: {
      type: "string",
    },
    task: {
      type: "string",
    },
    insert_before: {
      type: "string",
      optional: true,
    },
    insert_after: {
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {

    return await axios($, {
      method: "post",
      url: `https://app.asana.com/api/1.0/sections/${this.section_gid}/addTask`,

      headers: {
        "Authorization": `Bearer ${this.asana.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      data: {
        data: {
          task: this.task,
          insert_before: this.insert_before,
          insert_after: this.insert_after,
        },
      },
    });
  },
};
