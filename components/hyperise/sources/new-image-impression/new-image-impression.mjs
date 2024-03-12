import hyperise from "../../hyperise.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";
import sampleEmit from "./test-event.mjs";

export default {
  key: "hyperise-new-image-impression",
  name: "New Image Impression",
  description: "Emit new event when a new personalised image is viewed. [See the documentation](https://support.hyperise.com/en/api/Image-Views-API)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    hyperise,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    imageTemplateHash: {
      propDefinition: [
        hyperise,
        "imageTemplateHash",
      ],
    },
  },
  methods: {
    _getLastDate() {
      return this.db.get("lastDate") || this.oneDayAgo();
    },
    _setLastDate(lastDate) {
      this.db.set("lastDate", lastDate);
    },
    oneDayAgo() {
      return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        .slice(0, 19) + "Z";
    },
    emitEvent(data) {
      const meta = this.generateMeta(data);
      this.$emit(data, meta);
    },
    generateMeta(data) {
      return {
        id: data.id,
        summary: `New View of Image: ${data.image_name}`,
        ts: Date.parse(data.processed_at),
      };
    },
  },
  async run() {
    const lastDate = this._getLastDate();
    let maxDate = lastDate;
    const impressions = [];
    const results = await this.hyperise.getImageViews({
      params: {
        image_hash: this.imageTemplateHash,
        date_from: lastDate,
      },
    });
    for (const impression of results) {
      const ts = Date.parse(impression.processed_at);
      if (ts > Date.parse(lastDate)) {
        impressions.push(impression);
        if (ts > Date.parse(maxDate)) {
          maxDate = impression.processed_at;
        }
      }
    }
    impressions.reverse().forEach((impression) => this.emitEvent(impression));
    this._setLastDate(maxDate);
  },
  sampleEmit,
};
