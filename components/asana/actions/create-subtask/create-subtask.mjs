// legacy_hash_id: a_vgi87A
import asana from "../../asana.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "asana-create-subtask",
  name: "Create Subtask",
  description: "Create a subtask",
  version: "0.3.1",
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
      description: "The task GID to operate on.",
      type: "string",
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          projects: c.project,
        }),
      ],
    },
    name: {
      label: "Name",
      description: "Name of the subtask. This is generally a short sentence fragment that fits on a line in the UI for maximum readability. However, it can be longer.",
      type: "string",
    },
    assignee: {
      label: "Assignee",
      description: "Gid of a user.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "users",
      ],
    },
    assignee_section: {
      label: "Assignee Section",
      description: "The assignee section is a subdivision of a project that groups tasks together in the assignee's \"My Tasks\" list.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "sections",
        (c) => ({
          projects: c.project,
        }),
      ],
    },
    completed: {
      label: "Completed",
      description: "True if the task is currently marked complete, false if not.",
      type: "boolean",
      optional: true,
    },
    due_at: {
      label: "Due At",
      description: "The UTC date and time on which this task is due, or null if the task has no due time. This takes an ISO 8601 date string in UTC and should not be used together with due_on.",
      type: "string",
      optional: true,
    },
    due_on: {
      label: "Due On",
      description: "The localized date on which this task is due, or null if the task has no due date. This takes a date with YYYY-MM-DD format and should not be used together with due_at.",
      type: "string",
      optional: true,
    },
    followers: {
      label: "Followers",
      description: "An array of strings identifying users. These can either be the string \"me\", an email, or the gid of a user.",
      type: "string[]",
      optional: true,
      propDefinition: [
        asana,
        "users",
      ],
    },
    html_notes: {
      label: "HTML Notes",
      description: "The notes of the text with formatting as HTML.",
      type: "string",
      optional: true,
    },
    notes: {
      label: "Notes",
      description: "Free-form textual information associated with the task (i.e. its description).",
      type: "string",
      optional: true,
    },
    start_on: {
      label: "Start On",
      description: "The day on which work begins for the task , or null if the task has no start date. This takes a date with YYYY-MM-DD format.",
      type: "string",
      optional: true,
    },
    tags: {
      propDefinition: [
        asana,
        "tags",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    return await axios($, {
      method: "post",
      url: `${this.asana._apiUrl()}/tasks/${this.task_gid}/subtasks`,
      headers: this.asana._headers(),
      data: {
        data: {
          name: this.name,
          assignee: this.assignee,
          assignee_section: this.assignee_section,
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
