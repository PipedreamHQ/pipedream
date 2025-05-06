import { axios } from "@pipedream/platform";
import letzai from "../../letzai.app.mjs";

export default {
  key: "letzai-new-image",
  name: "New Image Created",
  description: "Emit new event when a new image is created in LetzAI. [See the documentation](https://letz.ai/docs/api)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    letzai,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getLastTimestamp() {
      return this.db.get("lastTimestamp") || 0;
    },
    _setLastTimestamp(timestamp) {
      this.db.set("lastTimestamp", timestamp);
    },
  },
  hooks: {
    async deploy() {
      const images = await this.letzai._makeRequest({
        path: "/images",
        params: {
          sortBy: "createdAt",
          sortOrder: "DESC",
          limit: 50,
        },
      });

      const lastImage = images[0];
      for (const image of images) {
        this.$emit(image, {
          id: image.id,
          summary: `New image created: ${image.prompt}`,
          ts: Date.parse(image.createdAt),
        });
      }

      if (lastImage) {
        this._setLastTimestamp(Date.parse(lastImage.createdAt));
      }
    },
  },
  async run() {
    const lastTimestamp = this._getLastTimestamp();

    const images = await this.letzai._makeRequest({
      path: "/images",
      params: {
        sortBy: "createdAt",
        sortOrder: "ASC",
        limit: 100,
      },
    });

    for (const image of images) {
      const createdAt = Date.parse(image.createdAt);
      if (createdAt > lastTimestamp) {
        this.$emit(image, {
          id: image.id,
          summary: `New image created: ${image.prompt}`,
          ts: createdAt,
        });
      }
    }

    const lastImage = images[images.length - 1];
    if (lastImage) {
      this._setLastTimestamp(Date.parse(lastImage.createdAt));
    }
  },
};
