import common from "../common/base.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "freshchat-new-conversation-started",
  name: "New Conversation Started",
  description: "Emit new event when a new conversation is started for a user. [See the documentation](https://developers.freshchat.com/api/#retrieve_all_conversation_for_a_user)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    userId: {
      propDefinition: [
        common.props.freshchat,
        "userId",
      ],
    },
  },
  methods: {
    ...common.methods,
    _getPreviousIds() {
      return this.db.get("previousIds") || {};
    },
    _setPreviousIds(ids) {
      this.db.set("previousIds", ids);
    },
    generateMeta(conversation) {
      return {
        id: conversation.conversation_id,
        summary: `New conversation started: ${conversation.conversation_id}`,
        ts: Date.parse(conversation.created_time),
      };
    },
    async processEvents(max) {
      const previousIds = this._getPreviousIds();

      const conversations = await this.freshchat.getPaginatedResults({
        fn: this.freshchat.listConversations,
        args: {
          userId: this.userId,
        },
        resourceKey: "conversations",
      });

      let newConversations = conversations.filter((conversation) => !previousIds[conversation.id]);

      this._setPreviousIds(conversations.reduce((acc, conversation) => {
        acc[conversation.id] = conversation.id;
        return acc;
      }, {}));

      if (max) {
        newConversations = newConversations.slice(0, max);
      }

      for (const conversation of newConversations) {
        const conversationDetails = await this.freshchat.getConversation({
          conversationId: conversation.id,
        });
        this.$emit(conversationDetails, this.generateMeta(conversationDetails));
      }
    },
  },
  sampleEmit,
};
