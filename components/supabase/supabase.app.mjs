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
    verifyForErrors(resp) {
      if (resp.error) {
        throw new Error(JSON.stringify(resp, null, 2));
      }
    },
    async _client() {
      return createClient(`https://${this.$auth.subdomain}.supabase.co`, this.$auth.service_key);
    },
    retryWithExponentialBackoff(func, maxAttempts = 3, baseDelayS = 2) {
      let attempt = 0;
      const verifyForErrors = this.verifyForErrors;

      const execute = async () => {
        try {
          const resp = await func();
          verifyForErrors(resp);
          return resp;
        } catch (error) {
          if (attempt === maxAttempts - 1) {
            throw error;
          }

          const delayMs = Math.pow(baseDelayS, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delayMs));

          attempt++;
          return execute();
        }
      };

      return execute();
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
      const ctx = this;
      const resp = await this.retryWithExponentialBackoff(async () => {
        let query = ctx.baseFilter(client, table, orderBy, ascending, max);
        if (filter) {
          query = ctx[filter](query, column, value);
        }
        return await query;
      });
      return resp;
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
      const resp = await client
        .from(table)
        .insert(rowData)
        .select();
      this.verifyForErrors(resp);
      return resp;
    },
    async updateRow(table, column, value, rowData = {}) {
      const client = await this._client();
      const resp = await client
        .from(table)
        .update(rowData)
        .eq(column, value)
        .select();
      this.verifyForErrors(resp);
      return resp;
    },
    async upsertRow(table, rowData = {}) {
      const client = await this._client();
      const resp = await client
        .from(table)
        .upsert(rowData)
        .select();
      this.verifyForErrors(resp);
      return resp;
    },
    async deleteRow(table, column, value) {
      const client = await this._client();
      const resp = await client
        .from(table)
        .delete()
        .eq(column, value)
        .select();
      this.verifyForErrors(resp);
      return resp;
    },
    async remoteProcedureCall(functionName, args = {}) {
      const client = await this._client();
      const resp = await client.rpc(functionName, args);
      this.verifyForErrors(resp);
      return resp;
    },
    async countRows(args) {
      const client = await this._client();
      const {
        table,
        column,
        filter,
        value,
      } = args;
      const ctx = this;
      const resp = await this.retryWithExponentialBackoff(async () => {
        let query = client
          .from(table)
          .select("*", {
            count: "exact",
            head: true,
          });
        if (filter) {
          query = ctx[filter](query, column, value);
        }
        return await query;
      });
      return {
        count: resp.count,
        error: resp.error,
      };
    },
  },
};
