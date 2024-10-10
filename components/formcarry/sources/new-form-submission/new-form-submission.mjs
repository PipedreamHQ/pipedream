import formcarry from "../../formcarry.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "formcarry-new-form-submission",
  name: "New Form Submission",
  description: "Emit new event when the specified form receives a new submission. [See the documentation](https://formcarry.com/docs/formcarry-api/submissions-api#cc7f3010897b4c938c8829db46b18656)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    formcarry,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    formId: {
      type: "string",
      label: "Form ID",
      description: "The ID of the form to watch for new submissions",
    },
  },
  hooks: {
    async deploy() {
      await this.processEvent(25);
    },
  },
  methods: {
    _getLastTs() {
      return this.db.get("lastTs") || 0;
    },
    _setLastTs(lastTs) {
      this.db.set("lastTs", lastTs);
    },
    generateMeta(submission) {
      return {
        id: submission._id,
        summary: `New Form Submission ID: ${submission._id}`,
        ts: Date.parse(submission.createdAt),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();

      const results = this.formcarry.paginate({
        fn: this.formcarry.listSubmissions,
        args: {
          formId: this.formId,
        },
        resourceKey: "submissions",
        max,
      });

      const submissions = [];
      for await (const item of results) {
        const ts = Date.parse(item.createdAt);
        if (ts >= lastTs) {
          submissions.push(item);
        } else {
          break;
        }
      }

      if (!submissions.length) {
        return;
      }

      this._setLastTs(Date.parse(submissions[0].createdAt));

      submissions.forEach((submission) => {
        const meta = this.generateMeta(submission);
        this.$emit(submission, meta);
      });
    },
  },
  async run() {
    await this.processEvent();
  },
};
