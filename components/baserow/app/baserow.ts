import { defineApp } from "@pipedream/types";
import { axios } from "@pipedream/platform";
import {
  CreateRowParams,
  DeleteRowParams,
  GetRowParams,
  HttpRequestParams, ListRowsParams, PaginatedResponse, Row,
} from "../common/types";

export default defineApp({
  type: "app",
  app: "baserow",
  methods: {
    _apiKey(): string {
      return this.$auth.token;
    },
    _baseUrl() {
      return "https://api.baserow.io/api";
    },
    async _httpRequest({
      $ = this,
      ...args
    }: HttpRequestParams): Promise<object> {
      return axios($, {
        baseURL: this._baseUrl(),
        headers: {
          Authorization: `Token ${this._apiKey()}`,
        },
        ...args,
      });
    },
    async _paginatedRequest({
      params, ...args
    }: HttpRequestParams): Promise<object[]> {
      const requestParams = {
        ...params,
        size: 200,
      };
      const result = [];
      let page = 1;
      let nextRequest = null;

      do {
        const response: PaginatedResponse = await this._httpRequest({
          params: {
            ...requestParams,
            page: page++,
          },
          ...args,
        });
        result.push(...response.results);
        nextRequest = response.next;
      } while (nextRequest);

      return result;
    },
    async createRow({
      tableId, ...args
    }: CreateRowParams): Promise<Row> {
      return this._httpRequest({
        method: "POST",
        url: `/database/rows/table/${tableId}/`,
        ...args,
      });
    },
    async deleteRow({
      rowId, tableId, ...args
    }: DeleteRowParams): Promise<Row> {
      return this._httpRequest({
        method: "DELETE",
        url: `/database/rows/table/${tableId}/${rowId}/`,
        ...args,
      });
    },
    async getRow({
      rowId, tableId, ...args
    }: GetRowParams): Promise<Row> {
      return this._httpRequest({
        url: `/database/rows/table/${tableId}/${rowId}/`,
        ...args,
      });
    },
    async listRows({
      tableId, ...args
    }: ListRowsParams): Promise<Row[]> {
      return this._paginatedRequest({
        url: `/database/rows/table/${tableId}/`,
        ...args,
      });
    },
  },
  propDefinitions: {
    rowId: {
      label: "Row ID",
      description:
        "The id of the **row** on which to perform this action.",
      type: "integer",
    },
    tableId: {
      label: "Table ID",
      description:
        "The ID of the table to use. You can find your tables and their IDs on the [Baserow API Docs](https://baserow.io/api-docs).",
      type: "integer",
    },
    userFieldNames: {
      label: "User Field Names",
      description:
        "If **true**, field names returned will be the actual names of the fields. Otherwise, all returned field names will be `field_` followed by the id of the field. For example `field_1` refers to the field with an id of 1.",
      type: "boolean",
      optional: true,
    },
  },
});
