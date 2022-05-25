import kanbanizeApp from "../../kanbanize.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "kanbanize-edit-task",
  name: "Edit Task",
  description: "Edit Task. [See the docs here](https://kanbanize.com/api)",
  version: "0.0.1",
  type: "action",
  props: {
    kanbanizeApp,
    boardId: {
      label: "Board Id",
      description: "The ID of the board to move the task into.\n\nYou can see the board ID on the dashboard screen, in the upper right corner of each board.",
      type: "string",
      reloadProps: true,
      async options() {
        return this.kanbanizeApp.getBoardsOptions();
      },
    },
    taskId: {
      label: "Task Id",
      description: "The ID of the task to edit.",
      type: "string",
      async options() {
        if (!this.boardId) {
          return [];
        }
        return this.kanbanizeApp.getTasksOpts(this.boardId);
      },
    },
    title: {
      label: "Title",
      description: "Title of the task.",
      type: "string",
      optional: true,
    },
    description: {
      label: "Description",
      description: "Description of the task.",
      type: "string",
      optional: true,
    },
    type: {
      label: "Type",
      description: "The type of the task.",
      type: "string",
      optional: true,
      async options() {
        if (!this.boardId) {
          return [];
        }
        return this.kanbanizeApp.getTypes(this.boardId);
      },
    },
    assignee: {
      label: "Assignee",
      description: "Username of the assignee.",
      type: "string",
      optional: true,
      async options() {
        if (!this.boardId) {
          return [];
        }
        return this.kanbanizeApp.getUsernames(this.boardId);
      },
    },
    priority: {
      label: "Priority",
      description: "Priority of the task.",
      type: "string",
      optional: true,
      options: constants.priorityOpts,
    },
    size: {
      label: "Size",
      description: "Size of the task.",
      type: "integer",
      optional: true,
    },
    extLink: {
      label: "External Link",
      description: "A external link in the following format: `https://domain.com/resource`",
      type: "string",
      optional: true,
    },
    deadline: {
      label: "Deadline",
      description: "Deadline in the format: yyyy-mm-dd (e.g. 2011-12-13).",
      type: "string",
      optional: true,
    },
    color: {
      label: "Color",
      description: "Any color code (e.g. #34A97B).",
      type: "string",
      optional: true,
    },
    tags: {
      label: "Tags",
      description: "List of tags.",
      type: "string[]",
      optional: true,
    },
  },
  async additionalProps() {
    if (!this.boardId) {
      return {};
    }
    return this.kanbanizeApp.getCustomFieldsProps(this.boardId);
  },
  methods: {
    removeUnusedParams(searchParams) {
      return Object.keys(searchParams).reduce((acc, key) => (
        (searchParams[key] === undefined || searchParams[key] === null) ?
          acc :
          {
            ...acc,
            [key]: searchParams[key],
          }
      ), {});
    },
    async getCustomFieldsParams(boardId) {
      const customFieldsTaskParam = {};
      const customFields = await this.kanbanizeApp.getCustomFields(boardId);
      for (const customField of customFields) {
        customFieldsTaskParam[customField.name] = this[`cf-${customField.fieldid}`];
      }
      return customFieldsTaskParam;
    },
  },
  async run({ $ }) {
    const customFieldsTaskParam = await this.getCustomFieldsParams(this.boardId);
    const taskParam = this.removeUnusedParams({
      ...customFieldsTaskParam,
      boardid: this.boardId,
      taskid: this.taskId,
      title: this.title,
      description: this.description,
      priority: this.priority,
      extlink: this.extLink,
      deadline: this.deadline,
      type: this.type,
      assignee: this.assignee,
      size: this.size,
      tags: this.tags ?
        this.tags.join(" ") :
        null,
      color: this.color ?
        this.color.replace("#", "") :
        null,
    });
    const response = await this.kanbanizeApp.editTask(taskParam);
    if (response === 1) {
      $.export("$summary", `Successfully edited task #${this.taskId}`);
    }
    return response;
  },
};
