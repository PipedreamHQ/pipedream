import { axios } from "@pipedream/platform";
import { SUPPORTED_MODULES } from "./common/constants.mjs";

export default {
  type: "app",
  app: "zoho_recruit",
  propDefinitions: {
    module: {
      type: "string",
      label: "Module",
      description: "The API name of the module",
      options: SUPPORTED_MODULES,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "The API names of the fields to include",
      async options({ moduleName }) {
        if (!moduleName) return [];
        const { fields } = await this.listFields({
          params: {
            module: moduleName,
          },
        });
        return fields?.map(({ api_name: name }) => name) || [];
      },
    },
    record: {
      type: "string",
      label: "Record",
      description: "ID of a record",
      async options({
        moduleName, page,
      }) {
        if (!moduleName) return [];
        const { data } = await this.listRecords({
          moduleName,
          params: {
            page: page + 1,
          },
        });
        return data?.map(({ id }) => id) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return `https://recruit.${this.$auth.base_api_uri}/recruit/v2`;
    },
    _headers() {
      return {
        "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
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
    listModules(args = {}) {
      return this._makeRequest({
        path: "/settings/modules",
        ...args,
      });
    },
    listFields(args = {}) {
      return this._makeRequest({
        path: "/settings/fields",
        ...args,
      });
    },
    listRecords({
      moduleName, ...args
    }) {
      return this._makeRequest({
        path: `/${moduleName}`,
        ...args,
      });
    },
    createRecord({
      moduleName, ...args
    }) {
      return this._makeRequest({
        path: `/${moduleName}`,
        method: "POST",
        ...args,
      });
    },
    upsertRecord({
      moduleName, ...args
    }) {
      return this._makeRequest({
        path: `/${moduleName}/upsert`,
        method: "POST",
        ...args,
      });
    },
    updateRecord({
      moduleName, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/${moduleName}/${recordId}`,
        method: "PUT",
        ...args,
      });
    },
  },
};
