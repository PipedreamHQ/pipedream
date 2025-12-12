import { ConfigurationError } from "@pipedream/platform";
import { parseObject } from "../../common/utils.mjs";
import glide from "../../glide.app.mjs";

export default {
  key: "glide-add-rows",
  name: "Add Rows to Table",
  description: "Add new rows to a specified table. [See the documentation](https://apidocs.glideapps.com/api-reference/v2/tables/post-table-rows)",
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
    rows: {
      type: "string[]",
      label: "Rows",
      description: "Array of row objects to add. Each object should contain the column names as keys and their values.",
    },
  },
  async run({ $ }) {
    let rowsData = parseObject(this.rows);
    if (!Array.isArray(rowsData)) {
      throw new ConfigurationError("Rows data must be an array");
    }
    const response = await this.glide.addRows({
      $,
      tableId: this.tableId,
      data: rowsData,
    });

    const addedCount = rowsData.length;
    const plural = addedCount === 1
      ? ""
      : "s";
    $.export("$summary", `Successfully added ${addedCount} row${plural}`);
    return response;
  },
};

