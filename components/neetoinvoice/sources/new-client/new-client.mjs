import neetoinvoice from "../../neetoinvoice.app.mjs";

export default {
  key: "neetoinvoice-new-client",
  name: "New Client",
  description: "Emits a new event every time there is a new client in neetoInvoice. [See the documentation](https://help.neetoinvoice.com/articles/neetoinvoice-zapier-integration)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    neetoinvoice,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    subscriptionUrl: {
      propDefinition: [
        neetoinvoice,
        "subscriptionUrl",
      ],
    },
    eventType: {
      propDefinition: [
        neetoinvoice,
        "eventType",
        (c) => ({
          event: c.eventType,
        }),
      ],
    },
  },
  hooks: {
    async deploy() {
      const clients = await this.neetoinvoice.getClients({
        pageSize: 5,
        pageIndex: 1,
      });
      clients.forEach((client) => {
        this.$emit(client, {
          id: client.id,
          summary: client.name,
          ts: Date.parse(client.created_at),
        });
      });
    },
    async activate() {
      const subscription = await this.neetoinvoice.subscribe({
        url: this.subscriptionUrl,
        event: this.eventType,
      });
      this.db.set("subscriptionId", subscription.id);
    },
    async deactivate() {
      const subscriptionId = this.db.get("subscriptionId");
      await this.neetoinvoice.unsubscribe(subscriptionId);
    },
  },
  async run(event) {
    const body = event.body;
    this.$emit(body, {
      id: body.id,
      summary: `New client: ${body.name}`,
      ts: Date.parse(body.created_at),
    });
    this.http.respond({
      status: 200,
      body: "OK",
    });
  },
};
