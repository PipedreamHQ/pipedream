import whatsable from "../../whatsable.app.mjs";

export default {
  name: "List Message Templates",
  description: "Retrieve Whatsable message templates with cursor pagination",
  key: "whatsable-list-templates",
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
      description: "Maximum number of templates (1–100)",
      default: 25,
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Cursor from the previous response's next_cursor",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.whatsable.listTemplates({
      $,
      params: {
        limit: this.limit,
        cursor: this.cursor,
      },
    });
    $.export("$summary", "Retrieved Whatsable message templates");
    return response;
  },
};
