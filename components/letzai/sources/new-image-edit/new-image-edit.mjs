import {
  axios, DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
} from "@pipedream/platform";
import letzai from "../../letzai.app.mjs";

export default {
  key: "letzai-new-image-edit",
  name: "New Image Edit Created",
  description: "Emit new event when a new image edit is created in LetzAI. [See the documentation](https://letz.ai/docs/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    letzai,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    async _getImageEdits(page) {
      return this.letzai._makeRequest({
        path: "/image-edits",
        params: {
          page,
          limit: 50,
        },
      });
    },
    _getLastTimestamp() {
      return this.db.get("lastTimestamp");
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const lastTimestamp = this._getLastTimestamp();
      let page = 1;
      const recentImageEdits = [];

      while (true) {
        const imageEdits = await this._getImageEdits(page);
        if (!imageEdits.length) break;

        const newEdits = imageEdits.filter((imageEdit) =>
          !lastTimestamp || new Date(imageEdit.createdAt) > new Date(lastTimestamp));

        recentImageEdits.unshift(...newEdits);

        if (newEdits.length < imageEdits.length) break;
        page++;
      }

      recentImageEdits.slice(0, 50).reverse()
        .forEach((imageEdit) => {
          this.$emit(imageEdit, {
            id: imageEdit.id,
            summary: `New Image Edit: ${imageEdit.prompt}`,
            ts: Date.parse(imageEdit.createdAt),
          });
        });

      if (recentImageEdits.length) {
        this._setLastTimestamp(recentImageEdits[0].createdAt);
      }
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();
    let page = 1;

    while (true) {
      const imageEdits = await this._getImageEdits(page);
      if (!imageEdits.length) break;

      const newEdits = imageEdits.filter((imageEdit) =>
        !lastTimestamp || new Date(imageEdit.createdAt) > new Date(lastTimestamp));

      newEdits.forEach((imageEdit) => {
        this.$emit(imageEdit, {
          id: imageEdit.id,
          summary: `New Image Edit: ${imageEdit.prompt}`,
          ts: Date.parse(imageEdit.createdAt),
        });
      });

      if (!newEdits.length) break;
      page++;
    }

    if (newEdits.length) {
      this._setLastTimestamp(newEdits[0].createdAt);
    }
  },
};
