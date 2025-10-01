import keboola from "../../keboola.app.mjs";

export default {
  key: "keboola-update-table-name",
  name: "Update Table Name",
  description: "Update the name of a table. [See the documentation](https://keboola.docs.apiary.io/#reference/tables/manage-tables/table-update)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    keboola,
    bucketId: {
      propDefinition: [
        keboola,
        "bucketId",
      ],
    },
    tableId: {
      propDefinition: [
        keboola,
        "tableId",
        (c) => ({
          bucketId: c.bucketId,
        }),
      ],
      reloadProps: true,
    },
    displayName: {
      type: "string",
      label: "Display Name",
      description: "The new display name for the table",
    },
  },
  async additionalProps(props) {
    if (this.tableId) {
      const table = await this.keboola.getTableDetails({
        tableId: this.tableId,
      });
      props.displayName.default = table.displayName;
    }
    return {};
  },
  async run({ $ }) {
    const response = await this.keboola.updateTable({
      $,
      tableId: this.tableId,
      data: {
        displayName: this.displayName,
      },
    });
    $.export("$summary", `Successfully updated table name to ${this.displayName}`);
    return response;
  },
};
