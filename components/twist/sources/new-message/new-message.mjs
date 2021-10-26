import common from "../common.mjs";

export default {
  ...common,
  name: "New Message (Instant)",
  version: "0.0.2",
  type: "source",
  key: "twist-new-message-instant",
  description: "Emits an event for any new message in a workspace",
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
