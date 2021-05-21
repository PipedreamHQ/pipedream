const twist = require("../../twist.app.js");
const common = require("../common.js");

module.exports = {
  ...common,
  name: "New Comment (Instant)",
  version: "0.0.1",
  key: "twist-new-comment",
  description: "Emits an event for any new comment in a workspace",
  props: {
    ...common.props,
    channel: {
      propDefinition: [twist, "channel", (c) => ({ workspace: c.workspace })],
    },
    thread: {
      propDefinition: [twist, "thread", (c) => ({ channel: c.channel })],
    },
  },
  methods: {
    getHookActivationData() {
      return {
        target_url: this.http.endpoint,
        event: "comment_added",
        workspace_id: this.workspace,
        channel_id: this.channel,
        thread_id: this.thread,
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