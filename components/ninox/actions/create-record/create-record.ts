import ninox from "../../app/ninox.app";
import { defineAction } from "@pipedream/types";

export default defineAction({
  name: "Create Record",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  key: "ninox-create-record",
  description: "Creates a record. [See docs here](https://docs.ninox.com/en/api/private-cloud-apis#create-update-multiple-records-with-post)",
  type: "action",
  props: {
    ninox,
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
          fields: typeof this.fields === "string"
            ? JSON.parse(this.fields)
            : this.fields,
        },
      ],
    });

    if (response) {
      $.export("$summary", `Successfully created record with id ${response[0].id}`);
    }

    return response;
  },
});
