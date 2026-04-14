import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-create-task",
  name: "Create Task",
  description: "Creates a new task. [See the documentation](https://developers.asana.com/docs/create-a-task)",
  version: "0.4.5",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    name: {
      label: "Name",
      description: "Name of the task. This is generally a short sentence fragment that fits on a line in the UI for maximum readability. However, it can be longer.",
      type: "string",
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
    parent: {
      label: "Parent",
      description: "Gid of a task.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "tasks",
        (c) => ({
          project: c.project,
        }),
      ],
    },
    start_on: {
      label: "Start On",
      description: "The day on which work begins for the task , or null if the task has no start date. This takes a date with YYYY-MM-DD format.",
      type: "string",
      optional: true,
    },
    custom_fields: {
      label: "Custom Fields",
      description: `An object where each key is a Custom Field gid and each value is an enum gid, string, or number: E.g. {
        "4578152156": "Not Started",
        "5678904321": "On Hold"
      }`,
      type: "string",
      optional: true,
    },
  },
  async run({ $ }) {
    let customFields;
    if (this.custom_fields) customFields = JSON.parse(this.custom_fields);

    const response = await this.asana._makeRequest({
      path: "tasks",
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
          parent: this.parent,
          projects: this.project,
          start_on: this.start_on,
          tags: this.tags,
          workspace: this.workspace,
          custom_fields: customFields,
        },
      },
      $,
    });

    $.export("$summary", "Successfully created task");

    return response;
  },
};
