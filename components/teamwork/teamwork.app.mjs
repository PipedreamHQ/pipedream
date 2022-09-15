import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "teamwork",
  propDefinitions: {
    tasklistId: {
      type: "string",
      label: "Tasklist Id",
      description: "Id of the tasklist to list tasks from",
      async options({ page }) {
        const tasklists = await this.listTasklists(page + 1);
        return tasklists.map((item) => ({
          label: item.name,
          value: item.id,
        }));
      },
    },
    peopleId: {
      type: "string",
      label: "People Id",
      description: "Id of the people to list tasks from",
      async options({ page }) {
        const people = await this.listPeople(page + 1);
        return people.map((item) => ({
          label: `${item["first-name"]} ${item["last-name"]}`,
          value: item.id,
        }));
      },
    },
  },
  methods: {
    _getBaseUrl() {
      return this.$auth.domain;
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      console.log(res);
      return res;
    },
    async listTasklists(page, ctx = this) {
      const res = await axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "tasklists.json",
        params: {
          page,
        },
      }));
      return res?.tasklists || [];
    },
    async listPeople(page, ctx = this) {
      const res = await axios(ctx, this._getAxiosParams({
        method: "GET",
        path: "people.json",
        params: {
          page,
        },
      }));
      return res?.people || [];
    },
    async createTask(taskListId, data, ctx = this) {
      return axios(ctx, this._getAxiosParams({
        method: "POST",
        path: `tasklists/${taskListId}/tasks.json`,
        data: {
          "todo-item": data,
        },
      }));
    },
  },
};
