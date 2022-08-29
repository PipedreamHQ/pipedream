import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "agile_crm",
  propDefinitions: {
    filter: {
      type: "string",
      label: "Filter",
      description: "Type of ticket filter",
      async options() {
        const filters = await this.listFilters();
        if (!filters || filters?.length === 0) {
          return [];
        }
        return filters.map((filter) => ({
          label: filter.name,
          value: filter.id,
        }));
      },
    },
    maxRequests: {
      type: "integer",
      min: 1,
      max: 100,
      label: "Max API Requests per Execution",
      description: "The maximum number of API requests to make per execution (e.g., multiple requests are required to retrieve paginated results).",
      optional: true,
      default: 1,
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://${this.$auth.domain}.agilecrm.com/dev/api/`;
    },
    _getAuth() {
      return {
        username: this.$auth.username,
        password: this.$auth.api_key,
      };
    },
    async _makeRequest(args = {}) {
      const {
        method = "GET",
        path,
        $ = this,
        ...otherArgs
      } = args;
      const config = {
        method,
        url: `${this._getBaseUrl()}${path}`,
        auth: this._getAuth(),
        ...otherArgs,
      };
      return axios($, config);
    },
    async listContacts(args = {}) {
      return this._makeRequest({
        path: "contacts",
        ...args,
      });
    },
    async listTasks(args = {}) {
      return this._makeRequest({
        path: "tasks",
        ...args,
      });
    },
    async listTickets(args = {}) {
      return this._makeRequest({
        path: "tickets/filter",
        ...args,
      });
    },
    async listFilters(args = {}) {
      return this._makeRequest({
        path: "tickets/filters",
        ...args,
      });
    },
  },
};
