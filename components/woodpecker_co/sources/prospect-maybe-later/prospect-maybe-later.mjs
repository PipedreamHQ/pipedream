import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-prospect-maybe-later",
  name: "New Prospect Maybe Later (Instant)",
  description: "Emit new event when prospect's interest level changes to 'Maybe later' [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_75d0017396)",
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
      return `Prospect (${email}) maybe later - Campaign ${campaign_name}`;
    },
    getAction() {
      return "prospect_maybe_later";
    },
  },
};
