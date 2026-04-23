import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "lambdatest",
  propDefinitions: {
    priorityLevel: {
      type: "string",
      label: "Priority Level",
      description: "The priority level of the issue",
      options: [
        "Low",
        "Medium",
        "High",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "The status of the issue",
      options: [
        "New",
        "In Progress",
        "Resolved",
        "Closed",
      ],
    },
    assignee: {
      type: "string",
      label: "Assignee",
      description: "The assignee of the issue",
      async options() {
        const users = await this.getUsers();
        return users.map((user) => ({
          label: user.name,
          value: user.id,
        }));
      },
    },
    filters: {
      type: "string",
      label: "Filters",
      description: "Optional filters for the issue",
      optional: true,
    },
    labels: {
      type: "string",
      label: "Labels",
      description: "Optional labels for the issue",
      optional: true,
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.lambdatest.com";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async getUsers(opts = {}) {
      return this._makeRequest({
        path: "/users",
        ...opts,
      });
    },
    async emitBuildOrTestEvent(opts = {}) {
      return this._makeRequest({
        path: "/builds-or-tests",
        ...opts,
      });
    },
    async emitNewIssueEvent({
      priorityLevel, status, assignee, filters, labels,
    }) {
      return this._makeRequest({
        path: "/issues",
        method: "POST",
        data: {
          priority_level: priorityLevel,
          status,
          assignee,
          filters,
          labels,
        },
      });
    },
  },
};
