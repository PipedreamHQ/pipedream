import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-email-opened",
  name: "New Email Opened (Instant)",
  description: "Emit new event when an email is opened [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_5014c8c48a)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    getSummary(body) {
      const [
        {
          email_no,
          prospect: { email },
        },
      ] = body;
      return `${email} opened the email (${email_no})`;
    },
    getAction() {
      return "email_opened";
    },
  },
};
