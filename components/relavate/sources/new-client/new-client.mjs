import { axios } from "@pipedream/platform";
import relavate from "../../relavate.app.mjs";

export default {
  key: "relavate-new-client",
  name: "New Client Created",
  description: "Emits an event when a new client is created on the platform",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    relavate,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    _getPreviousClients() {
      return this.db.get("previousClients") || [];
    },
    _setPreviousClients(clients) {
      this.db.set("previousClients", clients);
    },
  },
  async run() {
    const previousClients = this._getPreviousClients();
    const response = await this.relavate.createClient();
    const newClients = response.data.filter(
      (client) => !previousClients.includes(client.id),
    );
    newClients.forEach((client) => {
      this.$emit(client, {
        id: client.id,
        summary: `New Client Created: ${client.name}`,
        ts: Date.now(),
      });
    });
    this._setPreviousClients(newClients.map((client) => client.id));
  },
};
