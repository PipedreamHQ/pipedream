import common from "../common/common.mjs";

export default {
  ...common,
  name: "New Uploaded File (Instant)",
  version: "0.0.1",
  key: "uploadcare-new-uploaded-file",
  description: "Emit new event on each created task.",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    getWebhookEventType() {
      return "file.uploaded";
    },
    async deploy() {
      const response = await this.uploadcare.getFiles({
        params: {
          limit: 10,
        },
      });

      response.results.reverse().forEach(this.emitEvent);
    },
    emitEvent(event) {
      const data = event?.data ?? event;

      this.$emit(data, {
        id: data.uuid,
        summary: `New file uploaded with id ${data.uuid}`,
        ts: new Date(),
      });
    },
  },
};
