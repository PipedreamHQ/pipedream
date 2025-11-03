import common from "../common/rows.mjs";

export default {
  ...common,
  key: "seatable-create-row",
  name: "Create Row",
  description: "Creates a new row in the specified table. [See the documentation](https://api.seatable.io/reference/add-row)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  async run({ $ }) {
    const {
      seatable,
      tableName,
      ...rowValues
    } = this;
    const response = await seatable.createRow({
      $,
      baseUuid: await this.seatable.getBaseUuid({
        $,
      }),
      data: {
        table_name: tableName,
        row: {
          ...rowValues,
        },
      },
    });
    $.export("$summary", `Successfully created row with ID ${response._id}`);
    return response;
  },
};
