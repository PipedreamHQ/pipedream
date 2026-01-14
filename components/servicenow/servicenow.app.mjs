import { axios, ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "servicenow_oauth_",
  propDefinitions: {
    table: {
      type: "string",
      label: "Table",
      description: "Search for a table or provide a table name (not label)",
      useQuery: true,
      async options({ query }) {
        if (!(query?.length > 1)) {
          throw new ConfigurationError("Please input a search term");
        }
        const data = await this.getTableRecords({
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
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID (`sys_id` field) of the record",
    },
    responseDataFormat: {
      label: "Response Data Format",
      type: "string",
      description: "The format to return response fields in",
      optional: true,
      options: [
        {
          value: "true",
          label: "Returns the display values for all fields",
        },
        {
          value: "false",
          label: "Returns the actual values from the database",
        },
        {
          value: "all",
          label: "Returns both actual and display values",
        },
      ],
    },
    excludeReferenceLinks: {
      type: "boolean",
      label: "Exclude Reference Links",
      description: "If true, the response excludes Table API links for reference fields",
      optional: true,
    },
    responseFields: {
      type: "string[]",
      label: "Response Fields",
      description: "The fields to return in the response. By default, all fields are returned",
      optional: true,
    },
    inputDisplayValue: {
      label: "Input Display Value",
      type: "boolean",
      description: "If true, the input values are treated as display values (and are manipulated so they can be stored properly in the database)",
      optional: true,
    },
    responseView: {
      label: "Response View",
      type: "string",
      description: "Render the response according to the specified UI view (overridden by `Response Fields`)",
      optional: true,
      options: [
        "desktop",
        "mobile",
        "both",
      ],
    },
    queryNoDomain: {
      type: "boolean",
      label: "Query Across Domains",
      description: "If true, allows access to data across domains (if authorized)",
      optional: true,
    },
  },
  methods: {
    async _makeRequest({
      $ = this,
      headers,
      ...args
    }) {
      const response = await axios($, {
        baseURL: `https://${this.$auth.instance_name}.service-now.com/api/now`,
        headers: {
          ...headers,
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
        },
        ...args,
      });
      return response.result;
    },
    async createTableRecord({
      table, ...args
    }) {
      return this._makeRequest({
        method: "post",
        url: `/table/${table}`,
        ...args,
      });
    },
    async updateTableRecord({
      table, recordId, replace, ...args
    }) {
      return this._makeRequest({
        method: replace
          ? "put"
          : "patch",
        url: `/table/${table}/${recordId}`,
        ...args,
      });
    },
    async deleteTableRecord({
      table, recordId, ...args
    }) {
      return this._makeRequest({
        method: "delete",
        url: `/table/${table}/${recordId}`,
        ...args,
      });
    },
    async getTableRecordById({
      table, recordId, ...args
    }) {
      return this._makeRequest({
        url: `/table/${table}/${recordId}`,
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
    async getRecordCountsByField({
      table, ...args
    }) {
      return this._makeRequest({
        url: `/stats/${table}`,
        ...args,
      });
    },
  },
};
