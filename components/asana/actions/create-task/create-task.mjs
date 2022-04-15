// legacy_hash_id: a_Mdi8Vw
import { axios } from "@pipedream/platform";

export default {
  key: "asana-create-task",
  name: "Create Task",
  description: "Create a task",
  version: "0.2.1",
  type: "action",
  props: {
    asana: {
      type: "app",
      app: "asana",
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
      type: "any",
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
    parent: {
      type: "string",
      optional: true,
    },
    projects: {
      type: "any",
      optional: true,
    },
    start_on: {
      type: "string",
      optional: true,
    },
    tags: {
      type: "any",
      optional: true,
    },
    workspace: {
      type: "string",
    },
  },
  async run({ $ }) {

    return await axios($, {
      method: "post",
      url: "https://app.asana.com/api/1.0/tasks",
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
          parent: this.parent,
          projects: this.projects,
          start_on: this.start_on,
          tags: this.tags,
          workspace: this.workspace,
        },
      },
    });
  },
};
