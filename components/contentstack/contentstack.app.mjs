import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 20;

export default {
  type: "app",
  app: "contentstack",
  propDefinitions: {
    branchIds: {
      type: "string[]",
      label: "Branches",
      description: "An array of branch identifiers",
      async options({ page }) {
        const { branches } = await this.listBranches({
          params: {
            limit: DEFAULT_LIMIT,
            skip: page * DEFAULT_LIMIT,
          },
        });
        return branches?.map(({ uid }) => uid) || [];
      },
    },
    contentType: {
      type: "string",
      label: "Content Type",
      description: "The UID of the content type for creating and listing entries",
      async options() {
        const { content_types: contentTypes } = await this.listContentTypes();
        return contentTypes?.map(({
          uid: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    entryId: {
      type: "string",
      label: "Entry ID",
      description: "The UID of the entry to publish or update",
      async options({ contentType }) {
        const { entries } = await this.listEntries({
          contentType,
        });
        return entries?.map(({
          uid: value, title: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    environments: {
      type: "string[]",
      label: "Environments",
      description: "The UIDs of the environments to which you want to publish the entry",
      async options() {
        const { environments } = await this.listEnvironments();
        return environments?.map(({ name }) => name ) || [];
      },
    },
    locale: {
      type: "string",
      label: "Locale",
      description: "The code of the language in which you want your entry to be localized in",
      async options() {
        const { locales } = await this.listLocales();
        return locales?.map(({
          code: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `${this.$auth.region}api.contentstack.${this.$auth.region === "https://"
        ? "io"
        : "com"}/v3`;
    },
    _makeRequest({
      $ = this,
      path,
      ...otherOpts
    }) {
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "api_key": `${this.$auth.stack_api_key}`,
          "authorization": `${this.$auth.management_token}`,
          "content-type": "application/json",
        },
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/webhooks",
        ...opts,
      });
    },
    deleteWebhook({
      webhookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/webhooks/${webhookId}`,
        ...opts,
      });
    },
    listBranches(opts = {}) {
      return this._makeRequest({
        path: "/stacks/branches",
        ...opts,
      });
    },
    listContentTypes(opts = {}) {
      return this._makeRequest({
        path: "/content_types",
        ...opts,
      });
    },
    listEntries({
      contentType, ...opts
    }) {
      return this._makeRequest({
        path: `/content_types/${contentType}/entries`,
        ...opts,
      });
    },
    listEnvironments(opts = {}) {
      return this._makeRequest({
        path: "/environments",
        ...opts,
      });
    },
    listLocales(opts = {}) {
      return this._makeRequest({
        path: "/locales",
        ...opts,
      });
    },
    getEntry({
      contentType, entryId, ...opts
    }) {
      return this._makeRequest({
        path: `/content_types/${contentType}/entries/${entryId}`,
        ...opts,
      });
    },
    getContentType({
      contentType, ...opts
    }) {
      return this._makeRequest({
        path: `/content_types/${contentType}`,
        ...opts,
      });
    },
    createEntry({
      contentType, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/content_types/${contentType}/entries`,
        ...opts,
      });
    },
    updateEntry({
      contentType, entryId, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/content_types/${contentType}/entries/${entryId}`,
        ...opts,
      });
    },
    publishEntry({
      contentType, entryId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/content_types/${contentType}/entries/${entryId}/publish`,
        ...opts,
      });
    },
    listAssets(opts = {}) {
      return this._makeRequest({
        path: "/assets",
        ...opts,
      });
    },
    async getAsset(opts = {}) {
      return this._makeRequest({
        path: `/stacks/${this.stackId}/assets/${this.assetId}`,
        ...opts,
      });
    },
  },
};
