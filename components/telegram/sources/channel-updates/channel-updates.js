const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-channel-updates",
  name: "Channel Updates (Instant)",
  description: "Emits an event each time a channel message is created or updated.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    http: {
      label: "HTTP Responder",
      description: "Exposes a `respond()` method that lets the source issue HTTP responses",
      type: "$.interface.http",
      customResponse: true,
    },
    telegram,
  },
  hooks: {
    async activate() {
      await this.telegram.createHook(this.http.endpoint, [
        "channel_post",
        "edited_channel_post",
      ]);
    },
    async deactivate() {
      await this.telegram.deleteHook();
    },
  },
  async run(event) {
    if ((event.path).substring(1) !== this.telegram.$auth.token) {
      return;
    }
    this.http.respond({
      status: 200,
    });
    const { body } = event;
    if (!body) {
      return;
    }
    this.$emit(body,
      {
        id: body.update_id,
        summary: `${body.channel_post.chat.title} - ${body.channel_post.text}`,
        ts: Date.now(),
      });
  },
};
