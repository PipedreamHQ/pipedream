import hyperise from "../../hyperise.app.mjs";

export default {
  key: "hyperise-new-image-impression",
  name: "New Image Impression",
  description: "Emit new event when a new personalized image is viewed",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    hyperise,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      const data = await this.hyperise.getImageViews();
      if (Array.isArray(data) && data.length > 0) {
        this.db.set("lastImageId", data[0].id);
      }
    },
  },
  methods: {
    generateMeta(data) {
      const ts = Date.parse(data.created_at);
      return {
        id: data.id,
        summary: `New Image Viewed: ${data.id}`,
        ts,
      };
    },
  },
  async run() {
    const lastImageId = this.db.get("lastImageId");
    const data = await this.hyperise.getImageViews();

    if (Array.isArray(data)) {
      for (const image of data) {
        if (lastImageId && image.id <= lastImageId) {
          break;
        }
        const meta = this.generateMeta(image);
        this.$emit(image, meta);
      }
      this.db.set("lastImageId", data[0].id);
    }
  },
};
