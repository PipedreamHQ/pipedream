import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-prospect-invalid",
  name: "New Prospect Invalid (Instant)",
  description: "Emit new event when prospect's email address is marked as 'Invalid' [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_45a07f6ec4)",
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
      return `Prospect (${email}) invalid - Campaign ${campaign_name}`;
    },
    getAction() {
      return "prospect_invalid";
    },
  },
};
