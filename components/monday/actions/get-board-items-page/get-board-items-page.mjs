import common from "../common/column-values.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  ...common,
  key: "monday-get-board-items-page",
  name: "Get Board Items Page",
  description: "List every item (row) on a board, following the API's cursor automatically so all pages are returned in a single call — you do not need to paginate. Use when you want the whole board; use **Get Items By Column Value** to filter server-side by one column, which is far cheaper on a large board. Set `Board ID`, and optionally `Query Params` to filter or sort. Example: Query Params `{ \"rules\": [{ \"column_id\": \"status\", \"compare_value\": [\"Done\"], \"operator\": \"any_of\" }] }`. Returns an array of items with `id`, `name`, `state`, timestamps and column values. Gotcha: a large board returns every row in one response, so expect a slow call and a large payload. [See the documentation](https://developer.monday.com/api-reference/reference/items-page)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  ai: "optimized",
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
          boards: [
            {
              items_page: {
                cursor: nextCursor, items: nextItems,
              },
            },
          ],
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
