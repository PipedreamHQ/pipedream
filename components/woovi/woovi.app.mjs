import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "woovi",
  propDefinitions: {
    chargeId: {
      type: "string",
      label: "Charge",
      description: "Identifier of a charge",
      async options() {
        const { charges } = await this.listCharges();
        return charges?.map(({ correlationID }) => correlationID) || [];
      },
    },
    customer: {
      type: "string",
      label: "Customer",
      description: "The customer to charge",
      optional: true,
      withLabel: true,
      async options() {
        const { customers } = await this.listCustomers();
        return customers?.map(({
          taxID, name: label,
        }) => ({
          value: taxID.taxID,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.openpix.com.br/api/v1";
    },
    _headers() {
      return {
        "Authorization": `${this.$auth.app_id}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/webhook",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook({
      hookId, ...args
    }) {
      return this._makeRequest({
        path: `/webhook/${hookId}`,
        method: "DELETE",
        ...args,
      });
    },
    listCharges(args = {}) {
      return this._makeRequest({
        path: "/charge",
        ...args,
      });
    },
    listCustomers(args = {}) {
      return this._makeRequest({
        path: "/customer",
        ...args,
      });
    },
    createCharge(args = {}) {
      return this._makeRequest({
        path: "/charge",
        method: "POST",
        ...args,
      });
    },
    createChargeRefund({
      chargeId, ...args
    }) {
      return this._makeRequest({
        path: `/charge/${chargeId}/refund`,
        method: "POST",
        ...args,
      });
    },
    deleteCharge({
      chargeId, ...args
    }) {
      return this._makeRequest({
        path: `/charge/${chargeId}`,
        method: "DELETE",
        ...args,
      });
    },
  },
};
