import waiverfile from "../../waiverfile.app.mjs";

export default {
  props: {
    waiverfile,
    http: "$.interface.http",
    db: "$.service.db",
  },
  hooks: {
    async activate() {
      await this.waiverfile.createWebhook({
        eventType: this.getEventType(),
        params: {
          targetUrl: this.http.endpoint,
        },
      });
    },
    async deactivate() {
      await this.waiverfile.deleteWebhook({
        eventType: this.getEventType(),
        params: {
          targetUrl: this.http.endpoint,
        },
      });
    },
  },
  methods: {
    getEventType() {
      throw new Error("getEventType is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run({ body }) {
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
