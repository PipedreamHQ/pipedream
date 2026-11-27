import anymail from "../../anymail.app.mjs";

export default {
  props: {
    anymail,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
  },
  hooks: {
    async deploy() {
      // Up to three real recent deliveries of this event, oldest first.
      const { data } = await this.anymail.listHookSamples({
        params: {
          event: this.getEvent(),
        },
      });
      data.reverse().forEach((event) => this.emitEvent(event));
    },
    async activate() {
      // Idempotent on the anymail side: the same event and URL return the existing subscription.
      const { id } = await this.anymail.createHook({
        data: {
          event: this.getEvent(),
          target_url: this.http.endpoint,
        },
      });
      this.db.set("hookId", id);
    },
    async deactivate() {
      const id = this.db.get("hookId");
      if (id) {
        await this.anymail.deleteHook(id);
      }
    },
  },
  methods: {
    getEvent() {
      throw new Error("getEvent is not implemented");
    },
    getSummary(event) {
      return event.prospect_email || event.campaign_name || event.id;
    },
    emitEvent(event) {
      this.$emit(event, {
        id: event.id,
        summary: `${this.getLabel()}: ${this.getSummary(event)}`,
        ts: Date.parse(event.occurred_at),
      });
    },
  },
  async run({ body }) {
    this.emitEvent(body);
  },
};
