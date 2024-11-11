import mural from "../../mural.app.mjs";

export default {
  key: "mural-new-mural",
  name: "New Mural",
  description: "Emit new event when a new mural is created.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    mural: {
      type: "app",
      app: "mural",
    },
    muralId: {
      propDefinition: [
        mural,
        "muralId",
      ],
    },
    userId: {
      propDefinition: [
        mural,
        "userId",
      ],
    },
    muralTitle: {
      propDefinition: [
        mural,
        "muralTitle",
      ],
      optional: true,
    },
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    ...mural.methods,
    generateMeta(mural) {
      const {
        id, name, createdAt,
      } = mural;
      return {
        id,
        summary: name,
        ts: Date.parse(createdAt),
      };
    },
  },
  async run() {
    const murals = await this.mural._makeRequest({
      path: `/v1/murals/${this.muralId}`,
    });
    for (const mural of murals) {
      if (mural.id === this.muralId && mural.createdBy === this.userId) {
        this.$emit(mural, this.generateMeta(mural));
      }
    }
  },
};
