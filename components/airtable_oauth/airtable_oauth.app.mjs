import { ConfigurationError } from "@pipedream/platform";
import { fieldTypeToPropType } from "./common/utils.mjs";
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
      description: "The base ID",
      async options({ prevContext }) {
        const params = {};
        if (prevContext?.newOffset) {
          params.offset = prevContext.newOffset;
        }
        const {
          bases, offset,
        } = await this.listBases({
          params,
        });
        const options = (bases ?? []).map((base) => ({
          label: base.name || base.id,
          value: base.id,
        }));
        return {
          options,
          context: {
            newOffset: offset,
          },
        };
      },
    },
    tableId: {
      type: "string",
      label: "Table",
      description: "The table ID. If referencing a **Base** dynamically using data from another step (e.g., `{{steps.trigger.event.metadata.baseId}}`), you will not be able to select from the list of Tables, and automatic table options will not work when configuring this step. Please enter a custom expression to specify the **Table**.",
      async options({ baseId }) {
        let tables;
        try {
          tables  = (await this.listTables({
            baseId,
          })).tables;
        } catch (err) {
          throw new ConfigurationError(`Could not find tables for base ID "${baseId}"`);
        }
        return (tables ?? []).map((table) => ({
          label: table.name || table.id,
          value: table.id,
        }));
      },
    },
    viewId: {
      type: "string",
      label: "View",
      description: "The view ID. If referencing a **Table** dynamically using data from another step (e.g., `{{steps.trigger.event.metadata.tableId}}`), you will not be able to select from the list of Views for this step. Please enter a custom expression to specify the **View**.",
      async options({
        baseId, tableId,
      }) {
        let views;
        try {
          const { tables } = await this.listTables({
            baseId,
          });
          const table = tables.find(({ id }) => id === tableId);
          views = table.views;
        } catch (err) {
          throw new ConfigurationError(`Could not find views for base ID "${baseId}"`);
        }
        return (views ?? []).map((view) => ({
          label: view.name || view.id,
          value: view.id,
        }));
      },
    },
    sortFieldId: {
      type: "string",
      label: "Sort: Field",
      description: "Optionally select a field to sort results. To sort by multiple fields, use the **Filter by Forumla** field. If referencing a **Table** dynamically using data from another step (e.g., `{{steps.mydata.$return_value}}`), automatic field options won't work when configuring this step. Please enter a custom expression to specify the **Sort: Field**.",
      optional: true,
      async options({
        baseId, tableId,
      }) {
        let fields;
        try {
          const { tables } = await this.listTables({
            baseId,
          });
          const table = tables.find(({ id }) => id === tableId);
          fields = table.fields;
        } catch (err) {
          throw new ConfigurationError(`Could not find fields for table ID "${tableId}"`);
        }
        return (fields ?? []).map((field) => ({
          label: field.name || field.id,
          value: field.id,
        }));
      },
    },
    fieldName: {
      type: "string",
      label: "Search Field",
      description: "The field to match against the search value",
      async options({
        baseId, tableId, fieldType,
      }) {
        let fields;
        try {
          const { tables } = await this.listTables({
            baseId,
          });
          const table = tables.find(({ id }) => id === tableId);
          fields = table.fields;
          if (fieldType) {
            fields = fields.filter(({ type }) => fieldTypeToPropType(type) === fieldType);
          }
        } catch (err) {
          throw new ConfigurationError(`Could not find fields for table ID "${tableId}"`);
        }
        return (fields ?? []).map((field) => field.name);
      },
    },
    recordId: {
      type: "string",
      label: "Record ID",
      description: "Identifier of a record",
      async options({
        baseId, tableId, prevContext,
      }) {
        const params = {};
        if (prevContext?.newOffset) {
          params.offset = prevContext.newOffset;
        }
        const {
          records, offset,
        } = await this.listRecords({
          baseId,
          tableId,
          params,
        });
        const options = (records ?? []).map((record) => ({
          label: record.fields?.Name || record.id,
          value: record.id,
        }));
        return {
          options,
          context: {
            newOffset: offset,
          },
        };
      },
    },
    commentId: {
      type: "string",
      label: "Comment ID",
      description: "Identifier of a comment",
      async options({
        baseId, tableId, recordId, prevContext,
      }) {
        const params = {};
        if (prevContext?.newOffset) {
          params.offset = prevContext.newOffset;
        }
        const {
          comments, offset,
        } = await this.listComments({
          baseId,
          tableId,
          recordId,
          params,
        });
        const options = (comments ?? []).map((comment) => ({
          label: comment.text,
          value: comment.id,
        }));
        return {
          options,
          context: {
            newOffset: offset,
          },
        };
      },
    },
    returnFieldsByFieldId: {
      type: "boolean",
      label: "Return Fields By Field ID",
      description: "An optional boolean value that lets you return field objects where the key is the field id. This defaults to `false`, which returns field objects where the key is the field name.",
      optional: true,
    },
    sortDirection: {
      type: "string",
      label: "Sort: Direction",
      description: "This field will be ignored if you don't select a field to sort by.",
      options: SORT_DIRECTION_OPTIONS,
      default: "desc",
      optional: true,
    },
    maxRecords: {
      type: "integer",
      label: "Max Records",
      description: "Optionally limit the maximum number of records to return. Leave blank to retrieve all records.",
      optional: true,
    },
    filterByFormula: {
      type: "string",
      label: "Filter by Formula",
      description: "Optionally provide a [formula](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) used to filter records. The formula will be evaluated for each record, and if the result is not `0`, `false`, `\"\"`, `NaN`, `[]`, or `#Error!` the record will be included in the response. For example, to only include records where `Name` isn't empty, pass `NOT({Name} = '')`.",
      optional: true,
    },
    records: {
      type: "string",
      label: "Records",
      description: "Provide an array of objects. Each object should represent a new record with the column name as the key and the data to insert as the corresponding value (e.g., passing `[{\"foo\":\"bar\",\"id\":123},{\"foo\":\"baz\",\"id\":456}]` will create two records and with values added to the fields `foo` and `id`). The most common pattern is to reference an array of objects exported by a previous step (e.g., `{{steps.foo.$return_value}}`). You may also enter or construct a string that will `JSON.parse()` to an array of objects.",
    },
    typecast: {
      type: "boolean",
      label: "Typecast",
      description: "The Airtable API will perform best-effort automatic data conversion from string values if the typecast parameter is `True`. Automatic conversion is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources.",
      optional: true,
    },
    record: {
      type: "object",
      label: "Record",
      description: "Enter the column name for the key and the corresponding column value. You can include all, some, or none of the field values. You may also pass a JSON object as a custom expression with key/value pairs representing columns and values (e.g., `{{ {\"foo\":\"bar\",\"id\":123} }}`). A common pattern is to reference an object exported by a previous step (e.g., `{{steps.foo.$return_value}}`).",
    },
  },
  methods: {
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
      baseId, tableId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}`,
        ...args,
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
    listRecords({
      baseId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}`,
        ...args,
      });
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
      baseId, tableId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}`,
        method: "POST",
        ...args,
      });
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
      baseId, tableId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}`,
        method: "PATCH",
        ...args,
      });
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
      baseId, tableId, recordId, ...args
    }) {
      return this._makeRequest({
        path: `/${baseId}/${tableId}/${recordId}`,
        method: "DELETE",
        ...args,
      });
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
