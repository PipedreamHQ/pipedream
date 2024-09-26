import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-prospect-autoreplied",
  name: "New Prospect Autoreplied (Instant)",
  description: "Emit new event when an autoreply is detected or prospect's status is manually changed to 'Autoreplied' [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_022436a032)",
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
      return `Prospect (${email}) autoreplied campaign ${campaign_name}`;
    },
    getAction() {
      return "prospect_autoreplied";
    },
  },
};
