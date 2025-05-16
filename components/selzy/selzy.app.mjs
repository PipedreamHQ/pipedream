import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "selzy",
  propDefinitions: {
    listId: {
      type: "string",
      label: "List ID",
      description: "Select or enter the List ID to monitor or target",
      async options() {
        const lists = await this.getLists();
        return lists.map((list) => ({
          label: list.name,
          value: list.id,
        }));
      },
    },
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "Select or enter the Campaign ID to monitor",
      async options() {
        const campaigns = await this.getCampaigns();
        return campaigns.map((campaign) => ({
          label: campaign.name,
          value: campaign.id,
        }));
      },
    },
    senderEmail: {
      type: "string",
      label: "Sender Email",
      description: "The sender's email address",
    },
    senderName: {
      type: "string",
      label: "Sender Name",
      description: "The sender's name",
    },
    subject: {
      type: "string",
      label: "Subject",
      description: "The subject of the email",
    },
    body: {
      type: "string",
      label: "Body",
      description: "The HTML body of the email",
    },
    messageContent: {
      type: "string",
      label: "Message Content",
      description: "Content of the email message",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.selzy.com/en/api";
    },
    async _makeRequest(opts = {}) {
      const {
        $ = this,
        method = "GET",
        path = "/",
        headers,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: `${this._baseUrl()}${path}`,
        headers: {
          ...headers,
          api_key: this.$auth.api_key,
        },
      });
    },
    async getLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    async getCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    async createEmailMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/createEmailMessage",
        data: {
          sender_name: this.senderName,
          sender_email: this.senderEmail,
          subject: this.subject,
          body: this.body,
          list_id: this.listId,
          ...opts,
        },
      });
    },
    async createCampaign(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/createCampaign",
        data: {
          subject: this.subject,
          sender_name: this.senderName,
          sender_email: this.senderEmail,
          message_content: this.messageContent,
          list_id: this.listId,
          ...opts,
        },
      });
    },
    async subscribeToNewContact(listId) {
      // Logic for webhook or polling to emit new event on new contact subscription
    },
    async subscribeToNewCampaign() {
      // Logic for webhook or polling to emit new event when a new campaign is created
    },
    async subscribeToCampaignStatusChange(campaignId) {
      // Logic for webhook or polling to emit new event on campaign status change
    },
  },
};
