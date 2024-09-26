import neetoinvoice from "../../neetoinvoice.app.mjs";

export default {
  dedupe: "unique",
  props: {
    neetoinvoice,
    http: "$.interface.http",
    db: "$.service.db",
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
  hooks: {
    async deploy() {
      const fn = this.getFunction();
      const clients = await fn({
        pageSize: 25,
      });
      clients.reverse().forEach((body) => {
        this.emitEvent(body);
      });
    },
    async activate() {
      const subscription = await this.neetoinvoice.createHook({
        data: {
          zapier_subscription: {
            options: {
              url: this.http.endpoint,
              event: this.getEvent(),
            },
            subscription_for: "Zapier",
          },
        },
      });

      this._setHookId(subscription.id);
    },
    async deactivate() {
      const id = this._getHookId("hookId");
      await this.neetoinvoice.deleteHook(id);
    },
  },
  async run({ body }) {
    this.emitEvent(body);
  },
};
