import { axios } from "@pipedream/platform";
const DEFAULT_PAGE_LIMIT = 20;

export default {
  type: "app",
  app: "dock_certs",
  propDefinitions: {
    profile: {
      type: "string",
      label: "Issuer Profile",
      description: "Identifier of the profile issuing the credential",
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listProfiles,
          keys: {
            label: "name",
            value: "did",
          },
        });
      },
    },
    templateDesign: {
      type: "string",
      label: "Template Design",
      description: "The ID of the intended template/design",
      optional: true,
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listTemplates,
          keys: {
            label: "name",
            value: "id",
          },
        });
      },
    },
    credentialType: {
      type: "string",
      label: "Type",
      description: "Credential type",
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listSchemas,
          key: "name",
        });
      },
    },
    credential: {
      type: "string",
      label: "Credential",
      description: "The credential to act upon",
      async options({
        prevContext, isRevoked = null,
      }) {
        const data = {
          prevContext,
          resourceFn: this.listCredentials,
          keys: {
            label: "subjectRef",
            value: "id",
          },
        };
        if (isRevoked !== null) {
          data.filter = {
            key: "revoked",
            value: isRevoked,
          };
        }
        return this.getPropOptions(data);
      },
    },
    registry: {
      type: "string",
      label: "Registry",
      description: "The registry ID",
      async options({ prevContext }) {
        return this.getPropOptions({
          prevContext,
          resourceFn: this.listRegistries,
          key: "id",
        });
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://${this.$auth.endpoint}.dock.io`;
    },
    _headers() {
      return {
        "DOCK-API-TOKEN": `${this.$auth.api_key}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      ...args
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      });
    },
    async getPropOptions({
      prevContext, resourceFn, key, keys, filter,
    }) {
      const limit = DEFAULT_PAGE_LIMIT;
      const offset = prevContext?.offset || 0;
      let results = await resourceFn({
        params: {
          limit,
          offset,
        },
      });
      if (filter) {
        results = results.filter((result) => result[filter.key] === filter.value);
      }
      const options = key
        ? results?.map((result) => result[key])
        : results?.map((result) => ({
          label: result[keys.label],
          value: result[keys.value],
        })) || [];
      return {
        options,
        context: {
          offset: offset + limit,
        },
      };
    },
    async paginate({
      resourceFn, args = {}, maxResults = 100,
    }) {
      const limit = DEFAULT_PAGE_LIMIT;
      let offset = 0;
      const results = [];
      let result;
      do {
        const params = {
          ...args.params,
          limit,
          offset,
        };
        result = await resourceFn({
          ...args,
          params,
        });
        results.push(...result);
        offset += limit;
      } while (result.length === limit && results.length < maxResults);
      if (results.length > maxResults) {
        results.length = maxResults;
      }
      return results;
    },
    getCredential({
      credentialId, ...args
    } = {}) {
      return this._makeRequest({
        path: `/credentials/${encodeURIComponent(credentialId)}`,
        ...args,
      });
    },
    listProfiles(args = {}) {
      return this._makeRequest({
        path: "/profiles",
        ...args,
      });
    },
    listTemplates(args = {}) {
      return this._makeRequest({
        path: "/templates",
        ...args,
      });
    },
    listSchemas(args = {}) {
      return this._makeRequest({
        path: "/schemas",
        ...args,
      });
    },
    listCredentials(args = {}) {
      return this._makeRequest({
        path: "/credentials",
        ...args,
      });
    },
    listRegistries(args = {}) {
      return this._makeRequest({
        path: "/registries",
        ...args,
      });
    },
    issueCredential(args = {}) {
      return this._makeRequest({
        path: "/credentials",
        method: "POST",
        ...args,
      });
    },
    revokeCredential({
      registryId, ...args
    }) {
      return this._makeRequest({
        path: `/registries/${registryId}`,
        method: "POST",
        ...args,
      });
    },
  },
};
