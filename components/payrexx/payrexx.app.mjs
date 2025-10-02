import {
  axios, ConfigurationError,
} from "@pipedream/platform";
import crypto from "crypto";

export default {
  type: "app",
  app: "payrexx",
  propDefinitions: {
    invoiceId: {
      type: "string",
      label: "Invoice ID",
      description: "The ID of the invoice",
      async options() {
        const { data } = await this.listInvoices();
        return data?.map(({
          id, number,
        }) => ({
          label: `Invoice #${number}`,
          value: id,
        })) || [];
      },
    },
    gatewayId: {
      type: "string",
      label: "Gateway ID",
      description: "The ID of the gateway",
    },
    paylinkId: {
      type: "string",
      label: "Paylink ID",
      description: "The ID of the paylink",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount of payment in cents",
    },
    purpose: {
      type: "string",
      label: "Purpose",
      description: "The purpose of the payment",
    },
    currency: {
      type: "string",
      label: "Currency",
      description: "Currency of payment (ISO code)",
    },
    vatRate: {
      type: "string",
      label: "VAT Rate",
      description: "VAT Rate Percentage",
      optional: true,
    },
    sku: {
      type: "string",
      label: "SKU",
      description: "Product stock keeping unit",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.payrexx.com/v1.11";
    },
    _authParams() {
      const apiSignature = crypto
        .createHmac("sha256", this.$auth.api_key)
        .update("")
        .digest("base64");

      return {
        instance: this.$auth.instance_name,
        ApiSignature: apiSignature,
      };
    },
    async _makeRequest({
      $ = this, path, params, ...opts
    }) {
      const response = await axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: {
          "X-API-KEY": this.$auth.api_key,
        },
        params: {
          ...params,
          ...this._authParams(),
        },
        ...opts,
      });
      if (response?.status === "error") {
        throw new ConfigurationError(response.message);
      }
      return response;
    },
    listInvoices(opts = {}) {
      return this._makeRequest({
        path: "/Bill/",
        ...opts,
      });
    },
    createGateway(opts = {}) {
      return this._makeRequest({
        path: "/Gateway/",
        method: "POST",
        ...opts,
      });
    },
    createPaylink(opts = {}) {
      return this._makeRequest({
        path: "/Invoice/",
        method: "POST",
        ...opts,
      });
    },
    createManualPayout(opts = {}) {
      return this._makeRequest({
        path: "/Payout/",
        method: "POST",
        ...opts,
      });
    },
    deleteGateway({
      gatewayId, ...opts
    }) {
      return this._makeRequest({
        path: `/Gateway/${gatewayId}/`,
        method: "DELETE",
        ...opts,
      });
    },
    deleteInvoice({
      invoiceId, ...opts
    }) {
      return this._makeRequest({
        path: `/Bill/${invoiceId}/`,
        method: "DELETE",
        ...opts,
      });
    },
    removePaylink({
      paylinkId, ...opts
    }) {
      return this._makeRequest({
        path: `/Invoice/${paylinkId}`,
        method: "DELETE",
        ...opts,
      });
    },
  },
};
