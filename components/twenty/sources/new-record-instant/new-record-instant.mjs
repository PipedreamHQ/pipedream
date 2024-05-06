import twenty from "../../twenty.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "twenty-new-record-instant",
  name: "New Record Instant",
  description: "Emit new event when a record is created, updated, or deleted.",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    twenty: {
      type: "app",
      app: "twenty",
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
    db: "$.service.db",
  },
  hooks: {
    async deploy() {
      // This source does not fetch historical data
    },
    async activate() {
      // Logic to create a webhook subscription if supported by the app
    },
    async deactivate() {
      // Logic to delete the webhook subscription if supported by the app
    },
  },
  async run(event) {
    const {
      actionType, recordId, recordData,
    } = event.body;

    try {
      const result = await this.twenty.performAction({
        actionType,
        recordId,
        recordData,
      });

      this.$emit(result, {
        id: result.id || `${actionType}-${Date.now()}`,
        summary: `${actionType.toUpperCase()} action performed`,
        ts: Date.parse(result.createdAt || new Date()),
      });

      this.http.respond({
        status: 200,
        body: "Success",
      });
    } catch (error) {
      this.http.respond({
        status: 500,
        body: "Internal Server Error",
      });
      console.error(`Error processing ${actionType} action:`, error);
    }
  },
};
