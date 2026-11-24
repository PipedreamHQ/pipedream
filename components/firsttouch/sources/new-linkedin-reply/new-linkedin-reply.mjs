import common from "../common/base.mjs";

export default {
  ...common,
  key: "firsttouch-new-linkedin-reply",
  name: "New LinkedIn Reply",
  description: "Emit new event when a prospect replies on LinkedIn in any conversation in the FirstTouch inbox. [See the documentation](https://docs.firsttouch.com)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    tag: {
      type: "string",
      label: "Only Conversations Tagged",
      description: "Leave empty for every conversation",
      optional: true,
      options: [
        {
          label: "Hot",
          value: "hot",
        },
        {
          label: "Nurture",
          value: "nurture",
        },
      ],
    },
    linkedinAccountId: {
      propDefinition: [
        common.props.firsttouch,
        "linkedinAccountId",
      ],
    },
  },
  methods: {
    ...common.methods,
    async fetchEvents() {
      const { conversations = [] } = await this.firsttouch.listConversations({
        data: {
          limit: 100,
          archived: false,
          tags: this.tag
            ? [
              this.tag,
            ]
            : undefined,
          linAccountId: this.linkedinAccountId || undefined,
        },
      });
      return conversations
        .filter((conversation) => conversation.lastInboundMessageAtUtc)
        .map((conversation) => ({
          id: `${conversation.conversationId}:${conversation.lastInboundMessageAtUtc}`,
          occurredAt: conversation.lastInboundMessageAtUtc,
          data: {
            ...conversation,
            replyIsLatestMessage:
              conversation.latestMessageAtUtc === conversation.lastInboundMessageAtUtc,
          },
        }));
    },
    getSummary(conversation) {
      return `New reply from ${conversation.participantName || "a prospect"}`;
    },
  },
};
