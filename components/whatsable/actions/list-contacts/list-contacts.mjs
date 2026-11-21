import whatsable from "../../whatsable.app.mjs";

export default {
  name: "List Contacts",
  description: "Retrieve contacts from Whatsable",
  key: "whatsable-list-contacts",
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
      description: "Maximum number of contacts to retrieve",
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
    const response = await this.whatsable.listContacts({
      $,
      params: {
        limit: this.limit,
        page: this.page,
      },
    });

    $.export("$summary", "Retrieved Whatsable contacts");

    return response;
  },
};
