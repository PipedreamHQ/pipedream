import deputy from "../../deputy.app.mjs";

export default {
  props: {
    deputy,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      await this.deputy.createWebhook({
        data: {
          Topic: this.getTopic(),
          Enabled: 1,
          Type: "URL",
          Address: this.http.endpoint,
        },
      });
    },
  },
  methods: {
    getTopic() {
      throw new Error("getTopic is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body: { data } } = event;
    if (!data) {
      return;
    }
    const meta = this.generateMeta(data);
    this.$emit(data, meta);
  },
};
