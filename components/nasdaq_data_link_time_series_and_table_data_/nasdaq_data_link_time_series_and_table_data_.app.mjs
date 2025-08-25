import { axios } from "@pipedream/platform";

export default {
  type: "app",
  app: "nasdaq_data_link_time_series_and_table_data_",
  propDefinitions: {
    publisher: {
      type: "string",
      label: "Publisher Code",
      description: "The publisher code (e.g., `MER`, `ETFG`, `AR`, `NDAQ`). This is the first part of the datatable code. If the code is `MER/F1`, then `MER` is the publisher code and `F1` is the table code.",
    },
    table: {
      type: "string",
      label: "Table Code",
      description: "The table code (e.g., `F1`, `FUND`, `MWCS`, `RTAT10`). This is the second part of the datatable code. If the code is `MER/F1`, then `F1` is the table code.",
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "Request data from specific columns. If you want to query for multiple columns, include the column names as array items",
      optional: true,
      async options({
        publisher, table,
      }) {
        if (!publisher || !table) {
          return [];
        }
        const { datatable: { columns } } = await this.tableMetadata({
          publisher,
          table,
        });
        return columns.map(({ name }) => name);
      },
    },
  },
  methods: {
    getUrl(path) {
      return `https://data.nasdaq.com/api/v3${path}`;
    },
    getHeaders(headers) {
      return {
        ...headers,
        "Accept": "application/json",
        "X-Api-Token": this.$auth.api_key,
      };
    },
    makeRequest({
      $ = this, path, headers, ...args
    } = {}) {
      return axios($, {
        ...args,
        url: this.getUrl(path),
        headers: this.getHeaders(headers),
      });
    },
    tableMetadata({
      publisher, table, ...args
    }) {
      return this.makeRequest({
        path: `/datatables/${publisher}/${table}/metadata.json`,
        ...args,
      });
    },
    tableData({
      publisher, table, ...args
    }) {
      return this.makeRequest({
        path: `/datatables/${publisher}/${table}.json`,
        ...args,
      });
    },
    async paginate({
      fn, args = {}, maxRequests = 3,
    } = {}) {
      let allData = [];
      let cursorId = null;
      let requestCount = 0;
      let hasMorePages = true;

      while (hasMorePages && requestCount < maxRequests) {
        const response = await fn({
          ...args,
          params: {
            ...args.params,
            "qopts.per_page": 100,
            ...(cursorId
              ? {
                "qopts.cursor_id": cursorId,
              }
              : undefined
            ),
          },
        });

        const pageData = response?.datatable?.data || [];
        allData = allData.concat(pageData);

        cursorId = response?.meta?.next_cursor_id;
        hasMorePages = !!cursorId;
        requestCount++;
      }

      return allData;
    },
  },
};
