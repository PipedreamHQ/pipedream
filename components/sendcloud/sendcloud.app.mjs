import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "sendcloud",
  propDefinitions: {
    parcelId: {
      type: "string",
      label: "Parcel ID",
      description: "The unique identifier of the parcel",
      async options({ prevContext }) {
        const params = {};

        if (prevContext?.cursor) params.cursor = prevContext.cursor;

        const {
          parcels: resources, next,
        } = await this.listParcels({
          params,
        });

        return {
          context: {
            cursor: next,
          },
          options: resources.map(({
            id, name,
          }) => ({
            value: id,
            label: name,
          })),
        };
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name of the recipient",
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the recipient",
    },
    city: {
      type: "string",
      label: "City",
      description: "City of the recipient",
    },
    houseNumber: {
      type: "string",
      label: "House Number",
      description: "House number of the recipient",
    },
    postalCode: {
      type: "string",
      label: "Postal Code",
      description: "Zip code of the recipient",
    },
    country: {
      type: "string",
      label: "country",
      description: "Country of the recipient",
      options: constants.COUNTRIES,
    },
  },
  methods: {
    _baseUrl() {
      return "https://panel.sendcloud.sc/api/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        auth,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        auth: {
          ...auth,
          username: `${this.$auth.public_key}`,
          password: `${this.$auth.secret_key}`,
        },
      });
    },
    async createParcel(args = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/parcels",
        ...args,
      });
    },
    async updateParcel({
      id, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/parcels/${id}`,
        ...args,
      });
    },
    async listParcels(args = {}) {
      return this._makeRequest({
        path: "/parcels",
        ...args,
      });
    },
  },
};
