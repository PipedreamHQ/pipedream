import poof from "../../poof.app.mjs";

export default {
  props: {
    poof,
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      await this.poof.createWebhook({
        data: {
          url: this.http.endpoint,
        },
      });
    },
  },
  methods: {
    isRelevant() {
      return true;
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    if (this.isRelevant(body)) {
      const meta = this.generateMeta(body);
      this.$emit(body, meta);
    }
  },
};
