import common from "../common/http-based.mjs";

export default {
  ...common,
  key: "mailgun-new-click",
  name: "New Click (Instant)",
  description: "Emit new event when the email recipient clicked on a link in the email. " +
    "Open tracking must be enabled in the Mailgun control panel, and the CNAME record " +
    "must be pointing to mailgun.org. See more at the Mailgun User's Manual [Tracking Messages]" +
    "(https://documentation.mailgun.com/en/latest/user_manual.html#tracking-messages) " +
    "section",
  version: "0.0.3",
  dedupe: "unique",
  type: "source",
  methods: {
    ...common.methods,
    getEventName() {
      return [
        "clicked",
      ];
    },
    getEventType() {
      return [
        "CLICKED",
        "clicked",
      ];
    },
  },
};
