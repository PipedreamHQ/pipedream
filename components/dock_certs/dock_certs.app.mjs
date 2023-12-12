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
          keyNames: {
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
          keyNames: {
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
          keyName: "name",
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
          keyNames: {
            label: "subjectRef",
            value: "id",
          },
        };
        if (isRevoked !== null) {
          data.filter = {
            keyName: "revoked",
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
          keyName: "id",
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
      prevContext, resourceFn, keyName, keyNames, filter,
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
        results = results.filter((result) => result[filter.keyName] === filter.value);
      }
      const options = keyName
        ? results?.map((result) => result[keyName])
        : results?.map((result) => ({
          label: result[keyNames.label],
          value: result[keyNames.value],
        })) || [];
      return {
        options,
        context: {
          offset: offset + limit,
        },
      };
    },
    async paginate({
      resourceFn, args = {}, maxResults = 1000,
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
    async listSchemas(args = {}) {
      const results = await this._makeRequest({
        path: "/schemas",
        ...args,
      });
      return results?.map(({ schema }) => schema) || [];
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
