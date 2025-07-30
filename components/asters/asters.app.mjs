import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "asters",
  propDefinitions: {
    workspaceId: {
      type: "string",
      label: "Workspace ID",
      description: "The ID of a workspace",
      async options() {
        const { data: { workspaces = [] } } = await this.listWorkspaces();
        return workspaces.map((workspace) => ({
          label: workspace.name,
          value: workspace._id,
        }));
      },
    },
    socialAccountId: {
      type: "string",
      label: "Social Account ID",
      description: "The ID of a social account",
      async options({ workspaceId }) {
        const { data = [] } = await this.listSocialAccounts({
          workspaceId,
        });
        return data.map((account) => ({
          label: account.name,
          value: account.account_id,
        }));
      },
    },
    fromDate: {
      type: "string",
      label: "From Date",
      description: "The date to start the search from (YYYY-MM-DD)",
    },
    toDate: {
      type: "string",
      label: "To Date",
      description: "The date to end the search (YYYY-MM-DD)",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.asters.ai/api/external/v1.0";
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "x-api-key": `${this.$auth.api_key}`,
        },
        ...opts,
      });
    },
    listWorkspaces(opts = {}) {
      return this._makeRequest({
        path: "/workspaces",
        ...opts,
      });
    },
    listSocialAccounts({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/socialAccounts`,
        ...opts,
      });
    },
    listLabels({
      workspaceId, ...opts
    }) {
      return this._makeRequest({
        path: `/workspaces/${workspaceId}/labels`,
        ...opts,
      });
    },
    listPosts(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/data/posts",
        ...opts,
      });
    },
    listPostAnalytics(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/analytics/posts",
        ...opts,
      });
    },
    async *paginate({
      fn, args, max,
    }) {
      args = {
        ...args,
        data: {
          ...args?.data,
          page: 1,
        },
      };
      let hasMore, count = 0;
      do {
        const {
          data, pagination,
        } = await fn(args);
        if (!data?.length) {
          return;
        }
        for (const item of data) {
          yield item;
          if (max && ++count >= max) {
            return;
          }
        }
        hasMore = pagination?.totalPages > args.data.page;
        args.data.page++;
      } while (hasMore);
    },
    async getPaginatedResources(opts) {
      const results = [];
      for await (const item of this.paginate(opts)) {
        results.push(item);
      }
      return results;
    },
  },
};
