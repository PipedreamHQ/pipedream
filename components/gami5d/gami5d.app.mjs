import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gami5d",
  propDefinitions: {
    observationDetails: {
      type: "string",
      label: "Observation Details",
      description: "Enter the details of your observation for evaluation",
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.gami5d.com/web/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "POST",
        path,
        data,
        headers,
        ...otherOpts
      } = opts;

      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        data,
      });
    },
    async recordObservation(observationDetails) {
      return this._makeRequest({
        path: "/observations",
        data: {
          details: observationDetails,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
