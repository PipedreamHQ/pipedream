import justcallApp from "../../justcall.app.mjs";

export default {
  props: {
    justcallApp,
    http: "$.interface.http",
  },
  hooks: {
    async activate() {
      await this.justcallApp.createHook({
        data: {
          type: this.getWebhookType(),
          url: this.http.endpoint,
        },
      });
    },
    async deactivate() {
      await this.justcallApp.deleteHook({
        urlId: this.http.endpoint,
      });
    },
  },

  methods: {
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
    emitEvent(data) {
      const meta = this.generateMeta(data);
      this.$emit(data, meta);
    },
    getWebhookType() {
      throw new Error("getWebhookType is not implemented");
    },
  },
  async run({ body }) {
    this.emitEvent(body?.data);
  },
};
