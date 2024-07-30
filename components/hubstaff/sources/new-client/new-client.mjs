import { axios } from "@pipedream/platform";
import hubstaff from "../../hubstaff.app.mjs";

export default {
  key: "hubstaff-new-client",
  name: "New Client Created",
  description: "Emit new event when a new client is created in Hubstaff. [See the documentation](https://developer.hubstaff.com/docs/hubstaff_v2)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    hubstaff,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  hooks: {
    async deploy() {
      const clients = await this.listClients();
      for (const client of clients.slice(-50)) {
        this.$emit(client, {
          id: client.id,
          summary: `New Client: ${client.name}`,
          ts: Date.parse(client.created_at),
        });
      }
    },
    async activate() {
      // Logic to activate webhook or other setup if needed
    },
    async deactivate() {
      // Logic to deactivate webhook or cleanup if needed
    },
  },
  methods: {
    async listClients() {
      return this.hubstaff._makeRequest({
        path: `/organizations/${this.hubstaff.$auth.organization_id}/clients`,
      });
    },
    async getLastClientId() {
      return this.db.get("lastClientId");
    },
    async setLastClientId(clientId) {
      return this.db.set("lastClientId", clientId);
    },
  },
  async run() {
    const lastClientId = await this.getLastClientId();
    const clients = await this.listClients();
    let newLastClientId = lastClientId;

    for (const client of clients) {
      if (!lastClientId || client.id > lastClientId) {
        this.$emit(client, {
          id: client.id,
          summary: `New Client: ${client.name}`,
          ts: Date.parse(client.created_at),
        });
        if (!newLastClientId || client.id > newLastClientId) {
          newLastClientId = client.id;
        }
      }
    }

    await this.setLastClientId(newLastClientId);
  },
};
