import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "google_tasks",
  propDefinitions: {
    title: {
      type: "string",
      label: "Title",
      description: "The title of the task list.",
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of register to be fetched.",
      default: 20,
    },
    taskListId: {
      type: "string",
      label: "Task List",
      description: "The ID of the task list.",
      async options({ prevContext }) {
        const res = await this.getTaskLists(this, {
          pageToken: prevContext.nextPageToken,
        });
        return {
          context: {
            nextPageToken: res.nextPageToken,
          },
          options: res.items.map((taskList) => ({
            label: taskList.title,
            value: taskList.id,
          })),
        };
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return "https://tasks.googleapis.com/tasks/v1";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getRequestParams(opts = {}) {
      return {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
    },
    async paginate(fn, params) {
      let data = [];
      let nextPageToken = null;
      const TOTAL_MAX_RESULTS = Math.min(params.maxResults, 10000);
      const ITEMS_PER_PAGE = Math.min(params.maxResults, 50);
      do {
        const pageResult = await fn(this, {
          ...params,
          maxResults: ITEMS_PER_PAGE,
          pageToken: nextPageToken,
        });
        nextPageToken = pageResult.nextPageToken;
        data = [
          ...data,
          ...pageResult.items,
        ];

        if (data.length >= TOTAL_MAX_RESULTS) {
          data = data.slice(0, TOTAL_MAX_RESULTS);
          break;
        }
      } while (nextPageToken);
      return data;
    },
    async getTaskLists(ctx = this, params = {}) {
      return axios(ctx, this._getRequestParams({
        path: "/users/@me/lists",
        method: "GET",
        params,
      }));
    },
    async insertTaskList(ctx = this, data) {
      return axios(ctx, this._getRequestParams({
        path: "/users/@me/lists",
        method: "POST",
        data,
      }));
    },
    async updateTaskList(ctx = this, data) {
      return axios(ctx, this._getRequestParams({
        path: `/users/@me/lists/${data.id}`,
        method: "PUT",
        data,
      }));
    },
    async deleteTaskList(ctx = this, id) {
      return axios(ctx, this._getRequestParams({
        path: `/users/@me/lists/${id}`,
        method: "DELETE",
      }));
    },
  },
};
