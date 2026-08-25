import { ConfigurationError } from "@pipedream/platform";
import common from "../common/common.mjs";
import {
  escapeFormulaString, fieldTypeToPropType, getTableFields,
} from "../../common/utils.mjs";

export default {
  key: "airtable_oauth-search-records",
  name: "Search Records",
  description: "Find records in a table using an Airtable formula, or a **Search Field** + **Search Value** pair. **Search Formula** takes precedence when provided; otherwise, **Search Field** and **Search Value** must both be set. Use the **List Tables** action first to look up the table's field names. [See the documentation](https://airtable.com/developers/web/api/list-records)",
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
      description: "Use an [Airtable search formula (see info on the documentation)](https://support.airtable.com/docs/formula-field-reference) to find records. For example, if you want to find records with `Tags` including `test-1`, use `FIND('test-1', {Tags})`. Takes precedence over **Search Field** and **Search Value**.",
      optional: true,
    },
    fieldName: {
      type: "string",
      label: "Search Field",
      description: "The field to match against **Search Value**. Use together with **Search Value** as a simpler alternative to **Search Formula**. Use the **List Tables** action to look up a table's field names.",
      optional: true,
      async options() {
        const fields = await getTableFields(this);
        return fields.map(({ name }) => name);
      },
    },
    value: {
      type: "string",
      label: "Search Value",
      description: "The value to match against **Search Field**. For a checkbox field, use `true` or `false`.",
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
