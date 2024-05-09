import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "timetonic",
  propDefinitions: {
    bookCode: {
      type: "string",
      label: "Book Code",
      description: "The book code of the book",
      async options() {
        const { allBooks: { books } } = await this.listBooks();
        return books?.map(({
          b_c: value, ownerPrefs,
        }) => ({
          value,
          label: ownerPrefs?.title,
        })) || [];
      },
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table",
      async options({ bookCode }) {
        const { bookTables: { categories } } = await this.listTables({
          params: {
            b_c: bookCode,
          },
        });
        return categories?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    rowId: {
      type: "string",
      label: "Row ID",
      description: "The ID of the row",
      async options({ tableId }) {
        const { tableRows } = await this.listRows({
          params: {
            catId: tableId,
          },
        });
        return tableRows?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    fieldId: {
      type: "integer",
      label: "Field ID",
      description: "The ID of the field to search",
      async options({
        bookCode, tableId,
      }) {
        const { bookTables: { categories } } = await this.listTables({
          params: {
            b_c: bookCode,
            includeFields: true,
          },
        });
        const { fields } = categories.find(({ id }) => id === tableId);
        return fields?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    viewId: {
      type: "string",
      label: "View ID",
      description: "The ID of the view",
      async options({
        bookCode, tableId,
      }) {
        const { tableValues: { views } } = await this.getTableValues({
          params: {
            catId: tableId,
            b_c: bookCode,
          },
        });
        return views?.map(({
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
      return "https://timetonic.com/live/api.php";
    },
    _userId() {
      return this.$auth.user_id;
    },
    _makeRequest(opts = {}) {
      const {
        $ = this, req, params, ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        method: "POST",
        url: this._baseUrl(),
        params: {
          ...params,
          req,
          o_u: this._userId(),
          u_c: this._userId(),
          sesskey: this.$auth.api_key,
          b_o: this._userId(),
        },
      });
    },
    listBooks(opts = {}) {
      return this._makeRequest({
        req: "getAllBooks",
        ...opts,
      });
    },
    listTables(opts = {}) {
      return this._makeRequest({
        req: "getBookTables",
        ...opts,
      });
    },
    listRows(opts = {}) {
      return this._makeRequest({
        req: "listTableRowsById",
        ...opts,
      });
    },
    getTableValues(opts = {}) {
      return this._makeRequest({
        req: "getTableValues",
        ...opts,
      });
    },
    createOrUpdateRow(opts = {}) {
      return this._makeRequest({
        req: "createOrUpdateTableRow",
        ...opts,
      });
    },
    deleteRow(opts = {}) {
      return this._makeRequest({
        req: "deleteTableRow",
        ...opts,
      });
    },
    uploadFile(opts = {}) {
      return this._makeRequest({
        req: "fileUpload",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      params,
    }) {
      params = {
        ...params,
        maxRows: constants.DEFAULT_LIMIT,
        offset: 0,
      };
      let total;
      do {
        const { tableValues: { rows } } = await resourceFn({
          params,
        });
        for (const row of rows) {
          yield row;
        }
        total = rows?.length;
        params.offset += params.maxRows;
      } while (total === params.maxRows);
    },
  },
};
