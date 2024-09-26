import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "ambivo",
  propDefinitions: {
    contactIds: {
      type: "string[]",
      label: "Contact IDs",
      description: "The IDs of the contacts whose status updates you want to monitor",
      optional: true,
      async options() {
        const contacts = await this.listContacts();
        return contacts?.map(({
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
      return "https://fapi.ambivo.com/crm";
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
          "Authorization": `Bearer ${this.$auth.access_token}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/created",
        ...opts,
      });
    },
    listContactStatusUpdated(opts = {}) {
      return this._makeRequest({
        path: "/contacts/status_updated",
        ...opts,
      });
    },
    listLeads(opts = {}) {
      return this._makeRequest({
        path: "/leads/created",
        ...opts,
      });
    },
  },
};
