import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-prospect-not-interested",
  name: "New Prospect Not Interested (Instant)",
  description: "Emit new event when prospect's interest level changes to 'Not Interested' [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_8c08a8d67c)",
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
      return `Prospect (${email}) not interested - Campaign ${campaign_name}`;
    },
    getAction() {
      return "prospect_not_interested";
    },
  },
};
