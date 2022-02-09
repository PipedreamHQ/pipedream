const {
  methods,
  ...common
} = require("../common/http-based");

module.exports = {
  ...common,
  key: "mailgun-new-bounce",
  name: "New Bounce",
  type: "source",
  description: "Emit new event when the email recipient could not be reached.",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...methods,
    getEventName() {
      return [
        "bounce",
      ];
    },
    getEventType() {
      return [
        "bounced",
      ];
    },
  },
  async run(event) {
    if (!event.body?.signature) {
      console.warn("Webhook signature missing, skipping");
      return;
    }
    if (!this.verifySignature(event.body)) {
      this.http.respond({
        status: 401,
      });
      console.warn("Webhook signature invalid, skipping");
      return;
    }
    this.emitEvent(event.body);
  },
};
