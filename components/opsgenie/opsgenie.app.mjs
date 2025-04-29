import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "opsgenie",
  propDefinitions: {
    alertId: {
      type: "string",
      label: "Alert ID",
      description: "ID of the alert",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const { data } = await this.listAlerts({
          params: {
            limit,
            offset: page * limit,
          },
        });
        return data?.map(({
          id: value, message: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    user: {
      type: "string",
      label: "User ID",
      description: "ID of the User",
      async options() {
        const response = await this.listUsers();
        const usersIds = response.data;
        return usersIds.map(({
          id, fullName,
        }) => ({
          value: id,
          label: fullName,
        }));
      },
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message of the alert",
    },
    note: {
      type: "string",
      label: "Note",
      description: "Note of the alert",
    },
    description: {
      type: "string",
      label: "Description",
      description: "Description of the alert",
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags of the alert",
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "Priority of the alert",
      options: constants.PRIORITY_OPTIONS,
    },
    requestId: {
      type: "string",
      label: "Request ID",
      description: "ID of the alert request to be checked",
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.instance_region}.opsgenie.com/v2`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        headers,
        APIKey,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          Authorization: `GenieKey ${APIKey}`,
        },
      });
    },
    listAlerts(opts = {}) {
      return this._makeRequest({
        path: "/alerts",
        APIKey: this.$auth.team_api_key,
        ...opts,
      });
    },
    createAlert(args = {}) {
      return this._makeRequest({
        method: "post",
        path: "/alerts",
        APIKey: this.$auth.team_api_key,
        ...args,
      });
    },
    getAlertStatus({
      requestId, ...args
    }) {
      return this._makeRequest({
        path: `/alerts/requests/${requestId}`,
        APIKey: this.$auth.team_api_key,
        ...args,
      });
    },
    listUsers(args = {}) {
      return this._makeRequest({
        path: "/users",
        APIKey: this.$auth.api_key,
        ...args,
      });
    },
    addNoteToAlert({
      alertId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/alerts/${alertId}/notes`,
        APIKey: this.$auth.team_api_key,
        ...args,
      });
    },
    deleteAlert({
      alertId, ...args
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/alerts/${alertId}`,
        APIKey: this.$auth.team_api_key,
        ...args,
      });
    },
  },
};
