import crpro from "../../crpro.app.mjs";

export default {
  key: "crpro-new-event-instant",
  name: "New Event (Instant)",
  description:
    "Emit new event when a chosen event happens in CRPRO, such as a contact created, a deal won or a message received. [See the documentation](https://crpro.com.br/integracoes/whatsapp-com-pipedream)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    crpro,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    events: {
      propDefinition: [
        crpro,
        "events",
      ],
    },
  },
  hooks: {
    async activate() {
      const { data } = await this.crpro.createWebhook({
        data: {
          url: this.http.endpoint,
          events: this.events,
          label: "Pipedream",
        },
      });
      this.db.set("hookId", data.id);
    },
    async deactivate() {
      const hookId = this.db.get("hookId");
      if (!hookId) {
        return;
      }
      await this.crpro.deleteWebhook({
        hookId,
      });
      this.db.set("hookId", null);
    },
  },
  async run(event) {
    const { body } = event;
    if (!body) {
      return;
    }

    // CRPRO delivers a stable envelope: { id, type, occurred_at,
    // organization_id, api_version, data }. `id` is what dedupe keys on.
    this.$emit(body, {
      id: body.id,
      summary: `New ${body.type} from CRPRO`,
      ts: Date.parse(body.occurred_at) || Date.now(),
    });
  },
};
