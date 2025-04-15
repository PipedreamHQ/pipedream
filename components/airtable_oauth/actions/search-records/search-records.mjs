import common from "../common/common.mjs";
import { fieldTypeToPropType } from "../../common/utils.mjs";

export default {
  key: "airtable_oauth-search-records",
  name: "Search Records",
  description: "Search for a record by formula or by field value. [See the documentation](https://airtable.com/developers/web/api/list-records)",
  version: "0.0.12",
  type: "action",
  props: {
    ...common.props,
    searchMethod: {
      type: "string",
      label: "Search Method",
      description: "Select the search method to use",
      options: [
        "Search by Field and Value",
        "Search by Formula",
      ],
      reloadProps: true,
    },
    returnFieldsByFieldId: {
      propDefinition: [
        common.props.airtable,
        "returnFieldsByFieldId",
      ],
    },
  },
  async additionalProps() {
    const props = {};
    if (this.searchMethod === "Search by Formula") {
      props.searchFormula = {
        type: "string",
        label: "Search Formula",
        description: "Use an [Airtable search formula (see info on the documentation)](https://support.airtable.com/docs/formula-field-reference) to find records. For example, if you want to find records with `Tags` including `test-1`, use `FIND('test-1', {Tags})`.",
        optional: true,
      };
    }
    if (this.searchMethod === "Search by Field and Value") {
      props.fieldName = {
        type: "string",
        label: "Search Field",
        description: "The field to match against the search value",
        reloadProps: true,
        options: async () => {
          const fields = await this.listFields();
          return fields.map((field) => field.name);
        },
      };
      if (this.fieldName) {
        const fields = await this.listFields();
        const { type } = fields.find(({ name }) => name === this.fieldName);
        props.value = {
          type: this.fieldTypeToPropType(type) || "string",
          label: "Search Value",
          description: "The value to search for",
        };
      }
    }
    return props;
  },
  methods: {
    ...common.methods,
    fieldTypeToPropType,
    async listFields() {
      const { tables } = await this.airtable.listTables({
        baseId: this.baseId.value,
      });
      const table = tables.find(({ id }) => id === this.tableId.value);
      return table.fields ?? [];
    },
  },
  async run({ $ }) {
    const fields = await this.listFields();
    const field = fields.find(({ name }) => name === this.fieldName);

    let filterByFormula = this.searchFormula;
    if (!this.searchFormula) {
      const type = fieldTypeToPropType(field.type);
      filterByFormula = type === "string"
        ? `FIND("${this.value}", {${this.fieldName}})`
        : type === "boolean"
          ? `${this.fieldName} = ${this.value
            ? 1
            : 0}`
          : type === "integer"
            ? `${this.fieldName} = ${this.value}`
            : `{${this.fieldName}} = "${this.value}"`;
    }

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
