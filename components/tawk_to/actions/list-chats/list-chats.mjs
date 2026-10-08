import tawk_to from "../../tawk_to.app.mjs";

export default {
  key: "tawk_to-list-chats",
  name: "List Chats",
  description:
    "Retrieve chat history and conversations for a specific tawk.to property. Returns an array of chat sessions including visitor details, duration, message history, and timestamps. Use this to inspect conversations, export chat transcripts, or analyze support interactions. Call **List Properties** first to discover valid `propertyId` values. Note: tawk.to returns up to 50 chats per request. [See the documentation](https://developer.tawk.to/).",
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
      propDefinition: [
        tawk_to,
        "startDate",
      ],
      description:
        "Filter chats starting from this timestamp in ISO 8601 format (e.g. `2026-01-01T00:00:00Z`).",
    },
    endDate: {
      propDefinition: [
        tawk_to,
        "endDate",
      ],
      description:
        "Filter chats ending before this timestamp in ISO 8601 format (e.g. `2026-01-31T23:59:59Z`).",
    },
    size: {
      propDefinition: [
        tawk_to,
        "size",
      ],
      description:
        "Maximum number of chats to return (up to 50). Defaults to 50 if omitted. For example, use `10` to return up to 10 chats.",
      max: 50,
    },
    sort: {
      propDefinition: [
        tawk_to,
        "sort",
      ],
      description: "Sort order of the returned chats.",
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
