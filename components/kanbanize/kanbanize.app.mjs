import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "kanbanize",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return `https://${this.$auth.subdomain}.kanbanize.com/index.php/api/kanbanize`;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "apikey": this.$auth.api_key,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async getBoardsOptions() {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/get_projects_and_boards",
      }));
      return response.projects.map((project) => {
        return project.boards.map((board) => ({
          label: `${project.name} - ${board.name}`,
          value: board.id,
        }));
      }).flat();
    },
    async getBoardsColumns(boardId) {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/get_board_structure",
        data: {
          boardid: boardId,
        },
      }));
      return response.columns.map((column) => ({
        label: column.description ?
          `${column.lcname} - ${column.description}` :
          column.lcname,
        value: column.lcname,
      }));
    },
    async getBoardsLanes(boardId) {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/get_board_structure",
        data: {
          boardid: boardId,
        },
      }));
      return response.lanes.map((lane) => ({
        label: lane.description ?
          `${lane.lcname} - ${lane.description}` :
          lane.lcname,
        value: lane.lcname,
      }));
    },
    async getUsernames(boardId) {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/get_board_settings",
        data: {
          boardid: boardId,
        },
      }));
      return response.usernames;
    },
    async getTemplates(boardId) {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/get_board_settings",
        data: {
          boardid: boardId,
        },
      }));
      return response.templates;
    },
    async getTypes(boardId) {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/get_board_settings",
        data: {
          boardid: boardId,
        },
      }));
      return response.types;
    },
    async getTasksOpts(boardId) {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/get_all_tasks",
        data: {
          boardid: boardId,
        },
      }));
      console.log(response);
      return response.map((task) => (
        {
          label: task.title,
          value: task.taskid,
        }
      ));
    },
    async getCustomFields(boardId) {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/get_board_settings",
        data: {
          boardid: boardId,
        },
      }));
      return response.customFields;
    },
    async getCustomFieldsProps(boardId) {
      const props = {};
      const customFields = await this.getCustomFields(boardId);
      for (const customField of customFields) {
        props[`cf-${customField.fieldid}`] = {
          label: `${customField.name}`,
          optional: !customField.mandatory,
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
    async getAllTasks(searchParams) {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/get_all_tasks",
        data: searchParams,
      }));
      return response;
    },
    async createNewTask(taskParam) {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/create_new_task",
        data: taskParam,
      }));
      return response;
    },
    async editTask(taskParam) {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/edit_task",
        data: taskParam,
      }));
      return response;
    },
  },
};
