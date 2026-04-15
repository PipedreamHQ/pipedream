import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-create-subtask",
  name: "Create Subtask",
  description: "Creates a new subtask and adds it to the parent task. [See the documentation](https://developers.asana.com/docs/create-a-subtask)",
  version: "0.4.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    task_gid: {
      label: "Task GID",
      description: "The task GID to operate on.",
      type: "string",
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          project: c.project,
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
        ({ workspace }) => ({
          workspace,
        }),
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
          project: c.project,
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
        ({ workspace }) => ({
          workspace,
        }),
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
        ({ workspace }) => ({
          workspace,
        }),
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.asana._makeRequest({
      path: `tasks/${this.task_gid}/subtasks`,
      method: "post",
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
          projects: this.project,
          start_on: this.start_on,
          tags: this.tags,
          workspace: this.workspace,
        },
      },
      $,
    });

    $.export("$summary", "Successfully created subtask");

    return response;
  },
};
