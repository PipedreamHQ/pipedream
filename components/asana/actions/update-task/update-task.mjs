import asana from "../../asana.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "asana-update-task",
  name: "Update Task",
  description: "Updates one or more fields on an existing Asana task (name, assignee, due date, completion status, notes, custom fields, etc.). All fields are optional — supply only the ones you want to change; unchanged fields retain their current values. Use **Find Task by ID** or **Search Tasks** to obtain the task GID first. Returns the updated task record. Example: call with `task_gid: '1202345678901234'`, `completed: true` → marks the task complete and returns the updated record. [See the documentation](https://developers.asana.com/docs/update-a-task)",
  version: "0.4.9",
  ai: "optimized",
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
      description: "The ID of the task to update",
      type: "string",
      propDefinition: [
        asana,
        "tasks",
      ],
    },
    name: {
      label: "Name",
      description: "Name of the task. This is generally a short sentence fragment that fits on a line in the UI for maximum readability. However, it can be longer.",
      type: "string",
      optional: true,
    },
    assignee: {
      label: "Assignee",
      description: "Gid of a user. Use **List Users** to find available user GIDs.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "users",
      ],
    },
    assignee_section: {
      label: "Assignee Section",
      description: "The assignee section is a subdivision of a project that groups tasks together in the assignee's \"My Tasks\" list (a section GID, e.g. `1203456789012345`). Use **Search Sections** to find available section GIDs.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "sections",
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

    const { data: response } = await this.asana._makeRequest({
      path: `tasks/${this.task_gid}`,
      method: "put",
      data: {
        data: {
          name: this.name,
          assignee: this.assignee,
          assignee_section: this.assignee_section,
          completed: this.completed,
          due_at: this.due_at,
          due_on: this.due_on,
          html_notes: this.html_notes,
          notes: this.notes,
          start_on: this.start_on,
          workspace: this.workspace,
          custom_fields: customFields,
        },
      },
      $,
    });

    $.export("$summary", "Successfully updated task");

    return response;
  },
};
