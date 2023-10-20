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
      type: "string",
      label: "Filter",
      description: "Filter type for the query",
      options: constants.FILTER_OPTIONS,
    },
    sortOrder: {
      type: "string",
      label: "Sort Order",
      description: "Sort ascending or descending",
      options: [
        "ascending",
        "descending",
      ],
      optional: true,
      default: "ascending",
    },
  },
  methods: {
    async _client() {
      return createClient(`https://${this.$auth.subdomain}.supabase.co`, this.$auth.service_key);
    },
    async selectRow(args) {
      const client = await this._client();
      const {
        table,
        column,
        filter,
        value,
        orderBy,
        ascending = args.sortOrder === "ascending",
        max,
      } = args;
      const query = this.baseFilter(client, table, orderBy, ascending, max);
      if (filter) {
        const filterMethod = this[filter];
        filterMethod(query, column, value);
      }
      const { data } = await query;
      return data;
    },
    baseFilter(client, table, orderBy, ascending, max) {
      return client
        .from(table)
        .select()
        .order(orderBy, {
          ascending,
        })
        .limit(max);
    },
    equalTo(obj, column, value) {
      return obj
        .eq(column, value);
    },
    notEqualTo(obj, column, value) {
      return obj
        .neq(column, value);
    },
    greaterThan(obj, column, value) {
      return obj
        .gt(column, value);
    },
    greaterThanOrEqualTo(obj, column, value) {
      return obj
        .gte(column, value);
    },
    lessThan(obj, column, value) {
      return obj
        .lt(column, value);
    },
    lessThanOrEqualTo(obj, column, value) {
      return obj
        .lte(column, value);
    },
    patternMatch(obj, column, value) {
      return obj
        .like(column, `%${value}%`);
    },
    patternMatchCaseInsensitive(obj, column, value) {
      return obj
        .ilike(column, `%${value}%`);
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
