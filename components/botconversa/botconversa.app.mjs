import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "botconversa",
  propDefinitions: {
    subscriberId: {
      type: "string",
      label: "Subscriber Id",
      description: "The Id of the subscriber.",
      async options({ page }) {
        const { results } = await this.listSubscribers({
          params: {
            page: page + 1,
          },
        });

        return results.map(({
          id: value, full_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    tagId: {
      type: "string",
      label: "Tag Id",
      description: "The Id of the tag.",
      async options() {
        const data = await this.listTags();

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
    _apiUrl() {
      return "https://backend.botconversa.com.br/api/v1/webhook";
    },
    _getHeaders() {
      return {
        "API-KEY": this.$auth.api_key,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    addTag({
      subscriberId, tagId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `subscriber/${subscriberId}/tags/${tagId}/`,
      });
    },
    createSubscriber(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "subscriber/",
        ...args,
      });
    },
    listSubscribers(args = {}) {
      return this._makeRequest({
        path: "subscribers/",
        ...args,
      });
    },
    listTags(args = {}) {
      return this._makeRequest({
        path: "tags/",
        ...args,
      });
    },
    sendMessage({
      subscriberId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `subscriber/${subscriberId}/send_message/`,
        ...args,
      });
    },
  },
};
