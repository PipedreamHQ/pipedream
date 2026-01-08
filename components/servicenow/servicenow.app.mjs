import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "servicenow",
  propDefinitions: {
    table: {
      type: "string",
      label: "Table",
      description: "Search for a table or provide a table name (not label)",
      useQuery: true,
      async options({ query }) {
        if (!(query?.length > 1)) {
          return [];
        }
        const { data } = await this.getTable({
          table: "sys_db_object",
          params: {
            sysparm_query: `nameLIKE${query}^ORlabelLIKE${query}`,
            sysparm_fields: "name,label",
          },
        });
        return data.map(({
          label, name,
        }) => ({
          label,
          value: name,
        }));
      },
    },
  },
  methods: {
    _makeRequest({
      $ = this,
      headers,
      ...args
    }) {
      return axios($, {
        baseURL: `https://${this.$auth.instance_name}.service-now.com/api/now`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
    },
    async getTable({
      table, ...args
    }) {
      return this._makeRequest({
        url: `/table/${table}`,
        ...args,
      });
    },
    async createTableRecord({
      table, data, ...args
    }) {
      return this._makeRequest({
        method: "post",
        url: `/table/${table}`,
        data,
        ...args,
      });
    },
    async updateTableRecord({
      table, sysId, data, ...args
    }) {
      return this._makeRequest({
        method: "patch",
        url: `/table/${table}/${sysId}`,
        data,
        ...args,
      });
    },
    async getTableRecordBySysId({
      table, sysId, ...args
    }) {
      return this._makeRequest({
        url: `/table/${table}/${sysId}`,
        ...args,
      });
    },
    async getTableRecords({
      table, ...args
    }) {
      return this._makeRequest({
        url: `/table/${table}`,
        ...args,
      });
    },
  },
};
