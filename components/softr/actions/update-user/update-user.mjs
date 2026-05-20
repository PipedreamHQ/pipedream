import softr from "../../softr.app.mjs";

export default {
  key: "softr-update-user",
  name: "Update User",
  description: "Updates an existing user record in a Softr database. [See the documentation](https://docs.softr.io/softr-api/softr-database-api/records/update-record)",
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
    fields: {
      type: "object",
      label: "Fields",
      description: "The fields to update on the user record. Provide key-value pairs where keys are field names and values are the new values.",
    },
  },
  async run({ $ }) {
    const response = await this.softr.updateRecord({
      $,
      databaseId: this.databaseId,
      tableId: this.tableId,
      recordId: this.recordId,
      data: {
        fields: this.fields,
      },
    });
    $.export("$summary", `Successfully updated record ${this.recordId} in table ${this.tableId}`);
    return response;
  },
};
