import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "dex",
  propDefinitions: {
    contactIds: {
      type: "string[]",
      label: "Contact IDs",
      description: "Array of contact IDs",
      optional: true,
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const { contacts } = await this.listContacts({
          params: {
            limit,
            offset: page * limit,
          },
        });
        return contacts?.map(({
          id: value, first_name: firstname, last_name: lastname,
        }) => ({
          value,
          label: `${firstname} ${lastname}`,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.getdex.com/api/rest";
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
          "x-hasura-dex-api-key": `${this.$auth.api_key}`,
        },
      });
    },
    getContact(opts = {}) {
      return this._makeRequest({
        path: "/search/contacts",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
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
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    createReminder(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/reminders",
        ...opts,
      });
    },
    createNote(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/timeline_items",
        ...opts,
      });
    },
  },
};
