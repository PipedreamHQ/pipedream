import zohoSheet from "../../zoho_sheet.app.mjs";

export default {
  props: {
    zohoSheet,
    http: "$.interface.http",
    db: "$.service.db",
    serviceName: {
      type: "string",
      label: "Service Name",
      description: "The name of the webhook.",
    },
  },
  methods: {
    getExtraData() {
      return {};
    },
  },
  hooks: {
    async activate() {
      await this.zohoSheet.createWebhook({
        data: {
          service_name: this.serviceName.replace(/\s/g, ""),
          target_url: this.http.endpoint,
          event: this.getEvent(),
          ...this.getExtraData(),
        },
      });
    },
    async deactivate() {
      await this.zohoSheet.deleteWebhook({
        data: {
          target_url: this.http.endpoint,
          ...this.getExtraData(),
        },
      });
    },
  },
  async run({ body }) {
    const ts = Date.parse(new Date());
    this.$emit(body, {
      id: `${ts}`,
      summary: this.getSummary(body),
      ts: ts,
    });
  },
};
