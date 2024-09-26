import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "postgrid",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact",
      description: "Identifier of a contact",
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          skip: page * limit,
        };
        const { data } = await this.listContacts({
          params,
        });
        return data?.map(({
          id: value, firstName, lastName, companyName,
        }) => ({
          value,
          label: firstName
            ? `${firstName} ${lastName}`
            : companyName,
        })) || [];
      },
    },
    returnEnvelopeId: {
      type: "string",
      label: "Return Envelope",
      description: "The id of the return envelope to be used.",
      optional: true,
      async options({ page }) {
        const limit = constants.DEFAULT_LIMIT;
        const params = {
          limit,
          skip: page * limit,
        };
        const { data } = await this.listReturnEnvelopes({
          params,
        });
        return data?.map(({ id }) => id ) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.postgrid.com/print-mail/v1";
    },
    _headers() {
      return {
        "x-api-key": `${this.$auth.api_key}`,
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
        path: "/contacts",
        ...args,
      });
    },
    listReturnEnvelopes(args = {}) {
      return this._makeRequest({
        path: "/return_envelopes",
        ...args,
      });
    },
    createContact(args = {}) {
      return this._makeRequest({
        path: "/contacts",
        method: "POST",
        ...args,
      });
    },
    createLetter(args = {}) {
      return this._makeRequest({
        path: "/letters",
        method: "POST",
        ...args,
      });
    },
    createPostcard(args = {}) {
      return this._makeRequest({
        path: "/postcards",
        method: "POST",
        ...args,
      });
    },
  },
};
