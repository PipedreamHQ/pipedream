import documerge from "../../documerge.app.mjs";

export default {
  props: {
    documerge,
    http: "$.interface.http",
    db: "$.service.db",
  },
  methods: {
    _getDeliveryMethodIds() {
      return this.db.get("deliveryMethodIds") || {};
    },
    _setDeliveryMethodIds(deliveryMethodIds) {
      this.db.set("deliveryMethodIds", deliveryMethodIds);
    },
    getWebhookSettings() {
      return {
        type: "webhook",
        settings: {
          url: this.http.endpoint,
          always_send: true,
          send_temporary_download_url: true,
          send_data_using_json: true,
          send_merge_data: true,
        },
      };
    },
    generateMeta(body) {
      return {
        id: body.merge_id,
        summary: this.getSummary(body),
        ts: Date.now(),
      };
    },
    getSummary() {
      throw new Error("getSummary is not implemented");
    },
  },
  async run(event) {
    const { body } = event;
    const meta = this.generateMeta(body);
    this.$emit(body, meta);
  },
};
