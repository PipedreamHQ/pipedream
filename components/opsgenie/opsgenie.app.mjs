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
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.instance_region}.opsgenie.com/v2`;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `GenieKey ${this.$auth.api_key}`,
        },
      });
    },
    listAlerts(opts = {}) {
      return this._makeRequest({
        path: "/alerts",
        ...opts,
      });
    },
    createAlert(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/alerts",
        ...opts,
      });
    },
    addNoteToAlert({
      alertId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/alerts/${alertId}/notes`,
        ...opts,
      });
    },
    deleteAlert({
      alertId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/alerts/${alertId}`,
        ...opts,
      });
    },
  },
};
