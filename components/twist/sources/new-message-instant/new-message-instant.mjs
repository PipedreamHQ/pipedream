import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Message (Instant)",
  version: "0.0.3",
  type: "source",
  key: "twist-new-message-instant",
  description: "Emit new event for any new message in a workspace [See the docs here](https://developer.twist.com/v3/#outgoing-webhook)",
  props: {
    ...common.props,
    conversation: {
      propDefinition: [
        common.props.twist,
        "conversation",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
  },
  methods: {
    ...common.methods,
    async getHistoricalEvents() {
      return this.twist.getConversationMessages({
        conversation: this.conversation,
      });
    },
    getHookActivationData() {
      return {
        target_url: this.http.endpoint,
        event: "message_added",
        workspace_id: this.workspace,
        conversation_id: this.conversation,
      };
    },
    getMeta(body) {
      const {
        id,
        content,
        posted,
      } = body;
      return {
        id,
        summary: content,
        ts: Date.parse(posted),
      };
    },
  },
};
