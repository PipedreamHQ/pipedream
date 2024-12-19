import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "contentstack",
  version: "0.0.{{ts}}",
  propDefinitions: {
    stackId: {
      type: "string",
      label: "Stack ID",
      description: "The ID of the Contentstack stack",
    },
    assetId: {
      type: "string",
      label: "Asset ID",
      description: "The ID of the asset",
    },
    contentTypeUid: {
      type: "string",
      label: "Content Type UID",
      description: "The UID of the content type for creating and listing entries",
    },
    entryId: {
      type: "string",
      label: "Entry ID",
      description: "The ID of the entry relevant to the published content",
    },
    entryUid: {
      type: "string",
      label: "Entry UID",
      description: "The UID of the entry to publish or update",
    },
    entryTitle: {
      type: "string",
      label: "Entry Title",
      description: "The title of the new entry",
    },
    content: {
      type: "string",
      label: "Content",
      description: "The content of the new entry",
    },
    metadata: {
      type: "string[]",
      label: "Metadata",
      description: "Array of metadata objects in JSON format",
      optional: true,
    },
    fieldsToUpdate: {
      type: "string[]",
      label: "Fields to Update",
      description: "Array of fields to update with new values in JSON format",
      optional: true,
    },
  },
  methods: {
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    _baseUrl() {
      return "https://api.contentstack.com/v3";
    },
    async _makeRequest(opts = {}) {
      const {
        $, method = "GET", path = "/", headers, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method,
        url: this._baseUrl() + path,
        headers: {
          ...headers,
          "api_key": this.$auth.api_key,
          "access_token": this.$auth.access_token,
          "Content-Type": "application/json",
        },
      });
    },
    async listAssets(opts = {}) {
      return this._makeRequest({
        path: `/stacks/${this.stackId}/assets`,
        ...opts,
      });
    },
    async getAsset(opts = {}) {
      return this._makeRequest({
        path: `/stacks/${this.stackId}/assets/${this.assetId}`,
        ...opts,
      });
    },
    async listEntries(opts = {}) {
      return this._makeRequest({
        path: `/stacks/${this.stackId}/content_types/${this.contentTypeUid}/entries`,
        ...opts,
      });
    },
    async getEntry(opts = {}) {
      return this._makeRequest({
        path: `/stacks/${this.stackId}/entries/${this.entryId}`,
        ...opts,
      });
    },
    async createEntry(opts = {}) {
      const data = {
        title: this.entryTitle,
        content: this.content,
        ...(this.metadata
          ? {
            metadata: this.metadata.map(JSON.parse),
          }
          : {}),
        ...opts.data,
      };
      return this._makeRequest({
        method: "POST",
        path: `/stacks/${this.stackId}/content_types/${this.contentTypeUid}/entries`,
        data,
        ...opts,
      });
    },
    async updateEntry(opts = {}) {
      const data = {
        ...(this.fieldsToUpdate
          ? this.fieldsToUpdate.reduce((acc, field) => {
            const parsedField = JSON.parse(field);
            return {
              ...acc,
              ...parsedField,
            };
          }, {})
          : {}),
        ...opts.data,
      };
      return this._makeRequest({
        method: "PUT",
        path: `/stacks/${this.stackId}/entries/${this.entryUid}`,
        data,
        ...opts,
      });
    },
    async publishEntry(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/stacks/${this.stackId}/entries/${this.entryUid}/publish`,
        ...opts,
      });
    },
    async paginate(fn, ...opts) {
      let allResults = [];
      let currentPage = 1;
      let hasMore = true;
      while (hasMore) {
        const response = await fn({
          page: currentPage,
          ...opts,
        });
        if (response.items && response.items.length > 0) {
          allResults = [
            ...allResults,
            ...response.items,
          ];
        }
        if (response.pagination && response.pagination.next_page) {
          currentPage += 1;
        } else {
          hasMore = false;
        }
      }
      return allResults;
    },
  },
};
