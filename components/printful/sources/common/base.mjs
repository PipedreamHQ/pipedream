import printful from "../../printful.app.mjs";

export default {
  props: {
    printful,
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
    alert: {
      type: "alert",
      alertType: "warning",
      content: "**Note** that only one webhook URL can be active for a store, so all existing webhook configuration will be disabled upon creating this source.",
    },
    storeId: {
      propDefinition: [
        printful,
        "storeId",
      ],
    },
  },
  hooks: {
    async activate() {
      await this.printful.createWebhook({
        headers: {
          "X-PF-Store-Id": this.storeId,
        },
        data: {
          url: this.http.endpoint,
          types: this.getEventType(),
        },
      });
    },
    async deactivate() {
      await this.printful.deleteWebhook({
        headers: {
          "X-PF-Store-Id": this.storeId,
        },
      });
    },
  },
  async run({ body }) {
    const modelField = this.getModelField();
    const ts = body.created;
    this.$emit(body, {
      id: `${body.data[modelField].id}-${ts}`,
      summary: this.getSummary(body),
      ts,
    });
  },
};
