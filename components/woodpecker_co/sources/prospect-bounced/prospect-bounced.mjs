import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-prospect-bounced",
  name: "New Prospect Bounced (Instant)",
  description: "Emit new event when a bounce is detected or prospect's status is manually changed to 'Bounced' [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_b5fe953958)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    getSummary(body) {
      const [
        {
          prospect: {
            email, campaign_name,
          },
        },
      ] = body;
      return `Prospect (${email}) bounced - Campaign ${campaign_name}`;
    },
    getAction() {
      return "prospect_bounced";
    },
  },
};
