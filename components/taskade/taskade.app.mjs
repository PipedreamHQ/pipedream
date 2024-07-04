import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "taskade",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The identifier of a project",
      async options({ page }) {
        const { items } = await this.listProjects({
          params: {
            page: page + 1,
          },
        });
        return items?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://www.taskade.com/api/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/me/projects",
        ...opts,
      });
    },
    listTasks({
      projectId, ...opts
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/tasks`,
        ...opts,
      });
    },
    createTask({
      projectId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/projects/${projectId}/tasks`,
        ...opts,
      });
    },
    assignTask({
      projectId, taskId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/projects/${projectId}/tasks/${taskId}/assignees`,
        ...opts,
      });
    },
    createOrUpdateDueDate({
      projectId, taskId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/projects/${projectId}/tasks/${taskId}/date`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      resourceType,
      max,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
        },
      };
      let count = 0;
      do {
        const results = await resourceFn(args);
        const items = resourceType
          ? results[resourceType]
          : results;
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          count++;
          if (max && max >= count) {
            return;
          }
        }
        args.params.after = items[items.length - 1].id;
      } while (args.params.after);
    },
  },
};
