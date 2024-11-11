import mural from "../../mural.app.mjs";

export default {
  key: "mural-new-area",
  name: "New Area Created",
  description: "Emits an event when a new area is created in the user's mural",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    mural,
    muralId: {
      propDefinition: [
        mural,
        "muralId",
      ],
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
    _getLastEvent() {
      return this.db.get("lastEvent") || null;
    },
    _setLastEvent(lastEvent) {
      this.db.set("lastEvent", lastEvent);
    },
  },
  async run() {
    const lastEvent = this._getLastEvent();
    const newEvent = await this.mural.getArea(this.muralId);
    if (!lastEvent || new Date(newEvent.created_at) > new Date(lastEvent.created_at)) {
      this.$emit(newEvent, {
        id: newEvent.id,
        summary: `New area created: ${newEvent.name}`,
        ts: Date.parse(newEvent.created_at),
      });
      this._setLastEvent(newEvent);
    }
  },
};
