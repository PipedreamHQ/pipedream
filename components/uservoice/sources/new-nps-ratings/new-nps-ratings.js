const uservoice = require("../../uservoice.app.js");
const NUM_SAMPLE_RESULTS = 10;

module.exports = {
  name: "New NPS Ratings",
  version: "0.0.3",
  key: "uservoice-new-nps-ratings",
  description: `Emits new NPS ratings submitted through the UserVoice NPS widget. On first run, emits up to ${NUM_SAMPLE_RESULTS} sample NPS ratings users have previously submitted.`,
  dedupe: "unique",
  type: "source",
  props: {
    uservoice,
    timer: {
      label: "Polling schedule",
      description:
        "Pipedream will poll the UserVoice API for new NPS ratings on this schedule",
      type: "$.interface.timer",
      default: {
        intervalSeconds: 15 * 60, // 15 minutes
      },
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // Emit sample records on the first run
      const { npsRatings } = await this.uservoice.listNPSRatings({
        numSampleResults: NUM_SAMPLE_RESULTS,
      });
      this.emitWithMetadata(npsRatings);
    },
  },
  methods: {
    emitWithMetadata(ratings) {
      for (const rating of ratings) {
        const {
          id, rating: score, body, created_at,
        } = rating;
        const summary = body && body.length
          ? `${score} - ${body}`
          : `${score}`;
        this.$emit(rating, {
          summary,
          id,
          ts: +new Date(created_at),
        });
      }
    },
  },
  async run() {
    let updated_after =
      this.db.get("updated_after") || new Date().toISOString();
    const {
      npsRatings, maxUpdatedAt,
    } = await this.uservoice.listNPSRatings({
      updated_after,
    });
    this.emitWithMetadata(npsRatings);

    if (maxUpdatedAt) {
      updated_after = maxUpdatedAt;
    }
    this.db.set("updated_after", updated_after);
  },
};
