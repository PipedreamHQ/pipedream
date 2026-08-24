import { ConfigurationError } from "@pipedream/platform";
import { getColumnOptions } from "../../common/utils.mjs";
import monday from "../../monday.app.mjs";

export default {
  key: "monday-list-columns",
  name: "List Columns",
  description: "List the columns of a board, including each column's ID, type, and the labels a `status` or `dropdown` column accepts. Use this to discover the column IDs and values required by **Create Item**, **Update Column Values** and **Get Items By Column Value**. [See the documentation](https://developer.monday.com/api-reference/reference/columns#queries)",
  type: "action",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    monday,
    boardId: {
      propDefinition: [
        monday,
        "boardId",
      ],
    },
  },
  async run({ $ }) {
    const columns = await this.monday.listColumns({
      boardId: +this.boardId,
    });

    if (!columns) {
      throw new ConfigurationError(`No columns found for board ${this.boardId}. Check that the board ID is correct and that the connected account can access it.`);
    }

    const results = columns.map(({
      id, title, type,
    }) => ({
      id,
      title,
      type,
      // Only status/dropdown columns carry labels; undefined for every other type.
      labels: getColumnOptions(columns, id, true),
    }));

    $.export("$summary", `Successfully retrieved ${results.length} column${results.length === 1
      ? ""
      : "s"}`);

    return results;
  },
};
