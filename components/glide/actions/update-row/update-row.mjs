import { parseObject } from "../../common/utils.mjs";
import glide from "../../glide.app.mjs";

export default {
  key: "glide-update-row",
  name: "Update Row",
  description: "Update an existing row in a table. [See the documentation](https://apidocs.glideapps.com/api-reference/v2/tables/patch-update-row)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    glide,
    tableId: {
      propDefinition: [
        glide,
        "tableId",
      ],
    },
    rowId: {
      propDefinition: [
        glide,
        "rowId",
        ({ tableId }) => ({
          tableId,
        }),
      ],
    },
    rowData: {
      type: "object",
      label: "Row Data",
      description: "Object containing the column names as keys and their new values.",
    },
  },
  async run({ $ }) {
    const response = await this.glide.updateRow({
      $,
      tableId: this.tableId,
      rowId: this.rowId,
      data: parseObject(this.rowData),
    });

    $.export("$summary", `Successfully updated row ${this.rowId}`);
    return response;
  },
};

