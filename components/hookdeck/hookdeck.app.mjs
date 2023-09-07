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
      options: options.retrieveAllRequests.ORDER_BY,
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
      options: options.retrieveRequestEvents.STATUS,
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
    createdAtInitalRange: {
      type: "string",
      label: "Created At Initial Range",
      description: "Filter by created at initial range. `YYYY-MM-DD` format.",
      optional: true,
    },
    createdAtFinalRange: {
      type: "string",
      label: "Created At Final Range",
      description: "Filter by created at final range. `YYYY-MM-DD` format.",
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
    async createConnection(data, ctx = this) {
      return this._makeHttpRequest({
        method: "POST",
        path: "/connections",
        data,
      }, ctx);
    },
    async listSources(nextCursor, ctx = this) {
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: "/sources",
        params: {
          next: nextCursor,
          limit: LIMIT,
        },
      }, ctx);
    },
    async listDestinations(nextCursor, ctx = this) {
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: "/destinations",
        params: {
          next: nextCursor,
          limit: LIMIT,
        },
      }, ctx);
    },
    async listRequests(params, ctx = this) {
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: "/requests",
        params: {
          ...params,
          limit: LIMIT,
        },
      }, ctx);
    },
    async listEvents(params, ctx = this) {
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: "/events",
        params: {
          ...params,
          limit: LIMIT,
        },
      }, ctx);
    },
    async listRequestEvents(id, params, ctx = this) {
      const LIMIT = 100;
      return this._makeHttpRequest({
        method: "GET",
        path: `/requests/${id}/events`,
        params: {
          ...params,
          limit: LIMIT,
        },
      }, ctx);
    },
  },
};
