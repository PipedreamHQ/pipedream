import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "jo4-new-referring-domain",
  name: "New Referring Domain (Instant)",
  description: "Emit new event when traffic from a new referring domain is detected. [See the documentation](https://jo4.io/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventSlug() {
      return "new-referrer";
    },
    getSummary(body) {
      const domain = body.data?.domain || "unknown";
      return `New referring domain: ${domain}`;
    },
    async getSampleEvents() {
      return this.jo4.getRecentReferrers();
    },
  },
};
