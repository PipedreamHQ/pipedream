const twist = require("../../twist.app.js");

module.exports = {
  name: "New Thread (Instant)",
  version: "0.0.1",
  key: "twist-new-thread",
  description: "Emits an event for any new thread in a Workspace",
  dedupe: "unique",
  props: {
    twist,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    workspace: {
      propDefinition: [twist, "workspace"],
    },
    channel: {
      propDefinition: [twist, "channel", (c) => ({ workspace: c.workspace })],
    },
  },
  hooks: {
    async activate() {
      const params = {
        workspace: this.workspace,
        channel: this.channel,
      };
      await this.twist.createHook(this.http.endpoint, "thread_added", params);
    },
    async deactivate() {
      await this.twist.deleteHook(this.http.endpoint);
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) return;

    this.http.respond({
      status: 200,
    });

    this.$emit(body, {
      id: body.id,
      summary: body.title,
      ts: Date.now(),
    });
  },
};