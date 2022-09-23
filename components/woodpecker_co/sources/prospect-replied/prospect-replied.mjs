import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-prospect-replied",
  name: "New Prospect Replied (Instant)",
  description: "Emit new event when a reply is detected or prospect's status is manually changed to 'Responded' [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_9cca37ee9e)",
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
      return `Prospect (${email}) replied campaign ${campaign_name}`;
    },
    getAction() {
      return "prospect_replied";
    },
  },
};
