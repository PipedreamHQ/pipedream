import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesforge-link-clicked-instant",
  name: "Link Clicked (Instant)",
  description: "Emit new event when a link is clicked in Salesforge. [See the documentation](https://help.salesforge.ai/en/articles/8680365-how-to-use-webhooks)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "link_clicked";
    },
    getSummary({
      sequenceEmail, linkUrl,
    }) {
      return `Link clicked: ${linkUrl} in "${sequenceEmail?.subject}"`;
    },
  },
};
