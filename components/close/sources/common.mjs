import close from "../close.app.mjs";

export default {
  props: {
    close,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  methods: {
    _getHookID() {
      return this.db.get("hookId");
    },
    _setHookID(hookID) {
      this.db.set("hookId", hookID);
    },
  },
  hooks: {
    async activate() {
      const response = await this.close.createHook({
        data: {
          events: this.getEvents(),
          url: this.http.endpoint,
        },
      });
      this._setHookID(response.data.id);
    },
    async deactivate() {
      const hookId = this._getHookID();
      await this.close.deleteHook({
        hookId,
      });
    },
  },
  async run(event) {
    this.$emit({
      event,
    },
    {
      id: event.body.event.id,
      ts: Date.parse(event.body.event.date_created),
      summary: `New event (ID:${event.body.event.id})`,
    });
  },
};
