import common from "../common/rows.mjs";

export default {
  ...common,
  key: "seatable-update-row",
  name: "Update Row",
  description: "Updates an existing row in a specified table. [See the documentation](https://api.seatable.io/reference/update-row)",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    ...common.props,
    rowId: {
      propDefinition: [
        common.props.seatable,
        "rowId",
        (c) => ({
          tableName: c.tableName,
        }),
      ],
    },
  },
  async run({ $ }) {
    const {
      seatable,
      tableName,
      rowId,
      ...rowValues
    } = this;
    const response = await seatable.updateRow({
      $,
      baseUuid: await this.seatable.getBaseUuid({
        $,
      }),
      data: {
        table_name: tableName,
        row_id: rowId,
        row: {
          ...rowValues,
        },
      },
    });
    $.export("$summary", `Successfully updated row with ID ${this.rowId}`);
    return response;
  },
};
