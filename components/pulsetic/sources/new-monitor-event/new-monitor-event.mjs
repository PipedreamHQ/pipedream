import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import pulsetic from "../../pulsetic.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "pulsetic-new-monitor-event",
  name: "New Monitor Event",
  description: "Emit new event when a monitor event occurs.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    pulsetic,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    monitorId: {
      propDefinition: [
        pulsetic,
        "monitorId",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01T00:00:00Z";
    },
    _setLastDate(createdAt) {
      this.db.set("lastDate", createdAt);
    },
    generateMeta(event) {
      const ts = Date.parse(event.created_at);
      return {
        id: ts,
        summary: `New event published with type: ${event.type}`,
        ts: ts,
      };
    },
    getParams() {
      return {};
    },
    async startEvent(maxResults = 0) {
      const lastDate = this._getLastDate();

      const data = await this.pulsetic.listEvents({
        monitorId: this.monitorId,
        params: {
          start_dt: lastDate,
          end_dt: new Date(),
        },
      });

      const responseArray = [];
      for await (const item of data) {
        if (Date.parse(item.created_at) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) this._setLastDate(responseArray[0].created_at);
      if (maxResults && responseArray.length > maxResults) {
        responseArray.length = maxResults;
      }

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
