import vida from "../../vida.app.mjs";

export default {
  props: {
    vida,
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
    db: "$.service.db",
    label: {
      type: "string",
      label: "Label",
      description: "Friendly label for webhook",
    },
  },
  methods: {
    filterEvent() {
      return true;
    },
  },
  hooks: {
    async activate() {
      await this.vida.createWebhook({
        data: {
          url: this.http.endpoint,
          label: this.label,
          type: "conversation",
        },
      });
    },
    async deactivate() {
      await this.vida.deleteWebhook({
        data: {
          url: this.http.endpoint,
        },
      });
    },
  },
  async run({ body }) {
    if (this.filterEvent(body)) {
      this.$emit(body, {
        id: body.uuid,
        summary: this.getSummary(body),
        ts: body.timestamp,
      });
    }
  },
};
