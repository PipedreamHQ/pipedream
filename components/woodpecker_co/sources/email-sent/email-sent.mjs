import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-email-sent",
  name: "New Email Sent (Instant)",
  description: "Emit new event when an email is sent [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_fa177002b0)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    getSummary(body) {
      const [
        {
          email: { subject },
          prospect: { email },
        },
      ] = body;
      return `Email sent (${subject}) to ${email}`;
    },
    getAction() {
      return "campaign_sent";
    },
  },
};
