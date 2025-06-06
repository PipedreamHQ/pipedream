import { axios } from "@pipedream/platform";
import alttextify from "../../alttextify.app.mjs";

export default {
  key: "alttextify-new-failed-processing",
  name: "New Failed Image Processing",
  description: "Emit a new event when an image fails to process in AltTextify. Useful for triggering alerts or fallback mechanisms. [See the documentation](https://apidoc.alttextify.net/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    alttextify,
    db: "$.service.db",
    timer: {
      type: "$.interface.timer",
      default: {
        intervalSeconds: 60, // 1 minute
      },
    },
    userId: {
      type: "string",
      label: "User ID",
      description: "Your user ID for setting up the webhook to receive notifications.",
    },
  },
  hooks: {
    async deploy() {
      const failedProcesses = await this.getFailedProcesses();
      for (const process of failedProcesses.slice(0, 50)) {
        this.$emit(process, {
          id: process.id,
          summary: `Failed processing for image ${process.id}`,
          ts: Date.parse(process.created_at),
        });
      }
    },
    async activate() {
      // Code to create webhook subscription can be added here
    },
    async deactivate() {
      // Code to delete webhook subscription can be added here
    },
  },
  methods: {
    async getFailedProcesses() {
      return await this.alttextify._makeRequest({
        path: "/failed_processes",
        params: {
          userId: this.userId,
        },
      });
    },
  },
  async run() {
    const failedProcesses = await this.getFailedProcesses();
    for (const process of failedProcesses) {
      this.$emit(process, {
        id: process.id,
        summary: `Failed processing for image ${process.id}`,
        ts: Date.parse(process.created_at),
      });
    }
  },
};
