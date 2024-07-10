import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "transifex",
  propDefinitions: {
    file: {
      type: "string",
      label: "File",
      description: "The path to the json file saved to the `/tmp` directory (e.g. `/tmp/example.json`). [See the documentation](https://pipedream.com/docs/workflows/steps/code/nodejs/working-with-files/#the-tmp-directory).",
    },
    organizationId: {
      type: "string",
      label: "Organization ID",
      description: "The ID of the organization.",
      async options({ prevContext: { next } }) {
        const {
          data, links,
        } = await this.listOrganizations({
          params: {
            "page[cursor]": next,
          },
        });
        return {
          options: data.map(({
            attributes: { name: label }, id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            next: this.getNextToken(links),
          },
        };
      },
    },
    projectId: {
      type: "string",
      label: "Project ID",
      description: "The ID of the project.",
      async options({
        organizationId, prevContext: { next },
      }) {
        const {
          data, links,
        } = await this.listProjects({
          params: {
            "filter[organization]": organizationId,
            "page[cursor]": next,
          },
        });
        return {
          options: data.map(({
            attributes: { name: label }, id: value,
          }) => ({
            label,
            value,
          })),
          context: {
            next: this.getNextToken(links),
          },
        };
      },
    },
    resourceId: {
      type: "string",
      label: "Resource ID",
      description: "The ID of the resource.",
      async options({
        projectId, prevContext: { next },
      }) {
        const {
          data, links,
        } = await this.listResources({
          params: {
            "filter[project]": projectId,
            "page[cursor]": next,
          },
        });
        return {
          options: data.map(({
            id: value, attributes: { name: label },
          }) => ({
            label,
            value,
          })),
          context: {
            next: this.getNextToken(links),
          },
        };
      },
    },
    asyncDownloadId: {
      type: "string",
      label: "Async Download ID",
      description: "The ID of the asynchronous download.",
    },
  },
  methods: {
    _baseUrl() {
      return "https://rest.api.transifex.com";
    },
    _headers(headers) {
      return {
        Authorization: `Bearer ${this.$auth.api_token}`,
        ...headers,
      };
    },
    _makeRequest({
      $ = this, headers, path = "/", ...opts
    }) {
      return axios($, {
        ...opts,
        url: this._baseUrl() + path,
        headers: this._headers(headers),
      });
    },
    getNextToken({ next }) {
      if (!next) return false;
      return next.split("[cursor]=")[1];
    },
    listOrganizations(opts = {}) {
      return this._makeRequest({
        path: "/organizations",
        ...opts,
      });
    },
    listProjects(opts = {}) {
      return this._makeRequest({
        path: "/projects",
        ...opts,
      });
    },
    listResources(opts = {}) {
      return this._makeRequest({
        path: "/resources",
        ...opts,
      });
    },
    listLanguages(opts = {}) {
      return this._makeRequest({
        path: "/languages",
        ...opts,
      });
    },
    uploadFile(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/resource_strings_async_uploads",
        ...opts,
      });
    },
    prepareDownload(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/resource_strings_async_downloads",
        ...opts,
      });
    },
    downloadFile({
      asyncDownloadId, ...opts
    }) {
      return this._makeRequest({
        path: `/resource_strings_async_downloads/${asyncDownloadId}`,
        ...opts,
      });
    },
    createTaskWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/project_webhooks",
        ...opts,
      });
    },
    deleteTaskWebhook(webhookId) {
      return this._makeRequest({
        method: "DELETE",
        path: `/project_webhooks/${webhookId}`,
      });
    },
  },
};
