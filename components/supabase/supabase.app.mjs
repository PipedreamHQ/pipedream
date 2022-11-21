import { createClient } from "@supabase/supabase-js";

export default {
  type: "app",
  app: "supabase",
  propDefinitions: {
    table: {
      type: "string",
      label: "Table",
      description: "Name of the table to search",
    },
    column: {
      type: "string",
      label: "Column",
      description: "Column name to search by",
    },
    value: {
      type: "string",
      label: "Value",
      description: "Value of the column specified to search for",
    },
    data: {
      type: "object",
      label: "Row Data",
      description: "Enter the column names and values as key/value pairs",
    },
  },
  methods: {
    async _client() {
      return createClient(`https://${this.$auth.subdomain}.supabase.co`, this.$auth.service_key);
    },
    async selectRow(table, column, value) {
      const client = await this._client();
      const { data } = await client
        .from(table)
        .select()
        .eq(column, value);
      return data;
    },
    async insertRow(table, rowData = {}) {
      const client = await this._client();
      const { data } = await client
        .from(table)
        .insert(rowData)
        .select();
      return data;
    },
    async updateRow(table, column, value, rowData = {}) {
      const client = await this._client();
      const { data } = await client
        .from(table)
        .update(rowData)
        .eq(column, value)
        .select();
      return data;
    },
    async upsertRow(table, rowData = {}) {
      const client = await this._client();
      const { data } = await client
        .from(table)
        .upsert(rowData)
        .select();
      return data;
    },
    async deleteRow(table, column, value) {
      const client = await this._client();
      const { data } = await client
        .from(table)
        .delete()
        .eq(column, value)
        .select();
      return data;
    },
    async remoteProcedureCall(functionName, args = {}) {
      const client = await this._client();
      const { data } = await client.rpc(functionName, args);
      return data;
    },
  },
};
