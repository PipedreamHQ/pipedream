import kanbanizeApp from "../../kanbanize.app.mjs";

export default {
  key: "kanbanize-create-new-task",
  name: "Create New Task",
  description: "Create New Task. [See the docs here](https://kanbanize.com/api)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kanbanizeApp,
    boardId: {
      description: "The ID of the board whose structure you want to get.\n\nYou can see the board ID on the dashboard screen, in the upper right corner of each board.",
      propDefinition: [
        kanbanizeApp,
        "boardId",
      ],
    },
    title: {
      propDefinition: [
        kanbanizeApp,
        "title",
      ],
    },
    description: {
      propDefinition: [
        kanbanizeApp,
        "description",
      ],
    },
    type: {
      propDefinition: [
        kanbanizeApp,
        "type",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
    },
    assignee: {
      propDefinition: [
        kanbanizeApp,
        "assignee",
        (c) => ({
          boardId: c.boardId,
        }),
      ],
    },
    column: {
      label: "Column",
      description: "The name of the column to create the task into (default is Backlog).",
      type: "string",
      optional: true,
      async options() {
        if (!this.boardId) {
          return [];
        }
        return this.kanbanizeApp.getBoardsColumns(this.boardId);
      },
    },
    lane: {
      label: "Lane",
      description: "The name of the swimlane to put the newly created task into.\n\nIf omitted, the task will be placed in the first swimlane.",
      type: "string",
      optional: true,
      async options() {
        if (!this.boardId) {
          return [];
        }
        return this.kanbanizeApp.getBoardsLanes(this.boardId);
      },
    },
    position: {
      label: "Position",
      description: "The position of the task in the new column/swimlane (zero-based).\n\nIf omitted, the task will be placed at the bottom of the column.",
      type: "integer",
      optional: true,
    },
    template: {
      label: "Template",
      description: "The name of the template you want to apply.\n\nIf you specify any property as part of the request, the one specified in the template will be overwritten.",
      type: "string",
      optional: true,
      async options() {
        if (!this.boardId) {
          return [];
        }
        return this.kanbanizeApp.getTemplates(this.boardId);
      },
    },
    exceedingReason: {
      label: "Exceeding Reason",
      description: "If you can exceed a limit with a reason, supply it with this parameter.\n\nApplicable only if column, lane and/or position are supplied.",
      type: "string",
      optional: true,
    },
    priority: {
      propDefinition: [
        kanbanizeApp,
        "priority",
      ],
    },
    size: {
      propDefinition: [
        kanbanizeApp,
        "size",
      ],
    },
    extLink: {
      propDefinition: [
        kanbanizeApp,
        "extLink",
      ],
    },
    deadline: {
      propDefinition: [
        kanbanizeApp,
        "deadline",
      ],
    },
    color: {
      propDefinition: [
        kanbanizeApp,
        "color",
      ],
    },
    tags: {
      propDefinition: [
        kanbanizeApp,
        "tags",
      ],
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
      title: this.title,
      description: this.description,
      priority: this.priority,
      extlink: this.extLink,
      deadline: this.deadline,
      type: this.type,
      assignee: this.assignee,
      column: this.column,
      lane: this.lane,
      template: this.template,
      size: this.size,
      position: this.position,
      exceedingreason: this.exceedingReason,
      tags: this.tags ?
        this.tags.join(" ") :
        null,
      color: this.color ?
        this.color.replace("#", "") :
        null,
      returntaskdetails: 1,
    });
    const response = await this.kanbanizeApp.createNewTask(taskParam);
    $.export("$summary", `Successfully created new task #${response.id}`);
    return response;
  },
};
