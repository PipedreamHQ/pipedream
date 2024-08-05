import dart from "../../dart.app.mjs";

export default {
  type: "source",
  key: "dart-new-doc-updated-instant",
  name: "New Document Updated",
  description: "Emit new event when any document is updated",
  version: "0.0.0",
  dedupe: "unique",
  props: {
    dart,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // 15 minutes
      },
    },
  },
  methods: {
    generateMeta(data) {
      const ts = new Date(data.updated_at).getTime();
      return {
        id: data.id,
        summary: data.title,
        ts,
      };
    },
  },
  async run() {
    const since = this.db.get("since");
    const params = since
      ? {
        since,
      }
      : {};
    const { data } = await this.dart._makeRequest({
      method: "GET",
      path: "/documents",
      params,
    });
    if (Array.isArray(data)) {
      let maxDate = since;
      data.forEach((item) => {
        if (!maxDate || new Date(item.updated_at) > new Date(maxDate)) {
          maxDate = item.updated_at;
        }
        this.$emit(item, this.generateMeta(item));
      });
      this.db.set("since", maxDate);
    }
  },
};
