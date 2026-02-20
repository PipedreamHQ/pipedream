import { axios } from "@pipedream/platform";
import { LIMIT } from "./common/constants.mjs";

export default {
  type: "app",
  app: "kintone",
  propDefinitions: {
    appId: {
      type: "integer",
      label: "App ID",
      description: "The Kintone App ID",
      async options({ page }) {
        const { apps } = await this.getApps({
          params: {
            limit: LIMIT,
            offset: page * LIMIT,
          },
        });
        return apps.map((app) => ({
          label: app.name,
          value: parseInt(app.appId),
        }));
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The Record ID of the record to update. Use this OR `Update Key`, not both",
      async options({
        appId, page,
      }) {
        const { records } = await this.getRecords({
          params: {
            app: appId,
            query: `order by $id desc limit ${LIMIT} offset ${page * LIMIT}`,
          },
        });

        return records.map((record) => record.$id.value);
      },
    },
    record: {
      type: "object",
      label: "Record",
      description: `Field codes and values are specified in this object.
        \nThe values that can be specified vary depending on the type of field.
        \nIf ignored, the record will be added with default field values.
        \nIf field codes that don't exist are specified, these will be ignored.
        \nFor more information on field types, refer to the following article: [Field Types](https://kintone.dev/en/docs/kintone/overview/field-types/).
        \nExample: {"Text": {"value": "Sample"}, "Number": {"value": 1}}`,
    },
  },
  methods: {
    _getBaseUrl() {
      return `https://${this.$auth.subdomain}.kintone.com/k/v1`;
    },
    _getHeaders() {
      return {
        "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    _makeRequest({
      $ = this, path, ...opts
    }) {
      return axios($, {
        url: `${this._getBaseUrl()}${path}`,
        headers: this._getHeaders(),
        ...opts,
      });
    },
    getApps(opts = {}) {
      return this._makeRequest({
        path: "/apps.json",
        ...opts,
      });
    },
    addRecord(opts = {}) {
      return this._makeRequest({
        path: "/record.json",
        method: "POST",
        ...opts,
      });
    },
    updateRecord(opts = {}) {
      return this._makeRequest({
        path: "/record.json",
        method: "PUT",
        ...opts,
      });
    },
    addComment(opts = {}) {
      return this._makeRequest({
        path: "/record/comment.json",
        method: "POST",
        ...opts,
      });
    },
    getRecords(opts = {}) {
      return this._makeRequest({
        path: "/records.json",
        ...opts,
      });
    },
    async *paginate({
      fn, params = {}, query = "", maxResults = null, ...opts
    }) {
      let hasMore = false;
      let count = 0;
      let page = 0;
      let offset = 0;

      do {
        offset = page * LIMIT;
        if (offset >= 10100) return false;
        params.query = `${query} limit ${LIMIT} offset ${offset}`;
        page++;

        const { records } = await fn({
          params,
          ...opts,
        });
        for (const d of records) {
          yield d;

          if (maxResults && ++count === maxResults) {
            return count;
          }
        }

        hasMore = records.length === LIMIT;

      } while (hasMore);
    },
  },
};
