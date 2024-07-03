import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "deftship",
  propDefinitions: {
    freightOrderId: {
      type: "string",
      label: "Freight Order ID",
      description: "The unique identification of the freight order",
    },
    parcelOrderId: {
      type: "string",
      label: "Parcel Order ID",
      description: "The unique identification of the parcel order",
    },
    freightShipmentId: {
      type: "string",
      label: "Freight Shipment ID",
      description: "The unique identification of the freight shipment",
    },
    vehicleType: {
      type: "string",
      label: "Vehicle Type",
      description: "The type of vehicle for the insurance policy",
    },
    shipmentValue: {
      type: "integer",
      label: "Shipment Value",
      description: "The value of the shipment for the insurance policy",
    },
    parcelSize: {
      type: "string",
      label: "Parcel Size",
      description: "The size of the parcel for the new order",
    },
    destination: {
      type: "string",
      label: "Destination",
      description: "The destination of the parcel for the new order",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.deftship.com";
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
          Authorization: `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async getFreightOrder({
      freightOrderId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/freightOrders/${freightOrderId}`,
      });
    },
    async getParcelOrder({
      parcelOrderId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/parcelOrders/${parcelOrderId}`,
      });
    },
    async getFreightShipment({
      freightShipmentId, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        path: `/freightShipments/${freightShipmentId}`,
      });
    },
    async bookInsurancePolicy({
      vehicleType, shipmentValue, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/insurancePolicies",
        data: {
          vehicleType,
          shipmentValue,
        },
      });
    },
    async createParcelOrder({
      parcelSize, destination, ...opts
    }) {
      return this._makeRequest({
        ...opts,
        method: "POST",
        path: "/parcelOrders",
        data: {
          parcelSize,
          destination,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    emitNewFreightOrder(freightOrderId, additionalData = {}) {
      this.$emit({
        freightOrderId,
        ...additionalData,
      }, {
        summary: `New freight order: ${freightOrderId}`,
        id: freightOrderId,
      });
    },
    emitNewParcelOrder(parcelOrderId, additionalData = {}) {
      this.$emit({
        parcelOrderId,
        ...additionalData,
      }, {
        summary: `New parcel order: ${parcelOrderId}`,
        id: parcelOrderId,
      });
    },
    emitNewFreightShipment(freightShipmentId, additionalData = {}) {
      this.$emit({
        freightShipmentId,
        ...additionalData,
      }, {
        summary: `New freight shipment: ${freightShipmentId}`,
        id: freightShipmentId,
      });
    },
    async triggerNewFreightOrder() {
      return this._makeRequest({
        method: "POST",
        path: "/freight_order",
      });
    },
  },
};
