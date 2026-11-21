import whatsable from "../../whatsable.app.mjs";

export default {
  name: "List Messages",
  description: "Retrieve Whatsable messages with cursor pagination",
  key: "whatsable-list-messages",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    whatsable,
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum messages (1–100)",
      default: 25,
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Cursor from previous response's next_cursor",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.whatsable.listMessages({
      $,
      params: {
        limit: this.limit,
        cursor: this.cursor,
      },
    });
    $.export("$summary", "Retrieved Whatsable messages");
    return response;
  },
};
