import { ConfigurationError } from "@pipedream/platform";
import common from "../common/common.mjs";
import {
  fieldTypeToPropType, getTableFields,
} from "../../common/utils.mjs";

export default {
  key: "airtable_oauth-search-records",
  name: "Search Records",
  description: "Search for a record by formula or by field value. [See the documentation](https://airtable.com/developers/web/api/list-records)",
  version: "0.1.0",
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
        return `FIND("${this.value}", {${this.fieldName}})`;
      case "boolean":
        return `{${this.fieldName}} = ${`${this.value}`.toLowerCase() === "true"
          ? 1
          : 0}`;
      case "integer":
        return `{${this.fieldName}} = ${this.value}`;
      default:
        return `{${this.fieldName}} = "${this.value}"`;
      }
    },
  },
  async run({ $ }) {
    if (!this.searchFormula && !(this.fieldName && this.value)) {
      throw new ConfigurationError("Provide either Search Formula, or both Search Field and Search Value.");
    }

    const filterByFormula = this.searchFormula ?? await this.buildFilterByFormula();

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
