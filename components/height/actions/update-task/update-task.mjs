import height from "../../height.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "height-update-task",
  name: "Update Task",
  description: "Updates a specified task within your workspace. [See the documentation](https://height.notion.site/Update-tasks-53d72cb0059a4e0e81cc2fcbfcbf9d0a)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    height,
    taskId: {
      propDefinition: [
        height,
        "taskId",
      ],
    },
    taskName: {
      propDefinition: [
        height,
        "taskName",
      ],
      optional: true,
    },
    description: {
      propDefinition: [
        height,
        "description",
      ],
    },
    listIdsToAdd: {
      propDefinition: [
        height,
        "listIds",
        (c) => ({
          taskId: c.taskId,
          excludeTaskLists: true,
        }),
      ],
      optional: true,
      label: "Lists to Add",
      description: "Lists to add the task to",
    },
    listIdsToRemove: {
      propDefinition: [
        height,
        "listIds",
        (c) => ({
          taskId: c.taskId,
        }),
      ],
      optional: true,
      label: "Lists to Remove",
      description: "Lists to remove the task from",
    },
    assigneeIdsToAdd: {
      propDefinition: [
        height,
        "assigneeIds",
        (c) => ({
          taskId: c.taskId,
          excludeTaskAssignees: true,
        }),
      ],
      label: "Assignees to Add",
      description: "The assignees to add to this task",
    },
    assigneeIdsToRemove: {
      propDefinition: [
        height,
        "assigneeIds",
        (c) => ({
          taskId: c.taskId,
        }),
      ],
      label: "Assignees to Remove",
      description: "The assignees to remove from this task",
    },
    parentTaskId: {
      propDefinition: [
        height,
        "taskId",
      ],
      label: "Parent Task ID",
      description: "The task ID of the parent task",
      optional: true,
    },
  },
  async run({ $ }) {
    if (!this.taskName
      && !this.description
      && !this.listIdsToAdd
      && !this.listIdsToRemove
      && !this.assigneeIdsToAdd
      && !this.assigneeIdsToRemove
      && !this.parentTaskId
    ) {
      throw new ConfigurationError("Please specify at least one field to update");
    }

    const effects = [];
    if (this.taskName) {
      effects.push({
        type: "name",
        name: this.taskName,
      });
    }
    if (this.description) {
      effects.push({
        type: "description",
        description: {
          message: this.description,
        },
      });
    }
    if (this.listIdsToAdd || this.listIdsToRemove) {
      effects.push({
        type: "lists",
        listIds: {
          add: this.listIdsToAdd,
          remove: this.listIdsToRemove,
        },
      });
    }
    if (this.assigneeIdsToAdd || this.assigneeIdsToRemove) {
      effects.push({
        type: "assignees",
        assigneeIds: {
          add: this.assigneeIdsToAdd,
          remove: this.assigneeIdsToRemove,
        },
      });
    }
    if (this.parentTaskId) {
      effects.push({
        type: "parentTask",
        parentTaskId: this.parentTaskId,
      });
    }
    let response;
    try {
      response = await this.height.updateTask({
        $,
        data: {
          patches: [
            {
              taskIds: [
                this.taskId,
              ],
              effects,
            },
          ],
        },
      });
    } catch (e) {
      const messageText = JSON.parse(e.message).error.message;
      if (messageText === "listIds can't be empty.") {
        throw new Error("Task must belong to at least one list");
      }
      throw new Error(messageText);
    }
    $.export("$summary", `Task ${this.taskId} updated successfully`);
    return response;
  },
};
