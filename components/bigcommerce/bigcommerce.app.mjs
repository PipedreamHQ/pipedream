import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";
export default {
  type: "app",
  app: "bigcommerce",
  propDefinitions: {
    storeHash: {
      type: "string",
      label: "Store Hash",
      description: "Your store hash.",
    },
    channel: {
      type: "boolean",
      label: "Using channel",
      description: "Channel of the webhook",
    },
    channelId: {
      type: "string",
      label: "Channel Id",
      description: "Id of the channel",
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
    async _makeRequest(customConfig) {
      const {
        $,
        url,
        path,
        ...otherConfig
      } = customConfig;

      const baseUrl = constants.BASE_URL.replace(
        "{storeHash}",
        this.$auth.store_hash,
      );

      const config = {
        url: url || `${baseUrl}${constants.VERSION_PATH}${path}`,
        headers: this._getHeaders(),
        ...otherConfig,
      };

      return axios($ || this, config);
    },
    async deleteHook(hookId) {
      return await this._makeRequest({
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
      const { data } = await this._makeRequest({
        method: "POST",
        path: "/hooks",
        data: {
          scope: `store/${
            channel
              ? `channel/${channelId}/`
              : ""
          }${type}/${scope}`,
          destination: webhookUrl,
          is_active: true,
        },
      });

      return data.id;
    },
  },
};
