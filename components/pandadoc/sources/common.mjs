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
    getHookTypes() {
      throw new Error("Hook types not defined for this source");
    },
    getSummary({ name }) {
      return `${this.getHookName()}: ${name}`;
    },
  },
  hooks: {
    async activate() {
      const data = {
        name: `Pipedream event source (${this.getHookName()})`,
        payload: PAYLOAD_ARRAY,
        triggers: this.getHookTypes(),
        url: this.http.endpoint,
      };

      const { uuid } = await this.app.createHook({
        data,
      });
      this.db.set("hookId", uuid);
    },
    async deactivate() {
      const id = this.db.get("hookId");
      await this.app.deleteHook(id);
    },
  },
  async run({ body }) {
    body?.forEach?.(({ data }) => {
      const summary = this.getSummary(data);
      const { id } = data;
      this.$emit(data, {
        id,
        summary,
        ts: new Date().valueOf(),
      });
    });
  },
};
