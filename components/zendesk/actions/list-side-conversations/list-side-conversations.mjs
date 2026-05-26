import zendesk from "../../zendesk.app.mjs";

export default {
  key: "zendesk-list-side-conversations",
  name: "List Side Conversations",
  description: "Retrieve all side conversations on a Zendesk ticket. Side conversations are collaboration threads attached to a ticket (email, Slack, Microsoft Teams, or linked child tickets). Use **Get Side Conversation** to fetch a single side conversation by ID. Set `includeEvents` to `true` to sideload each conversation's events (creation, replies, state changes). [See the documentation](https://developer.zendesk.com/api-reference/ticketing/side_conversation/side_conversation/#list-side-conversations).",
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
    includeEvents: {
      type: "boolean",
      label: "Include Events",
      description: "If `true`, sideload each side conversation's events (creation, replies, state changes) in the response.",
      optional: true,
      default: false,
    },
    limit: {
      propDefinition: [
        zendesk,
        "limit",
      ],
      description: "Maximum number of side conversations to return (1-1000).",
      min: 1,
      max: 1000,
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

    const results = this.zendesk.paginate({
      fn: this.zendesk.listSideConversations,
      args: {
        step,
        ticketId: this.ticketId,
        customSubdomain: this.customSubdomain,
        params,
      },
      resourceKey: "side_conversations",
      max: this.limit,
    });

    const sideConversations = [];
    for await (const sc of results) {
      sideConversations.push(sc);
    }

    step.export("$summary", `Successfully retrieved ${sideConversations.length} side conversation${sideConversations.length === 1
      ? ""
      : "s"}`);

    return sideConversations;
  },
};
