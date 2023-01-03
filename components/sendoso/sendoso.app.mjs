import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "discord_bot",
  propDefinitions: {
    groupId: {
      type: "integer",
      label: "Group",
      description: "The ID of the Group.",
      async options() {
        const data = await this.listGroups();

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    recipientUsers: {
      type: "string[]",
      label: "Recipient Users",
      description: "The array of gift recipient users. If not provided, links can be redeemed by anyone.",
      async options({ groupId }) {
        const data = await this.listUsers(groupId);

        return data.map(({ email }) => email);
      },
    },
    template: {
      type: "integer",
      label: "Template",
      description: "The ID of the Template.",
      async options() {
        const data = await this.listTemplates();
        let result;
        if (typeof data === "string") {
          result = data.replace(/(},)(?!.*\1)/gs, "}");
          result = JSON.parse(result);
        } else {
          result = data;
        }

        return result.custom_template.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    touchId: {
      type: "integer",
      label: "Touch ID",
      description: "The ID of the Touch.",
      async options({ groupId }) {
        const data = await this.listTouches(groupId);

        return data.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    trackingId: {
      type: "string",
      label: "Tracking Id",
      description: "The tracking code for the send.",
      async options() {
        const data = await this.listSendGifts();

        return data.map(({
          tracking_code: value, touch_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    via: {
      type: "string",
      label: "Via",
      description: "Specify you want to generate gift links.",
    },
    viaFrom: {
      type: "string",
      label: "Via From",
      description: "Specify the name of your Company or Application.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://app.sendoso.com/api/v3";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };
      return axios($, config);
    },
    sendGift({
      $, ...data
    }) {
      return this._makeRequest({
        $,
        path: "send.json",
        method: "POST",
        data,
      });
    },
    getSentGifts() {
      return this._makeRequest({
        path: "sent_gifts.json",
      });
    },
    getSendStatus({
      $, trackingId,
    }) {
      return this._makeRequest({
        $,
        path: `gifts/status/${trackingId}`,
      });
    },
    listGroups() {
      return this._makeRequest({
        path: "groups.json",
      });
    },
    listSendGifts() {
      return this._makeRequest({
        path: "sent_gifts.json",
      });
    },
    listTemplates() {
      return this._makeRequest({
        path: "user_custom_templates.json",
      });
    },
    listTouches(groupId) {
      return this._makeRequest({
        path: `groups/${groupId}/group_touches.json`,
      });
    },
    listUsers(groupId) {
      return this._makeRequest({
        path: `groups/${groupId}/members.json`,
      });
    },
  },
};
