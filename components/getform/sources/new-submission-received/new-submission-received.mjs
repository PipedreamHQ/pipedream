import getform from "../../getform.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Submission Received",
  version: "0.0.1",
  key: "getform-new-submission-received",
  description: "Emit new event on each new feedback received.",
  type: "source",
  dedupe: "unique",
  props: {
    getform,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    formId: {
      label: "Form ID",
      description: "The form ID",
      type: "string",
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New submission received with ID ${data.id}`,
        ts: Date.parse(data.submissionDate),
      });
    },
    _setLastSyncDate(date) {
      this.db.set("lastSyncDate", date);
    },
    _getLastSyncDate() {
      return this.db.get("lastSyncDate");
    },
  },
  hooks: {
    async deploy() {
      const { submissions } = await this.getform.getSubmissions({
        params: {
          size: 10,
        },
      });

      submissions.reverse().forEach(this.emitEvent);
    },
  },
  async run() {
    const lastSyncDate = this._getLastSyncDate() ?? (new Date).getTime();
    this._setLastSyncDate((new Date).getTime());

    let page = 1;

    while (true) {
      const { submissions } = await this.getform.getSubmissions({
        params: {
          page,
          size: 100,
        },
      });

      submissions
        .filter((submission) => Date.parse(submission.submissionDate) > lastSyncDate)
        .reverse()
        .forEach(this.emitEvent);

      if (submissions.length < 100) {
        break;
      }

      page++;
    }
  },
};
