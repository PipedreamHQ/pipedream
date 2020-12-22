const twist = require("../../twist.app.js");

module.exports = {
  name: "New Channel (Instant)",
  version: "0.0.1",
  key: "twist-new-channel",
  description: "Emits an event for any new channel added in a Workspace",
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
  },
  hooks: {
    async activate() {
      const params = {
        workspace: this.workspace,
      };
      await this.twist.createHook(this.http.endpoint, "channel_added", params);
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
      summary: body.name,
      ts: Date.now(),
    });
  },
};