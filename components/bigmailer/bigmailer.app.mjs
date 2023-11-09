import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "bigmailer",
  propDefinitions: {
    brandId: {
      type: "string",
      label: "Brand ID",
      description: "The ID of the brand",
      async options() {
        const { brands } = await this.listBrands();
        return brands.map((brand) => ({
          label: brand.name,
          value: brand.id,
        }));
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The ID of the transactional campaign",
      async options({ brandId }) {
        const { campaigns } = await this.listTransactionalCampaigns({
          brandId,
        });
        return campaigns.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        }));
      },
    },
    contactData: {
      type: "object",
      label: "Contact Data",
      description: "The data for the new contact",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.bigmailer.io/v1";
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
          "Authorization": `Bearer ${this.$auth.api_token}`,
        },
      });
    },
    async listBrands() {
      return this._makeRequest({
        path: "/brands",
      });
    },
    async listTransactionalCampaigns({ brandId }) {
      return this._makeRequest({
        path: `/brands/${brandId}/transactional-campaigns`,
      });
    },
    async listContacts({ brandId }) {
      return this._makeRequest({
        path: `/brands/${brandId}/contacts`,
      });
    },
    async sendTransactionalCampaign({
      brandId, campaignId, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/brands/${brandId}/transactional-campaigns/${campaignId}/send`,
        data,
      });
    },
    async upsertContact({
      brandId, data,
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/brands/${brandId}/contacts/upsert`,
        data,
      });
    },
  },
};
