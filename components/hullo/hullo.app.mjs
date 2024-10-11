import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "hullo",
  propDefinitions: {
    attributes: {
      type: "string[]",
      label: "Attributes",
      description: "The attributes that describe the member",
      optional: true,
      async options() {
        const attributes = await this.listAttributes();
        return attributes?.map(({ name }) => name ) || [];
      },
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the member",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.hullo.me/api/endpoints";
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
          "X-API-KEY": `${this.$auth.api_key}`,
        },
      });
    },
    listAttributes(opts = {}) {
      return this._makeRequest({
        path: "/attributes",
        ...opts,
      });
    },
    sendMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    addOrUpdateMember(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/members",
        ...opts,
      });
    },
  },
};
