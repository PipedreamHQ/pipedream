const twist = require("../../twist.app.js");
const common = require("../common.js");

module.exports = {
  ...common,
  name: "New Message (Instant)",
  version: "0.0.1",
  key: "twist-new-message",
  description: "Emits an event for any new message in a workspace",
  props: {
    ...common.props,
    conversation: {
      propDefinition: [
        twist,
        "conversation",
        (c) => ({ workspace: c.workspace }),
      ],
    },
  },
  methods: {
    getHookActivationData() {
      return {
        target_url: this.http.endpoint,
        event: "message_added",
        workspace_id: this.workspace,
        conversation_id: this.conversaion,
      };
    },
    getMeta(body) {
      const { id, content, posted } = body;
      return {
        id,
        summary: content,
        ts: Date.parse(posted),
      };
    },
  },
};