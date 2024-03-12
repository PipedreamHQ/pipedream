import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "sendcloud",
  propDefinitions: {
    parcelId: {
      type: "string",
      label: "Parcel ID",
      description: "The unique identifier of the parcel",
    },
    parcelData: {
      type: "object",
      label: "Parcel Data",
      description: "The data for creating or updating a parcel",
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.sendcloud.dev";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path,
        data,
        params,
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.api_key}`,
        },
        data,
        params,
      });
    },
    async createParcel(parcelData) {
      return this._makeRequest({
        method: "POST",
        path: "/parcels",
        data: parcelData,
      });
    },
    async updateParcel(parcelId, parcelData) {
      return this._makeRequest({
        method: "PUT",
        path: `/parcels/${parcelId}`,
        data: parcelData,
      });
    },
    async listParcels() {
      return this.paginate(this._makeRequest, {
        path: "/parcels",
      });
    },
    async paginate(fn, opts = {}) {
      const results = [];
      let response;
      do {
        response = await fn({
          ...opts,
          params: {
            ...opts.params,
            page: opts.params?.page || 1,
          },
        });
        results.push(...response.parcels);
        opts.params.page = response.next
          ? response.next
          : null;
      } while (opts.params.page);
      return results;
    },
  },
  version: "0.0.{{ts}}",
};
