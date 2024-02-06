import uplisting from "../../uplisting.app.mjs";

export default {
  props: {
    uplisting,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      const { id } = await this.uplisting.createHook({
        data: {
          target_url: this.http.endpoint,
          event: this.getEvent(),
        },
      });

      this._setHookId(id);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.uplisting.deleteHook(id);
    },
  },
  methods: {
    emitEvent(body) {
      const {
        id,
        timestamp,
      } = body;

      this.$emit(body, {
        id,
        summary: this.getSummary(id),
        ts: new Date(timestamp),
      });
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
