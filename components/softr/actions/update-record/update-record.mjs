import softr from "../../softr.app.mjs";

export default {
  key: "softr-update-record",
  name: "Update Record",
  description: "Update a record in a Softr database. [See the documentation](https://docs.softr.io/softr-api/softr-database-api/records/update-record)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    softr,
    databaseId: {
      propDefinition: [
        softr,
        "databaseId",
      ],
    },
    tableId: {
      propDefinition: [
        softr,
        "tableId",
      ],
    },
    recordId: {
      propDefinition: [
        softr,
        "recordId",
      ],
    },
    fieldNames: {
      propDefinition: [
        softr,
        "fieldNames",
      ],
    },
    fields: {
      type: "object",
      label: "Fields",
      description: "The fields to update on the record. Provide key-value pairs where keys are field IDs and values are the new values (e.g., `{ \"sulHm\": \"New Value\" }`).",
    },
  },
  async run({ $ }) {
    const response = await this.softr.updateRecord({
      $,
      databaseId: this.databaseId,
      tableId: this.tableId,
      recordId: this.recordId,
      params: {
        fieldNames: this.fieldNames,
      },
      data: {
        fields: typeof this.fields === "string"
          ? JSON.parse(this.fields)
          : this.fields,
      },
    });
    $.export("$summary", `Successfully updated record with ID ${this.recordId}`);
    return response;
  },
};
