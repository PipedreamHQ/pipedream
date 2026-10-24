import microsoftTodo from "../../microsofttodo.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "microsofttodo-reopen-task",
  name: "Reopen Task",
  description: "Reopens one specifically identified completed Microsoft To Do task by setting its status to not started. The task list ID, task ID, and exact expected title are checked before the status is changed. [See the documentation](https://learn.microsoft.com/en-us/graph/api/todotask-update).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
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
  },
  async run({ $ }) {
    const task = await this.microsoftTodo.getTask({
      taskListId: this.taskListId,
      taskId: this.taskId,
      $,
    });

    if (task.title !== this.expectedTitle) {
      throw new ConfigurationError(`Task title mismatch. Expected "${this.expectedTitle}" but task ${this.taskId} is titled "${task.title}". No change was made.`);
    }

    if (this.expectedLastModifiedDateTime && task.lastModifiedDateTime !== this.expectedLastModifiedDateTime) {
      throw new ConfigurationError(`Task ${this.taskId} was modified after it was reviewed. Expected lastModifiedDateTime "${this.expectedLastModifiedDateTime}" but found "${task.lastModifiedDateTime}". No change was made.`);
    }

    if (task.status === "notStarted") {
      $.export("$summary", `Task ${this.taskId} is already not started; no change was made.`);
      return {
        changed: false,
        operation: "already-reopened",
        task,
      };
    }

    if (task.status !== "completed") {
      throw new ConfigurationError(`Task ${this.taskId} has status "${task.status}", not "completed". Reopening it could overwrite meaningful state, so no change was made.`);
    }

    try {
      await this.microsoftTodo.updateTask({
        taskListId: this.taskListId,
        taskId: this.taskId,
        data: {
          status: "notStarted",
        },
        $,
      });
    } catch (updateError) {
      let verificationTask;
      try {
        verificationTask = await this.microsoftTodo.getTask({
          taskListId: this.taskListId,
          taskId: this.taskId,
          $,
        });
      } catch (verificationError) {
        throw new ConfigurationError(`The reopen outcome for task ${this.taskId} is uncertain because both the update request and verification read failed. Do not retry automatically; read the exact task ID before requesting reopening again.`);
      }

      if (verificationTask.status === "notStarted") {
        $.export("$summary", `Task ${this.taskId} is not started after an uncertain update response; reopening is verified.`);
        return {
          changed: true,
          operation: "reopen-verified-after-uncertain-response",
          task: verificationTask,
        };
      }

      throw new ConfigurationError(`The reopen request failed and task ${this.taskId} still has status "${verificationTask.status}". It was not retried. Review the task before another reopen request. Original error: ${updateError.message}`);
    }

    const verifiedTask = await this.microsoftTodo.getTask({
      taskListId: this.taskListId,
      taskId: this.taskId,
      $,
    });

    if (verifiedTask.status !== "notStarted") {
      throw new ConfigurationError(`The update response could not be verified: task ${this.taskId} does not report status "notStarted". Do not retry automatically.`);
    }

    $.export("$summary", `Successfully reopened task ${this.taskId}.`);
    return {
      changed: true,
      operation: "reopened",
      task: verifiedTask,
    };
  },
};
