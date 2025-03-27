import airtable from "../../airtable_oauth.app.mjs";

export default {
  key: "airtable_oauth-create-table",
  name: "Create Table",
  description: "Create a new table. [See the documentation](https://airtable.com/developers/web/api/create-table)",
  version: "0.0.9",
  type: "action",
  props: {
    airtable,
    baseId: {
      propDefinition: [
        airtable,
        "baseId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the table",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the table",
      optional: true,
    },
    fields: {
      type: "string[]",
      label: "Fields",
      description: "A list of JSON objects representing the fields in the table. [See the documentation](https://airtable.com/developers/web/api/model/field-type) for supported field types, the write format for field options, and other specifics for certain field types.",
    },
  },
  async run({ $ }) {
    const fields = [];
    for (const field of this.fields) {
      const fieldObj = typeof field === "object"
        ? field
        : JSON.parse(field);
      fields.push(fieldObj);
    }
    const response = await this.airtable.createTable({
      baseId: this.baseId,
      data: {
        name: this.name,
        description: this.description,
        fields,
      },
      $,
    });

    if (response) {
      $.export("$summary", `Successfully created table with ID ${response.id}.`);
    }

    return response;
  },
};
