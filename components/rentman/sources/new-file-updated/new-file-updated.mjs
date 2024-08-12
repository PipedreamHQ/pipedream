import rentman from "../../rentman.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "rentman-new-file-updated",
  name: "New File Uploaded/Updated",
  description: "Emit new event when a file is uploaded/updated. [See the documentation](https://api.rentman.net/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    rentman,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60 * 15, // Poll every 15 minutes
      },
    },
  },
  hooks: {
    async deploy() {
      await this.emitFileEvents();
    },
    async activate() {
      // No webhook subscription needed
    },
    async deactivate() {
      // No webhook subscription needed
    },
  },
  methods: {
    async emitFileEvents() {
      const files = await this.getFiles();
      for (const file of files) {
        this.$emit(file, {
          id: file.id,
          summary: `New file updated: ${file.name}`,
          ts: Date.parse(file.updated_at),
        });
      }
    },
    async getFiles() {
      return this.rentman._makeRequest({
        method: "GET",
        path: "/files",
      });
    },
  },
  async run() {
    await this.emitFileEvents();
  },
};
