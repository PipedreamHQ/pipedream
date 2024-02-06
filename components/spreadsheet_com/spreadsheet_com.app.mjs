import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/utils.mjs";

export default {
  type: "app",
  app: "spreadsheet_com",
  propDefinitions: {
    columnId: {
      type: "string",
      label: "Column Id",
      description: "Unique column identifier in the worksheet.",
      async options({
        page, worksheetId,
      }) {
        const { items } = await this.listColumns({
          worksheetId,
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return items.map(({ field }) => field);
      },
    },
    workbookId: {
      type: "string",
      label: "Workbook Id",
      description: "ID of the workbook.",
      async options({ page }) {
        const { items } = await this.listWorkbooks({
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return items.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
    worksheetId: {
      type: "string",
      label: "Worksheet Id",
      description: "ID of the worksheet.",
      async options({
        page, workbookId,
      }) {
        const { items } = await this.listWorksheets({
          workbookId,
          params: {
            limit: LIMIT,
            offset: LIMIT * page,
          },
        });

        return items.map(({
          _id: value, name: label,
        }) => ({
          label,
          value,
        }));
      },
    },
  },
  methods: {
    _apiUrl() {
      return "https://api.spreadsheet.com/v1";
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.api_key}`,
        "Content-Type": "application/json",
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      const config = {
        url: `${this._apiUrl()}/${path}`,
        headers: this._getHeaders(),
        ...opts,
      };

      return axios($, config);
    },
    createRows({
      worksheetId, ...args
    }) {
      return this._makeRequest({
        method: "POST",
        path: `worksheets/${worksheetId}/rows`,
        ...args,
      });
    },
    updateRows({
      worksheetId, ...args
    }) {
      return this._makeRequest({
        method: "PUT",
        path: `worksheets/${worksheetId}/rows`,
        ...args,
      });
    },
    listColumns({
      worksheetId, ...args
    }) {
      return this._makeRequest({
        path: `worksheets/${worksheetId}/columns`,
        ...args,
      });
    },
    listRows({
      worksheetId, ...args
    }) {
      return this._makeRequest({
        path: `worksheets/${worksheetId}/rows`,
        ...args,
      });
    },
    listWorkbooks(args = {}) {
      return this._makeRequest({
        path: "workbooks",
        ...args,
      });
    },
    listWorksheets({
      workbookId, ...args
    }) {
      return this._makeRequest({
        path: `workbooks/${workbookId}/worksheets`,
        ...args,
      });
    },
    async *paginate({
      fn, params = {}, maxResults = null, ...args
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;

      do {
        params.limit = LIMIT;
        params.offset = LIMIT * page;
        page++;
        const {
          items,
          hasMore: hasMoreItems,
        } = await fn({
          params,
          ...args,
        });
        for (const d of items) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = hasMoreItems;

      } while (hasMore);
    },
  },
};
