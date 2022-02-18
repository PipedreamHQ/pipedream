// legacy_hash_id: a_K5i2Gr
import { axios } from "@pipedream/platform";

export default {
  key: "asana-find-task-by-id",
  name: "Find Task by ID",
  description: "Searches for a task by id. Returns the complete task record for a single task.",
  version: "0.1.1",
  type: "action",
  props: {
    asana: {
      type: "app",
      app: "asana",
    },
    task_gid: {
      type: "string",
      description: "The ID of the task to find.",
    },
    opt_pretty: {
      type: "boolean",
      description: "Provides pretty output.",
      optional: true,
    },
    opt_fields: {
      type: "any",
      description: "Defines fields to return.",
      optional: true,
    },
  },
  async run({ $ }) {
    let taskGid = this.task_gid;
    const asanaParams = [
      "opt_pretty",
      "opt_fields",
    ];
    let p = this;

    const queryString = asanaParams.filter((param) => p[param]).map((param) => `${param}=${p[param]}`)
      .join("&");

    return await axios($, {
      url: `https://app.asana.com/api/1.0/tasks/${taskGid}?${queryString}`,
      headers: {
        Authorization: `Bearer ${this.asana.$auth.oauth_access_token}`,
      },
    });
  },
};
