import pipefy from "../../pipefy.app.mjs";
import constants from "../common/constants.mjs";

export default {
  key: "pipefy-update-table",
  name: "Update Table",
  description: "Updates a table. [See the docs here](https://api-docs.pipefy.com/reference/mutations/updateTableRecord/)",
  version: "0.1.3",
  annotations: {
    destructiveHint: true,
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
    name: {
      type: "string",
      label: "Name",
      description: "The new table name",
      optional: true,
    },
    icon: {
      type: "string",
      label: "Icon",
      description: "The new table icon",
      options: constants.ICON_OPTIONS,
      optional: true,
    },
    color: {
      type: "string",
      label: "Color",
      description: "The new table color",
      options: constants.TABLE_COLORS,
      optional: true,
    },
  },
  async run({ $ }) {
  /*
  Example query:

  mutation updateExistingTable{
    updateTable(
        input: {id: 301501717, description: "Updated Table" } ) {
            table{id name}
        }
      }

  */

    const { table } = await this.pipefy.getTable(this.table);
    const variables = {
      tableId: this.table,
      name: this.name || table.name,
      icon: this.icon || table.icon,
      color: this.color || table.color,
    };

    const response = await this.pipefy.updateTable(variables);
    $.export("$summary", "Successfully updatedTable");
    return response;
  },
};
