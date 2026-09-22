import wrike from "../../wrike.app.mjs";
import {
  TASK_STATUS_OPTIONS, TASK_IMPORTANCE_OPTIONS,
} from "../../common/constants.mjs";
import { parseJson } from "../../common/utils.mjs";

export default {
  key: "wrike-update-task",
  name: "Update Task",
  description: "Update any combination of a Wrike task's fields (title, description, status, importance, assignees, dates, custom fields) in a single call via PUT /tasks/{taskId}. Supersedes the former Update Task Custom Fields action. Use **Find Tasks** or **Get Task** to obtain the taskId; use **List Contact ID Options** for assignee IDs and **List Custom Fields Keys Options** for custom field IDs. [See the documentation](https://developers.wrike.com/reference/puttaskssingle)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    readOnlyHint: false,
    destructiveHint: false,
    openWorldHint: true,
  },
  props: {
    wrike,
    taskId: {
      propDefinition: [
        wrike,
        "taskId",
      ],
      description: "The ID of the task to update, e.g. `IEAASDF3KQAAAAAA`. Run the **Find Tasks** action to look up task IDs.",
    },
    title: {
      type: "string",
      label: "Title",
      description: "New task title.",
      optional: true,
    },
    description: {
      type: "string",
      label: "Description",
      description: "New task description.",
      optional: true,
    },
    status: {
      type: "string",
      label: "Status",
      description: "New task status. One of: `Active`, `Deferred`, `Completed`, `Cancelled`.",
      optional: true,
      options: TASK_STATUS_OPTIONS,
    },
    importance: {
      type: "string",
      label: "Importance",
      description: "New task importance. One of: `High`, `Normal`, `Low`.",
      optional: true,
      options: TASK_IMPORTANCE_OPTIONS,
    },
    addResponsibles: {
      propDefinition: [
        wrike,
        "contactId",
      ],
      type: "string[]",
      label: "Add Responsibles",
      description: "Contact IDs to add as assignees, e.g. `KUABCDEF` (the intake 'responsibles' input maps here; Wrike PUT has no flat responsibles field). Run **List Contact ID Options** to look up IDs.",
      optional: true,
    },
    removeResponsibles: {
      propDefinition: [
        wrike,
        "contactId",
      ],
      type: "string[]",
      label: "Remove Responsibles",
      description: "Contact IDs to remove as assignees. Run **List Contact ID Options** to look up IDs.",
      optional: true,
    },
    dates: {
      type: "string",
      label: "Dates",
      description: "JSON object of task dates. Example: `{\"start\":\"2026-07-23\",\"due\":\"2026-09-30\",\"type\":\"Planned\"}`.",
      optional: true,
    },
    customStatus: {
      type: "string",
      label: "Custom Status",
      description: "ID of a custom workflow status to set.",
      optional: true,
    },
    customFields: {
      type: "string",
      label: "Custom Fields",
      description: "JSON array of custom field objects to set. Example: `[{\"id\":\"IEAASDF3JQAAAAAA\",\"value\":\"Done\"}]`. Run **List Custom Fields Keys Options** to discover valid field IDs.",
      optional: true,
    },
  },
  async run({ $ }) {
    const task = await this.wrike.updateTask({
      $,
      taskId: this.taskId,
      data: {
        title: this.title,
        description: this.description,
        status: this.status,
        importance: this.importance,
        addResponsibles: this.addResponsibles,
        removeResponsibles: this.removeResponsibles,
        dates: parseJson(this.dates),
        customStatus: this.customStatus,
        customFields: parseJson(this.customFields),
      },
    });

    $.export("$summary", `Successfully updated task ${task.title} (${task.id})`);
    return task;
  },
};
