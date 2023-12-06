import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "postalytics",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The unique identifier for a campaign",
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier for a contact",
      async options({ prevContext }) {
        const page = prevContext.page
          ? prevContext.page
          : 0;
        const response = await this.listContacts({
          page,
        });
        return {
          options: response.map((contact) => ({
            label: `${contact.firstName} ${contact.lastName}`,
            value: contact.id,
          })),
          context: {
            page: page + 1,
          },
        };
      },
    },
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The unique identifier of the template",
      async options() {
        const templates = await this.listTemplates();
        return templates.map((template) => ({
          label: template.name,
          value: template.id,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.postalytics.com";
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
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
      });
    },
    async listCampaigns() {
      return this._makeRequest({
        path: "/campaigns",
      });
    },
    async listContacts(opts = {}) {
      const { page } = opts;
      return this._makeRequest({
        path: `/contacts?page=${page}`,
      });
    },
    async listTemplates() {
      return this._makeRequest({
        path: "/templates",
      });
    },
    async sendMailItem({
      campaignId, contactId, templateId,
    }) {
      return this._makeRequest({
        method: "POST",
        path: "/send",
        data: {
          campaignId,
          contactId,
          templateId,
        },
      });
    },
    async createContact({ contactData }) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        data: contactData,
      });
    },
    async getContact({ contactId }) {
      return this._makeRequest({
        path: `/contacts/${contactId}`,
      });
    },
    async getCampaign({ campaignId }) {
      return this._makeRequest({
        path: `/campaigns/${campaignId}`,
      });
    },
    async sendMailPiece(campaignId, contactId, mailPieceData) {
      return this._makeRequest({
        method: "POST",
        path: `/campaigns/${campaignId}/send`,
        data: {
          contactId,
          ...mailPieceData,
        },
      });
    },
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
  },
};
