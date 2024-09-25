import mailerlite from "../../mailerlite.app.mjs";

export default {
  dedupe: "unique",
  props: {
    mailerlite,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { data } = await this.mailerlite.createHook({
        data: {
          url: this.http.endpoint,
          events: this.getEvents(),
        },
      });

      this._setHookId(data.id);
    },
    async deactivate() {
      const hookId = this._getHookId("hookId");
      await this.mailerlite.removeHook({
        hookId,
      });
    },
  },
  methods: {
    emitEvent(body) {
      this.$emit(body, this.getDataToEmit(body));
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    _setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  async run({ body }) {
    this.emitEvent(body);
  },
};
