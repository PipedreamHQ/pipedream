import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "wakatime",
  propDefinitions: {
    project: {
      type: "string",
      label: "Project",
      description: "The name of a project",
      async options({ page }) {
        const { data } = await this.listProjects({
          params: {
            page,
          },
        });
        return data?.map(({ name }) => name) || [];
      },
    },
    language: {
      type: "string",
      label: "Language",
      description: "The name of a programming language",
      optional: true,
      async options({ page }) {
        const { data } = await this.listProgrammingLanguages({
          params: {
            page,
          },
        });
        return data?.map(({ name }) => name) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://wakatime.com/api/v1";
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        url: `${this._baseUrl()}/${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...otherOpts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/users/current/projects",
        ...opts,
      });
    },
    listHeartbeats(opts = {}) {
      return this._makeRequest({
        path: "/users/current/heartbeats",
        ...opts,
      });
    },
    listProgrammingLanguages(opts = {}) {
      return this._makeRequest({
        path: "/program_languages",
        ...opts,
      });
    },
    listCommits({
      project, ...opts
    }) {
      return this._makeRequest({
        path: `/users/current/projects/${project}/commits`,
        ...opts,
      });
    },
    listGoals(opts = {}) {
      return this._makeRequest({
        path: "/users/current/goals",
        ...opts,
      });
    },
    createHeartbeat(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/users/current/heartbeats",
        ...opts,
      });
    },
    async *paginate({
      fn, args, resourceKey, max,
    }) {
      args = {
        ...args,
        params: {
          ...args?.params,
          page: 1,
        },
      };
      let hasMore = false;
      let count = 0;
      do {
        const response = await fn(args);
        const items = resourceKey
          ? response[resourceKey]
          : response.data;
        if (!items?.length) {
          return;
        }
        for (const item of items) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = args?.params?.page < response.total_pages;
        args.params.page++;
      } while (hasMore);
    },
  },
};
