import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "relavate",
  propDefinitions: {
    referralName: {
      type: "string",
      label: "Referral Name",
      description: "The name of the referral",
      optional: true,
    },
    clientId: {
      type: "string",
      label: "Client ID",
      description: "The ID of the client",
      required: true,
    },
    vendorId: {
      type: "string",
      label: "Vendor ID",
      description: "The ID of the vendor",
      required: true,
    },
    details: {
      type: "string",
      label: "Details",
      description: "The details of the lead",
      required: true,
    },
    followUp: {
      type: "boolean",
      label: "Follow Up",
      description: "Indicates if a follow up interaction is necessary",
      optional: true,
    },
    dealDetails: {
      type: "string",
      label: "Deal Details",
      description: "The details of the deal",
      required: true,
    },
    priority: {
      type: "string",
      label: "Priority",
      description: "The priority of the deal",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.relavate.co/";
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
          "X-key": this.$auth.key,
          "X-secret": this.$auth.secret,
          "X-partnerType": this.$auth.partnerType,
        },
      });
    },
    async createAffiliateCampaign() {
      return this._makeRequest({
        method: "POST",
        path: "/affiliate/campaign",
      });
    },
    async createClient() {
      return this._makeRequest({
        method: "POST",
        path: "/client",
      });
    },
    async createReferral(referralName) {
      return this._makeRequest({
        method: "POST",
        path: "/referral",
        data: {
          name: referralName,
        },
      });
    },
    async associateClientVendor(clientId, vendorId) {
      return this._makeRequest({
        method: "POST",
        path: "/client/vendor",
        data: {
          clientId: clientId,
          vendorId: vendorId,
        },
      });
    },
    async createAffiliateLead(details, followUp) {
      return this._makeRequest({
        method: "POST",
        path: "/affiliate/lead",
        data: {
          details: details,
          followUp: followUp,
        },
      });
    },
    async createDeal(dealDetails, priority) {
      return this._makeRequest({
        method: "POST",
        path: "/deal",
        data: {
          dealDetails: dealDetails,
          priority: priority,
        },
      });
    },
  },
};
