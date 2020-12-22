const twist = require("../../twist.app.js");

module.exports = {
  name: "New Message (Instant)",
  version: "0.0.1",
  key: "twist-new-message",
  description: "Emits an event for any new message in a Workspace",
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
    conversation: {
      propDefinition: [
        twist,
        "conversation",
        (c) => ({ workspace: c.workspace }),
      ],
    },
  },
  hooks: {
    async activate() {
      const params = {
        workspace: this.workspace,
        conversation: this.conversation,
      };
      await this.twist.createHook(this.http.endpoint, "message_added", params);
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
      summary: body.content,
      ts: Date.now(),
    });
  },
};