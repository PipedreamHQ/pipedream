import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-prospect-interested",
  name: "New Prospect Interested (Instant)",
  description: "Emit new event when prospect's interest level changes to 'Interested' [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_6fe1be60a7)",
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
      return `Prospect (${email}) interested - Campaign ${campaign_name}`;
    },
    getAction() {
      return "prospect_interested";
    },
  },
};
