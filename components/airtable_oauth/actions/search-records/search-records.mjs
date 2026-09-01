// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import common from "../common/common.mjs";
import {
  escapeFormulaString, fieldTypeToPropType, getTableFields,
} from "../../common/utils.mjs";

export default {
  key: "airtable_oauth-search-records",
  name: "Search Records",
  description: "Find records in a table using an Airtable formula, or a `Search Field` + `Search Value` pair. `Search Formula` takes precedence when provided; otherwise `Search Field` and `Search Value` must both be set. Use **List Tables** first to look up the table's field names. [See the documentation](https://airtable.com/developers/web/api/list-records)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    searchFormula: {
      type: "string",
      label: "Search Formula",
      description: "An [Airtable formula](https://support.airtable.com/docs/formula-field-reference) to filter records by, e.g. `FIND('test-1', {Tags})` to find records where `Tags` includes `test-1`, or `{Status} = \"Won\"` for an exact match. Takes precedence over `Search Field` + `Search Value` when set.",
      optional: true,
    },
    fieldName: {
      propDefinition: [
        common.props.airtable,
        "fieldName",
        ({
          baseId, tableId,
        }) => ({
          baseId: baseId?.value ?? baseId,
          tableId: tableId?.value ?? tableId,
        }),
      ],
      description: "The field to match against `Search Value`, e.g. `Status`. Use together with `Search Value` as a simpler alternative to `Search Formula`.",
      optional: true,
    },
    value: {
      type: "string",
      label: "Search Value",
      description: "The value to match against `Search Field`, e.g. `Won`. For a checkbox field, use `true` or `false`; for a number field, a numeric value.",
      optional: true,
    },
    returnFieldsByFieldId: {
      propDefinition: [
        common.props.airtable,
        "returnFieldsByFieldId",
      ],
    },
  },
  methods: {
    async buildFilterByFormula() {
      const fields = await getTableFields(this);
      const field = fields.find(({ name }) => name === this.fieldName);
      if (!field) {
        throw new ConfigurationError(`The selected table has no field named "${this.fieldName}". Use the List Tables action to look up the table's field names.`);
      }

      const type = fieldTypeToPropType(field.type);
      switch (type) {
      case "string":
        return `FIND("${escapeFormulaString(this.value)}", {${this.fieldName}})`;
      case "boolean": {
        const value = `${this.value}`.toLowerCase();
        if (value !== "true" && value !== "false") {
          throw new ConfigurationError(`Invalid value "${this.value}" for checkbox field "${this.fieldName}". Use \`true\` or \`false\`.`);
        }
        return `{${this.fieldName}} = ${value === "true"
          ? 1
          : 0}`;
      }
      case "integer": {
        const rawValue = `${this.value}`;
        const numericValue = Number(rawValue);
        if (rawValue.trim() === "" || !Number.isFinite(numericValue)) {
          throw new ConfigurationError(`Invalid value "${this.value}" for numeric field "${this.fieldName}". Use a number.`);
        }
        return `{${this.fieldName}} = ${numericValue}`;
      }
      default:
        return `{${this.fieldName}} = "${escapeFormulaString(this.value)}"`;
      }
    },
  },
  async run({ $ }) {
    const hasValue = this.value !== undefined && this.value !== null && this.value !== "";
    if (!this.searchFormula && !(this.fieldName && hasValue)) {
      throw new ConfigurationError("Provide either Search Formula, or both Search Field and Search Value.");
    }

    const filterByFormula = this.searchFormula || await this.buildFilterByFormula();

    const params = {
      filterByFormula,
      returnFieldsByFieldId: this.returnFieldsByFieldId || false,
    };

    const baseId = this.baseId?.value ?? this.baseId;
    const tableId = this.tableId?.value ?? this.tableId;

    const results = await this.airtable.listRecords({
      baseId,
      tableId,
      params,
    });

    $.export("$summary", `Found ${results.length} record${results.length === 1
      ? ""
      : "s"}.`);

    return results;
  },
};
