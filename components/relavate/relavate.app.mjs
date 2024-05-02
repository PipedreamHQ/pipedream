import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "relavate",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the campaign",
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.relavate.co/api";
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
          "X-key": this.$auth.api_key,
          "X-secret": this.$auth.api_secret,
          "X-partnerType": this.$auth.partner_type,
        },
      });
    },
    getPartnerType() {
      return this.$auth.partner_type;
    },
    getVendor({
      vendorId, ...opts
    }) {
      return this._makeRequest({
        path: `/vendors/${vendorId}`,
        ...opts,
      });
    },
    getPartner({
      partnerId, ...opts
    }) {
      return this._makeRequest({
        path: `/partners/${partnerId}`,
        ...opts,
      });
    },
    listVendors(opts = {}) {
      return this._makeRequest({
        path: "/partners/vendors/all",
        ...opts,
      });
    },
    listPartners(opts = {}) {
      return this._makeRequest({
        path: "/vendors/partners/all",
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/affiliate-campaigns",
        ...opts,
      });
    },
    listAffiliateLeads(opts = {}) {
      return this._makeRequest({
        path: "/affiliate-leads",
        ...opts,
      });
    },
    listReferrals(opts = {}) {
      return this._makeRequest({
        path: "/referrals",
        ...opts,
      });
    },
    createAffiliateLead(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/affiliate-leads",
        ...opts,
      });
    },
  },
};
