import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "interseller",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact ID",
      description: "The unique identifier of the contact.",
      async options({ page }) {
        const data = await this.listContacts({
          params: {
            limit: LIMIT,
            skip: LIMIT * page,
          },
        });

        return data.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    sentiment: {
      type: "string",
      label: "Sentiment",
      description: "The sentiment of the contact. Set this field to null to clear the value out.",
      optional: true,
      options: [
        {
          label: "Interested",
          value: "INTERESTED",
        },
        {
          label: "Not Interested",
          value: "NOT_INTERESTED",
        },
        {
          label: "Bad Fit",
          value: "BAD_FIT",
        },
        {
          label: "Wrong Contact",
          value: "WRONG_CONTACT",
        },
        {
          label: "Timing",
          value: "TIMING",
        },
      ],
    },
  },
  methods: {
    _baseUrl() {
      return "https://interseller.io/api";
    },
    _headers() {
      return {
        "X-API-Key": `${this.$auth.api_key}`,
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
    updateContact({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}`,
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    setContactReplied({
      contactId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/contacts/${contactId}/replied`,
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null,
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.skip = LIMIT * page;
        page++;

        const data = await fn({
          params,
        });
        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = data.length;

      } while (hasMore);
    },
  },
};
