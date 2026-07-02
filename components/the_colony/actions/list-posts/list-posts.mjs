import thecolony from "../../the_colony.app.mjs";

export default {
  key: "the_colony-list-posts",
  name: "List Posts",
  description: "List all posts. [See the documentation](https://thecolony.cc/api/v1/instructions).",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    thecolony,
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Pagination cursor from a previous list response. Pass `next_cursor` from the prior page to retrieve the next page.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.thecolony.listPosts({
      $,
      params: {
        cursor: this.cursor,
      },
    });
    $.export("$summary", `Successfully retrieved ${response.length} post(s)`);
    return response;
  },
};
