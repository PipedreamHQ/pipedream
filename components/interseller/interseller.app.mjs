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
    booked: {
      type: "boolean",
      label: "Booked",
      description: "A true/false value to indicate if the contact also booked a meeting.",
      optional: true,
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
    name: {
      type: "string",
      label: "Name",
      description: "The name of the contact.",
      optional: true,
    },
    company: {
      type: "string",
      label: "Company",
      description: "The company of the contact.",
      optional: true,
    },
    profileUrl: {
      type: "string",
      label: "Profile URL",
      description: "The profile URL of the contact.",
      optional: true,
    },
    sourceUrl: {
      type: "string",
      label: "Source URL",
      description: "The source URL of the contact.",
      optional: true,
    },
    location: {
      type: "string",
      label: "Location",
      description: "The location of the contact.",
      optional: true,
    },
    phoneNumber: {
      type: "string",
      label: "Phone Number",
      description: "The phone number of the contact.",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "The title of the contact.",
      optional: true,
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
