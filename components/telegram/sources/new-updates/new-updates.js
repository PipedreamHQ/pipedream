const telegram = require("../../telegram.app.js");

module.exports = {
  key: "telegram-new-updates",
  name: "New Updates (Instant)",
  description: "Emits an event for each new Telegram event.",
  version: "0.0.1",
  dedupe: "unique",
  props: {
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    telegram,
    updateTypes: { propDefinition: [telegram, "updateTypes"] },
  },
  hooks: {
    async activate() {
      const response = await this.telegram.createHook(this.http.endpoint, this.updateTypes);
    },
    async deactivate() {
      const response = await this.telegram.deleteHook();
    },
  },
  methods: {
    getMeta(body) {
      let summary;
      if (body.message.from)
        summary = `Update from ${body.message.from.first_name} ${body.message.from.last_name}`;
      else
        summary = `Update ID ${body.update_id}`;
      return {
        id: body.update_id,
        summary,
        ts: Date.now()
      }
    }
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
    this.$emit(body, this.getMeta(body));
  },
};