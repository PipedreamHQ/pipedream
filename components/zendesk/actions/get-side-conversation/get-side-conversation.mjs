import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-get-side-conversation",
  name: "Get Side Conversation",
  description: "Retrieve a single Zendesk side conversation by ID (UUID, e.g. `8566255a-ece5-11e8-857d-493066fa7b17`). Use **List Side Conversations** to discover IDs for a given ticket. Set `includeEvents` to `true` to sideload the conversation's events (creation, replies, state changes). [See the documentation](https://developer.zendesk.com/api-reference/ticketing/side_conversation/side_conversation/#show-side-conversation).",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    zendesk,
    ticketId: {
      propDefinition: [
        zendesk,
        "ticketId",
      ],
    },
    sideConversationId: {
      propDefinition: [
        zendesk,
        "sideConversationId",
        ({
          ticketId, customSubdomain,
        }) => ({
          ticketId,
          customSubdomain,
        }),
      ],
    },
    includeEvents: {
      type: "boolean",
      label: "Include Events",
      description: "If `true`, sideload the side conversation's events (creation, replies, state changes) in the response.",
      optional: true,
      default: false,
    },
    customSubdomain: {
      propDefinition: [
        zendesk,
        "customSubdomain",
      ],
    },
  },
  async run({ $: step }) {
    const params = this.includeEvents
      ? {
        include: "events",
      }
      : {};

    const response = await this.zendesk.getSideConversation({
      step,
      ticketId: this.ticketId,
      sideConversationId: this.sideConversationId,
      customSubdomain: this.customSubdomain,
      params,
    });

    step.export("$summary", `Successfully retrieved side conversation ${response.side_conversation.id}`);

    return response;
  },
};
