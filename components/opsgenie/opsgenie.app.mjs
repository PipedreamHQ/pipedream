import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "opsgenie",
  propDefinitions: {
    message: {
      type: "string",
      label: "Message",
      description: "The content of the alert",
    },
    alias: {
      type: "string",
      label: "Alias",
      description: "User defined identifier for the alert",
    },
    description: {
      type: "string",
      label: "Description",
      description: "More detailed information about the alert",
      optional: true,
    },
    responders: {
      type: "string[]",
      label: "Responders",
      description: "Teams, users, escalations and schedules that the alert will be routed to send notifications",
      optional: true,
    },
    actions: {
      type: "string[]",
      label: "Actions",
      description: "Custom actions that can be executed",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Labels attached to the alert",
      optional: true,
    },
    details: {
      type: "object",
      label: "Details",
      description: "Key-value pairs to provide detailed properties of the alert",
      optional: true,
    },
    entity: {
      type: "string",
      label: "Entity",
      description: "The entity the alert is related to",
      optional: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority level of the alert. Possible values are P1, P2, P3, P4, and P5",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "Additional information that can be added to the alert",
    },
    identifierType: {
      type: "string",
      label: "Identifier Type",
      description: "Type of the identifier to be used to identify the alert",
      default: "id",
      options: [
        "id",
        "tiny",
        "alias",
        "teams",
      ],
    },
    id: {
      type: "string",
      label: "ID",
      description: "ID of the alert",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.opsgenie.com/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `GenieKey ${this.$auth.api_key}`,
        },
      });
    },
    async createAlert(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/alerts",
        ...opts,
      });
    },
    async addNoteToAlert(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/alerts/${opts.id}/notes`,
        ...opts,
      });
    },
    async deleteAlert(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: `/alerts/${opts.id}`,
        ...opts,
      });
    },
  },
};
