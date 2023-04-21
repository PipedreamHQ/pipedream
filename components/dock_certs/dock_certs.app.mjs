import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "dock_certs",
  propDefinitions: {
    profile: {
      type: "string",
      label: "Issuer Profile",
      description: "Identifier of the profile issuing the certificate",
      async options() {
        const profiles = await this.listProfiles();
        return profiles?.map(({
          did, name,
        }) => ({
          label: name,
          value: did,
        })) || [];
      },
    },
    templateDesign: {
      type: "string",
      label: "Template Design",
      description: "The ID of the intended template/design",
      optional: true,
      async options() {
        const templates = await this.listTemplates();
        return templates?.map(({
          id, name,
        }) => ({
          label: name,
          value: id,
        })) || [];
      },
    },
    credentialType: {
      type: "string",
      label: "Type",
      description: "Credential type",
      optional: true,
      async options() {
        const schemas = await this.listSchemas();
        return schemas?.map(({ schema }) => schema.name) || [];
      },
    },
    credentials: {
      type: "string[]",
      label: "Credentials",
      description: "The list of credential ids to act upon",
      async options() {
        const credentials = await this.listCredentials();
        return credentials?.map(({
          id, type,
        }) => ({
          label: type,
          value: id,
        })) || [];
      },
    },
    registry: {
      type: "string",
      label: "Registry",
      description: "The registry ID",
      async options() {
        const registries = await this.listRegistries();
        return registries?.map(({ id }) => id) || [];
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
