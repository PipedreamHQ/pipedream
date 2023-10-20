import vestaboard from "../../vestaboard.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "vestaboard-new-current-message",
  name: "New Current Message",
  description: "Emit new event when a new message is displayed on a board. [See the docs](https://docs.vestaboard.com/read-write)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    vestaboard,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  hooks: {
    async deploy() {
      const { currentMessage } = await this.vestaboard.getCurrentMessage();
      if (!currentMessage) {
        return;
      }
      this.emitEvent(currentMessage);
      this._setPreviousId(currentMessage.id);
    },
  },
  methods: {
    _getPreviousId() {
      return this.db.get("previousId");
    },
    _setPreviousId(previousId) {
      this.db.set("previousId", previousId);
    },
    generateMeta({ id }) {
      const ts = Date.now();
      return {
        id: `${id}${ts}`,
        summary: `New Message with ID ${id}`,
        ts,
      };
    },
    emitEvent(message) {
      const meta = this.generateMeta(message);
      this.$emit(message, meta);
    },
  },
  async run() {
    const previousId = this._getPreviousId();
    const { currentMessage } = await this.vestaboard.getCurrentMessage();
    if (!currentMessage || currentMessage.id === previousId) {
      return;
    }
    this.emitEvent(currentMessage);
    this._setPreviousId(currentMessage.id);
  },
};
