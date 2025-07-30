import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "icontact",
  propDefinitions: {
    campaignId: {
      type: "string",
      label: "Campaign ID",
      description: "The sender property from which the message will pull its sending information.",
      async options() {
        const { campaigns } = await this.listCampaigns();

        return campaigns.map(({
          campaignId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The contact that will be subscribed to the list.",
      async options() {
        const { contacts } = await this.listContacts();

        return contacts.map(({
          contactId: value, email: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    listId: {
      type: "string",
      label: "List ID",
      description: "The ID of the list",
      async options() {
        const { lists } = await this.listLists();

        return lists.map(({
          listId: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://app.icontact.com/icp/a/${this.$auth.account_id}/c/${this.$auth.client_folder_id}`;
    },
    _headers() {
      return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "API-Version": "2.2",
        "API-AppId": `${this.$auth.api_app_id}`,
        "API-Username": `${this.$auth.api_username}`,
        "API-Password": `${this.$auth.api_password}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(),
        ...opts,
      });
    },
    createContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    createMessage(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/messages",
        ...opts,
      });
    },
    subscribeContactToList(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/subscriptions",
        ...opts,
      });
    },
    searchContact(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listCampaigns(opts = {}) {
      return this._makeRequest({
        path: "/campaigns",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listLists(opts = {}) {
      return this._makeRequest({
        path: "/lists",
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
      });
    },
  },
};
