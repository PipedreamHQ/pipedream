import Airtable from "airtable";
import isEmpty from "lodash.isempty";
import { axios } from "@pipedream/platform";
import { SORT_DIRECTION_OPTIONS } from "./common/constants.mjs";
import Bottleneck from "bottleneck";
const limiter = new Bottleneck({
  minTime: 250, // 4 requests per second
  maxConcurrent: 1,
});
const axiosRateLimiter = limiter.wrap(axios);

export default {
  propDefinitions: {
    filterByFormula: {
      type: "string",
      label: "Filter by Formula",
      description: "Optionally provide a [formula](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) used to filter records. The formula will be evaluated for each record, and if the result is not `0`, `false`, `\"\"`, `NaN`, `[]`, or `#Error!` the record will be included in the response. For example, to only include records where `Name` isn't empty, pass `NOT({Name} = '')`.",
      optional: true,
    },
    maxRecords: {
      type: "integer",
      label: "Max Records",
      description: "Optionally limit the maximum number of records to return. Leave blank to retrieve all records.",
      optional: true,
    },
    record: {
      type: "object",
      label: "Record",
      description: "Enter the column name for the key and the corresponding column value. You can include all, some, or none of the field values. You may also pass a JSON object as a custom expression with key/value pairs representing columns and values (e.g., `{{ {\"foo\":\"bar\",\"id\":123} }}`). A common pattern is to reference an object exported by a previous step (e.g., `{{steps.foo.$return_value}}`).",
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "Enter a [record ID](https://support.airtable.com/hc/en-us/articles/360051564873-Record-ID) (eg. `recxxxxxxx`).",
    },
    records: {
      type: "string",
      label: "Records",
      description: "Provide an array of objects. Each object should represent a new record with the column name as the key and the data to insert as the corresponding value (e.g., passing `[{\"foo\":\"bar\",\"id\":123},{\"foo\":\"baz\",\"id\":456}]` will create two records and with values added to the fields `foo` and `id`). The most common pattern is to reference an array of objects exported by a previous step (e.g., `{{steps.foo.$return_value}}`). You may also enter or construct a string that will `JSON.parse()` to an array of objects.",
    },
    sortDirection: {
      type: "string",
      label: "Sort: Direction",
      description: "This field will be ignored if you don't select a field to sort by.",
      options: SORT_DIRECTION_OPTIONS,
      default: "desc",
      optional: true,
    },
    typecast: {
      type: "boolean",
      label: "Typecast",
      description: "The Airtable API will perform best-effort automatic data conversion from string values if the typecast parameter is `True`. Automatic conversion is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources.",
      optional: true,
    },
  },
  methods: {
    _baseUrl() {
      return "https://api.airtable.com/v0";
    },
    _headers() {
      return {
        Authorization: `Bearer ${this.$auth.api_key}`,
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
    getRecords({
      baseId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}`,
        ...args,
      });
    },
    base(baseId) {
      return new Airtable({
        apiKey: this.$auth.api_key,
      }).base(baseId);
    },
    throwFormattedError(err) {
      throw Error(`${err.error} - ${err.statusCode} - ${err.message}`);
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
  },
};
