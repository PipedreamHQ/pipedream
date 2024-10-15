import everhour from "../../everhour.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "everhour-new-client-instant",
  name: "New Client Instant",
  description: "Emit new event when a client is added. [See the documentation](https://everhour.docs.apiary.io/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    everhour,
    db: "$.service.db",
    projectId: {
      propDefinition: [
        everhour,
        "projectId",
      ],
    },
  },
  hooks: {
    async deploy() {
      const clients = await this.getClients();
      clients.slice(0, 50).forEach((client) => {
        this.$emit(client, {
          id: client.id,
          summary: `New Client: ${client.name}`,
          ts: Date.parse(client.created),
        });
      });
    },
    async activate() {
      await this.everhour.emitClientCreatedEvent(this.projectId);
    },
    async deactivate() {
      await this.everhour.removeWebhook();
    },
  },
  methods: {
    async getClients() {
      return this.everhour.listClients();
    },
  },
  async run() {
    const clients = await this.getClients();
    clients.forEach((client) => {
      this.$emit(client, {
        id: client.id,
        summary: `New Client: ${client.name}`,
        ts: Date.parse(client.created),
      });
    });
  },
};
