import senta from "../../senta.app.mjs";
import { DEFAULT_POLLING_SOURCE_TIMER_INTERVAL } from "@pipedream/platform";

export default {
  key: "senta-new-client-created",
  name: "New Client Created",
  description: "Emit new event when a new client is created.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    senta,
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: DEFAULT_POLLING_SOURCE_TIMER_INTERVAL,
      },
    },
    clientViewId: {
      propDefinition: [
        senta,
        "clientViewId",
      ],
    },
  },
  methods: {
    generateMeta(client) {
      return {
        id: client._id,
        summary: client["Client name"],
        ts: Date.now(),
      };
    },
  },
  async run() {
    const { docs } = await this.senta.listClients({
      clientViewId: this.clientViewId,
    });
    for (const doc of docs) {
      const meta = this.generateMeta(doc);
      this.$emit(doc, meta);
    }
  },
};
