import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "yespo",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact Id",
      description: "The Id of the contact.",
      async options({ page }) {
        const data = await this.listContacts({
          params: {
            page,
          },
        });

        return data.map(({
          id: value, firstName, lastName,
        }) => ({
          label: `${firstName} ${lastName}`,
          value,
        }));
      },
    },
    segmentId: {
      type: "string",
      label: "Segment Id",
      description: "The id of the segment.",
      async options() {
        const response = await this.getSegments();

        return response
          .filter((item) => item.type === "Static")
          .map(({
            id: value, name: label,
          }) => ({
            label,
            value,
          }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://yespo.io/api/v1";
    },
    _headers() {
      return {
        "Content-Type": "application/json; charset=UTF-8",
      };
    },
    _auth() {
      return {
        username: "x",
        password: `${this.$auth.api_key}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: this._baseUrl() + path,
        headers: this._headers(),
        auth: this._auth(),
        ...opts,
      };

      return axios($, config);
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts",
        ...opts,
      });
    },
    listContactsFromSegment({
      segmentId, ...opts
    }) {
      return this._makeRequest({
        path: `/group/${segmentId}/contacts`,
        ...opts,
      });
    },
    getSegments() {
      return this._makeRequest({
        path: "/groups",
      });
    },
    addOrUpdateContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contact",
        ...opts,
      });
    },
    sendEmail(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/message/email",
        ...opts,
      });
    },
    registerEvent(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/event",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        if (page) {
          params.startindex = (LIMIT * page) + 1;
        }
        params.maxrows = LIMIT;
        page++;

        const data = await fn({
          params,
          ...opts,
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
