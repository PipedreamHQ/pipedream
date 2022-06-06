import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "people_data_labs",
  propDefinitions: {},
  methods: {
    _getBaseUrl() {
      return "https://api.peopledatalabs.com/v5";
    },
    _getHeaders() {
      return {
        "Content-Type": "application/json",
        "X-API-Key": this.$auth.api_key,
      };
    },
    _getAxiosParams(opts = {}) {
      const res = {
        ...opts,
        url: this._getBaseUrl() + opts.path,
        headers: this._getHeaders(),
      };
      delete res.path;
      console.log(res);
      return res;
    },
    async _makeRequest(opts = {}) {
      try {
        const axiosParams = this._getAxiosParams(opts);
        return await axios(this, axiosParams);
      } catch (err) {
        if (err)
        if (err?.response?.data?.error) {
          if (err.response.data.error.status == 404) {
            return null;
          }
          throw new Error(err.response.data.error.message)
        }
        throw err;
      }
      
    },
    async enrichPerson(params) {
      return this._makeRequest({
        method: "get",
        path: "/person/enrich",
        params
      })
    }
  },
};
