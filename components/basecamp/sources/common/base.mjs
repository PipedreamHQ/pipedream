import common from "../../common/common.mjs";

export default {
  props: {
    ...common.props,
    db: "$.service.db",
  },
  methods: {
    getWebhookTypes() {
      throw new Error("getWebhookTypes is not implemented");
    },
    generateMeta(event) {
      const {
        id, recording, created_at,
      } = event;
      const eventKind = event.kind.split("_").join(" ");
      return {
        id,
        summary: `${eventKind}: ${recording.title}`.replace(/(^\w)/g, (m) => m.toUpperCase()),
        ts: Date.parse(created_at),
      };
    },
    emitEvent(data) {
      const meta = this.generateMeta(data);
      this.$emit(data, meta);
    },
  },
};
