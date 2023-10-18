import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-search-records",
  name: "Search Records",
  description: "Searches for a record by field value. Search Field must accept string values. [See the documentation](https://airtable.com/developers/web/api/list-records)",
  version: "0.0.2",
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
          baseId: baseId.value,
          tableId: tableId.value,
          fieldType: "string",
        }),
      ],
    },
    value: {
      type: "string",
      label: "Search Value",
      description: "The value to search for",
    },
    searchFormula: {
      type: "string",
      label: "Search Formula",
      description: "Use an Airtable search formula to find records. Learn more on [Airtable's website](https://support.airtable.com/docs/formula-field-reference)",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      filterByFormula: `FIND("${this.value}", {${this.fieldName}})`,
    };
    if (this.searchFormula) {
      params.filterByFormula = `AND(${params.filterByFormula}, ${this.searchFormula})`;
    }
    const results = [];
    do {
      const {
        records, offset,
      } = await this.airtable.listRecords({
        baseId: this.baseId.value,
        tableId: this.tableId.value,
        params,
        $,
      });
      results.push(...records);
      params.offset = offset;
    } while (params.offset);

    $.export("$summary", `Found ${results.length} record${results.length === 1
      ? ""
      : "s"}.`);

    return results;
  },
};
