const {
  methods,
  ...common
} = require("../common-webhook");

module.exports = {
  ...common,
  key: "mailgun-new-click",
  name: "New Click",
  description: "Emit an event when the email recipient clicked on a link in the email. " +
    "Open tracking must be enabled in the Mailgun control panel, and the CNAME record " +
    "must be pointing to mailgun.org. See more at the Mailgun User's Manual [Tracking Messages]" +
    "(https://documentation.mailgun.com/en/latest/user_manual.html#tracking-messages) " +
    "section",
  version: "0.0.2",
  dedupe: "unique",
  type: "action",
  methods: {
    ...methods,
    getEventName() {
      return [
        "clicked",
      ];
    },
    getEventType() {
      return [
        "CLICKED",
      ];
    },
  },
};
