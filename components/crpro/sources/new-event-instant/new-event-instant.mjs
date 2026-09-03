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
  methods: {
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
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
      this._setHookId(data.id);
    },
    async deactivate() {
      const hookId = this._getHookId();
      if (!hookId) {
        return;
      }
      await this.crpro.deleteWebhook({
        hookId,
      });
      this._setHookId(null);
    },
  },
  async run(event) {
    const { body } = event;

    // CRPRO delivers a stable envelope: { id, type, occurred_at,
    // organization_id, api_version, data }. `id` is what dedupe keys on and
    // `type` is what the summary reads, so a payload missing either is dropped
    // rather than emitted with `id: undefined` or "New undefined from CRPRO".
    if (!body?.id || !body?.type) {
      return;
    }

    this.$emit(body, {
      id: body.id,
      summary: `New ${body.type} from CRPRO`,
      ts: Date.parse(body.occurred_at) || Date.now(),
    });
  },
};
