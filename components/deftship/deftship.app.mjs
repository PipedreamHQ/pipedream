import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "deftship",
  propDefinitions: {
    serviceCode: {
      type: "string",
      label: "Service Code",
      description: "Service code of this order",
      async options({ carrier }) {
        const { data } = await this.getServiceNames();
        const relevant = data.filter((item) => item.carrier === carrier);
        return relevant.map(({
          code: value, service: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    fromName: {
      type: "string",
      label: "From Address: Name",
      description: "The name in the sender address",
    },
    fromAttention: {
      type: "string",
      label: "From Address: Attention",
      description: "Attention of the sender",
    },
    fromStreet: {
      type: "string",
      label: "From Address: Street",
      description: "The street address of the sender",
    },
    fromCity: {
      type: "string",
      label: "From Address: City",
      description: "The city address of the sender",
    },
    fromState: {
      type: "string",
      label: "From Address: State",
      description: "The state code of the sender",
      options: constants.STATE_CODES,
    },
    fromZip: {
      type: "string",
      label: "From Address: Zip Code",
      description: "The zip code of the sender",
    },
    fromCountry: {
      type: "string",
      label: "From Address: Country",
      description: "The country code of the sender",
      options: constants.COUNTRY_CODES,
    },
    fromTelephone: {
      type: "string",
      label: "From Address: Telephone",
      description: "The telephone number of the sender",
    },
    toName: {
      type: "string",
      label: "To Address: Name",
      description: "The name in the receiver address",
    },
    toAttention: {
      type: "string",
      label: "To Address: Attention",
      description: "Attention of the receiver",
    },
    toStreet: {
      type: "string",
      label: "To Address: Street",
      description: "The street address of the receiver",
    },
    toCity: {
      type: "string",
      label: "To Address: City",
      description: "The city address of the receiver",
    },
    toState: {
      type: "string",
      label: "To Address: State",
      description: "The state code of the receiver",
      options: constants.STATE_CODES,
    },
    toZip: {
      type: "string",
      label: "To Address: Zip Code",
      description: "The zip code of the receiver",
    },
    toCountry: {
      type: "string",
      label: "To Address: Country",
      description: "The country code of the receiver",
      options: constants.COUNTRY_CODES,
    },
    toTelephone: {
      type: "string",
      label: "To Address: Telephone",
      description: "The telephone number of the receiver",
    },
    itemCount: {
      type: "integer",
      label: "Count",
      description: "Pieces count",
    },
    additionalFields: {
      type: "object",
      label: "Additional Fields",
      description: "An object of key/value pairs containing additional fields to add to the order",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return this.$auth.environment;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    getInsuranceRates(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/insurances/get-rates",
        ...opts,
      });
    },
    getServiceNames(opts = {}) {
      return this._makeRequest({
        path: "/shipment/service-names",
        ...opts,
      });
    },
    createFreightOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/freight-orders",
        ...opts,
      });
    },
    createParcelOrder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/parcel-orders",
        ...opts,
      });
    },
  },
};
