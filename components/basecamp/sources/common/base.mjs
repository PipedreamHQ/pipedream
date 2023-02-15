import app from "../../basecamp.app.mjs";

export default {
  props: {
    app,
    db: "$.service.db",
    accountId: {
      propDefinition: [
        app,
        "accountId",
      ],
    },
    projectId: {
      propDefinition: [
        app,
        "projectId",
        ({ accountId }) => ({
          accountId,
        }),
      ],
    },
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
