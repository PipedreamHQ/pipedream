import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "vryno",
  methods: {
    _baseUrl() {
      return  `https://${this.$auth.company_instance_name}.ms.vryno.com`;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: this._headers(),
      });
    },
    post(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/api/graphql/crm",
        ...opts,
      });
    },
  },
};
