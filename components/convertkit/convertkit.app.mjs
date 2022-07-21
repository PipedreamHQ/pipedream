import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "convertkit",
  propDefinitions: {
    subscriber: {
      type: "string",
      label: "Workspace",
      description: "Select a subscriber",
      async options({ page }) {
        const response = await this.listSubscribers({
          page: page + 1,
        });

        return response.subscribers.map((subscriber) => ({
          label: subscriber.first_name,
          value: subscriber.id,
        }));
      },
    },
  },
  methods: {
    _apiSecretToken() {
      return this.$auth.api_secret;
    },
    async _makeRequest(path, options = {}, $ = this) {
      if (options.method.toLowerCase() === "get") {
        options.params = {
          ...options.params,
          api_secret: this._apiSecretToken(),
        };
      } else {
        options.data = {
          ...options.data,
          api_secret: this._apiSecretToken(),
        };
      }
      return axios($, {
        url: `${constants.API_HOST}${constants.API_VERSION}/${path}`,
        ...options,
      });
    },

    async *paginate({
      $, fn, payload,
    }, dataField = null) {
      do {
        const response = await fn({
          $,
          ...payload,
        });

        for (const d of (dataField
          ? response[dataField]
          : response)) {
          yield d;
        }
        if (response.total_pages > response.page) {
          payload.page++;
          return true;
        }
        break;
      } while (true);
    },
    async listSubscribers({
      $, ...params
    }) {
      const options = {
        method: "get",
        params,
      };
      return await this._makeRequest("subscribers", options, $);
    },
    async getSubscriber(subscriberId, $) {
      const options = {
        method: "get",
      };
      return await this._makeRequest(`subscribers/${subscriberId}`, options, $);
    },
  },
};
