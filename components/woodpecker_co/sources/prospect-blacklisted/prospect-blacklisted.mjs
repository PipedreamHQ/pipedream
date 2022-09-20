import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-prospect-blacklisted",
  name: "New Prospect Autoreplied (Instant)",
  description: "Emit new event when a prospect unsubscribes or their status is changed manually to 'Blacklisted' [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_6dc6d56d86)",
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
      return `Prospect (${email}) blacklisted - Campaign ${campaign_name}`;
    },
    getAction() {
      return "prospect_blacklisted";
    },
  },
};
