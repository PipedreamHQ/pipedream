import Airtable from "airtable";
import isEmpty from "lodash.isempty";
import { ConfigurationError } from "@pipedream/platform";

export default {
  type: "app",
  app: "airtable",
  propDefinitions: {
    baseId: {
      type: "string",
      label: "Base",
      description: "The base ID",
      async options() {
        // Uses special .bases method on airtable app prop
        const bases = await this.bases();
        return (bases ?? []).map((base) => ({
          label: base.name || base.id,
          value: base.id,
        }));
      },
    },
    tableId: {
      type: "string",
      label: "Table",
      description: "The table ID. If referencing a **Base** dynamically using data from another step (e.g., `{{steps.mydata.$return_value}}`), automatic table options won't work when configuring this step. Please enter a custom expression to specify the **Table**.",
      async options({ baseId }) {
        // Uses special .tables method on airtable app prop
        let tables;
        try {
          tables = await this.tables(baseId?.value ?? baseId);
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
      description: "The view ID. If referencing a **Table** dynamically using data from another step (e.g., `{{steps.mydata.$return_value}}`), automatic view options won't work when configuring this step. Please enter a custom expression to specify the **View**.",
      async options({
        baseId, tableId,
      }) {
        let tableSchema;
        try {
          // Uses special .table method on airtable app prop
          tableSchema = await this.table(
            baseId?.value ?? baseId,
            tableId?.value ?? tableId,
          );
        } catch (err) {
          throw new ConfigurationError(`Could not find fields for table ID "${tableId}"`);
        }
        return (tableSchema?.views ?? []).map((view) => ({
          label: view.name || view.id,
          value: view.id,
        }));
      },
    },
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
      options: [
        {
          label: "Descending",
          value: "desc",
        },
        {
          label: "Ascending",
          value: "asc",
        },
      ],
      default: "desc",
      optional: true,
    },
    sortFieldId: {
      type: "string",
      label: "Sort: Field",
      description: "Optionally select a field to sort results. To sort by multiple fields, use the **Filter by Forumla** field. If referencing a **Table** dynamically using data from another step (e.g., `{{steps.mydata.$return_value}}`), automatic field options won't work when configuring this step. Please enter a custom expression to specify the **Sort: Field**.",
      optional: true,
      async options({
        baseId, tableId,
      }) {
        let tableSchema;
        try {
          // Uses special .table method on airtable app prop
          tableSchema = await this.table(
            baseId?.value ?? baseId,
            tableId?.value ?? tableId,
          );
        } catch (err) {
          throw new ConfigurationError(`Could not find views for table ID "${tableId}"`);
        }
        return (tableSchema?.fields ?? []).map((field) => ({
          label: field.name || field.id,
          value: field.id,
        }));
      },
    },
    typecast: {
      type: "boolean",
      label: "Typecast",
      description: "The Airtable API will perform best-effort automatic data conversion from string values if the typecast parameter is `True`. Automatic conversion is disabled by default to ensure data integrity, but it may be helpful for integrating with 3rd party data sources.",
    },
  },
  methods: {
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
    },
  },
};
