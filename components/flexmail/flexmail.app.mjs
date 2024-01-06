import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "flexmail",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The ID of the contact",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: page * limit,
        };
        const { _embedded: embedded } = await this.listContacts({
          params,
        });
        if (!embedded || !embedded.item?.length) {
          return [];
        }
        return embedded.item.map(({
          id: value, email: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    language: {
      type: "string",
      label: "Language",
      description: "The language the contact wants to receive emails in",
      async options() {
        const { languages } = await this.listLanguages();
        return languages;
      },
    },
    source: {
      type: "string",
      label: "Source",
      description: "Identifier of the source of the contact",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: page * limit,
        };
        const { _embedded: embedded } = await this.listSources({
          params,
        });
        if (!embedded || !embedded.item?.length) {
          return [];
        }
        return embedded.item.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
    interest: {
      type: "string",
      label: "Interest",
      description: "Identifier of an interest",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          offset: page * limit,
        };
        const { _embedded: embedded } = await this.listInterests({
          params,
        });
        if (!embedded || !embedded.item?.length) {
          return [];
        }
        return embedded.item.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.flexmail.eu";
    },
    _getAuth() {
      return {
        username: `${this.$auth.account_id}`,
        password: `${this.$auth.personal_access_token}`,
      };
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
        auth: this._getAuth(),
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listLanguages(opts = {}) {
      return this._makeRequest({
        path: "/account-contact-languages",
        ...opts,
      });
    },
    listSources(opts = {}) {
      return this._makeRequest({
        path: "/sources",
        ...opts,
      });
    },
    listCustomFields(opts = {}) {
      return this._makeRequest({
        path: "/custom-fields",
        ...opts,
      });
    },
    listInterests(opts = {}) {
      return this._makeRequest({
        path: "/interests",
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
        method: "PATCH",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    unsubscribeContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/unsubscribe`,
        ...opts,
      });
    },
    subscribeContactInterest({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/contacts/${contactId}/interest-subscriptions`,
        ...opts,
      });
    },
  },
};
