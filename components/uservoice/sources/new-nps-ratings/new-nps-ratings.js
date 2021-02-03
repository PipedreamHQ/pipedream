const uservoice = require("../../uservoice.app.js");

module.exports = {
  name: "New NPS Ratings",
  version: "0.0.1",
  key: "uservoice-new-nps-ratings",
  description:
    "Emits new NPS ratings submitted through the UserVoice NPS widget. On first run, emits up to 10 sample, past NPS ratings.",
  dedupe: "unique",
  props: {
    uservoice,
    timer: {
      label: "Polling schedule",
      description:
        "Pipdream will poll the UserVoice API for new NPS ratings on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // by default, run every 15 minutes
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Emit up to 10 sample records on the first run
      this.emitWithMetadata(
        await this.uservoice.listNPSRatings({ numSampleResults: 10 })
      );
    },
  },
  methods: {
    emitWithMetadata(ratings) {
      for (const rating of ratings) {
        const { id, rating: score, body, created_at } = rating;
        const summary = body && body.length ? `${score} - ${body}` : `${score}`;
        this.$emit(rating, {
          summary,
          id,
          ts: +new Date(created_at),
        });
      }
    },
  },
  async run() {
    const now = new Date().toISOString();
    const updated_after = this.db.get("updated_after") || now;
    this.emitWithMetadata(
      await this.uservoice.listNPSRatings({ updated_after })
    );
    this.db.set("updated_after", now);
  },
};
