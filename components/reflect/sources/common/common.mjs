import reflect from "../../reflect.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  props: {
    reflect,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    db: "$.service.db",
    graphId: {
      propDefinition: [
        reflect,
        "graphId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const events = await this.getEvents();
      if (!events) {
        return;
      }
      const previousIds = events.map(({ id }) => id);
      this._setPreviousIds(previousIds);
      events.slice(-25).forEach((event) => this.emitEvent(event));
    },
  },
  methods: {
    _getPreviousIds() {
      return this.db.get("previousIds");
    },
    _setPreviousIds(previousIds) {
      this.db.set("previousIds", previousIds);
    },
    emitEvent(event) {
      const meta = this.generateMeta(event);
      this.$emit(event, meta);
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run() {
    const previousIds = this._getPreviousIds() || [];
    const events = await this.getEvents();
    if (!events) {
      return;
    }
    for (const event of events) {
      if (!previousIds.includes(event.id)) {
        previousIds.push(event.id);
        this.emitEvent(event);
      }
    }
    this._setPreviousIds(previousIds);
  },
};
