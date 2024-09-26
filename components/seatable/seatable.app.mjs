import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "seatable",
  propDefinitions: {
    tableName: {
      type: "string",
      label: "Table Name",
      description: "The name of a table",
      async options() {
        const { tables } = await this.getBaseInfo({
          baseUuid: await this.getBaseUuid(),
        });
        return tables?.map(({ name }) => name ) || [];
      },
    },
    rowId: {
      type: "string",
      label: "Row ID",
      description: "The identifier of a row",
      async options({
        tableName, page,
      }) {
        const { rows } = await this.listRows({
          baseUuid: await this.getBaseUuid(),
          params: {
            table_name: tableName,
            limit: constants.DEFAULT_LIMIT,
            start: page * constants.DEFAULT_LIMIT,
          },
        });
        return rows.map(({
          _id: value, Name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://cloud.seatable.io";
    },
    _headers(useAccountToken) {
      const token = useAccountToken
        ? this.$auth.account_token
        : this.$auth.oauth_access_token;
      return {
        Authorization: `Bearer ${token}`,
      };
    },
    _makeRequest({
      $ = this,
      path,
      useAccountToken = false,
      ...opts
    }) {
      return axios($, {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(useAccountToken),
        ...opts,
      });
    },
    listBases(opts = {}) {
      return this._makeRequest({
        path: "/api/v2.1/user-admin-dtables",
        useAccountToken: true,
        ...opts,
      });
    },
    async getBaseUuid(opts = {}) {
      const {
        personal: bases, groups,
      } = await this.listBases(opts);
      for (const group of groups) {
        bases.push(...group.dtables);
      }
      const { uuid } = bases.find(({ name }) => name === this.$auth.base_name);
      return uuid;
    },
    getBaseInfo({
      baseUuid, ...opts
    }) {
      return this._makeRequest({
        path: `/dtable-server/dtables/${baseUuid}`,
        ...opts,
      });
    },
    listRows({
      baseUuid, ...opts
    }) {
      return this._makeRequest({
        path: `/dtable-server/api/v1/dtables/${baseUuid}/rows`,
        ...opts,
      });
    },
    listColumns({
      baseUuid, ...opts
    }) {
      return this._makeRequest({
        path: `/dtable-server/api/v1/dtables/${baseUuid}/columns/`,
        ...opts,
      });
    },
    createRow({
      baseUuid, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/dtable-server/api/v1/dtables/${baseUuid}/rows/`,
        ...opts,
      });
    },
    updateRow({
      baseUuid, ...opts
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `/dtable-server/api/v1/dtables/${baseUuid}/rows/`,
        ...opts,
      });
    },
    deleteRow({
      baseUuid, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/dtable-server/api/v1/dtables/${baseUuid}/rows/`,
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: `/api/v2.1/workspace/${this.$auth.workspace_id}/dtable/${this.$auth.base_name}/webhooks/`,
        useAccountToken: true,
        ...opts,
      });
    },
    deleteWebhook({
      hookId, ...opts
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/api/v2.1/workspace/${this.$auth.workspace_id}/dtable/${this.$auth.base_name}/webhooks/${hookId}/`,
        useAccountToken: true,
        ...opts,
      });
    },
  },
};
