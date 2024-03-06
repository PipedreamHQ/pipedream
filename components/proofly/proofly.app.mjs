import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "proofly",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The unique identifier for the campaign",
      async options() {
        const { data } = await this.listCampaigns();
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    notificationId: {
      type: "string",
      label: "Notification ID",
      description: "The unique identifier for the notification",
      async options({ campaignId }) {
        const { data } = await this.listNotifications({
          campaignId,
        });
        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "X-Api-Key": this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      const config = {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      };

      const response = await axios($, config);

      if (response?.ok !== true) {
        throw new Error(`Response Error: ${JSON.stringify(response)}`);
      }

      return response;
    },
    put(args = {}) {
      return this._makeRequest({
        method: "put",
        ...args,
      });
    },
    listCampaigns(args = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...args,
      });
    },
    listNotifications({
      campaignId, ...args
    }) {
      return this._makeRequest({
        path: `/campaign/${campaignId}`,
        ...args,
      });
    },
    listData({
      notificationId, ...args
    }) {
      return this._makeRequest({
        path: `/data/${notificationId}`,
        ...args,
      });
    },
  },
};
