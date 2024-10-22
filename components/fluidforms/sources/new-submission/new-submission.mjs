import fluidforms from "../../fluidforms.app.mjs";

export default {
  key: "fluidforms-new-submission",
  name: "New Submission",
  description: "Emits an event each time a new submission is made in FluidForms.",
  version: "0.0.{{ts}}",
  dedupe: "unique",
  type: "source",
  props: {
    fluidforms,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, submittedAt,
      } = data;
      return {
        id,
        summary: `New Submission: ${id}`,
        ts: Date.parse(submittedAt),
      };
    },
  },
  async run() {
    const lastRunTime = this.db.get("lastRunTime") || this.timer.intervalSeconds;
    const now = new Date().toISOString();
    const submissions = await this.fluidforms.getSubmissions();

    submissions
      .filter((submission) => new Date(submission.submittedAt) > new Date(lastRunTime))
      .forEach((submission) => {
        const meta = this.generateMeta(submission);
        this.$emit(submission, meta);
      });

    this.db.set("lastRunTime", now);
  },
};
