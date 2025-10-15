import readwise from "../../readwise.app.mjs";

export default {
  key: "readwise-get-highlight-details",
  name: "Get Highlight Details",
  description: "Get Highlight´s Details [See the docs here](https://readwise.io/api_deets)",
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
    },
    highlightId: {
      propDefinition: [
        readwise,
        "highlightId",
        (c) => ({
          bookId: c.bookId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const highlight = await this.readwise.getHighlight({
      $,
      highlightId: this.highlightId,
    });

    $.export("$summary", `Successfully returned highlight (${this.highlightId})`);
    return highlight;
  },
};
