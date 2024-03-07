import howuku from "../../howuku.app.mjs";

export default {
  key: "howuku-new-recording",
  name: "New Recording",
  description: "Emits a new event when a new visitor session is recorded.",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    howuku,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
    visitorId: howuku.propDefinitions.visitorId,
  },
  methods: {
    generateMeta(data) {
      const ts = +new Date(data.created_at);
      return {
        id: data.id,
        summary: `New Recording: ${data.id}`,
        ts,
      };
    },
  },
  async run() {
    const url = `/events/${this.visitorId}`;
    const { data } = await this.howuku._makeRequest({
      path: url,
    });
    const metadata = this.generateMeta(data);
    this.$emit(data, metadata);
  },
};
