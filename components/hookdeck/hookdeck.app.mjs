import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hookdeck",
  propDefinitions: {
    sourceId: {
      type: "string",
      label: "Source ID",
      description: "The source ID of the connection.",
      optional: true,
      async options({ prevContext }) {
        const { nextCursor } = prevContext;
        const {
          models,
          pagination,
        } = await this.listSources(nextCursor);
        const options = models.map((source) => {
          return {
            label: source.name,
            value: source.id,
          };
        });

        return {
          options,
          context: {
            nextCursor: pagination.next,
          },
        };
      },
    },
    destinationId: {
      type: "string",
      label: "Destination ID",
      description: "The destination ID of the connection.",
      optional: true,
      async options({ prevContext }) {
        const { nextCursor } = prevContext;
        const {
          models,
          pagination,
        } = await this.listDestinations(nextCursor);
        const options = models.map((destination) => {
          return {
            label: destination.name,
            value: destination.id,
          };
        });

        return {
          options,
          context: {
            nextCursor: pagination.next,
          },
        };
      },
    },
  },
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return "https://api.hookdeck.com/2023-07-01";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this._getApiKey()}`,
      };
    },
    async _makeHttpRequest(opts = {}, ctx = this) {
      const axiosOpts = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      return axios(ctx, axiosOpts);
    },
    async createConnection(data) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/connections",
        data,
      });
    },
    async listSources(nextCursor) {
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: "/sources",
        params: {
          next: nextCursor,
          limit: LIMIT,
        },
      });
    },
    async listDestinations(nextCursor) {
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: "/destinations",
        params: {
          next: nextCursor,
          limit: LIMIT,
        },
      });
    },
    async listRequests(params) {
      const LIMIT = 1;
      return this._makeHttpRequest({
        method: "GET",
        path: "/requests",
        params: {
          ...params,
          limit: LIMIT,
        },
      });
    },
  },
};
