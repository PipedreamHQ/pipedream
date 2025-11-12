import dext from "../../dext.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "dext-new-client-added",
  name: "New Client Added",
  description: "Emit new event when a new client is added.",
  version: "0.0.2",
  type: "source",
  dedupe: "unique",
  props: {
    dext,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
  },
  methods: {
    _getPreviousIds() {
      return this.db.get("previousIds") || {};
    },
    _setPreviousIds(previousIds) {
      this.db.set("previousIds", previousIds);
    },
    generateMeta(client) {
      return {
        id: client.id,
        summary: client.name,
        ts: Date.now(),
      };
    },
  },
  async run() {
    const previousIds = this._getPreviousIds();

    const clients = await this.dext.listClients();
    for (const client of clients) {
      if (!previousIds[client.id]) {
        previousIds[client.id] = true;
        const meta = this.generateMeta(client);
        this.$emit(client, meta);
      }
    }

    this._setPreviousIds(previousIds);
  },
};
