import tawk_to from "../../tawk_to.app.mjs";

export default {
  key: "tawk_to-list-chats",
  name: "List Chats",
  description:
    "Retrieve chat history and conversations for a specific tawk.to property via `POST /chat.list`. Returns an array of chat sessions including visitor details, duration, message history, and timestamps. Use this to inspect conversations, export chat transcripts, or analyze support interactions. Call **List Properties** first to discover valid `propertyId` values. Note: tawk.to returns up to 50 chats per request. [See the documentation](https://developer.tawk.to/).",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    tawk_to,
    propertyId: {
      propDefinition: [
        tawk_to,
        "propertyId",
      ],
      description:
        "The unique identifier of the property to retrieve chats from. Run **List Properties** first to discover valid property IDs.",
    },
    startDate: {
      type: "string",
      label: "Start Date",
      description:
        "Filter chats starting from this timestamp in ISO 8601 format (e.g. `2026-01-01T00:00:00Z`).",
      optional: true,
    },
    endDate: {
      type: "string",
      label: "End Date",
      description:
        "Filter chats ending before this timestamp in ISO 8601 format (e.g. `2026-01-31T23:59:59Z`).",
      optional: true,
    },
    size: {
      type: "integer",
      label: "Size",
      description:
        "Maximum number of chats to return (up to 50). Defaults to 50 if omitted.",
      optional: true,
      min: 1,
      max: 50,
    },
    sort: {
      type: "string",
      label: "Sort",
      description: "Sort order of the returned chats.",
      optional: true,
      options: [
        {
          label: "Newest first (co-new-old)",
          value: "co-new-old",
        },
        {
          label: "Oldest first (co-old-new)",
          value: "co-old-new",
        },
      ],
    },
  },
  async run({ $ }) {
    const data = {
      propertyId: this.propertyId,
      ...(this.startDate && {
        startDate: this.startDate,
      }),
      ...(this.endDate && {
        endDate: this.endDate,
      }),
      ...(this.size !== undefined && {
        size: this.size,
      }),
      ...(this.sort && {
        sort: this.sort,
      }),
    };

    const response = await this.tawk_to.listChats({
      $,
      data,
    });

    const chats = response?.data || [];
    $.export("$summary", `Successfully retrieved ${chats.length} chat(s)`);
    return response;
  },
};
