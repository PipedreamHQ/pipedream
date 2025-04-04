import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "elastic_email",
  propDefinitions: {
    email: {
      type: "string",
      label: "Email",
      description: "The contact's email",
    },
    listNames: {
      type: "string[]",
      label: "List Names",
      description: "Names of the mailing lists",
      optional: true,
      async options({ page }) {
        const data = await this.listLists({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return data.map(({ ListName }) => ListName);
      },
    },
    templateName: {
      type: "string",
      label: "Template Name",
      description: "The name of template.",
      async options({ page }) {
        const data = await this.listTemplates({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
            scopeType: "Personal",
          },
        });

        return data.map(({ Name }) => Name);
      },
    },
    unsubscribeEmails: {
      type: "string[]",
      label: "Email Addresses",
      description: "A list of email addresses  to unsubscribe",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.elasticemail.com/v4";
    },
    _headers() {
      return {
        "X-ElasticEmail-ApiKey": this.$auth.api_key,
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
    loadEvents(opts = {}) {
      return this._makeRequest({
        path: "/events",
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
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/templates",
        ...opts,
      });
    },
    sendBulkEmails(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/emails",
        ...opts,
      });
    },
    addContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/contacts",
        ...opts,
      });
    },
    unsubscribeContact(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/suppressions/unsubscribes",
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
        params.limit = LIMIT;
        params.offset = LIMIT * page;
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

        page++;
        hasMore = data.length;

      } while (hasMore);
    },
  },
};
