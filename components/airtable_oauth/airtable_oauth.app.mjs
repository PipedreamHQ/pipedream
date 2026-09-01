// x-pd-ai: optimized
import Airtable from "airtable";
import { axios } from "@pipedream/platform";
import { SORT_DIRECTION_OPTIONS } from "./common/constants.mjs";
import isEmpty from "lodash.isempty";
import Bottleneck from "bottleneck";
const limiter = new Bottleneck({
  minTime: 250, // 4 requests per second
  maxConcurrent: 1,
});
const axiosRateLimiter = limiter.wrap(axios);

export default {
  type: "app",
  app: "airtable_oauth",
  propDefinitions: {
    baseId: {
      type: "string",
      label: "Base",
      description: "The ID of the base to use, e.g. `appXXXXXXXXXXXXXX`. Use **List Bases** to look one up.",
    },
    tableId: {
      type: "string",
      label: "Table",
      description: "The ID of the table to use, e.g. `tblXXXXXXXXXXXXXX`. Use **List Tables** to look one up.",
    },
    viewId: {
      type: "string",
      label: "View",
      description: "The ID of the view to use, e.g. `viwXXXXXXXXXXXXXX`. Use **List Tables** to look up a table's views.",
    },
    sortFieldId: {
      type: "string",
      label: "Sort by Field",
      description: "Optionally provide a field ID to sort results by, e.g. `fldXXXXXXXXXXXXXX`. Use **List Tables** to look up a table's field IDs. To sort by multiple fields, use `Filter by Formula` instead.",
      optional: true,
    },
    fieldName: {
      type: "string",
      label: "Search Field",
      description: "The name of the field to match against the search value, e.g. `Status`. Use the **List Tables** action to look up a table's field names.",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "The ID of the record to operate on. IDs always start with `rec`, e.g. `recAbC123XyZ456`. Use **List Records** to look one up.",
    },
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "The ID of the comment to operate on. Use **List Comments** to look one up, or use the ID returned in the response of **Create Comment**.",
    },
    returnFieldsByFieldId: {
      type: "boolean",
      label: "Return Fields By ID",
      description: "If set to `true`, the returned field objects will have the field ID as the key, instead of the field name.",
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort: Direction",
      description: "If sorting by a field, which direction to sort by.",
      options: SORT_DIRECTION_OPTIONS,
      default: "desc",
      optional: true,
    },
    maxRecords: {
      type: "integer",
      label: "Max Records",
      description: "The maximum number of records to return. Leave blank to retrieve all records.",
      optional: true,
    },
    filterByFormula: {
      type: "string",
      label: "Filter by Formula",
      description: "Optionally provide a [formula (see info on the documentation)](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) used to filter records. The formula will be evaluated for each record, and if the result is not `0`, `false`, `\"\"`, `NaN`, `[]`, or `#Error!` the record will be included in the response. For example, to only include records where `Name` isn't empty, use `NOT({Name} = '')`.",
      optional: true,
    },
    records: {
      type: "string[]",
      label: "Records",
      description: "Each item in the array should be an object in JSON format, representing a new record. The keys are the column names and the corresponding values are the data to insert.",
    },
    typecast: {
      type: "boolean",
      label: "Typecast",
      description: "The Airtable API will perform best-effort automatic data conversion from string values if the typecast parameter is `True`. This is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources.",
      optional: true,
    },
    record: {
      type: "object",
      label: "Record",
      description: "An object keyed by Airtable field name, where each value is the data to write to that field, e.g. `{ \"Name\": \"Acme\", \"Stage\": \"Won\" }`. Include at least one writable field, and any number of the table's other fields. Use **List Tables** to look up a table's field names and types. Computed fields (formula, rollup, count, autonumber, created time, created by, last modified time and last modified by) cannot be written to. Enable `Typecast` when supplying human-readable values such as select option names or date strings. You may also use a custom expression.",
    },
    customExpressionInfo: {
      type: "alert",
      alertType: "info",
      content: `A custom expression can be a JSON object with key/value pairs representing columns and values, e.g. \`{{ { "foo": "bar", "id": 123 } }}\`.
\\
You can also reference an object exported by a previous step, e.g. \`{{steps.foo.$return_value}}\`.`,
    },
  },
  methods: {
    base(baseId) {
      return new Airtable({
        apiKey: this.$auth.oauth_access_token,
      }).base(baseId);
    },
    _baseUrl() {
      return "https://api.airtable.com/v0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.oauth_access_token}`,
      };
    },
    async _makeRequest({
      $ = this,
      path,
      rateLimited = true,
      ...args
    }) {
      const config = {
        url: `${this._baseUrl()}${path}`,
        headers: this._headers(),
        ...args,
      };
      return rateLimited
        ? axiosRateLimiter($, config)
        : axios($, config);
    },
    getRecord({
      baseId,
      tableId,
      recordId,
      opts = {},
    }) {
      return this._makeRequest({
        method: "GET",
        path: `/${baseId}/${tableId}/${recordId}`,
        params: opts,
      });
    },
    listBases(args = {}) {
      return this._makeRequest({
        path: "/meta/bases",
        ...args,
      });
    },
    listTables({
      baseId, ...args
    }) {
      return this._makeRequest({
        path: `/meta/bases/${baseId}/tables`,
        ...args,
      });
    },
    async listRecords({
      baseId, tableId, params = {},
    }) {
      const base = this.base(baseId);
      const data = [];

      try {
        await base(tableId).select({
          ...params,
        })
          .eachPage(function page(records, fetchNextPage) {
            records.forEach(function(record) {
              data.push(record._rawJson);
            });
            fetchNextPage();
          });
        return data;

      } catch (err) {
        this.throwFormattedError(err);
      }
    },
    listComments({
      baseId, tableId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}/comments`,
        ...args,
      });
    },
    createRecord({
      baseId, tableId, data, opts,
    }) {
      const base = this.base(baseId);
      return base(tableId).create(data, opts);
    },
    createTable({
      baseId, ...args
    }) {
      return this._makeRequest({
        path: `/meta/bases/${baseId}/tables`,
        method: "POST",
        ...args,
      });
    },
    createField({
      baseId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `/meta/bases/${baseId}/tables/${tableId}/fields`,
        method: "POST",
        ...args,
      });
    },
    createComment({
      baseId, tableId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}/comments`,
        method: "POST",
        ...args,
      });
    },
    updateRecord({
      baseId, tableId, recordId, data, opts,
    }) {
      const base = this.base(baseId);
      return base(tableId).update(recordId, data, opts);
    },
    updateTable({
      baseId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `/meta/bases/${baseId}/tables/${tableId}`,
        method: "PATCH",
        ...args,
      });
    },
    updateField({
      baseId, tableId, fieldId, ...args
    }) {
      return this._makeRequest({
        path: `/meta/bases/${baseId}/tables/${tableId}/fields/${fieldId}`,
        method: "PATCH",
        ...args,
      });
    },
    updateComment({
      baseId, tableId, recordId, commentId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}/comments/${commentId}`,
        method: "PATCH",
        ...args,
      });
    },
    deleteRecord({
      baseId, tableId, recordId,
    }) {
      const base = this.base(baseId);
      return base(tableId).destroy(recordId);
    },
    throwFormattedError(err) {
      const errorType = err.error ?? err.response?.data?.error?.type;
      const statusCode = err.statusCode ?? err.response?.status;
      const message = err.response?.data?.error?.message ?? err.message;
      throw Error(`${errorType} - ${statusCode} - ${message}`);
    },
    validateRecord(record) {
      if (typeof record !== "object") {
        throw new Error("Airtable record isn't an object");
      }
      if (Array.isArray(record)) {
        throw new Error("Airtable record is an array. Please pass an object, instead.");
      }
      if (isEmpty(record)) {
        throw new Error("Airtable record data is empty");
      }
    },
    validateRecordID(recordID) {
      if (!recordID) {
        throw new Error("Airtable record ID blank. Please pass a valid record ID");
      }
      if (!recordID.startsWith("rec")) {
        throw new Error("Invalid Record ID. See documentation about Finding Airtable record IDs - https://support.airtable.com/docs/finding-airtable-record-ids.");
      }
    },
    createWebhook({
      baseId, ...opts
    }) {
      return this._makeRequest({
        method: "POST",
        path: `/bases/${baseId}/webhooks`,
        ...opts,
      });
    },
    deleteWebhook({
      baseId, webhookId,
    }) {
      return this._makeRequest({
        method: "DELETE",
        path: `/bases/${baseId}/webhooks/${webhookId}`,
      });
    },
    listWebhookPayloads({
      baseId, webhookId, ...opts
    }) {
      return this._makeRequest({
        path: `/bases/${baseId}/webhooks/${webhookId}/payloads`,
        ...opts,
      });
    },
  },
};
