import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Prospect",
  version: "0.0.1",
  key: "nocrm_io-new-prospect",
  description: "Emit new event on each prospect created.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "prospect.created";
    },
    emitEvent(body) {
      const data = body?.webhook_event?.data;

      this.$emit(data, {
        id: data.id,
        summary: `New prospect with id ${data.id}`,
        ts: Date.parse(data.created_at),
      });
    },
    async deploy() { },
  },
};
