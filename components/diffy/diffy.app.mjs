import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "diffy",
  propDefinitions: {
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier of a project",
      async options() {
        const { projects } = await this.listProjects();
        return projects?.map(({
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
      return "https://app.diffy.website/api";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects",
        ...args,
      });
    },
    listScreenshots({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/screenshots`,
        ...args,
      });
    },
    listDiffs({
      projectId, ...args
    }) {
      return this._makeRequest({
        path: `/projects/${projectId}/diffs`,
        ...args,
      });
    },
    async *paginate({
      resourceFn, args = {}, resourceType,
    }) {
      args = {
        ...args,
        params: {
          ...args.params,
          page: 0,
        },
      };
      let done;
      do {
        const response = await resourceFn(args);
        const items = response[resourceType];
        for (const item of items) {
          yield item;
        }
        const totalPages = response.totalPages;
        done = args.params.page === totalPages;
        args.params.page++;
      } while (!done);
    },
  },
};
