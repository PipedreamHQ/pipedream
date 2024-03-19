import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "php_point_of_sale",
  propDefinitions: {
    registerId: {
      type: "string",
      label: "Register ID",
      description: "The ID of the register to delete or update",
    },
    registerData: {
      type: "object",
      label: "Register Data",
      description: "The data for the new register",
    },
    searchParams: {
      type: "object",
      label: "Search Parameters",
      description: "The search parameters to list registers",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://phppointofsale.com/api.php";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
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
      });
    },
    async addRegister({ registerData }) {
      return this._makeRequest({
        method: "POST",
        path: "/registers",
        data: registerData,
      });
    },
    async searchRegisters({ searchParams }) {
      return this._makeRequest({
        method: "GET",
        path: "/registers",
        params: searchParams,
      });
    },
    async deleteRegister({ registerId }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/registers/${registerId}`,
      });
    },
    async paginate(fn, ...opts) {
      let results = [];
      let moreData = true;
      let page = 1;

      while (moreData) {
        const response = await fn({
          params: {
            page,
            ...opts,
          },
        });
        results = results.concat(response);
        moreData = response.length > 0;
        page++;
      }

      return results;
    },
  },
  version: "0.0.{{ts}}",
};
