import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bloomerang",
  propDefinitions: {
    donationType: {
      type: "string",
      label: "Donation Type",
      description: "Filter donations by type",
      optional: true,
      async options() {
        const response = await this._makeRequest({
          path: "/donation-types",
        });
        return response.map((type) => ({
          label: type.name,
          value: type.id,
        }));
      },
    },
    fundId: {
      type: "string",
      label: "Fund",
      description: "Filter donations by fund",
      optional: true,
      async options() {
        const response = await this._makeRequest({
          path: "/funds",
        });
        return response.map((fund) => ({
          label: fund.name,
          value: fund.id,
        }));
      },
    },
    constituentType: {
      type: "string",
      label: "Constituent Type",
      description: "Filter constituents by type",
      optional: true,
      async options() {
        const response = await this._makeRequest({
          path: "/constituent-types",
        });
        return response.map((type) => ({
          label: type.name,
          value: type.id,
        }));
      },
    },
    interactionType: {
      type: "string",
      label: "Interaction Type",
      description: "Filter interactions by type",
      optional: true,
      async options() {
        const response = await this._makeRequest({
          path: "/interaction-types",
        });
        return response.map((type) => ({
          label: type.name,
          value: type.id,
        }));
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign",
      description: "Filter interactions by campaign",
      optional: true,
      async options() {
        const response = await this._makeRequest({
          path: "/campaigns",
        });
        return response.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        }));
      },
    },
    constituentId: {
      type: "string",
      label: "Constituent ID",
      description: "The ID of the constituent",
    },
    amount: {
      type: "string",
      label: "Amount",
      description: "The amount for the donation",
    },
    date: {
      type: "string",
      label: "Date",
      description: "The date of the donation",
    },
    paymentMethod: {
      type: "string",
      label: "Payment Method",
      description: "The method of payment",
      optional: true,
    },
    note: {
      type: "string",
      label: "Note",
      description: "A note for the donation",
      optional: true,
    },
    appeal: {
      type: "string",
      label: "Appeal",
      description: "An appeal for the donation",
      optional: true,
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the constituent",
    },
    contactDetails: {
      type: "string",
      label: "Contact Details",
      description: "Contact details of the constituent",
    },
    address: {
      type: "string",
      label: "Address",
      description: "Address of the constituent",
      optional: true,
    },
    tags: {
      type: "string[]",
      label: "Tags",
      description: "Tags for the constituent",
      optional: true,
    },
    customFields: {
      type: "string[]",
      label: "Custom Fields",
      description: "Custom fields for the constituent",
      optional: true,
    },
    interactionDate: {
      type: "string",
      label: "Interaction Date",
      description: "The date of the interaction",
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes for the interaction",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bloomerang.co/v2";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          Authorization: `Bearer ${this.$auth.api_key}`,
        },
      });
    },
    async listDonationTypes() {
      return this._makeRequest({
        path: "/donation-types",
      });
    },
    async listFunds() {
      return this._makeRequest({
        path: "/funds",
      });
    },
    async listConstituentTypes() {
      return this._makeRequest({
        path: "/constituent-types",
      });
    },
    async listInteractionTypes() {
      return this._makeRequest({
        path: "/interaction-types",
      });
    },
    async listCampaigns() {
      return this._makeRequest({
        path: "/campaigns",
      });
    },
    async createDonation({
      constituentId, amount, fundId, date, paymentMethod, note, appeal,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/donations",
        data: {
          constituentId,
          amount,
          fundId,
          date,
          paymentMethod,
          note,
          appeal,
        },
      });
    },
    async createConstituent({
      constituentType, name, contactDetails, address, tags, customFields,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/constituents",
        data: {
          constituentType,
          name,
          contactDetails,
          address,
          tags,
          customFields,
        },
      });
    },
    async createInteraction({
      constituentId, interactionType, interactionDate, notes, campaignId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/constituents/${constituentId}/interactions`,
        data: {
          interactionType,
          interactionDate,
          notes,
          campaignId,
        },
      });
    },
  },
};
