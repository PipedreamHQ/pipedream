import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "helpspot",
  propDefinitions: {
    xCategory: {
      type: "string",
      label: "Category",
      description: "The category id of the request.",
      async options({ page }) {
        const { category } = await this.listCategories({
          params: {
            page,
          },
        });

        return Object.entries(category).map(([
          , {
            xCategory: value, sCategory: label,
          },
        ]) => ({
          label,
          value,
        }));
      },
    },
    emailFrom: {
      type: "string",
      label: "Send Email From",
      description: "The ID of the mailbox to send emails from",
      async options({ page }) {
        const { mailbox } = await this.listMailboxes({
          params: {
            page,
          },
        });

        return mailbox.map(({
          xMailbox: value, sReplyName, sReplyEmail,
        }) => ({
          label: `${sReplyName} - ${sReplyEmail}`,
          value,
        }));
      },
    },
    emailStaff: {
      type: "string[]",
      label: "Email Staff",
      description: "List of staff to email",
      async options({ page }) {
        const { person } = await this.listActiveStaff({
          params: {
            page,
          },
        });

        return person.map(({
          xPerson: value, sFname, sLname, sEmail,
        }) => ({
          label: `${sFname} ${sLname} - ${sEmail}`,
          value,
        }));
      },
    },
    xStatus: {
      type: "string",
      label: "Status",
      description: "Select a status of the request",
      async options({ page }) {
        const { status } = await this.listStatuses({
          params: {
            page,
          },
        });

        return status.map(({
          xStatus: value, sStatus: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    xRequest: {
      type: "string",
      label: "Request Id",
      description: "The Id of the request",
      async options({ page }) {
        const { request } = await this.listRequests({
          params: {
            page,
          },
        });

        return request.map(({
          xRequest: value, sTitle: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.subdomain}.helpspot.com/api/index.php`;
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_token}`,
        "content-type": "multipart/form-data",
      };
    },
    _makeRequest({
      $ = this, methodParam, params, ...opts
    }) {
      return axios($, {
        url: this._baseUrl(),
        headers: this._headers(),
        params: {
          ...params,
          method: methodParam,
          output: "json",
        },
        ...opts,
      });
    },
    createRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        methodParam: "private.request.create",
        ...opts,
      });
    },
    getRequest(opts = {}) {
      return this._makeRequest({
        methodParam: "private.request.get",
        ...opts,
      });
    },
    listCategories(opts = {}) {
      return this._makeRequest({
        methodParam: "private.request.getCategories",
        ...opts,
      });
    },
    listMailboxes(opts = {}) {
      return this._makeRequest({
        methodParam: "private.request.getMailboxes",
        ...opts,
      });
    },
    listActiveStaff(opts = {}) {
      return this._makeRequest({
        methodParam: "private.util.getActiveStaff",
        ...opts,
      });
    },
    listStatuses(opts = {}) {
      return this._makeRequest({
        methodParam: "private.request.getStatusTypes",
        ...opts,
      });
    },
    listRequests(opts = {}) {
      return this._makeRequest({
        methodParam: "private.request.search",
        ...opts,
      });
    },
    listChanges(opts = {}) {
      return this._makeRequest({
        methodParam: "private.request.getChanged",
        ...opts,
      });
    },
    multiGet(opts = {}) {
      return this._makeRequest({
        methodParam: "private.request.multiGet",
        ...opts,
      });
    },
    updateRequest(opts = {}) {
      return this._makeRequest({
        method: "POST",
        methodParam: "private.request.update",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, field, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.length = LIMIT;
        params.start = LIMIT * page++;
        const response = await fn({
          params,
          ...opts,
        });

        for (const d of response[field]) {
          yield await this.getRequest({
            params: {
              xRequest: d.xRequest || d,
            },
          });

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = response[field].length;

      } while (hasMore);
    },
  },
};
