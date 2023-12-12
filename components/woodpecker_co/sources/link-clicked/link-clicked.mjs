import common from "../common/base.mjs";

export default {
  ...common,
  key: "woodpecker_co-link-clicked",
  name: "New Link Clicked (Instant)",
  description: "Emit new event when a prospect clicks on a link in your email [see the docs here](https://woodpecker.co/help/webhooks-events-notification/#h_d11d67b174)",
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
      return `Link clicked by (${email}) - Campaign ${campaign_name}`;
    },
    getAction() {
      return "link_clicked";
    },
  },
};
