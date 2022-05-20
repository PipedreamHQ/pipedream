import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
export default {
  type: "app",
  app: "bigcommerce",
  propDefinitions: {
    channel: {
      type: "boolean",
      label: "Using channel",
      description: "Channel of the webhook",
    },
    maxRequests: {
      type: "integer",
      min: 1,
      max: 180,
      label: "Max API Requests per Execution (advanced)",
      description:
        "The maximum number of API requests to make per execution (e.g., multiple requests are required to retrieve paginated results).",
      optional: true,
      default: 1,
    },
  },
  methods: {
    _getHeaders() {
      return {
        "X-Auth-Token": `${this.$auth.access_token}`,
      };
    },
    async _makeRequest({
      $, url, path, ...otherConfig
    }) {
      const baseUrl = `${constants.BASE_URL}/${this.$auth.store_hash}`;

      const config = {
        url: url || `${baseUrl}${constants.VERSION_PATH}${path}`,
        headers: this._getHeaders(),
        ...otherConfig,
      };

      return axios($ || this, config);
    },
    async deleteHook(hookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/hooks/${hookId}`,
      });
    },
    async createHook(
      webhookUrl,
      type,
      scope = "created",
      channel = null,
      channelId = null,
    ) {
      const channelScope = `${channel
        ? `channel/${channelId}/`
        : ""}`;

      const { data } = await this._makeRequest({
        method: "POST",
        path: "/hooks",
        data: {
          scope: `store/${channelScope}${type}/${scope}`,
          destination: webhookUrl,
          is_active: true,
        },
      });

      return data.id;
    },
  },
};
