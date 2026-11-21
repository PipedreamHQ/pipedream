import whatsable from "../../whatsable.app.mjs";

export default {
  name: "List Conversations",
  description: "Retrieve conversations from Whatsable",
  key: "whatsable-list-conversations",
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
      description: "Maximum number of conversations to retrieve",
      default: 100,
      optional: true,
    },
    page: {
      type: "integer",
      label: "Page",
      description: "Page number",
      default: 1,
      optional: true,
    },
  },

  async run({ $ }) {
    const response = await this.whatsable.listConversations({
      $,
      params: {
        limit: this.limit,
        page: this.page,
      },
    });

    $.export("$summary", "Retrieved Whatsable conversations");

    return response;
  },
};
