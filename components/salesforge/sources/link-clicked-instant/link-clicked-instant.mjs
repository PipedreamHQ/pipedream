import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "salesforge-link-clicked-instant",
  name: "Link Clicked (Instant)",
  description: "Emit new event when a link is clicked in Salesforge. [See the documentation](https://api.salesforge.ai/public/v2/swagger/index.html)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventType() {
      return "link_clicked";
    },
    getSummary(data) {
      return `Link clicked: ${data.name || data.url || data.id}`;
    },
  },
};
