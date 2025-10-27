import { parseObject } from "../../common/utils.mjs";
import dart from "../../dart.app.mjs";

export default {
  key: "dart-find-or-create-task",
  name: "Find or Create Task",
  description: "Checks for an existing task within a dartboard using the 'task-name'. If it doesn't exist, a new task is created. [See the documentation](https://app.dartai.com/api/v0/public/docs/#/Task/createTask)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    dart,
    dartboard: {
      propDefinition: [
        dart,
        "dartboard",
      ],
      optional: false,
    },
    title: {
      propDefinition: [
        dart,
        "taskName",
      ],
    },
    parentId: {
      propDefinition: [
        dart,
        "taskId",
      ],
      label: "Parent Task ID",
      description: "The universal, unique ID of the parent task. These tasks have a parent-child relationship where the current task is the child and this task ID corresponds to the parent. Subtasks inherit context from their parent and are typically smaller units of work",
    },
    type: {
      propDefinition: [
        dart,
        "type",
      ],
    },
    status: {
      propDefinition: [
        dart,
        "status",
      ],
      label: "Status",
      description: "The status from the list of available statuses",
    },
    description: {
      type: "string",
      label: "Description",
      description: "A longer description of the task, which can include markdown formatting",
    },
    assignees: {
      propDefinition: [
        dart,
        "assigneeIds",
      ],
      label: "Assignees",
      description: "The names or emails of the users that the task is assigned to. Either this or assignee must be included, depending on whether the workspaces allows multiple assignees or not",
    },
    assignee: {
      propDefinition: [
        dart,
        "assigneeIds",
      ],
      type: "string",
      label: "Assignee",
      description: "The name or email of the user that the task is assigned to. Either this or assignees must be included, depending on whether the workspaces allows multiple assignees or not",
    },
    tags: {
      propDefinition: [
        dart,
        "tags",
      ],
      label: "Tags",
      description: "Any tags that should be applied to the task, which can be used to filter and search for tasks. Tags are also known as labels or components and are strings that can be anything, but should be short and descriptive",
    },
    priority: {
      propDefinition: [
        dart,
        "priority",
      ],
      label: "Priority",
      description: "The priority, which is a string that can be one of the specified options. This is used to sort tasks and determine which tasks should be done first",
    },
    startAt: {
      propDefinition: [
        dart,
        "startAt",
      ],
    },
    dueAt: {
      propDefinition: [
        dart,
        "dueAt",
      ],
    },
    size: {
      propDefinition: [
        dart,
        "size",
      ],
    },
    customProperties: {
      propDefinition: [
        dart,
        "customProperties",
      ],
    },
  },
  async run({ $ }) {
    const { results } = await this.dart.listTasks({
      $,
      params: {
        title: this.taskName,
        dartboard: this.dartboard,
      },
    });

    if (results?.length) {
      $.export("$summary", `Successfully found task with ID: ${results[0].id}`);
      return results;
    }

    const { item: response } = await this.dart.createTask({
      $,
      data: {
        item: {
          title: this.title,
          parentId: this.parentId,
          dartboard: this.dartboard,
          type: this.type,
          status: this.status,
          description: this.description,
          assignees: parseObject(this.assignees),
          assignee: this.assignee,
          tags: parseObject(this.tags),
          priority: this.priority,
          startAt: this.startAt,
          dueAt: this.dueAt,
          size: this.size,
          customProperties: parseObject(this.customProperties),
        },
      },
    });

    $.export("$summary", `Successfully created task with ID: ${response.duid || response.id}`);
    return response;
  },
};
