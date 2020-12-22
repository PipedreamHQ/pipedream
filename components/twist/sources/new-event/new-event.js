const twist = require("../../twist.app.js");

module.exports = {
  name: "New Event (Instant)",
  version: "0.0.1",
  key: "twist-new-event",
  description: "Emits an event for any new updates in a Workspace",
  props: {
    twist,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    workspace: {
      propDefinition: [
        twist,
        "workspace",
      ],
    },
    channel: {
      propDefinition: [
        twist,
        "channel",
        (c) => ({ workspace: c.workspace }),
      ],
    },
    thread: {
      propDefinition: [
        twist,
        "thread",
        (c) => ({ channel: c.channel }),
      ],
    },
    eventType: {
      propDefinition: [
        twist,
        "eventType",
      ],
    },
  },
  hooks: {
    async activate() {
      const params = {
        workspace: this.workspace,
        channel: this.channel,
        thread: this.thread,
      }
      await this.twist.createHook(this.http.endpoint, this.eventType, params);
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
      summary: body.name || "New Event",
      ts: Date.now(),
    });
  },
};
