import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "white_swan",
  propDefinitions: {
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The unique identifier of the client",
    },
    planDetails: {
      type: "string",
      label: "Plan Details",
      description: "Details of the personal plan",
    },
    clientData: {
      type: "object",
      label: "Client Data",
      description: "Data about the client for pre-filling applications",
    },
    dataType: {
      type: "string",
      label: "Data Type",
      description: "The type of data being imported",
      optional: true,
    },
    clientEmail: {
      type: "string",
      label: "Client Email",
      description: "Email of the client to retrieve information",
    },
    referralStatus: {
      type: "string",
      label: "Referral Status",
      description: "Status of the referred client's onboarding process",
      optional: true,
    },
    extensiveClientData: {
      type: "object",
      label: "Extensive Client Data",
      description: "Detailed data about the client for creating a comprehensive quote request",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.white_swan.com";
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
    async emitChangeRequest(opts = {}) {
      return this._makeRequest({
        path: "/change_request",
        method: "POST",
        ...opts,
      });
    },
    async emitEarningsEvent(opts = {}) {
      return this._makeRequest({
        path: "/earnings_event",
        method: "POST",
        ...opts,
      });
    },
    async emitPlanOfferEvent(opts = {}) {
      return this._makeRequest({
        path: "/plan_offer_event",
        method: "POST",
        ...opts,
      });
    },
    async importClientData(opts = {}) {
      return this._makeRequest({
        path: "/import_client_data",
        method: "POST",
        ...opts,
      });
    },
    async getClientInfo(opts = {}) {
      return this._makeRequest({
        path: "/clients",
        ...opts,
      });
    },
    async createQuoteRequest(opts = {}) {
      return this._makeRequest({
        path: "/quote_request",
        method: "POST",
        ...opts,
      });
    },
  },
};
