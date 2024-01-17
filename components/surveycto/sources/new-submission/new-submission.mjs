import surveycto from "../../surveycto.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "surveycto-new-submission",
  name: "New Submission",
  description: "Emit new event each time a new form submission is received in SurveyCTO. [See the documentation](https://support.surveycto.com/hc/en-us/articles/360033156894-REST-API-documentation)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    surveycto,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    formId: {
      propDefinition: [
        surveycto,
        "formId",
      ],
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
        id: submission.KEY,
        summary: `New Submission ${submission.KEY}`,
        ts: Date.parse(submission.SubmissionDate),
      };
    },
  },
  async run() {
    const lastTs = this._getLastTs();
    let maxTs = lastTs;
    const submissions = await this.surveycto.listSubmissions({
      formId: this.formId,
      params: {
        date: lastTs,
      },
    });
    for (const submission of submissions) {
      const ts = Date.parse(submission.SubmissionDate);
      if (ts > lastTs) {
        const meta = this.generateMeta(submission); console.log(meta);
        this.$emit(submission, meta);
        if (ts > maxTs) {
          maxTs = ts;
        }
      }
    }
    this._setLastTs(maxTs);
  },
  sampleEmit,
};
