import sqlstring from "sqlstring";
import constants from "./common/constants.mjs";
import utils from "./common/utils.mjs";

export default {
  type: "app",
  app: "appdrag",
  propDefinitions: {
    table: {
      type: "string",
      label: "Table Name",
      description: "The name of the table.",
      async options() {
        const { Table: tables } = await this.listTables();
        return tables?.map((obj) => {
          const [
            table,
          ] = Object.values(obj);
          return table;
        });
      },
    },
    columns: {
      type: "string[]",
      label: "Columns",
      description: "The name of the columns in the table. Eg. `[\"column1\", \"column2\"]`",
      async options({ table }) {
        if (!table) {
          return [];
        }
        const { Table: columns } = await this.listColumns({
          table,
        });
        return columns?.map(({ Field: column }) => column);
      },
    },
  },
  methods: {
    getHeaders(headers) {
      return {
        ...headers,
        "Content-Type": "application/x-www-form-urlencoded",
      };
    },
    getUrl(path) {
      return path
        ? constants.URL.FUNCTION
          .replace(constants.APP_ID_PLACEHOLDER, this.$auth.app_id)
          .replace(constants.FUNCTION_PLACEHOLDER, path)
        : constants.URL.BACKEND;
    },
    getAuthData(data) {
      const {
        api_key: apiKey,
        app_id: appId,
      } = this.$auth;
      return {
        ...data,
        appID: appId,
        APIKey: apiKey,
      };
    },
    async makeRequest({
      step = this, path, headers, data, params, method, ...args
    } = {}) {
      const {
        getHeaders,
        getUrl,
        getAuthData,
      } = this;

      const isGet = method === constants.HTTP_METHOD.GET || method === undefined;

      const response = await utils.callAxios({
        ...args,
        debug: true,
        step,
        method,
        url: getUrl(path),
        data: !isGet && getAuthData(data),
        params: isGet && getAuthData(params),
        headers: getHeaders(headers),
      });

      if (response?.error || parseInt(response?.affectedRows) === 0) {
        throw new Error(JSON.stringify(response, null, 2));
      }

      return response;
    },
    post(args = {}) {
      return this.makeRequest({
        ...args,
        method: "post",
      });
    },
    executeRawQuery({
      query, values = [], ...args
    } = {}) {
      return this.post({
        ...args,
        data: {
          ...args?.data,
          command: "CloudDBExecuteRawQuery",
          query: sqlstring.format(query, values),
        },
      });
    },
    getDataset(args = {}) {
      return this.post({
        ...args,
        data: {
          ...args?.data,
          command: "CloudDBGetDataset",
        },
      });
    },
    listTables(args = {}) {
      return this.getDataset({
        ...args,
        data: {
          ...args?.data,
          query: "show tables",
        },
      });
    },
    listColumns({
      table, ...args
    } = {}) {
      return this.getDataset({
        ...args,
        data: {
          ...args?.data,
          query: `show columns from ${table}`,
        },
      });
    },
  },
};
