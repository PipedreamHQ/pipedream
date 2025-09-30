import readwise from "../../readwise.app.mjs";

export default {
  key: "readwise-list-highlights",
  name: "List Highlights",
  description: "A list of highlights with a pagination metadata. The rate limit of this endpoint is restricted to 20 requests per minute. Each request returns 1000 items. [See the docs here](https://readwise.io/api_deets)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    readwise,
    bookId: {
      propDefinition: [
        readwise,
        "bookId",
      ],
      optional: true,
    },
    limit: {
      propDefinition: [
        readwise,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const params = {
      page_size: 1000,
      limit: this.limit,
    };
    if (this.bookId) params.book_id = this.bookId;

    const items = [];

    const paginator = this.readwise.paginate({
      $,
      fn: this.readwise.listHighlights,
      params,
    });
    for await (const item of paginator) {
      items.push(item);
    }

    const suffix = items.length === 1
      ? ""
      : "s";

    $.export("$summary", `Successfully returned ${items.length} highlight${suffix}`);
    return items;
  },
};
