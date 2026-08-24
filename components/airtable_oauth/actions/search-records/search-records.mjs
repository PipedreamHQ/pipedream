import { ConfigurationError } from "@pipedream/platform";
import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";
import {
  escapeFormulaString, fieldTypeToPropType, parseBooleanValue,
} from "../../common/utils.mjs";

export default {
  key: "airtable_oauth-search-records",
  name: "Search Records",
  description: "Search for records in a table, either by matching a single field against a value or by evaluating an Airtable formula. Set `Search Field` and `Search Value` for the simple case — text fields match on substring, while checkbox and number fields match on equality. Set `Search Formula` instead for anything more complex, such as combining conditions or comparing dates, e.g. `AND({Status} = 'Open', {Priority} > 2)`. Set one or the other, not both. Returns every matching record, so use `Search Formula` to narrow large tables. [See the documentation](https://airtable.com/developers/web/api/list-records)",
  version: "1.0.0",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    fieldName: {
      propDefinition: [
        airtable,
        "fieldName",
        ({
          baseId, tableId,
        }) => ({
          baseId: baseId?.value ?? baseId,
          tableId: tableId?.value ?? tableId,
        }),
      ],
      description: "The field to match against `Search Value`, e.g. `Status`. Must match a field name in the selected table exactly — use **List Tables** to retrieve the table's fields. Requires `Search Value`.",
      optional: true,
    },
    value: {
      type: "string",
      label: "Search Value",
      description: "The value to match against `Search Field`, e.g. `Open`. Text fields match records containing this value anywhere in the field; number and checkbox fields match exactly. For a checkbox field use `true` or `false`. Requires `Search Field`.",
      optional: true,
    },
    searchFormula: {
      type: "string",
      label: "Search Formula",
      description: "An [Airtable formula](https://support.airtable.com/docs/formula-field-reference) evaluated against each record; records for which it returns a truthy value are included. Wrap field names in braces, e.g. `FIND('test-1', {Tags})` or `AND({Status} = 'Open', {Priority} > 2)`. Use this instead of `Search Field` and `Search Value`.",
      optional: true,
    },
    returnFieldsByFieldId: {
      propDefinition: [
        airtable,
        "returnFieldsByFieldId",
      ],
    },
  },
  methods: {
    async listFields() {
      const { tables } = await this.airtable.listTables({
        baseId: this.baseId?.value ?? this.baseId,
      });
      const table = tables.find(({ id }) => id === (this.tableId?.value ?? this.tableId));
      return table?.fields ?? [];
    },
    buildFilterFormula(fieldType) {
      const fieldRef = `{${this.fieldName}}`;

      switch (fieldTypeToPropType(fieldType)) {
      case "boolean":
        return `${fieldRef} = ${parseBooleanValue(this.value)
          ? 1
          : 0}`;
      case "integer": {
        const numericValue = Number(this.value);
        if (!Number.isFinite(numericValue)) {
          throw new ConfigurationError(`\`Search Value\` must be a number to search the field "${this.fieldName}".`);
        }
        return `${fieldRef} = ${numericValue}`;
      }
      case "string":
        return `FIND("${escapeFormulaString(this.value)}", ${fieldRef})`;
      default:
        return `${fieldRef} = "${escapeFormulaString(this.value)}"`;
      }
    },
  },
  async run({ $ }) {
    const hasFormula = Boolean(this.searchFormula);
    const hasValue = this.value !== undefined && this.value !== null;

    if (hasFormula && (this.fieldName || hasValue)) {
      throw new ConfigurationError("Set either `Search Formula` or `Search Field` and `Search Value`, not both.");
    }
    if (!hasFormula && !this.fieldName && !hasValue) {
      throw new ConfigurationError("Set `Search Field` and `Search Value` to search by field value, or `Search Formula` to search with an Airtable formula.");
    }
    if (!hasFormula && (!this.fieldName || !hasValue)) {
      throw new ConfigurationError("`Search Field` and `Search Value` must both be set to search by field value.");
    }

    let filterByFormula = this.searchFormula;
    if (!filterByFormula) {
      const fields = await this.listFields();
      const field = fields.find(({ name }) => name === this.fieldName);
      if (!field) {
        throw new ConfigurationError(`Could not find a field named "${this.fieldName}" in the selected table. Use **List Tables** to see the available fields.`);
      }
      filterByFormula = this.buildFilterFormula(field.type);
    }

    const results = await this.airtable.listRecords({
      baseId: this.baseId?.value ?? this.baseId,
      tableId: this.tableId?.value ?? this.tableId,
      params: {
        filterByFormula,
        returnFieldsByFieldId: this.returnFieldsByFieldId || false,
      },
    });

    $.export("$summary", `Found ${results.length} record${results.length === 1
      ? ""
      : "s"}.`);

    return results;
  },
};
