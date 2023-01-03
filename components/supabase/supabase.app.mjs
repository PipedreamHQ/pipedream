import { createClient } from "@supabase/supabase-js";
import constants from "./common/constants.mjs";

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
    filter: {
      type: "integer",
      label: "Filter",
      description: "Filter type for the query",
      options: constants.FILTER_OPTIONS,
    },
  },
  methods: {
    async _client() {
      return createClient(`https://${this.$auth.subdomain}.supabase.co`, this.$auth.service_key);
    },
    async selectRow(table, column, filter, value, max) {
      const client = await this._client();
      const filterMethod = filter
        ? this[constants.FILTER_METHODS[filter]]
        : null;
      const { data } = filter
        ? await filterMethod(client, table, column, value, max)
        : await this.getMaxRows(client, table, max);
      return data;
    },
    async getMaxRows(client, table, max) {
      return client
        .from(table)
        .select()
        .limit(max);
    },
    async equalTo(client, table, column, value, max) {
      return client
        .from(table)
        .select()
        .eq(column, value)
        .limit(max);
    },
    async notEqualTo(client, table, column, value, max) {
      return client
        .from(table)
        .select()
        .neq(column, value)
        .limit(max);
    },
    async greaterThan(client, table, column, value, max) {
      return client
        .from(table)
        .select()
        .gt(column, value)
        .limit(max);
    },
    async greaterThanOrEqualTo(client, table, column, value, max) {
      return client
        .from(table)
        .select()
        .gte(column, value)
        .limit(max);
    },
    async lessThan(client, table, column, value, max) {
      return client
        .from(table)
        .select()
        .lt(column, value)
        .limit(max);
    },
    async lessThanOrEqualTo(client, table, column, value, max) {
      return client
        .from(table)
        .select()
        .lte(column, value)
        .limit(max);
    },
    async patternMatch(client, table, column, value, max) {
      return client
        .from(table)
        .select()
        .like(column, `%${value}%`)
        .limit(max);
    },
    async patternMatchCaseInsensitive(client, table, column, value, max) {
      return client
        .from(table)
        .select()
        .ilike(column, `%${value}%`)
        .limit(max);
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
