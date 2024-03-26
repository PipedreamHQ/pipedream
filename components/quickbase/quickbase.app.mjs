import { axios } from "@pipedream/platform";
import constants from "./common/constants.mjs";

export default {
  type: "app",
  app: "quickbase",
  propDefinitions: {
    appId: {
      type: "string",
      label: "App ID",
      description: "The ID of an app. If the URL from your app dashboard starts with \"https://domain.quickbase.com/db/123456\", then the app ID is `123456`",
    },
    tableId: {
      type: "string",
      label: "Table ID",
      description: "The ID of the table",
      async options({ appId }) {
        const tables = await this.listTables({
          params: {
            appId,
          },
        });
        return tables?.map(({
          id: value, name: label,
        }) => ({
          value,
          label,
        })) || [];
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to update or delete",
      async options({
        appId, tableId, page,
      }) {
        const { keyFieldId } = await this.getTable({
          tableId,
          params: {
            appId,
          },
        });
        const { data } = await this.listRecords({
          data: {
            from: tableId,
            select: [
              keyFieldId,
            ],
            options: {
              top: constants.DEFAULT_LIMIT,
              skip: page * constants.DEFAULT_LIMIT,
            },
          },
        });
        return data?.map((record) => record[keyFieldId]) || [];
      },
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.quickbase.com/v1";
    },
    _makeRequest(opts = {}) {
      const {
        $ = this,
        path,
        ...otherOpts
      } = opts;
      return axios($, {
        ...otherOpts,
        url: `${this._baseUrl()}${path}`,
        headers: {
          "QB-Realm-Hostname": `${this.$auth.hostname}`,
          "User-Agent": "@PipedreamHQ/pipedream v0.1",
          "Authorization": `QB-USER-TOKEN ${this.$auth.user_token}`,
          "Content-Type": "application/json",
        },
      });
    },
    getTable({
      tableId, ...opts
    }) {
      return this._makeRequest({
        path: `/tables/${tableId}`,
        ...opts,
      });
    },
    listTables(opts = {}) {
      return this._makeRequest({
        path: "/tables",
        ...opts,
      });
    },
    listFields(opts = {}) {
      return this._makeRequest({
        path: "/fields",
        ...opts,
      });
    },
    listRecords(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/records/query",
        ...opts,
      });
    },
    createOrUpdateRecord(opts = {}) {
      return this._makeRequest({
        method: "POST",
        path: "/records",
        ...opts,
      });
    },
    deleteRecord(opts = {}) {
      return this._makeRequest({
        method: "DELETE",
        path: "/records",
        ...opts,
      });
    },
    async *paginate({
      resourceFn,
      args,
      max,
    }) {
      let total, count = 0;
      args = {
        ...args,
        data: {
          ...args.data,
          options: {
            top: constants.DEFAULT_LIMIT,
            skip: 0,
          },
        },
      };
      do {
        const { data } = await resourceFn(args);
        if (!data) {
          return;
        }
        for (const item of data) {
          yield item;
          count++;
          if (max && count >= max) {
            return;
          }
        }
        total = data?.length;
        args.data.options.skip += args.data.options.top;
      } while (total === args.data.options.top);
    },
  },
};
