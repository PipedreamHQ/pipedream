import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 100;

export default {
  type: "app",
  app: "wachete",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder ID",
      description: "Identifier of a folder. If not specified data from root folder are returned.",
      optional: true,
      async options({ prevContext }) {
        const params = prevContext?.continuationToken
          ? {
            continuationToken: prevContext.continuationToken,
          }
          : {};
        const {
          subfolders, continuationToken,
        } = await this.listFolders({
          params,
        });
        const options = subfolders?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            continuationToken,
          },
        };
      },
    },
    wachetId: {
      type: "string",
      label: "Wachet ID",
      description: "Identifier of a Wachet",
      async options({
        parentId, prevContext,
      }) {
        const params = {};
        if (parentId) {
          params.parentId = parentId;
        }
        if (prevContext?.continuationToken) {
          params.continuationToken = prevContext.continuationToken;
        }
        const {
          tasks, continuationToken,
        } = await this.listFolders({
          params,
        });
        const options = tasks?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
        return {
          options,
          context: {
            continuationToken,
          },
        };
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.wachete.com/thirdparty/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-type": "application/json",
        "accept": "*/*",
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    listFolders(opts = {}) {
      return this._makeRequest({
        path: "/folder/list",
        ...opts,
      });
    },
    getMonitor({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/task/${id}`,
        ...opts,
      });
    },
    getMonitorData({
      id, ...opts
    }) {
      return this._makeRequest({
        path: `/data/list/${id}`,
        ...opts,
      });
    },
    createOrUpdateMonitor(opts = {}) {
      return this._makeRequest({
        method: "PUT",
        path: "/task",
        ...opts,
      });
    },
    deleteMonitor({
      id, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/task/${id}`,
        ...opts,
      });
    },
    async *paginate({
      resourceFn, args, max,
    }) {
      args = {
        ...args,
        params: {
          count: DEFAULT_LIMIT,
          ...args.params,
        },
      };
      let count = 0;
      do {
        const {
          data, continuationToken,
        } = await resourceFn(args);
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
          args.params.continuationToken = continuationToken;
        }
      } while (args.params.continuationToken);
    },
  },
};
