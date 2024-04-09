import reachmail from "../../reachmail.app.mjs";

export default {
  props: {
    reachmail,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    _setHookId(Id) {
      this.db.set("hookId", Id);
    },
    _getHookId() {
      return this.db.get("hookId");
    },
    emitData(body) {
      this.$emit(body, {
        id: body.Signature,
        summary: this.getSummary(body),
        ts: Date.parse(body.Timestamp),
      });
    },
  },
  hooks: {
    async activate() {
      const response = await this.reachmail.createWebhook({
        action: this.getAction(),
        data: {
          Url: this.http.endpoint,
        },
      });
      this._setHookId(response.Id);
    },
    async deactivate() {
      const hookId = this._getHookId();

      await this.reachmail.updateWebhook({
        hookId,
        data: {
          Url: this.http.endpoint,
          Active: false,
        },
      });
    },
  },
  async run({ body }) {
    this.emitData(body);
  },
};
