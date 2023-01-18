import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "reply_io",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign",
      description: "The campaign identifier",
      async options() {
        const campaigns = await this.listCampaigns();
        return campaigns?.map((campaign) => ({
          value: campaign.id,
          label: campaign.name,
        })) || [];
      },
    },
    stepId: {
      type: "string",
      label: "Step",
      description: "The step identifier",
      async options({ campaignId }) {
        const steps = await this.listCampaignSteps(campaignId);
        return steps?.map((step) => ({
          value: step.id,
          label: `Step number ${step.number}`,
        })) || [];
      },
    },
    contactEmail: {
      type: "string",
      label: "Contact Email",
      description: "Email address of the contact",
      async options({
        page, campaignId,
      }) {
        const params = {
          limit: 10,
          page: page + 1,
        };
        const { people } = campaignId
          ? await this.listContactsInCampaign(campaignId, {
            params,
          })
          : await this.listContacts({
            params,
          });
        return people?.map((contact) => contact.email) || [];
      },
    },
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email address",
    },
    firstName: {
      type: "string",
      label: "First Name",
      description: "The contact's first name",
    },
    lastName: {
      type: "string",
      label: "Last Name",
      description: "The contact's last name",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The contact's company",
      optional: true,
    },
    city: {
      type: "string",
      label: "City",
      description: "The contact's city",
      optional: true,
    },
    state: {
      type: "string",
      label: "State",
      description: "The contact's state",
      optional: true,
    },
    country: {
      type: "string",
      label: "Country",
      description: "The contact's country",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The contact's title",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The contact's phone number",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.reply.io";
    },
    _headers() {
      return {
        "X-Api-Key": this.$auth.api_key,
        "Content-Type": "application/json",
      };
    },
    async _makeRequest(args = {}) {
      const {
        $ = this,
        path,
        ...otherArgs
      } = args;
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...otherArgs,
      };
      return axios($, config);
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/api/v2/webhooks",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook(hookId, args = {}) {
      return this._makeRequest({
        path: `/api/v2/webhooks/${hookId}`,
        method: "DELETE",
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/v1/people",
        ...args,
      });
    },
    listContactsInCampaign(campaignId, args = {}) {
      return this._makeRequest({
        path: `/v1/campaigns/${campaignId}/people`,
        ...args,
      });
    },
    listCampaigns(args = {}) {
      return this._makeRequest({
        path: "/v1/campaigns",
        ...args,
      });
    },
    listCampaignSteps(campaignId, args = {}) {
      return this._makeRequest({
        path: `/v2/campaigns/${campaignId}/steps`,
        ...args,
      });
    },
    getCampaignStepStatistics(args = {}) {
      return this._makeRequest({
        path: "/v1/Stats/CampaignStep",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/v1/people",
        method: "POST",
        ...args,
      });
    },
    createContactAndPushToCampaign(args = {}) {
      return this._makeRequest({
        path: "/v1/actions/addandpushtocampaign",
        method: "POST",
        ...args,
      });
    },
    markAsReplied(args = {}) {
      return this._makeRequest({
        path: "/v1/actions/markasreplied",
        method: "POST",
        ...args,
      });
    },
    markAsFinished(args = {}) {
      return this._makeRequest({
        path: "/v1/actions/markasfinished",
        method: "POST",
        ...args,
      });
    },
    removeFromCampaign(args = {}) {
      return this._makeRequest({
        path: "/v1/actions/removepersonfromcampaignbyid",
        method: "POST",
        ...args,
      });
    },
  },
};
