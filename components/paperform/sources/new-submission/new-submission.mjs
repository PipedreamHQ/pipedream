import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import paperform from "../../paperform.app.mjs";

export default {
  key: "paperform-new-submission",
  name: "New Submission",
  description: "Emit new event when a new submission is made on the specified form in Paperform. [See the documentation](https://paperform.readme.io/reference/listformsubmissions)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    paperform,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    formId: {
      propDefinition: [
        paperform,
        "formId",
      ],
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
        id: submission.id,
        summary: `New Submission ID: ${submission.id}`,
        ts: Date.parse(submission.created_at),
      };
    },
    async processEvent(max) {
      const lastTs = this._getLastTs();

      const items = this.paperform.paginate({
        fn: this.paperform.listSubmissions,
        args: {
          formId: this.formId,
        },
        resourceKey: "submissions",
        max,
      });

      const submissions = [];
      for await (const item of items) {
        const ts = Date.parse(item.created_at);
        if (ts >= lastTs) {
          submissions.push(item);
        } else {
          break;
        }
      }

      if (!submissions?.length) {
        return;
      }

      this._setLastTs(Date.parse(submissions[0].created_at));

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
