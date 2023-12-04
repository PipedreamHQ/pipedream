import { axios } from "@pipedream/platform";
import convolo_ai from "../../convolo_ai.app.mjs";

export default {
  key: "convolo_ai-new-call-instant",
  name: "New Call Instant",
  description: "Emit new event when a call ends and gets logged. [See the documentation](https://help.convolo.ai/)",
  version: "0.0.{{ts}}",
  type: "source",
  dedupe: "unique",
  props: {
    convolo_ai: {
      type: "app",
      app: "convolo_ai",
    },
    endOfCallTrigger: {
      propDefinition: [
        convolo_ai,
        "endOfCallTrigger",
      ],
    },
    db: "$.service.db",
    http: {
      type: "$.interface.http",
      customResponse: false,
    },
  },
  hooks: {
    async deploy() {
      // Fetch the 50 most recent calls to emit as historical events
      // Since the API documentation link is not available, the logic to fetch historical events is not defined
      // This is a placeholder for where the historical events would be fetched and emitted
    },
    async activate() {
      // Create a webhook subscription
      // Since the API documentation link is not available, the logic to create a webhook subscription is not defined
      // This is a placeholder for where the webhook would be created
    },
    async deactivate() {
      // Delete a webhook subscription
      // Since the API documentation link is not available, the logic to delete a webhook subscription is not defined
      // This is a placeholder for where the webhook would be deleted
    },
  },
  async run(event) {
    if (this.endOfCallTrigger) {
      // Log the end of the call
      await this.convolo_ai.logCallEnd({
        endOfCallTrigger: this.endOfCallTrigger,
      });

      // Emit the event with the required metadata
      this.$emit(event.body, {
        id: event.body.id, // Assuming `id` is a unique identifier for the event
        summary: "Call ended and logged", // Placeholder summary
        ts: Date.now(), // Use the current timestamp as the event timestamp
      });
    }
  },
};
