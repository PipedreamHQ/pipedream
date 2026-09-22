import common from "@pipedream/databricks";
import { axios } from "@pipedream/platform";
import constants from "@pipedream/databricks/common/constants.mjs";

export default {
  ...common,
  type: "app",
  app: "databricks_oauth",
  methods: {
    ...common.methods,
    getUrl(path, versionPath = constants.VERSION_PATH.V2_0) {
      return `https://${this.$auth.deployment_name}.${this.$auth.domain}${versionPath}${path}`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, versionPath, ...args
    } = {}) {
      return axios($, {
        url: this.getUrl(path, versionPath),
        headers: this._headers(),
        ...args,
      });
    },
  },
};
