import common from "../common/webhook.mjs";

export default {
  ...common,
  key: "jo4-new-url-created",
  name: "New Short URL Created (Instant)",
  description: "Emit new event when a short URL is created. [See the documentation](https://jo4.io/docs)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getEventSlug() {
      return "url-created";
    },
    getSummary(body) {
      const shortUrl = body.data?.fullShortUrl || body.data?.shortUrl || body.data?.slug;
      return `New URL created: ${shortUrl}`;
    },
    async getSampleEvents() {
      return this.jo4.getRecentUrls();
    },
  },
};
