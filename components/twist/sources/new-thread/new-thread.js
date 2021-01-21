const twist = require("../../twist.app.js");
const common = require("../common.js");

module.exports = {
  ...common,
  name: "New Thread (Instant)",
  version: "0.0.1",
  key: "twist-new-thread",
  description: "Emits an event for any new thread in a workspace",
  props: {
    ...common.props,
    channel: {
      propDefinition: [twist, "channel", (c) => ({ workspace: c.workspace })],
    },
  },
  methods: {
    getHookActivationData() {
      return {
        target_url: this.http.endpoint,
        event: "thread_added",
        workspace_id: this.workspace,
        channel_id: this.channel,
      };
    },
    getMeta(body) {
      const { id, title, posted } = body;
      return {
        id,
        summary: title,
        ts: Date.parse(posted),
      };
    },
  },
};