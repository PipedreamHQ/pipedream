import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "boldsign",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The ID of the BoldSign template to use.",
      async options({ page }) {
        const { result } = await this.listTemplates({
          params: {
            page: page + 1,
          },
        });

        return result.map(({
          documentId: value, templateName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    brandId: {
      type: "string",
      label: "Brand ID",
      description: "The brand ID for customizing the document.",
      async options() {
        const { result } = await this.listBrands();
        return result.map(({
          brandId: value, brandName: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    labels: {
      type: "string[]",
      label: "Labels",
      description: "Labels for categorizing documents.",
    },
    cc: {
      type: "string[]",
      label: "CC",
      description: "A list of CC recipients for the document.",
      async options({ page }) {
        const { result } = await this.listContacts({
          params: {
            page: page + 1,
          },
        });

        return result.map(({ email }) => email);
      },
    },
    sentBy: {
      type: "string",
      label: "Sent By",
      description: "The sender of the document.",
      async options({ page }) {
        const { result } = await this.listSenderIdentities({
          params: {
            page: page + 1,
          },
        });

        return result.map(({ email }) => email);
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.boldsign.com/v1";
    },
    _headers(headers = {}) {
      return {
        ...headers,
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        "accept": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(headers),
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/template/list",
        ...opts,
      });
    },
    listBrands(opts = {}) {
      return this._makeRequest({
        path: "/brand/list",
        ...opts,
      });
    },
    listContacts(opts = {}) {
      return this._makeRequest({
        path: "/contacts/list",
        ...opts,
      });
    },
    listDocuments(opts = {}) {
      return this._makeRequest({
        path: "/document/list",
        ...opts,
      });
    },
    listSenderIdentities(opts = {}) {
      return this._makeRequest({
        path: "/senderIdentities/list",
        ...opts,
      });
    },
    sendDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/template/send",
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
        params.page = ++page;
        const {
          result,
          pageDetails: {
            page: currentPage, totalPages,
          },
        } = await fn({
          params,
          ...opts,
        });
        for (const d of result) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = currentPage < totalPages;

      } while (hasMore);
    },
  },
};
