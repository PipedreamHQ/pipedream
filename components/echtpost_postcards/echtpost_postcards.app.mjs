import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "echtpost_postcards",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Design Template ID",
      description: "The ID of the template used for the postcard design.",
      async options() {
        const templates = await this.listTemplates();
        return templates.map((template) => ({
          label: template.best_name ?? template.content,
          value: template.id,
        }));
      },
    },
    contactId: {
      type: "string",
      label: "Recipient Contact",
      description: "The ID of the recipient contact.",
      async options() {
        const contacts = await this.listContacts();
        return contacts.map(({
          id, name, first,
        }) => ({
          label: name && first
            ? `${first} ${name}`
            : name ?? first ?? id,
          value: id,
        }));
      },
    },
    scheduledDate: {
      type: "string",
      label: "Scheduled Date",
      description: "The date when the postcard should be delivered, e.g. `2024-03-15`",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.echtpost.de/v1";
    },
    async _makeRequest({
      $ = this,
      path,
      params,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: this._baseUrl() + path,
        headers: {
          "Content-Type": "application/json",
        },
        params: {
          ...params,
          apikey: this.$auth.api_key,
        },
      });
    },
    async sendPostcard(args) {
      return this._makeRequest({
        method: "POST",
        path: "/cards",
        ...args,
      });
    },
    async listTemplates() {
      return this._makeRequest({
        path: "/templates",
      });
    },
    async listContacts() {
      return this._makeRequest({
        path: "/contacts",
      });
    },
    async createContact(args) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...args,
      });
    },
  },
};
