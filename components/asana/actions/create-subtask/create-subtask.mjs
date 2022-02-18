// legacy_hash_id: a_vgi87A
import { axios } from "@pipedream/platform";

export default {
  key: "asana-create-subtask",
  name: "Create Subtask",
  description: "Create a subtask",
  version: "0.2.1",
  type: "action",
  props: {
    asana: {
      type: "app",
      app: "asana",
    },
    task_gid: {
      type: "string",
    },
    name: {
      type: "string",
    },
    assignee: {
      type: "string",
      optional: true,
    },
    assignee_status: {
      type: "string",
      optional: true,
    },
    completed: {
      type: "string",
    },
    due_at: {
      type: "string",
      optional: true,
    },
    due_on: {
      type: "string",
      optional: true,
    },
    followers: {
      type: "string",
      optional: true,
    },
    html_notes: {
      type: "string",
      optional: true,
    },
    notes: {
      type: "string",
      optional: true,
    },
    projects: {
      type: "string",
      optional: true,
    },
    start_on: {
      type: "string",
      optional: true,
    },
    tags: {
      type: "string",
      optional: true,
    },
    workspace: {
      type: "string",
    },
  },
  async run({ $ }) {

    return await axios($, {
      method: "post",
      url: `https://app.asana.com/api/1.0/tasks/${this.task_gid}/subtasks`,
      headers: {
        "Authorization": `Bearer ${this.asana.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      data: {
        data: {
          name: this.name,
          assignee: this.assignee,
          assignee_status: this.assignee_status,
          completed: this.completed,
          due_at: this.due_at,
          due_on: this.due_on,
          followers: this.followers,
          html_notes: this.html_notes,
          notes: this.notes,
          projects: this.projects,
          start_on: this.start_on,
          tags: this.tags,
          workspace: this.workspace,
        },
      },
    });
  },
};
