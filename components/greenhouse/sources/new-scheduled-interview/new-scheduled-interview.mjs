import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import greenhouse from "../../greenhouse.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "greenhouse-new-scheduled-interview",
  name: "New Scheduled Interview",
  description: "Emit new event when a new interview is scheduled within a specific time period.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    greenhouse,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    startsAfter: {
      type: "string",
      label: "Starts After",
      description: "Only return scheduled interviews scheduled to start at or after this timestamp. Timestamps must be in in [ISO-8601](https://developers.greenhouse.io/harvest.html#general-considerations) format.",
    },
    endsBefore: {
      type: "string",
      label: "Ends Before",
      description: "Only return scheduled interviews scheduled to end before this timestamp. Timestamps must be in in [ISO-8601](https://developers.greenhouse.io/harvest.html#general-considerations) format.",
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(id) {
      this.db.set("lastId", id);
    },
    generateMeta(interview) {
      return {
        id: interview.id,
        summary: `New Interview Scheduled: ${interview.id}`,
        ts: Date.parse(interview.updated_at),
      };
    },
    async startEvent(maxResults) {
      const lastId = this._getLastId();
      const response = this.greenhouse.paginate({
        fn: this.greenhouse.listInterviews,
        params: {
          starts_after: this.startsAfter,
          ends_before: this.endsBefore,
        },
        maxResults,
      });

      let responseArray = [];
      for await (const item of response) {
        responseArray.push(item);
      }

      responseArray.sort((a, b) => b.id - a.id);
      responseArray.filter((item) => item.id > lastId);

      if (responseArray.length) this._setLastId(responseArray[0].id);

      for (const item of responseArray.reverse()) {
        this.$emit(item, this.generateMeta(item));
      }
    },
  },
  hooks: {
    async deploy() {
      await this.startEvent(25);
    },
  },
  async run() {
    await this.startEvent();
  },
  sampleEmit,
};
