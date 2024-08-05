import { axios } from "@pipedream/platform";
import dart from "../../dart.app.mjs";

export default {
  key: "dart-new-doc-created-instant",
  name: "New Document Created",
  description: "Emits an event when a new document is created in Dart",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    dart,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60,
      },
    },
  },
  methods: {
    generateMeta(data) {
      const {
        id, created_at, name,
      } = data;
      const summary = `New Document Created: ${name}`;
      const ts = new Date(created_at).getTime();
      return {
        id,
        summary,
        ts,
      };
    },
  },
  async run() {
    const url = this.dart._baseUrl() + "/documents";
    const { data } = await axios(this, {
      url,
      headers: {
        Authorization: `Bearer ${this.dart.$auth.api_token}`,
      },
    });
    if (Array.isArray(data)) {
      for (const item of data) {
        this.$emit(item, this.generateMeta(item));
      }
    }
  },
};
