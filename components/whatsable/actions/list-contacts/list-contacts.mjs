import whatsable from "../../whatsable.app.mjs";

export default {
  name: "List Contacts",
  description: "Retrieve Whatsable contacts with cursor pagination and optional filters",
  key: "whatsable-list-contacts",
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
      description: "Maximum contacts (1–100)",
      default: 25,
      optional: true,
    },
    cursor: {
      type: "string",
      label: "Cursor",
      description: "Cursor from the previous response's next_cursor",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "Filter by phone number",
      optional: true,
    },
    wa_user_id: {
      type: "string",
      label: "WhatsApp User ID",
      description: "Filter by business-scoped WhatsApp user ID",
      optional: true,
    },
    username: {
      type: "string",
      label: "Username",
      description: "Filter by WhatsApp username",
      optional: true,
    },
    label_id: {
      type: "string",
      label: "Label ID",
      description: "Filter by label ID",
      optional: true,
    },
    updated_after: {
      type: "string",
      label: "Updated After",
      description: "ISO date-time filter",
      optional: true,
    },
    query: {
      type: "string",
      label: "Search",
      description: "Search contacts",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.whatsable.listContacts({
      $,
      params: {
        limit: this.limit,
        cursor: this.cursor,
        phone: this.phone,
        wa_user_id: this.wa_user_id,
        username: this.username,
        label_id: this.label_id,
        updated_after: this.updated_after,
        query: this.query,
      },
    });
    $.export("$summary", "Retrieved Whatsable contacts");
    return response;
  },
};
