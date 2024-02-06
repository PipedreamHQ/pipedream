import common from "../common/common.mjs";

export default {
  key: "airtable_oauth-create-field",
  name: "Create Field",
  description: "Create a new field in a table. [See the documentation](https://airtable.com/developers/web/api/create-field)",
  version: "0.0.3",
  type: "action",
  props: {
    ...common.props,
    field: {
      type: "string",
      label: "Field",
      description: "A JSON object representing the field. Refer to [field types](https://airtable.com/developers/web/api/model/field-type) for supported field types, the write format for field options, and other specifics for certain field types.",
    },
  },
  async run({ $ }) {
    const field = typeof this.field === "object"
      ? this.field
      : JSON.parse(this.field);
    const data = {
      ...field,
    };
    const response = await this.airtable.createField({
      baseId: this.baseId.value,
      tableId: this.tableId.value,
      data,
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created field with ID ${response.id}.`);
    }

    return response;
  },
};
