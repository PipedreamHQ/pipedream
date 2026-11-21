import whatsable from "../../whatsable.app.mjs";

export default {
  name: "List Messages",
  description: "Retrieve messages from Whatsable",
  key: "whatsable-list-messages",
  version: "0.0.1",
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
      description: "Maximum number of messages to retrieve",
      default: 100,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number for pagination",
      default: 1,
      optional: true,
    },
  },

  async run({ $ }) {
    const response = await this.whatsable.listMessages({
      $,
      params: {
        limit: this.limit,
        page: this.page,
      },
    });

    $.export("$summary", "Retrieved Whatsable messages");

    return response;
  },
};
