import kanbanizeApp from "../../kanbanize.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "kanbanize-create-new-task",
  name: "Create New Task",
  description: "Create New Task. [See the docs here](https://kanbanize.com/api)",
  version: "0.0.12",
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
      label: "External link",
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
    const props = {
      type: {
        label: "Type",
        description: "The type of the task.",
        type: "string",
        optional: true,
        options: async () => {
          return this.kanbanizeApp.getTypes(this.boardId);
        },
      },
      assignee: {
        label: "Assignee",
        description: "Username of the assignee.",
        type: "string",
        optional: true,
        options: async () => {
          return this.kanbanizeApp.getUsernames(this.boardId);
        },
      },
      column: {
        label: "Column",
        description: "Get only cards from a specific column.\n\nThis field has higher priority than the section option.",
        type: "string",
        optional: true,
        options: async () => {
          return this.kanbanizeApp.getBoardsColumns(this.boardId);
        },
      },
      lane: {
        label: "Lane",
        description: "Only get cards from that specific lane.",
        type: "string",
        optional: true,
        options: async () => {
          return this.kanbanizeApp.getBoardsLanes(this.boardId);
        },
      },
      template: {
        label: "Template",
        description: "The name of the template you want to apply.\n\nIf you specify any property as part of the request, the one specified in the template will be overwritten.",
        type: "string",
        optional: true,
        options: async () => {
          return this.kanbanizeApp.getTemplates(this.boardId);
        },
      },
    };

    // adding custom fields dynamically
    const customFields = await this.kanbanizeApp.getCustomFields(this.boardId);
    for (const customField of customFields) {
      props[`cf-${customField.fieldid}`] = {
        label: `${customField.name}`,
        optional: customField.mandatory,
        description: `This is a custom field, the expected type is: \`${customField.type}\``,
        type: customField.type === "number" ?
          "integer" :
          "string",
      };
      if (customField.possibleValues) {
        props[`cf-${customField.fieldid}`].options = customField.possibleValues.split(",");
      }
    }
    return props;
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
  },
  async run({ $ }) {
    const customFieldsTaskParam = {};
    const customFields = await this.kanbanizeApp.getCustomFields(this.boardId);
    for (const customField of customFields) {
      customFieldsTaskParam[customField.name] = this[`cf-${customField.fieldid}`];
    }

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
      tags: this.tags ?
        this.tags.join(" ") :
        null,
      color: this.color ?
        this.color.replace("#", "") :
        null,
    });
    const response = await this.kanbanizeApp.createNewTask(taskParam);
    $.export("$summary", `Successfully created new task #${response.id}`);
    return response;
  },
};
