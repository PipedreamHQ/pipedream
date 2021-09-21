const {
  methods,
  ...common
} = require("../common-webhook");

module.exports = {
  ...common,
  key: "mailgun-new-bounce",
  name: "New Bounce",
  type: "source",
  description: "Emit an event when the email recipient could not be reached.",
  version: "0.0.2",
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
};
