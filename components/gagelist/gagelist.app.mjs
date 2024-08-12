import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "gagelist",
  propDefinitions: {
    gageId: {
      type: "string",
      label: "Gage ID",
      description: "The ID of the gage",
    },
    gageInformation: {
      type: "object",
      label: "Gage Information",
      description: "The information of the gage to create or update",
    },
  },
  methods: {
    _baseUrl() {
      return "https://gagelist.net/api";
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
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async createCalibration() {
      return this._makeRequest({
        method: "POST",
        path: "/calibrations",
      });
    },
    async createGage(gageInformation) {
      return this._makeRequest({
        method: "POST",
        path: "/gages",
        data: gageInformation,
      });
    },
    async createManufacturer() {
      return this._makeRequest({
        method: "POST",
        path: "/manufacturers",
      });
    },
    async getGage(gageId) {
      return this._makeRequest({
        path: `/gages/${gageId}`,
      });
    },
    async updateGage(gageId, gageInformation) {
      return this._makeRequest({
        method: "PUT",
        path: `/gages/${gageId}`,
        data: gageInformation,
      });
    },
  },
};
