import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "mixmax",
  propDefinitions: {
    contactId: {
      type: "string",
      label: "Contact Id",
      description: "The Id of the contact.",
      async options({ prevContext }) {
        const response = await this.listContacts({
          params: {
            next: prevContext.next,
          },
        });

        return {
          options: response.results.map(({
            _id: value, email: label,
          }) => ({
            label,
            value,
          })),
          context: {
            next: response.hasNext && response.next,
          },
        };
      },
    },
    email: {
      type: "string[]",
      label: "Email",
      description: "Exact email required. Matches case-insensitively.",
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "By default, all APIs return all properties of the response objects. For APIs that return collections, you can have it return only specific fields.",
    },
    groups: {
      type: "string[]",
      label: "Groups",
      description: "Exact, case-sensitive match on group name. If multiple `group` search operators passed they will be treated as an AND (i.e. contacts returned must be in all groups).",
      async options({ prevContext }) {
        const response = await this.listGroups({
          params: {
            next: prevContext.next,
          },
        });

        return {
          options: response.results.map(({
            _id: value, name: label,
          }) => ({
            label,
            value,
          })),
          context: {
            next: response.hasNext && response.next,
          },
        };
      },
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "The number of results you'd like to get back. Defaults to 10.",
    },
    meta: {
      type: "object",
      label: "Meta",
      description: "Contact variables from any source (ex. Salesforce) that are used to populate sequences and templates variables.",
    },
    name: {
      type: "string",
      label: "Name",
      description: "Partial match on contact name. Matches case-insensitively. Only one `name` search operator supported.",
    },
    salesforceId: {
      type: "string",
      label: "Salesforce Id",
      description: "Salesforce ID that this contact is associated with, if a contact exists in Salesforce (either contact or a lead) for this same email address.",
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.mixmax.com/v1";
    },
    _getHeaders() {
      return {
        "X-API-Token": this.$auth.api_key,
      };
    },
    async _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createContact({
      $, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "contacts",
        method: "POST",
        ...opts,
      });
    },
    createContactGroup({
      $, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "contactgroups",
        method: "POST",
        ...opts,
      });
    },
    queryContacts({
      $, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "contacts/query",
        ...opts,
      });
    },
    listContacts({
      $, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "contacts",
        ...opts,
      });
    },
    listGroups({
      $, ...opts
    }) {
      return this._makeRequest({
        $,
        path: "contactgroups",
        ...opts,
      });
    },
    updateContact({
      $, id, ...opts
    }) {
      return this._makeRequest({
        $,
        path: `contacts/${id}`,
        method: "PATCH",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, lastId = null,
    }) {
      let hasNextPage = false;
      let count = 0;
      let nextPage = null;

      do {
        params.next = nextPage;
        const {
          results,
          hasNext,
          next,
        } = await fn({
          params,
        });
        for (const d of results) {
          if (lastId && d._id === lastId) {
            return false;
          }

          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasNextPage = hasNext;
        nextPage = next;

      } while (hasNextPage);
    },
  },
};
