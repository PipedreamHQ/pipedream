import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import adrapid from "../../adrapid.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "adrapid-new-banner-ready",
  name: "New Banner Ready",
  description: "Emit new event when a new banner is ready.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    adrapid,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || "1970-01-01T00:00:00.000Z";
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();
      const response = this.adrapid.paginate({
        fn: this.adrapid.listBanners,
        params: {
          status: "ready",
        },
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.createdAt) <= Date.parse(lastDate)) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(responseArray[0].createdAt);
      }

      for (const banner of responseArray.reverse()) {
        this.$emit(banner, {
          id: banner.id,
          summary: `New banner ready: ${banner.id}`,
          ts: Date.parse(banner.createdAt),
        });
      }
    },
  },
  hooks: {
    async deploy() {
      await this.emitEvent(25);
    },
  },
  async run() {
    await this.emitEvent();
  },
  sampleEmit,
};
