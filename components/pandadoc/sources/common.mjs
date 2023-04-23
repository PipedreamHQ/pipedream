import app from "../pandadoc.app.mjs";

const PAYLOAD_ARRAY = [
  "fields",
  "products",
  "tokens",
  "metadata",
  "pricing",
];

export default {
  props: {
    app,
    db: "$.service.db",
    http: {
      type: "$.interface.http",
    },
  },
  methods: {
    getHookName() {
      throw new Error("Hook name not defined for this source");
    },
    getHookType() {
      throw new Error("Hook type not defined for this source");
    },
    getSummary() {
      throw new Error("Summary not defined for this source");
    },
  },
  hooks: {
    async activate() {
      const data = {
        name: `Pipedream event source (${this.getHookName()})`,
        payload: PAYLOAD_ARRAY,
        triggers: this.getHookType(),
        url: this.http.endpoint,
      };

      const { uuid } = await this.app.createHook(data);
      this.db.set("hookId", uuid);
    },
    async deactivate() {
      const id = this.db.get("hookId");
      await this.app.deleteHook(id);
    },
  },
  async run(data) {
    const summary = this.getSummary(data);
    this.$emit(data, {
      id: "test" + new Date().valueOf(),
      summary,
      ts: new Date().valueOf(),
    });
  },
};
