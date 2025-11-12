import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import asyncInterview from "../../async_interview.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "async_interview-new-interview-response",
  name: "New Interview Response",
  description: "Emit new event when a new interview response is received.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    asyncInterview,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastId() {
      return this.db.get("lastId") || 0;
    },
    _setLastId(lastId) {
      this.db.set("lastId", lastId);
    },
    generateMeta(event) {
      return {
        id: event.id,
        summary: `New interview response with ID ${event.id}`,
        ts: Date.parse(event.datetime),
      };
    },
    async startEvent(maxResults = 0) {
      const lastId = this._getLastId();

      let data = await this.asyncInterview.listInterviewResponses();

      data = data.filter((item) => item.id > lastId).reverse();

      if (maxResults && (data.length > maxResults)) data.length = maxResults;
      if (data.length) this._setLastId(data[0].id);

      for (const item of data.reverse()) {
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
