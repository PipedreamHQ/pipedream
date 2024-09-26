import sendinBlueApp from "../sendinblue.app.mjs";

export default {
  props: {
    sendinBlueApp,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    emitEvent(body) {
      const meta = this.generateMeta(body);
      this.$emit(meta, {
        id: meta.ts,
        summary: meta.event,
        ts: meta.ts,
      });
    },
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
    getHookId() {
      return this.db.get("hookId");
    },
  },
  hooks: {
    async activate() {
      const eventNames = this.getEventNames();
      const description = this.getHookDescription();
      const type = this.getEventType();
      const createHookData = {
        description: description,
        url: this.http.endpoint,
        events: eventNames,
        type: type,
      };
      const { id } = await this.sendinBlueApp.createHook(this, createHookData);
      this.setHookId(id);
    },
    async deactivate() {
      const hookId = this.getHookId();
      await this.sendinBlueApp.deleteHook(this, hookId);
    },
  },
  async run(event) {
    const { body } = event;
    const hookId = this.getHookId();
    if (body.id !== hookId) {
      throw new Error("The request was aborted: registered and requested webhook's id doesn't match.");
    }
    this.emitEvent(body);
  },
};
