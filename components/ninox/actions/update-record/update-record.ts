import ninox from "../../app/ninox.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Update Record",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "ninox-update-record",
  description: "Updates a record. [See docs here](https://docs.ninox.com/en/api/private-cloud-apis#create-update-multiple-records-with-post)",
  type: "action",
  props: {
    ninox,
    recordId: {
      label: "Record ID",
      description: "The record ID to be updated",
      type: "string",
    },
    teamId: {
      propDefinition: [
        ninox,
        "teamId",
      ],
    },
    databaseId: {
      propDefinition: [
        ninox,
        "databaseId",
        (c) => ({
          teamId: c.teamId,
        }),
      ],
    },
    tableId: {
      propDefinition: [
        ninox,
        "tableId",
        (c) => ({
          teamId: c.teamId,
          databaseId: c.databaseId,
        }),
      ],
    },
    fields: {
      label: "Fields",
      description: "Object to create an row in the table. E.g. `{ \"name\": \"Lucas Caresia\", \"age\": 23 }`",
      type: "object",
    },
  },
  async run({ $ }) {
    const response = await this.ninox.createRecord({
      $,
      teamId: this.teamId,
      databaseId: this.databaseId,
      tableId: this.tableId,
      data: [
        {
          id: this.recordId,
          fields: typeof this.fields === "string"
            ? JSON.parse(this.fields)
            : this.fields,
        },
      ],
    });

    if (response) {
      $.export("$summary", `Successfully updated record with id ${response[0].id}`);
    }

    return response;
  },
});
