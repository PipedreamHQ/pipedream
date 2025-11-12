import basin from "../../basin.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  name: "New Submission Received",
  version: "0.0.2",
  key: "basin-new-submission-received",
  description: "Emit new event on each new form submission received.",
  type: "source",
  dedupe: "unique",
  props: {
    basin,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      static: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    emitEvent(data) {
      this.$emit(data, {
        id: data.id,
        summary: `New submission received with ID ${data.id}`,
        ts: Date.parse(data.created_at),
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
      const { submissions } = await this.basin.getSubmissions();

      submissions.slice(0, 10).reverse()
        .forEach(this.emitEvent);
    },
  },
  async run() {
    const lastSyncDate = this._getLastSyncDate() ?? (new Date).getTime();
    this._setLastSyncDate((new Date).getTime());

    let page = 1;

    while (true) {
      const { submissions } = await this.basin.getSubmissions({
        params: {
          page,
        },
      });

      submissions
        .filter((submission) => Date.parse(submission.created_at) > lastSyncDate)
        .reverse()
        .forEach(this.emitEvent);

      if (submissions.length < 100) {
        break;
      }

      page++;
    }
  },
};
