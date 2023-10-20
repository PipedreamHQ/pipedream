import waiverforever from "../../waiverforever.app.mjs";

export default {
  props: {
    waiverforever,
    db: "$.service.db",
    http: "$.interface.http",
    template: {
      propDefinition: [
        waiverforever,
        "template",
      ],
    },
  },
  hooks: {
    async activate() {
      throw new Error("activate() hook not implemented");
    },
    async deactivate() {
      const hookId = this.getHookId();
      await this.waiverforever.deleteHook(hookId);
    },
  },
  methods: {
    getHookId() {
      return this.db.get("hookId");
    },
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    async activateHook(eventType) {
      const url = this.http.endpoint;
      const { id } = await this.waiverforever.createHook({
        target_url: url,
        event: eventType,
        template_id: this.template,
      });
      this.setHookId(id);
    },
  },
  async run({ body }) {
    const {
      id, signed_at,
    } = body;

    this.$emit(body, {
      id: id + signed_at,
      summary: this.getSummary(body),
      ts: signed_at,
    });
  },
};
