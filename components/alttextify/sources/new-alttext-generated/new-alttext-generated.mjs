import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import alttextify from "../../alttextify.app.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  key: "alttextify-new-alttext-generated",
  name: "New Alt Text Generated",
  description: "Emit new event when new alt text is generated for an image. [See the documentation](https://apidoc.alttextify.net/#api-Image-GetImages)",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    alttextify,
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
      return this.db.get("lastDate") || 0;
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    async emitEvent(maxResults = false) {
      const lastDate = this._getLastDate();

      const response = this.alttextify.paginate({
        fn: this.alttextify.listAltTexts,
      });

      let responseArray = [];
      for await (const item of response) {
        if (Date.parse(item.created_at) <= lastDate) break;
        responseArray.push(item);
      }

      if (responseArray.length) {
        if (maxResults && (responseArray.length > maxResults)) {
          responseArray.length = maxResults;
        }
        this._setLastDate(Date.parse(responseArray[0].created_at));
      }

      for (const item of responseArray.reverse()) {
        this.$emit(item, {
          id: item.asset_id,
          summary: `New alt text generated for asset ${item.asset_id}`,
          ts: Date.parse(item.created_at),
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
