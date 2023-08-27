import zohoCommerce from "../../zoho_commerce.app.mjs";

export default {
  props: {
    zohoCommerce,
    db: "$.service.db",
    http: "$.interface.http",
  },
  hooks: {
    async deploy() {
      await this.zohoCommerce.createWebhook({
        data: {
          url: this.http.endpoint,
          events: this.getEvents(),
        },
      });
    },
  },
  methods: {
    getEvents() {
      throw new Error("getEvents is not implemented");
    },
    generateMeta() {
      throw new Error("generateMeta is not implemented");
    },
  },
  async run(event) {
    const { body: { JSONString } } = event;
    if (!JSONString) {
      return;
    }
    const order = JSON.parse(JSONString);

    const meta = this.generateMeta(order);
    this.$emit(order, meta);
  },
};
