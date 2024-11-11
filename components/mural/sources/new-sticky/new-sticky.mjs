import mural from "../../mural.app.mjs";

export default {
  key: "mural-new-sticky",
  name: "New Sticky Note Created",
  description: "Emits an event each time a new sticky note is created in a specified mural",
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
    stickyId: {
      propDefinition: [
        mural,
        "stickyId",
      ],
    },
    stickyContent: {
      propDefinition: [
        mural,
        "stickyContent",
      ],
      optional: true,
    },
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    _getSticky() {
      return this.db.get("sticky") ?? {
        id: this.stickyId,
      };
    },
    _setSticky(sticky) {
      this.db.set("sticky", sticky);
    },
  },
  async run() {
    // get the sticky
    const sticky = await this.mural.createSticky({
      muralId: this.muralId,
      stickyId: this.stickyId,
      content: this.stickyContent,
    });

    // check if the sticky is new
    const lastSticky = this._getSticky();
    if (sticky.id !== lastSticky.id) {
      this.$emit(sticky, {
        id: sticky.id,
        summary: `New Sticky: ${sticky.content}`,
        ts: Date.now(),
      });
      this._setSticky(sticky);
    }
  },
};
