import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdfmonkey",
  propDefinitions: {
    templateId: {
      type: "string",
      label: "Template ID",
      description: "The unique identifier of the document template.",
      async options({ page }) {
        const { document_template_cards: data } = await this.listTemplates({
          params: {
            "page[number]": page,
          },
        });

        return data.map(({
          id: value, identifier: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The unique identifier of the document.",
      async options({ page }) {
        const { document_cards: data } = await this.listDocuments({
          params: {
            "page[number]": page,
          },
        });

        return data.map(({
          id: value, filename,
        }) => ({
          label: `${value}${filename
            ? ` - ${filename}`
            : ""}`,
          value,
        }));
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pdfmonkey.io/api/v1";
    },
    _headers() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
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
    createDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/documents",
        ...opts,
      });
    },
    deleteDocument({
      documentId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/documents/${documentId}`,
        ...opts,
      });
    },
    getDocument({
      documentId, ...opts
    }) {
      return this._makeRequest({
        path: `/documents/${documentId}`,
        ...opts,
      });
    },
    listDocuments(opts = {}) {
      return this._makeRequest({
        path: "/document_cards",
        ...opts,
      });
    },
    listTemplates(opts = {}) {
      return this._makeRequest({
        path: "/document_template_cards",
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
        params["page[number]"] = ++page;

        const {
          document_cards: data,
          meta: {
            current_page, total_pages,
          },
        } = await fn({
          params,
          ...opts,
        });

        for (const d of data) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = current_page < total_pages;

      } while (hasMore);
    },
  },
};
