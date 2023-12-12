import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "people_data_labs",
  propDefinitions: {
    pretty: {
      label: "Pretty",
      type: "boolean",
      description: "Whether the output should have human-readable indentation.",
      optional: true,
    },
    minLikelihood: {
      label: "Min Likelihood",
      type: "integer",
      description: "The minimum likelihood score a response must have to return a 200.",
      optional: true,
    },
  },
  methods: {
    _getApiKey() {
      return this.$auth.api_key;
    },
    _getBaseUrl() {
      return "https://api.peopledatalabs.com/v5";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "X-API-Key": this._getApiKey(),
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      delete res.path;
      return res;
    },
    async _makeRequest(opts = {}) {
      try {
        const axiosParams = this._getAxiosParams(opts);
        return await axios(this, axiosParams);
      } catch (err) {
        if (err?.response?.data?.error) {
          if (err.response.data.error.status == 404) {
            return null;
          }
          throw new Error(err.response.data.error.message);
        }
        throw err;
      }

    },
    async enrichPerson(params) {
      return this._makeRequest({
        path: "/person/enrich",
        params,
      });
    },
    async enrichCompany(params) {
      return this._makeRequest({
        path: "/company/enrich",
        params,
      });
    },
  },
};
