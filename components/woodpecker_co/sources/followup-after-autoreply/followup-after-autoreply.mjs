import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-followup-after-autoreply",
  name: "New Follow-up After Autoreply (Instant)",
  description: "Emit new event when you get an autoreply and you set a date to resume follow-ups [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_232afd5aae)",
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
      return `New follow-up after reply (${email}) - Campaign ${campaign_name}`;
    },
    getAction() {
      return "followup_after_autoreply";
    },
  },
};
