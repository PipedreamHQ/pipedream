import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "paystack",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "Email address of the customer to charge",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "Amount to charge",
    },
    currency: {
      type: "string",
      label: "Currency",
      description:
        "Currency to use for the charge. Defaults to your integration currency",
    },
    reference: {
      type: "string",
      label: "Reference",
      description:
        "Unique transaction reference. Only alphanumeric characters and `-`, `.`, `=` are allowed",
    },
    callback_url: {
      type: "string",
      label: "Callback URL",
      description:
        "URL to redirect customers to after a successful transaction. Setting this overrides the callback URL set on the dashboard",
    },
    metadata: {
      type: "object",
      label: "Metadata",
      description:
        "Stringified JSON object of custom data. Check the [Metadata docs](https://paystack.com/docs/payments/metadata/) for more information",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.paystack.co";
    },
    _headers() {
        return {
            "Authorization": `Bearer ${this.$auth.api_key}`,
            "Content-Type": "application/json",
            "user-agent": "@PaystackOSS/paystack v0.1"
        }
    },
    _makeRequest({ 
        $ = this, path = "/", ...opts
    }) {
      return axios($, {
          url: this._baseUrl() + path,
          headers: this._headers(),
          ...opts,
      });
    },
    async initializeTransaction(args = {}) {
      return await this._makeRequest({
        method: "POST",
        path: "/transaction/initialize",
      ...args,
      });
    },
  },
}
