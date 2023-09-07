import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 25;

export default {
  type: "app",
  app: "rex",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact",
      description: "Identifier of a contact",
      async options({ page }) {
        const limit = DEFAULT_LIMIT;
        const data = {
          limit,
          offset: page * limit,
        };
        const { results } = await this.listContacts({
          data,
        });
        return results?.rows?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    projectId: {
      type: "string",
      label: "Project",
      description: "Identifier of a project",
      optional: true,
      async options({ page }) {
        const limit = DEFAULT_LIMIT;
        const data = {
          limit,
          offset: page * limit,
        };
        const { results } = await this.listProjects({
          data,
        });
        return results?.rows?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    sourceId: {
      type: "string",
      label: "Contact",
      description: "Identifier of a source",
      async options() {
        const { result } = await this.listSources();
        return result?.map(({
          enquiry_source_id: value, email_address: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://api.${this.$auth.region === "api.uk"
        ? "uk."
        : ""}rexsoftware.com/v1/rex`;
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.access_token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    listContacts(args = {}) {
      return this._makeRequest({
        path: "/contacts/search",
        method: "POST",
        ...args,
      });
    },
    listProjects(args = {}) {
      return this._makeRequest({
        path: "/projects/search",
        method: "POST",
        ...args,
      });
    },
    listSources(args = {}) {
      return this._makeRequest({
        path: "/leads/get-allowed-sources-for-account",
        method: "POST",
        ...args,
      });
    },
    createWebhook(args = {}) {
      return this._makeRequest({
        path: "/admin-webhooks/create",
        method: "POST",
        ...args,
      });
    },
    deleteWebhook(args = {}) {
      return this._makeRequest({
        path: "/admin-webhooks/purge",
        method: "POST",
        ...args,
      });
    },
    createLead(args = {}) {
      return this._makeRequest({
        path: "/leads/create",
        method: "POST",
        ...args,
      });
    },
    createReminder(args = {}) {
      return this._makeRequest({
        path: "/reminders/create",
        method: "POST",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts/create",
        method: "POST",
        ...args,
      });
    },
  },
};
