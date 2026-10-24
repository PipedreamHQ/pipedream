import microsoftTodo from "../../microsofttodo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

const isNotFoundError = (error) => [
  error?.status,
  error?.statusCode,
  error?.response?.status,
  error?.cause?.status,
].includes(404);

export default {
  key: "microsofttodo-delete-task",
  name: "Delete Task",
  description: "Deletes one specifically identified Microsoft To Do task after checking its task list ID, task ID, exact expected title, and explicit confirmation. An optional last-modified value can prevent deletion if the task changed after review. [See the documentation](https://learn.microsoft.com/en-us/graph/api/todotask-delete).",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  ai: "optimized",
  props: {
    microsoftTodo,
    taskListId: {
      propDefinition: [
        microsoftTodo,
        "taskListId",
      ],
    },
    taskId: {
      propDefinition: [
        microsoftTodo,
        "taskId",
        ({ taskListId }) => ({
          taskListId,
        }),
      ],
    },
    expectedTitle: {
      propDefinition: [
        microsoftTodo,
        "expectedTitle",
      ],
    },
    expectedLastModifiedDateTime: {
      propDefinition: [
        microsoftTodo,
        "expectedLastModifiedDateTime",
      ],
    },
    confirmDelete: {
      type: "boolean",
      label: "Confirm Delete",
      description: "Must be set to `true` to confirm deletion of the task identified by the supplied IDs and expected title.",
    },
  },
  async run({ $ }) {
    if (this.confirmDelete !== true) {
      throw new ConfigurationError("Confirm Delete must be set to true. No change was made.");
    }

    let task;
    try {
      task = await this.microsoftTodo.getTask({
        taskListId: this.taskListId,
        taskId: this.taskId,
        $,
      });
    } catch (error) {
      if (!isNotFoundError(error)) {
        throw error;
      }

      $.export("$summary", `Task ${this.taskId} is already absent; no delete request was sent.`);
      return {
        alreadyAbsent: true,
        deleted: false,
        operation: "already-absent",
        taskId: this.taskId,
        taskListId: this.taskListId,
      };
    }

    if (task.title !== this.expectedTitle) {
      throw new ConfigurationError(`Task title mismatch. Expected "${this.expectedTitle}" but task ${this.taskId} is titled "${task.title}". No change was made.`);
    }

    if (this.expectedLastModifiedDateTime && task.lastModifiedDateTime !== this.expectedLastModifiedDateTime) {
      throw new ConfigurationError(`Task ${this.taskId} was modified after it was reviewed. Expected lastModifiedDateTime "${this.expectedLastModifiedDateTime}" but found "${task.lastModifiedDateTime}". No change was made.`);
    }

    try {
      await this.microsoftTodo.deleteTask({
        taskListId: this.taskListId,
        taskId: this.taskId,
        $,
      });
    } catch (deleteError) {
      try {
        await this.microsoftTodo.getTask({
          taskListId: this.taskListId,
          taskId: this.taskId,
          $,
        });
      } catch (verificationError) {
        if (isNotFoundError(verificationError)) {
          $.export("$summary", `Task ${this.taskId} is absent after an uncertain delete response; deletion is verified.`);
          return {
            deleted: true,
            operation: "delete-verified-after-uncertain-response",
            taskId: this.taskId,
            taskListId: this.taskListId,
          };
        }

        throw new ConfigurationError(`The delete outcome for task ${this.taskId} is uncertain because both the delete request and verification read failed. Do not retry automatically; read the exact task ID before requesting another deletion.`);
      }

      throw new ConfigurationError(`The delete request failed and task ${this.taskId} still exists. It was not retried. Review the task again and obtain fresh confirmation before another delete request. Original error: ${deleteError.message}`);
    }

    try {
      await this.microsoftTodo.getTask({
        taskListId: this.taskListId,
        taskId: this.taskId,
        $,
      });
    } catch (verificationError) {
      if (isNotFoundError(verificationError)) {
        $.export("$summary", `Successfully deleted task ${this.taskId} and verified that it is absent.`);
        return {
          deleted: true,
          operation: "deleted",
          taskId: this.taskId,
          taskListId: this.taskListId,
        };
      }

      throw new ConfigurationError(`Task ${this.taskId} returned a successful delete response, but absence could not be verified. Do not retry automatically; read the exact task ID before requesting another deletion.`);
    }

    throw new ConfigurationError(`Task ${this.taskId} still exists after a successful delete response. Do not retry automatically; review the task before requesting another deletion.`);
  },
};
