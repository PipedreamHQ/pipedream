import kanbanizeApp from "../../kanbanize.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "kanbanize-list-all-tasks",
  name: "List Tasks",
  description: "Get All Tasks. [See the docs here](https://kanbanize.com/api)",
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
      description: "The ID of the board where the tasks are located.\n\nYou can see the board ID on the dashboard screen, in the upper right corner of each board.",
      propDefinition: [
        kanbanizeApp,
        "boardId",
      ],
    },
    subtasks: {
      label: "Subtasks",
      description: "Set true if you want to get subtask details for each task.",
      type: "boolean",
      default: true,
    },
    comments: {
      label: "Comments",
      description: "Set true if you want to get comments for each task.",
      type: "boolean",
      default: true,
    },
    textFormat: {
      label: "Text Format",
      description: "If the plain text format is used, the HTML tags are stripped from the task description.",
      type: "string",
      options: constants.textFormatOpts,
    },
    section: {
      label: "Section",
      description: "Get card from a specific board area.",
      type: "string",
      optional: true,
      options: constants.sectionOpts,
    },
    column: {
      label: "Column",
      description: "Get only cards from a specific column.\n\nThis field has higher priority than the section option.",
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
      description: "Only get cards from that specific lane.",
      type: "string",
      optional: true,
      async options() {
        if (!this.boardId) {
          return [];
        }
        return this.kanbanizeApp.getBoardsLanes(this.boardId);
      },
    },
    container: {
      label: "Archive Container",
      description: "Set true if you want to get tasks from archive.",
      type: "boolean",
      default: false,
      reloadProps: true,
    },
  },
  async additionalProps() {
    if (!this.container) {
      return {};
    }
    return {
      fromDate: {
        label: "From date",
        description: "Only applicable with container=”archive”.\n\nThe date after which the tasks have been archived. Accepts the format: `2012-05-05`. Default value is `1970-01-01`",
        type: "string",
        optional: true,
      },
      toDate: {
        label: "To date",
        description: "Only applicable with container=”archive”.\n\nThe date before which the tasks have been archived. Accepts the following format: `2012-05-05`. Default value is `now`",
        type: "string",
        optional: true,
      },
      showInitiatives: {
        label: "Show initiatives",
        description: "Only applicable with container=”archive”.\n\nIf this parameter is set true the response will return only initiatives. Otherwise, it will return only tasks.",
        type: "boolean",
        optional: true,
      },
      version: {
        label: "Version",
        description: "Gives the tasks from the specified archive version.\n\nThe From Date and To Date parameters are ignored.",
        type: "string",
        optional: true,
      },
      page: {
        label: "Page",
        description: "Only applicable with container=”archive”.\n\nBy default this method returns 30 tasks per page. If not set, the first 30 values will be returned.",
        type: "integer",
        optional: true,
      },
    };
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
    const searchParams = this.removeUnusedParams({
      boardid: this.boardId,
      subtasks: this.subtasks ?
        "yes" :
        null,
      comments: this.comments ?
        "yes" :
        null,
      container: this.container
        ? "archive" :
        null,
      fromdate: this.fromDate,
      todate: this.toDate,
      showInitiatives: this.showInitiatives,
      version: this.version,
      page: this.page,
      textformat: this.textFormat,
      column: this.column,
      lane: this.lane,
      section: this.section,
    });
    const response = await this.kanbanizeApp.getAllTasks(searchParams);
    $.export("$summary", `Successfully fetched ${response.length} tasks`);
    return response;
  },
};
