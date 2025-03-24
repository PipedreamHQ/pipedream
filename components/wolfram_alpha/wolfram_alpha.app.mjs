import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "wolfram_alpha",
  methods: {
    getUrl(path) {
      return `${constants.BASE_URL}${constants.VERSION_PATH}${path}`;
    },
    getAuthParams(params) {
      return {
        ...params,
        appid: this.$auth.app_id,
      };
    },
    makeRequest({
      $ = this, path, params, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        params: this.getAuthParams(params),
      });
    },
  },
};
