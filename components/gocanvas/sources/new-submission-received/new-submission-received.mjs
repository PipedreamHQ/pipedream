import gocanvas from "../../gocanvas.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "gocanvas-new-submission-received",
  name: "New Submission Recieved",
  description: "Emit new event when a new submission is uploaded to GoCanvas.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    gocanvas,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    form: {
      propDefinition: [
        gocanvas,
        "form",
      ],
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastSubmissionDate() {
      return this.db.get("lastSubmissionDate");
    },
    _setLastSubmissionDate(lastSubmissionDate) {
      this.db.set("lastSubmissionDate", lastSubmissionDate);
    },
    generateMeta(submission) {
      return {
        id: submission.ResponseID,
        summary: `New Submission: ${submission.ResponseID}`,
        ts: Date.parse(submission.Date),
      };
    },
    currentDate() {
      const currentDate = new Date();
      return `${String(currentDate.getMonth() + 1)
        .padStart(2, "0")}/${String(currentDate.getDate())
        .padStart(2, "0")}/${currentDate.getFullYear()}`;
    },
    formatResponse(obj) {
      if (Array.isArray(obj) && obj.length === 1) {
        return this.formatResponse(obj[0]);
      } else if (typeof obj === "object" && obj !== null) {
        return Object.fromEntries(
          Object.entries(obj).map(([
            key,
            value,
          ]) => [
            key,
            this.formatResponse(value),
          ]),
        );
      } else {
        return obj;
      }
    },
    async processEvent(max) {
      let lastSubmissionDate = this._getLastSubmissionDate();

      const params = {
        form_name: this.form,
      };
      if (lastSubmissionDate) {
        params.begin_date = new Date(lastSubmissionDate).toLocaleDateString("en-US");
        params.end_date = this.currentDate();
      }

      const results = this.gocanvas.paginate({
        fn: this.gocanvas.listSubmissions,
        params,
        max,
      });

      for await (const result of results) {
        const submission = this.formatResponse(result);
        const meta = this.generateMeta(submission);
        this.$emit(submission, meta);

        if (!lastSubmissionDate
          || Date.parse(submission.Date) >= Date.parse(lastSubmissionDate)) {
          lastSubmissionDate = submission.Date;
        }
      }

      this._setLastSubmissionDate(lastSubmissionDate);
    },
  },
  async run() {
    await this.processEvent();
  },
};
