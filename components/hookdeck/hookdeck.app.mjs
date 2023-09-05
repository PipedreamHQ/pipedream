import { axios } from "@pipedream/platform";
import options from "./common/options.mjs";

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
        const options = models.map((model) => {
          return {
            label: model.name,
            value: model.id,
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
        const options = models.map((model) => {
          return {
            label: model.name,
            value: model.id,
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
    requestId: {
      type: "string",
      label: "Request ID",
      description: "Filter by requests IDs.",
      optional: true,
      async options({ prevContext }) {
        const { nextCursor } = prevContext;
        const {
          models,
          pagination,
        } = await this.listRequests({
          next: nextCursor,
        });
        const options = models.map((model) => {
          return {
            label: model.id,
            value: model.id,
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
    eventId: {
      type: "string",
      label: "Event",
      description: "Filter by requests IDs.",
      optional: true,
      async options({ prevContext }) {
        const { nextCursor } = prevContext;
        const {
          models,
          pagination,
        } = await this.listEvents({
          next: nextCursor,
        });
        const options = models.map((model) => {
          return {
            label: `${model.id} - ${model.status}`,
            value: model.id,
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
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Sort key.",
      optional: true,
      options: options.retreiveAllRequests.ORDER_BY,
    },
    orderByDir: {
      type: "string",
      label: "Order By Direction",
      description: "Sort direction.",
      optional: true,
      options: options.ORDER_BY_DIRECTION,
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Limit the number of results. Pipedream will automatically paginate through the results.",
      optional: true,
    },
    status: {
      type: "string[]",
      label: "Status",
      description: "Filter by status.",
      optional: true,
      options: options.retreiveRequestEvents.STATUS,
    },
    attempts: {
      type: "integer",
      label: "Attempts",
      description: "Filter by number of attempts.",
      optional: true,
    },
    additionalProperties: {
      type: "object",
      label: "Additional Properties",
      description: "Filter by additional properties. Check the [documentation](https://hookdeck.com/api-ref#retrieve-all-events).",
      optional: true,
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
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: "/requests",
        params: {
          ...params,
          limit: LIMIT,
        },
      });
    },
    async listEvents(params) {
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: "/events",
        params: {
          ...params,
          limit: LIMIT,
        },
      });
    },
    async listRequestEvents(id, params) {
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: `/requests/${id}/events`,
        params: {
          ...params,
          limit: LIMIT,
        },
      });
    },
  },
};
