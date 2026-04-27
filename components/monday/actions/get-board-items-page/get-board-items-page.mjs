import common from "../common/column-values.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "monday-get-board-items-page",
  name: "Get Board Items Page",
  description: "Retrieves all items from a board. [See the documentation](https://developer.monday.com/api-reference/reference/items-page)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    ...common.props,
    queryParams: {
      type: "string",
      label: "Query Params",
      description: "A JSON object containing parameters to filter, sort, and control the scope of the query. [See the documentation](https://developer.monday.com/api-reference/reference/items-page-other-types#itemsquery)\n\n"
        + "Example:\n"
        + "```json\n"
        + "{\n"
        + "  \"rules\": [\n"
        + "    {\n"
        + "      \"column_id\": \"name\",\n"
        + "      \"compare_value\": \"test\",\n"
        + "      \"operator\": \"is_not_empty\"\n"
        + "    }\n"
        + "  ]\n"
        + "}\n"
        + "```",
      optional: true,
    },
  },
  async run({ $ }) {
    let queryParams;
    if (this.queryParams) {
      try {
        queryParams = JSON.parse(this.queryParams);
      } catch (error) {
        throw new ConfigurationError(`Invalid query params: ${error.message}`);
      }
    }

    const args = {
      boardId: +this.boardId,
    };
    if (queryParams) {
      args.query_params = queryParams;
    }

    const response = await this.monday.listBoardItemsPage(args);

    if (response.errors) {
      throw new Error(response.errors[0].message);
    }

    const {
      data: {
        boards: [
          { items_page: pageItems },
        ],
      },
    } = response;
    const { items } = pageItems;
    let cursor = pageItems?.cursor;
    while (cursor) {
      const {
        data: {
          boards: {
            items_page: {
              cursor: nextCursor, items: nextItems,
            },
          },
        },
      } = await this.monday.listBoardItemsPage({
        boardId: +this.boardId,
        cursor,
      });
      items.push(...nextItems);
      cursor = nextCursor;
    }

    $.export("$summary", `Successfully retrieved ${items.length} item${items.length === 1
      ? ""
      : "s"}.`);

    return items;
  },
};
