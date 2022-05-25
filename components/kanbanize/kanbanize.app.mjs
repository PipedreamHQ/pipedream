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
    async getAllTasks(searchParams) {
      const response = await axios(this, this._getRequestParams({
        method: "POST",
        path: "/get_all_tasks",
        data: searchParams,
      }));
      return response;
    },
  },
};
