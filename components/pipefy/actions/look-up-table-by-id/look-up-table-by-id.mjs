import pipefy from "../../pipefy.app.mjs";

export default {
  key: "pipefy-look-up-table-by-id",
  name: "Look Up Table by ID",
  description: "Looks up a database table by its ID. [See the docs here](https://api-docs.pipefy.com/reference/queries/#table)",
  version: "0.1.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    pipefy,
    organization: {
      propDefinition: [
        pipefy,
        "organization",
      ],
    },
    table: {
      propDefinition: [
        pipefy,
        "table",
        (c) => ({
          orgId: c.organization,
        }),
      ],
    },
  },
  async run({ $ }) {
  /*
  Example query:

  {
      table(id: 301501717) {
      name url
    }
  }
  */

    const response = await this.pipefy.getTable(this.table);
    $.export("$summary", "Successfully retrieved table");
    return response;
  },
};
