import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "pdffiller",
  propDefinitions: {
    documentId: {
      type: "string",
      label: "Document ID",
      description: "The ID of the document template.",
      async options({ page }) {
        const { items } = await this.listDocuments({
          params: {
            page: page + 1,
          },
        });

        return items.map(({
          id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    fillableFormId: {
      type: "string",
      label: "Fillable Form ID",
      description: "The ID of the fillable form.",
      async options({ page }) {
        const { items } = await this.listFillableForms({
          params: {
            page: page + 1,
          },
        });

        return items.map(({
          fillable_form_id: value, document_name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    file: {
      type: "string",
      label: "File",
      description: "The path to the file saved to the `/tmp` directory (e.g. `/tmp/example.json`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    folderId: {
      type: "string",
      label: "Folder Id",
      description: "The id of the folder.",
      async options({ page }) {
        const { items } = await this.listFolders({
          params: {
            page: page + 1,
          },
        });

        return items.map(({
          folder_id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the document to be searched",
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.pdffiller.com/v2";
    },
    _headers(headers = {}) {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, path, headers, ...opts
    }) {
      return axios($, {
        url: this._baseUrl() + path,
        headers: this._headers(headers),
        ...opts,
      });
    },
    listDocuments(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/templates",
        ...opts,
      });
    },
    listFillableForms(opts = {}) {
      return this._makeRequest({
        method: "GET",
        path: "/fillable_forms",
        ...opts,
      });
    },
    listFolders(opts = {}) {
      return this._makeRequest({
        path: "/folders",
        ...opts,
      });
    },
    createFillableDocument(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/fillable_forms",
        ...opts,
      });
    },
    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/templates",
        ...opts,
      });
    },
    createCallback(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/callbacks",
        ...opts,
      });
    },
    deleteCallback(callbackId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/callbacks/${callbackId}`,
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
          items,
          next_page_url,
        } = await fn({
          params,
          ...opts,
        });
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = next_page_url;

      } while (hasMore);
    },
  },
};
