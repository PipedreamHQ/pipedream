const common = require("../common-polling.js");

module.exports = {
  ...common,
  key: "twilio-new-phone-number",
  name: "New Phone Number",
  description: "Emits an event when you add a new phone number to your account",
  version: "0.0.1",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async listResults(...args) {
      return await this.twilio.listIncomingPhoneNumbers(...args);
    },
    generateMeta(number) {
      const { sid: id, friendlyName: summary, dateCreated } = number;
      return {
        id,
        summary,
        ts: Date.parse(dateCreated),
      };
    },
  },
};