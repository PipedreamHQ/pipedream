import bigcommerce from "../../bigcommerce.app.mjs";

export default {
  props: {
    bigcommerce,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async deactivate() {
      await this.bigcommerce.deleteHook(this.getHookId());
    },
  },
  methods: {
    getHookId() {
      return this.db.get("hookId");
    },
    setHookId(hookId) {
      this.db.set("hookId", hookId);
    },
  },
  async run(event) {
    this.http.respond({
      status: 200,
    });

    this.$emit(event, {
      summary: this.getSummary(),
      ts: event.body.created_at,
    });
  },
};
