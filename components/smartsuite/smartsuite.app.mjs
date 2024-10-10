import { axios } from "@pipedream/platform";
const DEFAULT_LIMIT = 50;

export default {
  type: "app",
  app: "smartsuite",
  propDefinitions: {
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The identifier of a table",
      async options({ page }) {
        const { results: tables } = await this.listTables({
          params: {
            limit: DEFAULT_LIMIT,
            offset: page * DEFAULT_LIMIT,
          },
        });
        return tables?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    fieldIds: {
      type: "string[]",
      label: "Field IDs",
      description: "The field ID(s) (\"slug\") to search by",
      optional: true,
      async options({ tableId }) {
        const { structure: fields } = await this.listFields({
          tableId,
        });
        return fields?.map(({
          slug: value, label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    solutionId: {
      type: "string",
      label: "Solution ID",
      description: "The identifier of a solution",
      async options() {
        const solutions = await this.listSolutions();
        return solutions?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://app.smartsuite.com/api/v1";
    },
    _baseWebhookUrl() {
      return "https://webhooks.smartsuite.com/smartsuite.webhooks.engine.Webhooks";
    },
    _headers() {
      return {
        "Authorization": `Token ${this.$auth.api_token}`,
        "ACCOUNT-ID": `${this.$auth.account_id}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this,
      url,
      path,
      ...opts
    }) {
      return axios($, {
        url: url || `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...opts,
      });
    },
    createWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: `${this._baseWebhookUrl()}/CreateWebhook`,
        ...opts,
      });
    },
    deleteWebhook(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: `${this._baseWebhookUrl()}/DeleteWebhook`,
        ...opts,
      });
    },
    listWebhookEvents(opts = {}) {
      return this._makeRequest({
        method: "POST",
        url: `${this._baseWebhookUrl()}/ListEvents`,
        ...opts,
      });
    },
    listTables(opts = {}) {
      return this._makeRequest({
        path: "/applications",
        ...opts,
      });
    },
    listSolutions(opts = {}) {
      return this._makeRequest({
        path: "/solutions",
        ...opts,
      });
    },
    listFields({
      tableId, ...opts
    }) {
      return this._makeRequest({
        path: `/applications/${tableId}`,
        ...opts,
      });
    },
    listRecords({
      tableId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/applications/${tableId}/records/list/`,
        ...opts,
      });
    },
    createRecord({
      tableId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/applications/${tableId}/records/`,
        ...opts,
      });
    },
  },
};
