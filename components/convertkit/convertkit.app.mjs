import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "convertkit",
  propDefinitions: {},
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
        if ( response.total_pages > response.page) {
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
  },
};
