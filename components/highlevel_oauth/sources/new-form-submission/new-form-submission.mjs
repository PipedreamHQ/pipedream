import common from "../common/base-polling.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "highlevel_oauth-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event when a new form submission is created. [See the documentation](https://marketplace.gohighlevel.com/docs/ghl/forms/get-forms-submissions)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    generateMeta(submission) {
      return {
        id: submission.id,
        summary: `New Submission ID: ${submission.id}`,
        ts: Date.parse(submission.createdAt),
      };
    },
  },
  async run() {
    const lastDate = this._getLastDate();
    let maxDate = lastDate;

    const results = [];
    const params = {
      limit: 100,
      page: 1,
      startAt: lastDate,
      locationId: this.app.getLocationId(),
    };
    let total;

    do {
      const {
        submissions = [], meta,
      } = await this.app.listFormSubmissions({
        params,
      });
      for (const submission of submissions) {
        results.push(submission);
        if (!maxDate || Date.parse(submission.createdAt) > Date.parse(maxDate)) {
          maxDate = submission.createdAt.slice(0, 10);
        }
      }
      total = meta?.total;
      params.page++;
    } while (results.length < total);

    this._setLastDate(maxDate);

    results.forEach((submission) => {
      const meta = this.generateMeta(submission);
      this.$emit(submission, meta);
    });
  },
  sampleEmit,
};
